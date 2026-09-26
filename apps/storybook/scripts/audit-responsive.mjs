#!/usr/bin/env node
/**
 * Responsive + RTL + dokunma hedefi denetimi.
 *
 * Derlenmiş bir storybook-static dizinini yerelde sunar ve HER story'yi
 * gerçek Chromium'da şu profillerde açar:
 *
 *   dokunmatik (pointer: coarse, hover: none) — telefon / tablet
 *     LTR 320 · 360 · 768 · 1024      RTL 360
 *   hassas işaretçi (pointer: fine) — masaüstü
 *     LTR 1024 · 1280                 RTL 1024
 *
 * Her ölçümde denetlenenler:
 *   • yatay taşma  — sayfa scrollWidth'i ve kırpılmamış (overflow ile gizlenmemiş)
 *                    viewport dışına çıkan öğeler (RTL'de sola taşma dahil)
 *   • JS hatası    — pageerror (yakalanmamış istisna)
 *   • boş render   — #storybook-root boş ya da Storybook hata ekranı
 *   • dokunma      — yalnızca dokunmatik 320/360 LTR'de: ≥44×44px olmayan etkileşimli
 *                    öğeler (::before/::after ile genişletilmiş dokunma alanı hesaba katılır)
 *
 * Meşru dokunma-hedefi istisnaları (WCAG 2.5.5/2.5.8 ile uyumlu):
 *   • metin içi bağlantılar (paragraf/cümle içindeki satır içi <a>)
 *   • ≥44px bir <label> / tıklanabilir satır içine sarılmış kontroller
 *     (etiketin tamamı kontrolü tetikler)
 *   • yoğun ızgaralar (takvim günleri): `data-touch-dense` ya da RN'de
 *     `testID="ds-touch-dense:…"` işaretli, ≥44px yüksek ve ≥24px geniş hücreler
 *     (WCAG 2.5.8 AA en az 24px; 7 sütunlu takvim 320px'te 44px genişliğe sığmaz)
 *   • `data-touch-equivalent` işaretli öğeler: aynı işlev dokunmatikte ≥44px eşdeğer
 *     bir kontrolle sunulur (WCAG 2.5.8 "equivalent"; ör. FaceZoneMap bölge çipleri)
 *   • devre dışı, aria-hidden, inert, pointer-events:none, sr-only öğeler
 *   • `no-audit-touch` etiketli story'ler (ör. cihaz çerçevesi vitrinleri)
 *
 * Story etiketleri (tags) ile kapsam dışı bırakma:
 *   no-audit | no-audit-overflow | no-audit-touch | no-audit-rtl
 *
 * Kullanım:
 *   node apps/storybook/scripts/audit-responsive.mjs --dir apps/storybook/storybook-static \
 *     [--out audit-report.json] [--filter <id-regex>] [--concurrency 6] \
 *     [--profiles coarse-ltr,fine-ltr] [--max-overflow 0] [--max-touch 0] [--max-errors 0]
 *   # geliştirme sırasında çalışan bir Storybook'a karşı (derleme gerekmez):
 *   node apps/storybook/scripts/audit-responsive.mjs --url http://localhost:6006
 *
 * Tarayıcı: PLAYWRIGHT_CHROMIUM_PATH ortam değişkeni verilirse o çalıştırılabilir
 * dosya kullanılır (CI), yoksa sistemdeki Google Chrome (channel: "chrome").
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

// ── Argümanlar ──────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const arg = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? def : argv[i + 1];
};
const ROOT = path.resolve(arg("dir", "apps/storybook/storybook-static"));
const OUT = path.resolve(arg("out", "audit-report.json"));
const FILTER = arg("filter") ? new RegExp(arg("filter")) : null;
const CONCURRENCY = Number(arg("concurrency", "6"));
const MAX_OVERFLOW = Number(arg("max-overflow", "0"));
const MAX_TOUCH = Number(arg("max-touch", "0"));
const MAX_ERRORS = Number(arg("max-errors", "0"));
const PORT = Number(arg("port", "6199"));
const REMOTE = arg("url")?.replace(/\/$/, "");
const PROFILE_FILTER = arg("profiles")?.split(",");
const TOUCH_MIN = 44;

if (!REMOTE && !fs.existsSync(path.join(ROOT, "index.json"))) {
  console.error(`storybook-static bulunamadı: ${ROOT} (önce storybook build)`);
  process.exit(2);
}

// ── Statik sunucu ───────────────────────────────────────────────────────────
const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};
const server = REMOTE
  ? null
  : http
  .createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p.endsWith("/")) p += "index.html";
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT)) {
      res.writeHead(403);
      return res.end();
    }
    fs.readFile(file, (err, buf) => {
      if (err) {
        res.writeHead(404);
        return res.end();
      }
      res.writeHead(200, { "content-type": MIME[path.extname(file)] ?? "application/octet-stream" });
      res.end(buf);
    });
  })
  .listen(PORT);

// ── Story listesi ───────────────────────────────────────────────────────────
const BASE = REMOTE ?? `http://localhost:${PORT}`;
const index = REMOTE
  ? await (await fetch(`${REMOTE}/index.json`)).json()
  : JSON.parse(fs.readFileSync(path.join(ROOT, "index.json"), "utf8"));
const stories = Object.values(index.entries)
  .filter((e) => e.type === "story")
  .filter((e) => !(e.tags ?? []).includes("no-audit"))
  .filter((e) => !FILTER || FILTER.test(e.id));

/** Profil: tek bir sayfa yüklemesi + o yükleme üzerinde ölçülen genişlikler */
const ALL_PROFILES = [
  { key: "coarse-ltr", coarse: true, dir: "ltr", widths: [320, 360, 768, 1024], touchWidths: [320, 360] },
  { key: "coarse-rtl", coarse: true, dir: "rtl", widths: [360], touchWidths: [] },
  { key: "fine-ltr", coarse: false, dir: "ltr", widths: [1024, 1280], touchWidths: [] },
  { key: "fine-rtl", coarse: false, dir: "rtl", widths: [1024], touchWidths: [] },
];
const PROFILES = PROFILE_FILTER ? ALL_PROFILES.filter((p) => PROFILE_FILTER.includes(p.key)) : ALL_PROFILES;

