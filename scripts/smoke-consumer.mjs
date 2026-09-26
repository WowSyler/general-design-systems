#!/usr/bin/env node
/**
 * Tüketici smoke testi — paketleri GERÇEK bir tüketicinin göreceği şekilde doğrular.
 *
 *   1. tokens + ui (+ ui-native) build edilir ve `pnpm pack` ile tarball'a çevrilir
 *      (workspace:* → gerçek sürüm; `files`/`exports` alanları gerçekten test edilir).
 *   2. Geçici dizinde üç tüketici kurulur (npm ile, repo'dan bağımsız):
 *      a) Vite + React 19 + TS + Tailwind v3 — `@…/ui/tailwind-preset` + content glob'u,
 *         `tsc --noEmit` (skipLibCheck KAPALI: paket .d.ts'leri ve bağımlılık tipleri
 *         tüketici tarafında çözülmeli) + `vite build` + derlenen CSS'te bileşen sınıfları.
 *      b) Next.js 15 App Router — hazır `styles.css`, server component içinde tüm paket
 *         barrel'ının import'u (modül seviyesindeki RSC hataları: client referansına
 *         "nokta ile erişim", server'da createContext…), server'da `cn()`/`buttonVariants()`
 *         çağrısı, client bileşenleri ve `"use client"` sınırları; `next build`.
 *      c) React Native (Expo tarzı tsconfig) — `tsc --noEmit` ile ui-native tipleri,
 *         hem `types` hem `react-native` export koşuluyla.
 *
 * Kullanım:
 *   node scripts/smoke-consumer.mjs [--only vite,next,native] [--skip-build] [--keep]
 *   SMOKE_DIR=/tmp/ds-smoke node scripts/smoke-consumer.mjs
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const onlyArg = args.find((a) => a.startsWith("--only"));
const only = onlyArg
  ? (onlyArg.includes("=") ? onlyArg.split("=")[1] : args[args.indexOf(onlyArg) + 1]).split(",")
  : ["vite", "next", "native"];
const WORK = resolve(process.env.SMOKE_DIR ?? join(process.env.RUNNER_TEMP ?? tmpdir(), "ds-smoke-consumer"));

const log = (msg) => console.log(`\n\x1b[36m▶ ${msg}\x1b[0m`);
function run(cmd, cwd, env = {}) {
  console.log(`  $ ${cmd}  (${cwd.replace(WORK, "$SMOKE_DIR").replace(ROOT, ".")})`);
  execSync(cmd, { cwd, stdio: "inherit", env: { ...process.env, CI: "1", ...env } });
}
const write = (file, content) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, typeof content === "string" ? content : JSON.stringify(content, null, 2) + "\n");
};
const readPkg = (dir) => JSON.parse(readFileSync(join(ROOT, dir, "package.json"), "utf8"));

const PKGS = {
  tokens: { dir: "packages/tokens", ...readPkg("packages/tokens") },
  ui: { dir: "packages/ui", ...readPkg("packages/ui") },
  native: { dir: "packages/ui-native", ...readPkg("packages/ui-native") },
};
const wantNative = only.includes("native");

// ─── 1. Build + pack ────────────────────────────────────────────────────────
if (!flag("skip-build")) {
  log("Paketler derleniyor");
  const filters = ["tokens", "ui", ...(wantNative ? ["native"] : [])]
    .map((k) => `--filter ${PKGS[k].name}`)
    .join(" ");
  run(`pnpm ${filters} build`, ROOT);
}

rmSync(WORK, { recursive: true, force: true });
const TARBALLS = join(WORK, "tarballs");
mkdirSync(TARBALLS, { recursive: true });
log(`Tarball'lar üretiliyor → ${TARBALLS}`);
const tgz = {};
for (const key of ["tokens", "ui", ...(wantNative ? ["native"] : [])]) {
  const before = new Set(readdirSync(TARBALLS));
  run(`pnpm pack --pack-destination "${TARBALLS}"`, join(ROOT, PKGS[key].dir));
  const created = readdirSync(TARBALLS).find((f) => !before.has(f));
  if (!created) throw new Error(`${key} için tarball üretilmedi`);
  tgz[key] = join(TARBALLS, created);
  const listing = execSync(`tar -tzf "${tgz[key]}"`).toString().trim().split("\n");
  const bad = listing.filter((f) => /\/(test|__tests__)\/|\.test\.|\.stories\.|tsconfig|vitest\.config/.test(f));
  console.log(`  ${created}: ${listing.length} dosya`);
  if (bad.length) throw new Error(`Tarball'a sızan geliştirme dosyaları (${key}):\n  ${bad.slice(0, 10).join("\n  ")}`);
  const packed = JSON.parse(execSync(`tar -xzOf "${tgz[key]}" package/package.json`).toString());
  const leaked = Object.entries({ ...packed.dependencies, ...packed.peerDependencies }).filter(([, v]) =>
    String(v).startsWith("workspace:"),
  );
  if (leaked.length) throw new Error(`workspace: protokolü tarball'da kaldı: ${JSON.stringify(leaked)}`);
}

const T = PKGS.tokens.name;
const U = PKGS.ui.name;
const N = PKGS.native.name;
const localDeps = (keys) => Object.fromEntries(keys.map((k) => [PKGS[k].name, `file:${tgz[k]}`]));
// İzole npm önbelleği: kullanıcının ~/.npm'i (ör. root sahipli eski dosyalar) testi etkilemesin.
// CI'da SMOKE_NPM_CACHE ile kalıcı bir önbelleğe yönlendirilebilir.
const NPM_CACHE = resolve(process.env.SMOKE_NPM_CACHE ?? join(WORK, ".npm-cache"));
// İzole npm yapılandırması: ~/.npmrc, global npmrc ve `pnpm run`'ın aktardığı
// npm_config_* ortam değişkenleri (ör. npm 11'in proje kurulumunda reddettiği
// `allow-scripts`) testi etkilemesin.
const NPM_USERCONFIG = join(WORK, ".npmrc-user");
const NPM_GLOBALCONFIG = join(WORK, ".npmrc-global");
const npmInstall = (dir) => {
  for (const f of [NPM_USERCONFIG, NPM_GLOBALCONFIG]) if (!existsSync(f)) writeFileSync(f, "");
  const env = Object.fromEntries(
    Object.entries(process.env).filter(([k]) => !k.toLowerCase().startsWith("npm_config_")),
  );
  execSync("npm install --no-audit --no-fund --loglevel=error", {
    cwd: dir,
    stdio: "inherit",
    env: {
      ...env,
      CI: "1",
      npm_config_cache: NPM_CACHE,
      npm_config_userconfig: NPM_USERCONFIG,
      npm_config_globalconfig: NPM_GLOBALCONFIG,
    },
  });
};

// ─── 2a. Vite ───────────────────────────────────────────────────────────────
if (only.includes("vite")) {
  const app = join(WORK, "vite-app");
  log("Tüketici (a): Vite + React 19 + Tailwind v3 preset");
  write(join(app, "package.json"), {
    name: "ds-smoke-vite",
    private: true,
    type: "module",
    scripts: { typecheck: "tsc --noEmit", build: "vite build" },
    dependencies: { react: "^19.0.0", "react-dom": "^19.0.0", ...localDeps(["tokens", "ui"]) },
    devDependencies: {
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      "@vitejs/plugin-react": "^4.3.4",
      autoprefixer: "^10.4.20",
      postcss: "^8.4.47",
      tailwindcss: "^3.4.14",
      typescript: "~5.8.0",
      vite: "^6.0.0",
    },
    overrides: localDeps(["tokens"]),
  });
  write(join(app, "tsconfig.json"), {
    compilerOptions: {
      target: "ES2022",
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      module: "ESNext",
      moduleResolution: "bundler",
      jsx: "react-jsx",
      strict: true,
      skipLibCheck: false,
      noEmit: true,
      isolatedModules: true,
      types: ["vite/client"],
    },
    include: ["src", "tailwind.config.ts"],
  });
  write(join(app, "vite.config.ts"), `import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nexport default defineConfig({ plugins: [react()] });\n`);
  write(join(app, "postcss.config.js"), `export default { plugins: { tailwindcss: {}, autoprefixer: {} } };\n`);
  write(
    join(app, "tailwind.config.ts"),
    `import type { Config } from "tailwindcss";
import dsUiPreset, { dsUiContent } from "${U}/tailwind-preset";

export default {
  presets: [dsUiPreset],
  content: ["./index.html", "./src/**/*.{ts,tsx}", dsUiContent],
} satisfies Config;
`,
  );
  write(
    join(app, "index.html"),
    `<!doctype html><html lang="tr"><head><meta charset="UTF-8" /><title>smoke</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n`,
  );
  write(
    join(app, "src/index.css"),
    `@import "${T}/fonts.css";\n@import "${T}/css/themes.css";\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`,
  );
  write(
    join(app, "src/main.tsx"),
    `import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { dsPreset } from "${T}/tailwind-preset";
