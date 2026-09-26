import { defineConfig } from "tsup";
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import ts from "typescript";

/**
 * @wowsyler/ds-ui derlemesi — dosya başına (unbundled) ESM çıktısı.
 *
 * Neden tek bundle değil?
 *  - Next.js App Router: "use client" direktifi MODÜL seviyesinde çalışır. Tek
 *    bundle'da esbuild direktifleri siler; tüm paketi client yapmak ise `cn()`
 *    gibi saf yardımcıları server component'lerde çağrılamaz hale getirir.
 *    Dosya başına çıktıda yalnızca gerçekten client olan modüller işaretlenir.
 *  - Tüketici bundler'ı (Next/Vite) kullanılmayan bileşenleri dosya
 *    seviyesinde eler (tree-shaking), CSS dışında yan etkisi yoktur.
 *
 * Derleme sonrası adımlar (onSuccess):
 *  1. `@/…` alias'ları ve uzantısız göreli import'lar tam belirtilmiş
 *     (`./x.js`, `./dir/index.js`) göreli yollara çevrilir — webpack'in
 *     "fullySpecified" ESM kuralı ve Node ESM çözümlemesi için şart.
 *  2. Kaynakta "use client" olan YA DA hook/context/olay işleyicisi kullanan
 *     veya client-only paket (Radix, cmdk, vaul…) import eden modüllerin
 *     çıktısına "use client" eklenir.
 *  3. TypeScript API'siyle .d.ts üretilir; aynı yol dönüşümü uygulanır.
 */

const SRC = resolve(__dirname, "src");
const DIST = resolve(__dirname, "dist");