// ── Sayfa içinde çalışan ölçüm ──────────────────────────────────────────────
/* eslint-disable no-undef */
function measure({ checkTouch, touchMin }) {
  const vw = document.documentElement.clientWidth;
  const root = document.querySelector("#storybook-root");
  const errDisplay =
    document.body.classList.contains("sb-show-errordisplay") ||
    document.body.classList.contains("sb-show-nopreview");
  const empty = !root || (root.children.length === 0 && root.textContent.trim() === "");
  const pageOverflow = document.documentElement.scrollWidth - vw;

  const describe = (el) => {
    const cls = String(el.className?.baseVal ?? el.className ?? "").trim().replace(/\s+/g, ".");
    const label = (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30);
    return `${el.tagName.toLowerCase()}${cls ? "." + cls.slice(0, 80) : ""}${label ? ` "${label}"` : ""}`;
  };
  const isHidden = (el) => {
    const cs = getComputedStyle(el);
    return cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0;
  };

  // Kırpılmamış taşan öğeler: viewport dışına çıkan ve hiçbir overflow≠visible
  // atası tarafından kırpılmayan öğeler (sola taşma — RTL — dahil)
  const offenders = [];
  const scope = [root, ...document.querySelectorAll("body > [data-radix-portal], body > [data-radix-popper-content-wrapper], body > div[role=dialog], [data-vaul-drawer]")].filter(Boolean);
  const seen = new Set();
  for (const s of scope) {
    for (const el of s.querySelectorAll("*")) {
      if (seen.has(el)) continue;
      seen.add(el);
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right <= vw + 1 && r.left >= -1) continue;
      if (getComputedStyle(el).position === "fixed" && (r.right < 0 || r.left > vw)) continue;
      let clipped = false;
      // Bir overflow atası, absolute/fixed bir öğeyi yalnızca öğenin containing
      // block'u o atanın içindeyse kırpar (ör. sr-only span, konumlanmamış bir
      // overflow-x-auto kaydırıcıdan kaçar ve sayfayı taşırır).
      const pos = getComputedStyle(el).position;
      const cb = pos === "absolute" ? el.offsetParent : null;
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        if (pos === "fixed") break;
        if (pos === "absolute" && cb && !a.contains(cb)) continue;
        const cs = getComputedStyle(a);
        if (cs.overflowX !== "visible" || cs.clipPath !== "none" || cs.contain.includes("paint")) {
          const ar = a.getBoundingClientRect();
          if (ar.right <= vw + 1 && ar.left >= -1) {
            clipped = true;
            break;
          }
        }
      }
      if (clipped || isHidden(el)) continue;
      // Yalnızca "kök neden"i raporla: ebeveyni de taşıyorsa ebeveyn zaten sayılmıştır
      const pr = el.parentElement?.getBoundingClientRect();
      const parentAlso = pr && (pr.right > vw + 1 || pr.left < -1) && el.parentElement !== root;
      if (!parentAlso) offenders.push(`${describe(el)} [${Math.round(r.left)}→${Math.round(r.right)}]`);
      if (offenders.length >= 4) break;
    }
  }

  // Dokunma hedefleri
  const smallTargets = [];
  if (checkTouch && root) {
    const SEL =
      "button, a[href], input:not([type=hidden]), select, textarea, summary, [role=button], [role=link], [role=tab], [role=checkbox], [role=radio], [role=switch], [role=menuitem], [role=menuitemcheckbox], [role=menuitemradio], [role=option], [role=slider], [role=combobox], [role=treeitem]";
    const hitRect = (el) => {
      const r = el.getBoundingClientRect();
      let w = r.width;
      let h = r.height;
      // overflow'u kırpan öğede ::before/::after dokunma alanı da kırpılır
      const own = getComputedStyle(el);
      if (own.overflowX !== "visible" || own.overflowY !== "visible") return { w, h };
      for (const pseudo of ["::before", "::after"]) {
        const ps = getComputedStyle(el, pseudo);
        if (ps.content === "none" || ps.content === "normal" || ps.display === "none") continue;
        if (ps.position !== "absolute") continue;
        const pw = parseFloat(ps.width);
        const ph = parseFloat(ps.height);
        if (Number.isFinite(pw)) w = Math.max(w, pw);
        if (Number.isFinite(ph)) h = Math.max(h, ph);
      }
      return { w, h };
    };
    const inlineInText = (el) => {
      if (el.tagName !== "A") return false;
      if (getComputedStyle(el).display !== "inline") return false;
      const p = el.parentElement;
      if (!p) return false;
      return (p.textContent || "").trim().length > (el.textContent || "").trim().length + 3;
    };
    const wrappedInLargeTarget = (el) => {
      for (let a = el.parentElement, d = 0; a && a !== root && d < 6; a = a.parentElement, d++) {
        const isTarget =
          a.tagName === "LABEL" ||
          a.matches("[role=option], [role=menuitem], [role=row][aria-selected], [data-touch-target]") ||
          (a.tagName === "A" && a.hasAttribute("href")) ||
          (a.tagName === "BUTTON");
        if (!isTarget) continue;
        const r = a.getBoundingClientRect();
        if (r.height >= touchMin && r.width >= touchMin) return true;
      }
      // Radix Checkbox/Radio/Switch'in bir <label for=id> ile eşleşmesi
      if (el.id) {
        const lbl = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
        if (lbl) {
          const r = lbl.getBoundingClientRect();
          const me = el.getBoundingClientRect();
          // etiket + kontrol birlikte ≥44px yüksekliğinde bir satır oluşturuyorsa
          const top = Math.min(r.top, me.top);
          const bottom = Math.max(r.bottom, me.bottom);
          if (bottom - top >= touchMin && r.width >= touchMin) return true;
        }
      }
      return false;
    };
    for (const el of root.querySelectorAll(SEL)) {
      const r = el.getBoundingClientRect();
      if (r.width <= 1 || r.height <= 1) continue;
      if (el.matches(":disabled, [aria-disabled=true]")) continue;
      if (el.closest("[aria-hidden=true], [inert]")) continue;
      const cs = getComputedStyle(el);
      if (cs.pointerEvents === "none" || isHidden(el)) continue;
      if (inlineInText(el)) continue;
      // WCAG 2.5.8 "equivalent": aynı işlev ≥44px başka bir kontrolle sunuluyorsa
      if (el.closest("[data-touch-equivalent]")) continue;
      const { w, h } = hitRect(el);
      const isField = el.matches("input:not([type=checkbox]):not([type=radio]):not([type=range]), select, textarea, [role=combobox]");
      const ok = isField ? h >= touchMin - 0.5 : w >= touchMin - 0.5 && h >= touchMin - 0.5;
      if (ok) continue;
      // Yoğun ızgara hücresi (takvim): yükseklik tam, genişlik WCAG 2.5.8 AA (≥24px)
      if (el.closest('[data-touch-dense], [data-testid^="ds-touch-dense"]') && h >= touchMin - 0.5 && w >= 24) continue;
      if (wrappedInLargeTarget(el)) continue;
      smallTargets.push(`${describe(el)} ${Math.round(w)}×${Math.round(h)}`);
    }
  }

  return {
    vw,
    pageOverflow,
    offenders,
    errDisplay,
    empty,
    smallTargets,
    coarse: matchMedia("(pointer: coarse)").matches,
    rtl: document.documentElement.dir === "rtl",
  };
}
/* eslint-enable no-undef */