import { themes } from "${T}";
import {
  Button, Card, CardContent, CardHeader, CardTitle, DsThemeProvider, Dialog, DialogContent,
  DialogTitle, DialogTrigger, Tabs, TabsContent, TabsList, TabsTrigger, StatCard, cn,
  useBreakpoint, useDsTheme, type ButtonProps,
} from "${U}";
import "./index.css";

const primary: ButtonProps["variant"] = "default";

function Demo() {
  const { theme, setTheme, dir, setDir } = useDsTheme();
  const { isMobile } = useBreakpoint();
  const [n, setN] = useState(0);
  return (
    <Card className={cn("m-4", isMobile && "m-2")}>
      <CardHeader><CardTitle>{theme} · {dir}</CardTitle></CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button variant={primary} onClick={() => setN(n + 1)}>Tıkla {n}</Button>
        <Button variant="outline" onClick={() => setTheme(themes[1]!.name)}>Tema</Button>
        <Button variant="ghost" onClick={() => setDir(dir === "rtl" ? "ltr" : "rtl")}>Yön</Button>
        <StatCard label="Gelir" value="₺12.400" />
        <Tabs defaultValue="a"><TabsList><TabsTrigger value="a">A</TabsTrigger></TabsList><TabsContent value="a">A</TabsContent></Tabs>
        <Dialog><DialogTrigger asChild><Button>Aç</Button></DialogTrigger><DialogContent><DialogTitle>Merhaba</DialogTitle></DialogContent></Dialog>
      </CardContent>
    </Card>
  );
}

