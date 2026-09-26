// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import { resolve, dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const uiNativeSrc = resolve(__dirname, "../../../packages/ui-native/src");
const uiNativeRequire = createRequire(join(uiNativeSrc, "index.ts"));

/** Paket kökü (mutlak). */
const pkgDir = (pkg: string, req: NodeRequire = require) =>
  dirname(req.resolve(`${pkg}/package.json`));

/**
 * React Native paketleri tarayıcıda react-native-web ile çalışır. `.web.*`
 * uzantıları önceliklidir (safe-area-context, svg web uygulamaları).
 */
const RN_WEB_EXTENSIONS = [
  ".web.tsx",
  ".web.ts",
  ".web.mjs",
  ".web.js",
  ".mjs",
  ".js",
  ".mts",
  ".ts",
  ".jsx",
  ".tsx",
  ".json",
];

const config: StorybookConfig = {
  framework: getAbsolutePath("@storybook/react-vite"),
  // Web bileşenleri (stories/) + React Native bileşenleri (native-stories/, react-native-web ile).
  // DS_STORIES=web → yalnızca web story'leri (Claude Design senkronu @wowsyler/ds-ui'yi
  // kapsar; `Native/Button` gibi başlıklar web export'larıyla çakışmasın).
  stories:
    process.env.DS_STORIES === "web"
      ? ["../src/stories/**/*.stories.@(ts|tsx)"]
      : ["../src/**/*.stories.@(ts|tsx)"],
  addons: [],
  core: { disableTelemetry: true },
  viteFinal: async (viteConfig, { configType }) => {
    const isDev = configType !== "PRODUCTION";
    viteConfig.resolve = viteConfig.resolve ?? {};
    const existing = viteConfig.resolve.alias ?? {};
    const existingList = Array.isArray(existing)
      ? existing
      : Object.entries(existing).map(([find, replacement]) => ({ find, replacement: replacement as string }));
    viteConfig.resolve.alias = [
      ...existingList,
      // @wowsyler/ds-ui kaynaktan çözülür (HMR + build gerektirmez); @/ ui iç alias'ı
      { find: /^@wowsyler\/ds-ui$/, replacement: resolve(__dirname, "../../../packages/ui/src/index.ts") },
      { find: /^@\//, replacement: `${resolve(__dirname, "../../../packages/ui/src")}/` },
      // @wowsyler/ds-ui-native kaynaktan (RN → react-native-web)
      { find: /^@wowsyler\/ds-ui-native$/, replacement: join(uiNativeSrc, "index.ts") },
      { find: /^@wowsyler\/ds-ui-native\/charts$/, replacement: join(uiNativeSrc, "charts/index.ts") },
      { find: /^react-native$/, replacement: pkgDir("react-native-web") },
      // RN paketlerinin ESM (lib/module) girişleri — CJS girişi RN'in Flow kaynağını ister.
      {
        find: /^react-native-safe-area-context$/,
        replacement: join(pkgDir("react-native-safe-area-context", uiNativeRequire), "lib/module/index.js"),
      },
      {
        find: /^react-native-svg$/,
        replacement: join(pkgDir("react-native-svg"), "lib/module/index.js"),
      },
      // Flow kaynağı olan varlık kaydı (svg web'de yalnızca tip olarak kullanır) — taklit.
      {
        find: /^@react-native\/assets-registry\/registry$/,
        replacement: resolve(__dirname, "../src/native-stories/_support/assets-registry.ts"),
      },
    ];
    // Tek React kopyası: ui-native kaynağı ve svg Storybook'un React'ini kullanır.
    viteConfig.resolve.dedupe = [...(viteConfig.resolve.dedupe ?? []), "react", "react-dom"];
    viteConfig.resolve.extensions = RN_WEB_EXTENSIONS;
    viteConfig.define = {
      ...(viteConfig.define ?? {}),
      __DEV__: JSON.stringify(isDev),
    };
    viteConfig.optimizeDeps = {
      ...(viteConfig.optimizeDeps ?? {}),
      include: [...(viteConfig.optimizeDeps?.include ?? []), "react-native-web"],
      esbuildOptions: {
        ...(viteConfig.optimizeDeps?.esbuildOptions ?? {}),
        resolveExtensions: RN_WEB_EXTENSIONS,
        define: { __DEV__: JSON.stringify(isDev) },
      },
    };
    return viteConfig;
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
