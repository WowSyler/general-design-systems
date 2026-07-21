// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import { resolve, dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  framework: getAbsolutePath("@storybook/react-vite"),
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [],
  core: { disableTelemetry: true },
  viteFinal: async (viteConfig) => {
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias ?? {}),
      // @ds/ui kaynaktan çözülür (HMR + build gerektirmez); @/ ui iç alias'ı
      "@ds/ui": resolve(__dirname, "../../../packages/ui/src/index.ts"),
      "@": resolve(__dirname, "../../../packages/ui/src"),
    };
    return viteConfig;
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
