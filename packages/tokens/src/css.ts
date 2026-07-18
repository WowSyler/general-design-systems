import type { ColorTokens, ThemeDefinition } from "./types.js";

/**
 * Hex rengi shadcn'in beklediği "H S% L%" üçlüsüne çevirir.
 * Bu format hem Tailwind v3 (hsl(var(--x))) hem v4 (@theme inline) ile çalışır.
 */
export function hexToHslTriplet(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m || !m[1]) throw new Error(`Geçersiz hex renk: ${hex}`);
  const int = parseInt(m[1], 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }
  const round = (n: number) => Math.round(n * 10) / 10;
  return `${round(h * 360)} ${round(s * 100)}% ${round(l * 100)}%`;
}

/** camelCase token adını CSS değişken adına çevirir: cardForeground → card-foreground */
export function tokenToCssVarName(token: string): string {
  return "--" + token.replace(/([A-Z])/g, "-$1").toLowerCase();
}

function colorBlock(colors: ColorTokens, indent: string): string {
  return (Object.entries(colors) as [string, string][])
    .map(([k, v]) => `${indent}${tokenToCssVarName(k)}: ${hexToHslTriplet(v)};`)
    .join("\n");
}

/**
 * Bir temanın tüm CSS'ini üretir.
 * Kullanım: <html class="theme-glowscan"> (+ dark için <html class="theme-glowscan dark">)
 * data-theme attribute alternatifi de desteklenir.
 */
export function themeToCss(theme: ThemeDefinition): string {
  const light = `.theme-${theme.name},\n[data-theme="${theme.name}"] {\n${colorBlock(theme.colors.light, "  ")}
  --radius: ${theme.radius.base}px;
  --font-sans: ${theme.typography.fontSans};
  --font-serif: ${theme.typography.fontSerif};
  --font-mono: ${theme.typography.fontMono};
  --font-display: ${theme.typography.fontDisplay};\n}`;

  const dark = `.theme-${theme.name}.dark,\n.dark .theme-${theme.name},\n[data-theme="${theme.name}"].dark,\n.dark [data-theme="${theme.name}"] {\n${colorBlock(theme.colors.dark, "  ")}\n}`;

  return `/* ${theme.label} — otomatik üretildi, elle düzenlemeyin (@ds/tokens) */\n${light}\n\n${dark}\n`;
}
