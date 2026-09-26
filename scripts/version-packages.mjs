#!/usr/bin/env node
/**
 * `changeset version` sarmalayıcısı — ad çakışması koruması.
 *
 * Changesets, bir workspace paketiyle AYNI ADI taşıyan harici bir bağımlılığı
 * (ör. `apps/storybook` paketinin adı "storybook" iken `"storybook": "^10.5.2"`
 * devDependency'si) iç bağımlılık sanıp aralığını workspace sürümüne
 * (`^0.1.0`) yeniden yazar — Storybook kurulumu bozulur.
 *
 * Bu script `changeset version` öncesi tüm workspace package.json'larını okur;
 * sonrasında, adı bir workspace paketiyle çakışan ve `workspace:` protokolü
 * KULLANMAYAN (yani harici olan) bağımlılıkların aralıklarını geri yükler.
 * Kalıcı çözüm: çakışan workspace paketini yeniden adlandırmak.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEP_FIELDS = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];

function workspaceManifests() {
  const files = [];
  for (const group of ["packages", "apps"]) {
    const dir = join(ROOT, group);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      const file = join(dir, name, "package.json");
      if (existsSync(file)) files.push(file);
    }
  }
  return files;
}

const before = new Map(workspaceManifests().map((f) => [f, JSON.parse(readFileSync(f, "utf8"))]));
const workspaceNames = new Set([...before.values()].map((p) => p.name));

execFileSync(join(ROOT, "node_modules/.bin/changeset"), ["version"], { cwd: ROOT, stdio: "inherit" });

let restored = 0;
for (const [file, prev] of before) {
  const next = JSON.parse(readFileSync(file, "utf8"));
  let changed = false;
  for (const field of DEP_FIELDS) {
    for (const [dep, range] of Object.entries(prev[field] ?? {})) {
      if (!workspaceNames.has(dep) || String(range).startsWith("workspace:")) continue;
      if (next[field]?.[dep] !== range) {
        console.warn(`⚠ ${file.replace(ROOT + "/", "")}: ${field}.${dep} "${next[field]?.[dep]}" → "${range}" (harici bağımlılık, ad çakışması) geri yüklendi`);
        next[field][dep] = range;
        changed = true;
        restored++;
      }
    }
  }
  if (changed) writeFileSync(file, JSON.stringify(next, null, 2) + "\n");
}
if (restored) {
  console.warn(`⚠ ${restored} bağımlılık aralığı geri yüklendi. Kalıcı çözüm: harici paketle aynı adı taşıyan workspace paketini yeniden adlandırın.`);
}
