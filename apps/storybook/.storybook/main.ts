import type { StorybookConfig } from "@storybook/react-vite";
import { resolve } from "node:path";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-toolbars", "@storybook/addon-viewport"],
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
