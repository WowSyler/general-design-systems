import * as React from "react";
import type { Decorator, Preview } from "@storybook/react-vite";

import { DsThemeProvider } from "@wowsyler/ds-ui";

import "../src/styles.css";

/** Tema × mod toolbar'ı: her story 5 tema ve light/dark ile gezilebilir */
const withDsTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as string) ?? "deploylens";
  const mode = (context.globals.mode as "light" | "dark") ?? "light";
  const dir = (context.globals.direction as "ltr" | "rtl") ?? "ltr";
  // applyTo="root": tema sınıfları <html>'e yazılır — Radix portalları
  // (dropdown/dialog/popover) body'ye kaçtığından değişkenleri ancak kökten alır.
  return (
    <DsThemeProvider applyTo="root" theme={theme} mode={mode} dir={dir}>
      {/* Mobilde daha dar kenar boşluğu: 320px'lik ekranlarda içerik alanı korunur */}
      <div className="min-h-screen bg-background p-4 font-sans text-foreground sm:p-6">
        <Story />
      </div>
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
    direction: {
      description: "Yazı yönü (RTL: Arapça/İbranice arayüzler)",
      toolbar: {
        title: "Yön",
        icon: "transfer",
        items: [
          { value: "ltr", title: "LTR — soldan sağa" },
          { value: "rtl", title: "RTL — sağdan sola" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "deploylens",
    mode: "light",
    direction: "ltr",
  },
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: {
        mobile: { name: "Mobil", styles: { width: "390px", height: "844px" } },
        tablet: { name: "Tablet", styles: { width: "820px", height: "1180px" } },
        desktop: { name: "Masaüstü", styles: { width: "1440px", height: "900px" } },
      },
    },
    backgrounds: { disabled: true },
  },
};

export default preview;
