import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Story smoke + a11y testleri — .storybook/main.ts'deki alias'ların aynısı:
 * @wowsyler/ds-ui ve @wowsyler/ds-ui-native kaynaktan, react-native → react-native-web.
 */
const here = dirname(fileURLToPath(import.meta.url));
const pkg = (p: string) => resolve(here, "../../packages", p);
const nativeCharts = pkg("ui-native/src/charts/index.ts");
const require = createRequire(import.meta.url);
const uiNativeRequire = createRequire(pkg("ui-native/src/index.ts"));
const pkgDir = (name: string, req: NodeRequire = require) => dirname(req.resolve(`${name}/package.json`));
const assetsRegistryMock = resolve(here, "src/native-stories/_support/assets-registry.ts");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@wowsyler\/ds-ui$/, replacement: pkg("ui/src/index.ts") },
      ...(existsSync(nativeCharts) ? [{ find: /^@wowsyler\/ds-ui-native\/charts$/, replacement: nativeCharts }] : []),
      { find: /^@wowsyler\/ds-ui-native$/, replacement: pkg("ui-native/src/index.ts") },
      { find: /^@\//, replacement: pkg("ui/src") + "/" },
      // ESM girişi: import'lar Vite çözümlemesinden (dedupe) geçer → tek React kopyası.
      // (CJS girişi `require("react")`'i kendi konumundan çözüp ui-native'in React 18'ini yükler.)
      { find: /^react-native$/, replacement: join(pkgDir("react-native-web"), "dist/index.js") },
      { find: /^react-native-web$/, replacement: join(pkgDir("react-native-web"), "dist/index.js") },
      { find: /^react$/, replacement: pkgDir("react") },
      { find: /^react\/(.*)$/, replacement: `${pkgDir("react")}/$1` },
      { find: /^react-dom$/, replacement: pkgDir("react-dom") },
      { find: /^react-dom\/(.*)$/, replacement: `${pkgDir("react-dom")}/$1` },
      // main.ts ile aynı: RN paketlerinin ESM girişleri (CJS girişi RN'in Flow kaynağını ister)
      {
        find: /^react-native-safe-area-context$/,
        replacement: join(pkgDir("react-native-safe-area-context", uiNativeRequire), "lib/module/index.js"),
      },
      { find: /^react-native-svg$/, replacement: join(pkgDir("react-native-svg"), "lib/module/index.js") },
      ...(existsSync(assetsRegistryMock)
        ? [{ find: /^@react-native\/assets-registry\/registry$/, replacement: assetsRegistryMock }]
        : []),
    ],
    dedupe: ["react", "react-dom"],
    extensions: [".web.tsx", ".web.ts", ".web.mjs", ".web.js", ".tsx", ".ts", ".mjs", ".js", ".jsx", ".json"],
  },
  define: { __DEV__: "true" },
  test: {
    environment: "jsdom",
    include: ["test/**/*.test.{ts,tsx}"],
    setupFiles: ["./test/setup.ts"],
    css: false,
    testTimeout: 30_000,
    hookTimeout: 60_000,
    server: {
      deps: {
        inline: [/react-native-safe-area-context/, /react-native-svg/, /react-native-web/],
      },
    },
  },
});
