import type { Config } from "tailwindcss";
import { dsPreset } from "@wowsyler/ds-tokens/tailwind-preset";
import animate from "tailwindcss-animate";

const config: Config = {
  presets: [dsPreset as Partial<Config>],
  darkMode: ["class"],
  // Story dosyaları da taranır: story'lere özgü utility'ler (w-[420px] gibi)
  // pakete derlenen CSS'te bulunmalı — design-sync önizlemeleri bu CSS'le render edilir.
  content: ["./src/**/*.{ts,tsx}", "../../apps/storybook/src/**/*.{ts,tsx}"],
  plugins: [animate],
  theme: {
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
};

export default config;