console.log(Object.keys(dsPreset.theme.extend.colors).length);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DsThemeProvider defaultTheme="dolap" defaultMode="system"><Demo /></DsThemeProvider>
  </StrictMode>,
);
`,
  );
  npmInstall(app);
  run("npm run typecheck", app);
  run("npm run build", app);
  const assets = join(app, "dist/assets");
  const css = readdirSync(assets).filter((f) => f.endsWith(".css")).map((f) => readFileSync(join(assets, f), "utf8")).join("\n");
  const expectCss = {
    "tema değişkenleri (.theme-dolap)": /\.theme-dolap/,
    "semantik renk (.bg-primary)": /\.bg-primary\{/,
    "yalnız paket içinde kullanılan sınıf (data-[state=open]:animate-in)": /data-\\\[state\\=open\\\]\\:animate-in/,
    "font-face": /@font-face/,
  };
  for (const [label, re] of Object.entries(expectCss)) {
    if (!re.test(css)) throw new Error(`Vite CSS çıktısında bulunamadı: ${label}`);
    console.log(`  ✓ CSS: ${label}`);
  }
}

// ─── 2b. Next.js App Router ─────────────────────────────────────────────────
if (only.includes("next")) {
  const app = join(WORK, "next-app");
  log("Tüketici (b): Next.js 15 App Router (RSC)");
  write(join(app, "package.json"), {
    name: "ds-smoke-next",
    private: true,
    scripts: { build: "next build" },
    dependencies: { next: "^15.3.0", react: "^19.0.0", "react-dom": "^19.0.0", ...localDeps(["tokens", "ui"]) },
    devDependencies: { "@types/node": "^22.0.0", "@types/react": "^19.0.0", "@types/react-dom": "^19.0.0", typescript: "~5.8.0" },
    overrides: localDeps(["tokens"]),
  });
  write(join(app, "tsconfig.json"), {
    compilerOptions: {
      target: "ES2022",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: false,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      incremental: false,
      plugins: [{ name: "next" }],
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
    exclude: ["node_modules"],
  });
  // optimizePackageImports: barrel import'larını doğrudan modül yollarına çevirir —
  // olmadan tek bir { Button } import'u bile tüm client modüllerini sayfaya taşır (~400 kB → ~130 kB)
  write(
    join(app, "next.config.mjs"),
    `/** @type {import('next').NextConfig} */\nexport default { eslint: { ignoreDuringBuilds: true }, experimental: { optimizePackageImports: ["${U}"] } };\n`,
  );
  write(
    join(app, "app/layout.tsx"),
    `import type { ReactNode } from "react";
import { DsThemeProvider } from "${U}";
import "${T}/fonts.css";
import "${U}/styles.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <DsThemeProvider defaultTheme="randevu" defaultMode="light">{children}</DsThemeProvider>
      </body>
    </html>
  );
}
`,
  );
  write(
    join(app, "app/page.tsx"),
    `// SERVER component — adlandırılmış import'lar
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, StatCard, Tabs, TabsContent, TabsList, TabsTrigger, buttonVariants, cn } from "${U}";
import { Counter } from "./counter";

export default function Page() {
  return (
    <main className={cn("p-6", "p-8")}>
      <Card>
        <CardHeader><CardTitle>RSC smoke</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge>Rozet</Badge>
          <Button>Server buton</Button>
          <a className={buttonVariants({ variant: "outline" })} href="#">Link buton</a>
          <StatCard label="Randevu" value="42" />
          <Tabs defaultValue="a"><TabsList><TabsTrigger value="a">A</TabsTrigger></TabsList><TabsContent value="a">İçerik</TabsContent></Tabs>
          <Counter />
        </CardContent>
      </Card>
    </main>
  );
}
`,
  );
  write(
    join(app, "app/tum-exportlar/page.tsx"),
    `// SERVER component — paketin TÜM modülleri server'da değerlendirilir:
