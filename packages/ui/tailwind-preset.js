/**
 * @wowsyler/ds-ui Tailwind v3 preset'i — kendi Tailwind derlemesini yapan tüketiciler için.
 *
 * `@wowsyler/ds-tokens` preset'ini (renk/yarıçap/font/animasyon + pointer-coarse,
 * hover-none, rtl… variant'ları) `tailwindcss-animate` eklentisi ve Radix
 * accordion animasyonlarıyla birleştirir. Bileşen sınıflarının üretilmesi için
 * `content` dizisine paket çıktısını da ekleyin:
 *
 *   import dsUiPreset, { dsUiContent } from "@wowsyler/ds-ui/tailwind-preset";
 *   export default {
 *     presets: [dsUiPreset],
 *     content: ["./src/**\/*.{ts,tsx}", dsUiContent],
 *   };
 *
 * Kendi Tailwind derlemeniz yoksa bunun yerine `@wowsyler/ds-ui/styles.css` import edin
 * (ikisini birlikte kullanmayın — preflight iki kez yüklenir).
 */
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { dsPreset } from "@wowsyler/ds-tokens/tailwind-preset";
import animate from "tailwindcss-animate";

const require = createRequire(import.meta.url);

/** Paketin derlenmiş bileşenlerini kapsayan mutlak content glob'u */
export const dsUiContent = join(
  dirname(require.resolve("./package.json")),
  "dist/**/*.js",
);

const dsUiPreset = {
  presets: [dsPreset],
  darkMode: ["class"],
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

export { dsUiPreset };
export default dsUiPreset;
