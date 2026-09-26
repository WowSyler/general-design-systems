import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { themes, themeToCss, tokenToCssVarName, hexToHslTriplet, dsPreset, scales } from "../src/index.js";
import { resolveNativeTheme, MIN_TOUCH_TARGET } from "../src/native/index.js";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const colorKeys = Object.keys(themes[0]!.colors.light);

describe("yardımcılar", () => {
  it("hexToHslTriplet shadcn formatı üretir", () => {
    expect(hexToHslTriplet("#FFFFFF")).toBe("0 0% 100%");
    expect(hexToHslTriplet("#000000")).toBe("0 0% 0%");
    expect(hexToHslTriplet("#7C3AED")).toMatch(/^\d+(\.\d)? \d+(\.\d)?% \d+(\.\d)?%$/);
    expect(() => hexToHslTriplet("#FFF")).toThrow();
  });

  it("tokenToCssVarName camelCase → kebab", () => {
    expect(tokenToCssVarName("cardForeground")).toBe("--card-foreground");
    expect(tokenToCssVarName("chart1")).toBe("--chart1");
  });
});

describe("CSS çıktısı", () => {
  it.each(themes.map((t) => [t.name, t] as const))("%s: tüm tokenlar light+dark bloklarında", (_n, theme) => {
    const css = themeToCss(theme);
    expect(css).toContain(`.theme-${theme.name}`);
    expect(css).toContain(`[data-theme="${theme.name}"]`);
    expect(css).toContain(`.theme-${theme.name}.dark`);
    for (const k of colorKeys) {
      const name = tokenToCssVarName(k);
      const count = css.split(`${name}:`).length - 1;
      expect(count, name).toBe(2);
    }
    expect(css).toMatch(/--radius: \d+px;/);
    expect(css).toContain("--font-sans:");
  });

  const built = existsSync(join(dist, "css", "themes.css"));
  it.runIf(built)("dist/css güncel (kaynakla birebir) ve toplayıcı tüm temaları içerir", () => {
    for (const theme of themes) {
      expect(readFileSync(join(dist, "css", `${theme.name}.css`), "utf8")).toBe(themeToCss(theme));
    }
    const agg = readFileSync(join(dist, "css", "themes.css"), "utf8");
    for (const theme of themes) expect(agg).toContain(`@import "./${theme.name}.css";`);
    expect(existsSync(join(dist, "css", "base.css"))).toBe(true);
  });

  it.runIf(built)("Tailwind v4 köprüsü her renk tokenını bağlar", () => {
    const v4 = readFileSync(join(dist, "css", "v4-bridge.css"), "utf8");
    for (const k of colorKeys) {
      const kebab = tokenToCssVarName(k).slice(2);
      expect(v4).toContain(`--color-${kebab}: hsl(var(--${kebab}));`);
    }
  });
});

describe("Tailwind preset", () => {
  it("renkler yalnızca CSS değişkenlerine bağlı (ham renk yok)", () => {
    const flat = JSON.stringify(dsPreset.theme.extend.colors);
    expect(flat).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    const vars = [...flat.matchAll(/var\(--([a-z0-9-]+)\)/g)].map((m) => m[1]);
    const known = new Set(colorKeys.map((k) => tokenToCssVarName(k).slice(2)));
    for (const v of vars) expect(known.has(v!), `--${v}`).toBe(true);
  });

  it("darkMode class ve giriş-cihazı variant eklentisi mevcut", () => {
    expect(dsPreset.darkMode).toBe("class");
    const variants: string[] = [];
    for (const plugin of dsPreset.plugins as unknown as ((api: unknown) => void)[]) {
      plugin({ addVariant: (n: string) => variants.push(n), addUtilities: () => {}, matchUtilities: () => {}, addComponents: () => {}, addBase: () => {}, theme: () => ({}) });
    }
    expect(variants).toEqual(expect.arrayContaining(["pointer-coarse", "pointer-fine", "hover-none"]));
  });
});

describe("React Native teması", () => {
  it.each(themes.flatMap((t) => (["light", "dark"] as const).map((m) => [t.name, m, t] as const)))(
    "%s/%s çözümlenir",
    (_n, mode, theme) => {
      const nt = resolveNativeTheme(theme, mode);
      expect(nt.mode).toBe(mode);
      expect(Object.keys(nt.colors).sort()).toEqual([...colorKeys].sort());
      expect(nt.radius.sm).toBeLessThanOrEqual(nt.radius.md);
      expect(nt.radius.md).toBeLessThanOrEqual(nt.radius.lg);
      expect(nt.radius.lg).toBeLessThan(nt.radius.xl);
    },
  );

  it("dokunma hedefi ve kırılımlar", () => {
    expect(MIN_TOUCH_TARGET).toBe(44);
    expect(scales.breakpoints).toMatchObject({ sm: 640, md: 768, lg: 1024, xl: 1280 });
  });
});