// modül seviyesinde client referansına erişim / createContext gibi RSC hataları burada patlar.
import * as DS from "${U}";

export default function AllExports() {
  const names = Object.keys(DS).sort();
  return <p>{names.length} export: {names.slice(0, 5).join(", ")}</p>;
}
`,
  );
  write(
    join(app, "app/counter.tsx"),
    `"use client";
import { useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, DialogTrigger, ThemeModeToggle, useBreakpoint, useDsTheme } from "${U}";

export function Counter() {
  const [n, setN] = useState(0);
  const { theme } = useDsTheme();
  const { breakpoint } = useBreakpoint();
  return (
    <div className="flex gap-2">
      <Button onClick={() => setN(n + 1)}>{theme} {breakpoint} {n}</Button>
      <ThemeModeToggle />
      <Dialog><DialogTrigger asChild><Button variant="outline">Aç</Button></DialogTrigger><DialogContent><DialogTitle>Merhaba</DialogTitle></DialogContent></Dialog>
    </div>
  );
}
`,
  );
  npmInstall(app);
  run("npm run build", app, { NEXT_TELEMETRY_DISABLED: "1" });
  const html = readFileSync(join(app, ".next/server/app/index.html"), "utf8");
  for (const needle of ["RSC smoke", "Server buton", "Link buton"]) {
    if (!html.includes(needle)) throw new Error(`Next prerender çıktısında yok: ${needle}`);
  }
  const all = readFileSync(join(app, ".next/server/app/tum-exportlar.html"), "utf8");
  const count = Number(/(\d+)(?:<!-- -->)? export/.exec(all)?.[1] ?? 0);
  if (count < 100) throw new Error(`/tum-exportlar beklenenden az export gösterdi: ${count}`);
  console.log(`  ✓ Prerender HTML bileşenleri içeriyor; server'da ${count} export değerlendirildi`);
}

// ─── 2c. React Native (tip kontrolü) ────────────────────────────────────────
if (wantNative) {
  const app = join(WORK, "native-app");
  log("Tüketici (c): React Native tip kontrolü");
  const nativePkg = JSON.parse(execSync(`tar -xzOf "${tgz.native}" package/package.json`).toString());
  const hasCharts = Boolean(nativePkg.exports?.["./charts"]);
  write(join(app, "package.json"), {
    name: "ds-smoke-native",
    private: true,
    dependencies: {
      react: "18.3.1",
      "react-native": "0.76.9",
      "react-native-safe-area-context": "4.12.0",
      "react-native-svg": "15.8.0",
      ...localDeps(["tokens", "native"]),
    },
    devDependencies: { "@types/react": "~18.3.12", typescript: "~5.8.0" },
    overrides: localDeps(["tokens"]),
  });
  const base = {
    target: "ESNext",
    module: "ESNext",
    moduleResolution: "bundler",
    jsx: "react-jsx",
    strict: true,
    skipLibCheck: true,
    noEmit: true,
    allowImportingTsExtensions: true,
    lib: ["ES2022"],
    types: [],
  };
  write(join(app, "tsconfig.json"), { compilerOptions: base, include: ["App.tsx"] });
  // Expo SDK 50+ tsconfig.base: customConditions ["react-native"] → paket src'si çözülür
  write(join(app, "tsconfig.expo.json"), { compilerOptions: { ...base, customConditions: ["react-native"] }, include: ["App.tsx"] });
  write(
    join(app, "App.tsx"),
    `import { NativeThemeProvider, Button, Card, Text, useNativeTheme } from "${N}";
${hasCharts ? `import * as Charts from "${N}/charts";\nvoid Charts;` : ""}

function Inner() {
  const theme = useNativeTheme();
  return (
    <Card>
      <Text>{String(theme.theme?.name ?? "")}</Text>
      <Button title="Kaydet" onPress={() => {}} />
    </Card>
  );
}

export default function App() {
  return (
    <NativeThemeProvider theme="fisly" mode="system">
      <Inner />
    </NativeThemeProvider>
  );
}
`,
  );
  npmInstall(app);
  run("./node_modules/.bin/tsc -p tsconfig.json", app);
  run("./node_modules/.bin/tsc -p tsconfig.expo.json", app);
}

log("Tüketici smoke testi başarılı ✓");
if (!flag("keep")) rmSync(WORK, { recursive: true, force: true });
else console.log(`  Dizin korundu: ${WORK}`);
