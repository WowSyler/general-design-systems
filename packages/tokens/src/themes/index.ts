import type { ThemeDefinition } from "../types.js";
import { deploylens } from "./deploylens.js";
import { dolap } from "./dolap.js";
import { randevu } from "./randevu.js";
import { glowscan } from "./glowscan.js";
import { fisly } from "./fisly.js";

export { deploylens, dolap, randevu, glowscan, fisly };

/**
 * Tema kayıt defteri. Yeni proje eklemek için:
 * 1. themes/<ad>.ts dosyası oluştur (ThemeDefinition)
 * 2. Buraya import edip listeye ekle
 * 3. `pnpm build` — CSS, Tailwind preset ve RN çıktıları otomatik üretilir.
 */
export const themes: readonly ThemeDefinition[] = [
  deploylens,
  dolap,
  randevu,
  glowscan,
  fisly,
];

export type ThemeName = (typeof themes)[number]["name"];

export function getTheme(name: string): ThemeDefinition {
  const theme = themes.find((t) => t.name === name);
  if (!theme) {
    throw new Error(
      `Bilinmeyen tema: ${name}. Mevcut temalar: ${themes.map((t) => t.name).join(", ")}`,
    );
  }
  return theme;
}