// ── Çalıştırma ──────────────────────────────────────────────────────────────
const launchOpts = process.env.PLAYWRIGHT_CHROMIUM_PATH
  ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
  : { channel: "chrome" };
const browser = await chromium.launch({ headless: true, ...launchOpts });

const jobs = [];
for (const s of stories) for (const p of PROFILES) jobs.push({ s, p });
const results = [];
let cursor = 0;
let done = 0;
const t0 = Date.now();

async function worker() {
  const ctxs = {
    true: await browser.newContext({ viewport: { width: 360, height: 800 }, hasTouch: true, isMobile: false, reducedMotion: "reduce" }),
    false: await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" }),
  };
  const pages = { true: await ctxs.true.newPage(), false: await ctxs.false.newPage() };
  // Dokunmatik bağlamda (pointer: coarse) + (hover: none) medya sorgularını CDP ile zorla
  const cdp = await ctxs.true.newCDPSession(pages.true);
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await cdp.send("Emulation.setEmitTouchEventsForMouse", { enabled: true, configuration: "mobile" });

  const errors = { true: [], false: [] };
  for (const k of ["true", "false"]) {
    pages[k].on("pageerror", (e) => errors[k].push(String(e.message).slice(0, 200)));
  }

  while (cursor < jobs.length) {
    const { s, p } = jobs[cursor++];
    const tags = s.tags ?? [];
    if (p.dir === "rtl" && tags.includes("no-audit-rtl")) {
      done++;
      continue;
    }
    const page = pages[String(p.coarse)];
    const errs = errors[String(p.coarse)];
    errs.length = 0;
    const url = `${BASE}/iframe.html?id=${encodeURIComponent(s.id)}&viewMode=story${p.dir === "rtl" ? "&globals=direction:rtl" : ""}`;
    try {
      await page.setViewportSize({ width: p.widths[0], height: 900 });
      await page.goto(url, { waitUntil: "load", timeout: 30000 });
      await page
        .waitForFunction(
          () =>
            (document.querySelector("#storybook-root")?.childElementCount ?? 0) > 0 ||
            document.body.classList.contains("sb-show-errordisplay"),
          null,
          { timeout: 15000 },
        )
        .catch(() => {});
      await page.evaluate(() => document.fonts?.ready);
      await page.waitForTimeout(200);
      for (const w of p.widths) {
        if (w !== p.widths[0]) {
          await page.setViewportSize({ width: w, height: 900 });
          await page.waitForTimeout(180);
        }
        const r = await page.evaluate(measure, {
          checkTouch: p.touchWidths.includes(w) && !tags.includes("no-audit-touch"),
          touchMin: TOUCH_MIN,
        });
        if (p.coarse && !r.coarse) throw new Error("pointer: coarse emülasyonu etkin değil");
        if (p.dir === "rtl" && !r.rtl) throw new Error("dir=rtl uygulanmadı (globals=direction:rtl)");
        const overflow = !tags.includes("no-audit-overflow") && (r.pageOverflow > 1 || r.offenders.length > 0);
        results.push({
          id: s.id,
          title: s.title,
          name: s.name,
          profile: p.key,
          width: w,
          overflow,
          pageOverflow: r.pageOverflow,
          offenders: r.offenders,
          empty: r.empty || r.errDisplay,
          errors: [...errs],
          smallTargets: r.smallTargets,
        });
      }
    } catch (e) {
      results.push({ id: s.id, title: s.title, name: s.name, profile: p.key, width: p.widths[0], fail: String(e.message).slice(0, 200), errors: [...errs] });
    }
    done++;
    if (done % 250 === 0) {
      const sec = Math.round((Date.now() - t0) / 1000);
      console.error(`  ${done}/${jobs.length} yükleme (${sec}s)`);
    }
  }
  await ctxs.true.close();
  await ctxs.false.close();
}

