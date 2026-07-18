/**
 * Token CSS üretimi — tsc çıktısındaki temaları okuyup dist/css/ altına yazar.
 * Çalıştırma sırası önemli: önce `tsc`, sonra bu script (package.json "build").
 *
 * Çıktılar:
 *   dist/css/<tema>.css        — tema başına CSS custom property blokları
 *   dist/css/themes.css        — tüm temaları import eden toplayıcı
 *   dist/css/base.css          — global reset-üstü temel stiller (body bg/fg, font)
 *   dist/css/v4-bridge.css     — Tailwind v4 @theme inline köprüsü (Randevu admin gibi
 *                                v4 projeleri utility adlarını CSS değişkenlerine bağlar)
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "..", "dist");
const cssDir = join(dist, "css");

const { themes } = await import(join(dist, "themes", "index.js"));
const { themeToCss } = await import(join(dist, "css.js"));

await mkdir(cssDir, { recursive: true });

for (const theme of themes) {
  await writeFile(join(cssDir, `${theme.name}.css`), themeToCss(theme), "utf8");
}

const imports = themes.map((t) => `@import "./${t.name}.css";`).join("\n");
await writeFile(join(cssDir, "themes.css"), imports + "\n", "utf8");

const base = `/* @ds/tokens taban stilleri — tema sınıfıyla birlikte kullanılır */
body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
`;
await writeFile(join(cssDir, "base.css"), base, "utf8");

// Tailwind v4 projeleri için: utility adlarını (@theme inline) DS değişkenlerine bağlar.
const colorKeys = Object.keys(themes[0].colors.light);
const kebab = (s) => s.replace(/([A-Z])/g, "-$1").toLowerCase();
const v4Lines = colorKeys
  .map((k) => `  --color-${kebab(k)}: hsl(var(--${kebab(k)}));`)
  .join("\n");
const v4 = `/* Tailwind v4 köprüsü: @import "tailwindcss"; sonrasında import edin */
@theme inline {
${v4Lines}
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --font-sans: var(--font-sans);
  --font-serif: var(--font-serif);
  --font-mono: var(--font-mono);
}
`;
await writeFile(join(cssDir, "v4-bridge.css"), v4, "utf8");

console.log(
  `✓ ${themes.length} tema CSS'i üretildi: ${themes.map((t) => t.name).join(", ")}`,
);
