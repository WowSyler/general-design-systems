import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { defineConfig } from "vitest/config";

const require = createRequire(import.meta.url);
/** Paketin ESM (lib/module) girişi — Node'un CJS çözümü RN'in Flow kaynağına düşmesin. */
const esmEntry = (pkg: string) => join(dirname(require.resolve(`${pkg}/package.json`)), "lib/module/index.js");
/** Paket kökü (mutlak) — bağımlılıkların farklı pnpm kopyalarına düşmesini önler. */
const pkgDir = (pkg: string) => dirname(require.resolve(`${pkg}/package.json`));

/**
 * RN bileşenleri jsdom'da react-native-web üzerinden render edilir.
 * `.web.*` uzantıları önceliklidir; RN ekosistem paketleri (safe-area, svg)
 * alias'ın uygulanması için Vite'tan geçirilir (inline).
 */
export default defineConfig({
  resolve: {
    // react-native-svg pnpm'de başka bir React sürümüne bağlanabilir; tek kopya zorla.
    dedupe: ["react", "react-dom"],
    alias: [
      // Mutlak yol: svg gibi paketler de bu paketin react-native-web (React 18) kopyasını kullanır.
      { find: /^react-native$/, replacement: pkgDir("react-native-web") },
      { find: /^react$/, replacement: pkgDir("react") },
      { find: /^react\/(.*)$/, replacement: `${pkgDir("react")}/$1` },
      { find: /^react-dom$/, replacement: pkgDir("react-dom") },
      { find: /^react-dom\/(.*)$/, replacement: `${pkgDir("react-dom")}/$1` },
      { find: /^react-native-safe-area-context$/, replacement: esmEntry("react-native-safe-area-context") },
      { find: /^react-native-svg$/, replacement: esmEntry("react-native-svg") },
      {
        find: /^@react-native\/assets-registry\/registry$/,
        replacement: new URL("./test/stubs/assets-registry.ts", import.meta.url).pathname,
      },
    ],
    extensions: [
      ".web.tsx",
      ".web.ts",
      ".web.mjs",
      ".web.js",
      ".tsx",
      ".ts",
      ".mjs",
      ".js",
      ".jsx",
      ".json",
    ],
  },
  define: {
    __DEV__: "true",
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}", "test/**/*.test.{ts,tsx}"],
    setupFiles: ["./test/setup.ts"],
    server: {
      deps: {
        inline: [/react-native-safe-area-context/, /react-native-svg/, /react-native-web/],
      },
    },
  },
});
