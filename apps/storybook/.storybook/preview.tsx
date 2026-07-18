import * as React from "react";
import type { Decorator, Preview } from "@storybook/react";

import { DsThemeProvider } from "@ds/ui";

import "../src/styles.css";

/** Tema × mod toolbar'ı: her story 5 tema ve light/dark ile gezilebilir */
const withDsTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as string) ?? "deploylens";
  const mode = (context.globals.mode as "light" | "dark") ?? "light";
  return (
    <DsThemeProvider applyTo="self" theme={theme} mode={mode} className="min-h-screen p-6">
      <Story />
    </DsThemeProvider>
  );
};

const preview: Preview = {
  decorators: [withDsTheme],
  globalTypes: {
    theme: {
      description: "Proje teması",
      toolbar: {
        title: "Tema",
        icon: "paintbrush",
        items: [
          { value: "deploylens", title: "DeployLens" },
          { value: "dolap", title: "Dolap" },
          { value: "randevu", title: "Randevu" },
          { value: "glowscan", title: "GlowScan" },
          { value: "fisly", title: "Fisly" },
        ],
        dynamicTitle: true,
      },
    },
    mode: {
      description: "Renk modu",
      toolbar: {
        title: "Mod",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "deploylens",
    mode: "light",
  },
  parameters: {
    layout: "fullscreen",
    viewport: {
      viewports: {
        mobile: { name: "Mobil", styles: { width: "390px", height: "844px" } },
        tablet: { name: "Tablet", styles: { width: "820px", height: "1180px" } },
        desktop: { name: "Masaüstü", styles: { width: "1440px", height: "900px" } },
      },
    },
    backgrounds: { disable: true },
  },
};

export default preview;