const CLIENT_SIGNALS =
  /\buse(State|Effect|LayoutEffect|InsertionEffect|Ref|Reducer|Context|Callback|Memo|Id|Transition|SyncExternalStore|ImperativeHandle|DeferredValue|Optimistic|ActionState)\b|\bcreateContext\b|\bon[A-Z][A-Za-z]+=\{/;
/**
 * Client-only paketleri (kendi dist'lerinde "use client" taşıyanlar) import eden
 * modüller de client olmalı: server modülünde `Primitive.Content.displayName`
 * gibi client referansına "nokta ile erişim" Next.js'te hata fırlatır.
 * `@radix-ui/react-slot` hariç (direktifsiz; Button/buttonVariants server'da kullanılabilir kalsın).
 */
const CLIENT_IMPORTS =
  /from\s+["'](?:@radix-ui\/react-(?!slot["'])[\w-]+|cmdk|vaul|sonner|input-otp|react-day-picker|next-themes|react-hook-form|@hookform\/[\w-]+)["']/;
const HAS_DIRECTIVE =/^\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*)*["']use client["']/;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const isSourceModule = (p: string) =>
  /\.(ts|tsx)$/.test(p) && !/\.d\.ts$/.test(p) && !/\.(test|spec|stories)\.tsx?$/.test(p);

/** src içindeki bir modül yolunu (uzantısız) gerçek dosyaya çözer; dist göreli hedefini döndürür */
function resolveSourceTarget(absNoExt: string): string | null {
  for (const ext of [".ts", ".tsx"]) {
    if (existsSync(absNoExt + ext)) return absNoExt + ".js";
  }
  for (const ext of [".ts", ".tsx"]) {
    if (existsSync(join(absNoExt, "index" + ext))) return join(absNoExt, "index.js");
  }
  return null;
}

/** Çıktı dosyasındaki import/export specifier'larını tam belirtilmiş göreli yola çevirir */
function rewriteSpecifiers(code: string, outFile: string, srcFile: string): string {
  const srcDir = dirname(srcFile);
  const outDir = dirname(outFile);
  const replace = (spec: string): string => {
    let absSrcNoExt: string | null = null;
    if (spec.startsWith("@/")) absSrcNoExt = join(SRC, spec.slice(2));
    else if (spec.startsWith("./") || spec.startsWith("../")) {
      if (/\.(js|mjs|cjs|css|json)$/.test(spec)) return spec;
      absSrcNoExt = resolve(srcDir, spec);
    } else return spec;
    const targetInSrc = resolveSourceTarget(absSrcNoExt);
    if (!targetInSrc) throw new Error(`Çözülemeyen import: "${spec}" (${relative(SRC, srcFile)})`);
    const targetInDist = join(DIST, relative(SRC, targetInSrc));
    let rel = relative(outDir, targetInDist).split(sep).join("/");
    if (!rel.startsWith(".")) rel = "./" + rel;
    return rel;
  };
  return code
    .replace(/(\bfrom\s*["'])([^"']+)(["'])/g, (_, a, s, b) => a + replace(s) + b)
    .replace(/(\bimport\s*["'])([^"']+)(["'])/g, (_, a, s, b) => a + replace(s) + b)
    .replace(/(\bimport\(\s*["'])([^"']+)(["']\s*\))/g, (_, a, s, b) => a + replace(s) + b);
}

function srcFor(distFile: string, kind: "js" | "dts"): string | null {
  const rel = relative(DIST, distFile).replace(kind === "js" ? /\.js$/ : /\.d\.ts$/, "");
  for (const ext of [".ts", ".tsx"]) {
    const p = join(SRC, rel + ext);
    if (existsSync(p)) return p;
  }
  return null;
}

function emitDeclarations() {
  const program = ts.createProgram(
    walk(SRC).filter(isSourceModule),
    {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.ReactJSX,
      strict: true,
      skipLibCheck: true,
      esModuleInterop: true,
      resolveJsonModule: true,
      isolatedModules: true,
      declaration: true,
      emitDeclarationOnly: true,
      noUncheckedIndexedAccess: true,
      rootDir: SRC,
      outDir: DIST,
      baseUrl: __dirname,
      paths: { "@/*": ["src/*"] },
      lib: ["lib.es2022.d.ts", "lib.dom.d.ts", "lib.dom.iterable.d.ts"],
    },
  );
  const result = program.emit();
  const errors = ts
    .getPreEmitDiagnostics(program)
    .concat(result.diagnostics)
    .filter((d) => d.category === ts.DiagnosticCategory.Error);
  if (errors.length) {
    const host = {
      getCanonicalFileName: (f: string) => f,
      getCurrentDirectory: () => __dirname,
      getNewLine: () => "\n",
    };
    throw new Error(ts.formatDiagnostics(errors.slice(0, 20), host));
  }
}

function postprocess() {
  let clientCount = 0;
  let autoClient: string[] = [];
  for (const file of walk(DIST)) {
    if (file.endsWith(".js")) {
      const src = srcFor(file, "js");
      if (!src) continue;
      const source = readFileSync(src, "utf8");
      let code = rewriteSpecifiers(readFileSync(file, "utf8"), file, src);
      const declared = HAS_DIRECTIVE.test(source);
      const needsClient = declared || CLIENT_SIGNALS.test(source) || CLIENT_IMPORTS.test(source);
      if (needsClient) {
        clientCount++;
        if (!declared) autoClient.push(relative(SRC, src));
        if (!HAS_DIRECTIVE.test(code)) {
          code = `"use client";\n` + code;
          // Kaynak haritası: eklenen satır kadar üretilmiş satırları kaydır
          const mapFile = file + ".map";
          if (existsSync(mapFile)) {
            const map = JSON.parse(readFileSync(mapFile, "utf8"));
            map.mappings = ";" + map.mappings;
            writeFileSync(mapFile, JSON.stringify(map));
          }
        }
      }
      writeFileSync(file, code);
    } else if (file.endsWith(".d.ts")) {
      const src = srcFor(file, "dts");
      if (!src) continue;
      writeFileSync(file, rewriteSpecifiers(readFileSync(file, "utf8"), file, src));
    }
  }
  console.log(`✓ @wowsyler/ds-ui: ${clientCount} client modül ("use client")`);
  if (autoClient.length) {
    console.log(
      `  ↳ ${autoClient.length} modül kaynakta direktifsiz ama hook/olay kullanıyor — çıktıya otomatik eklendi`,
    );
    if (process.env.DS_VERBOSE) autoClient.forEach((f) => console.log("    " + f));
  }
}

export default defineConfig({
  entry: ["src/**/*.ts", "src/**/*.tsx", "!src/**/*.d.ts", "!src/**/*.{test,spec,stories}.{ts,tsx}"],
  format: ["esm"],
  bundle: false,
  dts: false,
  sourcemap: true,
  clean: true,
  treeshake: false,
  splitting: false,
  target: "es2020",
  outDir: "dist",
  // Dosya başına ~290 giriş: tsup'ın giriş/çıktı listesini basmasını engelle (özet onSuccess'te)
  silent: true,
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
  async onSuccess() {
    emitDeclarations();
    postprocess();
  },
});