console.error(`${stories.length} story × ${PROFILES.length} profil denetleniyor…`);
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
await browser.close();
server?.close();

// ── Rapor ───────────────────────────────────────────────────────────────────
const by = (pred) => results.filter(pred);
const overflowRows = by((r) => r.overflow);
const errorRows = by((r) => r.fail || r.errors?.length);
const emptyRows = by((r) => r.empty);
const touchRows = by((r) => r.smallTargets?.length);
const summary = {
  stories: stories.length,
  measurements: results.length,
  overflow: overflowRows.length,
  overflowStories: new Set(overflowRows.map((r) => r.id)).size,
  errors: errorRows.length,
  empty: emptyRows.length,
  touchStories: new Set(touchRows.map((r) => r.id)).size,
  touchTargets: touchRows.reduce((n, r) => n + r.smallTargets.length, 0),
};
fs.writeFileSync(OUT, JSON.stringify({ summary, results }, null, 1));

const show = (title, rows, fmt) => {
  if (!rows.length) return;
  console.log(`\n${title} (${rows.length})`);
  for (const r of rows.slice(0, 60)) console.log("  " + fmt(r));
  if (rows.length > 60) console.log(`  … +${rows.length - 60} (tam liste: ${OUT})`);
};
show("Yatay taşma", overflowRows, (r) => `${r.id} @${r.profile}/${r.width} +${r.pageOverflow}px ${r.offenders.join(" | ")}`);
show("JS hatası / yükleme", errorRows, (r) => `${r.id} @${r.profile}: ${r.fail ?? r.errors[0]}`);
show("Boş render", emptyRows, (r) => `${r.id} @${r.profile}/${r.width}`);
show("<44px dokunma hedefi", touchRows, (r) => `${r.id} @${r.width}: ${r.smallTargets.slice(0, 3).join(" | ")}`);
console.log("\nÖzet:", JSON.stringify(summary));

const failed =
  summary.overflow > MAX_OVERFLOW ||
  summary.touchTargets > MAX_TOUCH ||
  summary.errors + summary.empty > MAX_ERRORS;
process.exit(failed ? 1 : 0);
