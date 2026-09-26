import { describe, expect, it } from "vitest";
import { themes, getTheme, type ColorTokens } from "../src/index.js";

/** types.ts'teki ColorTokens sözleşmesinin çalışma zamanı kopyası — yeni token eklenince burası da güncellenmeli */
const REQUIRED_COLOR_TOKENS: (keyof ColorTokens)[] = [
  "background", "foreground", "card", "cardForeground", "popover", "popoverForeground",
  "primary", "primaryForeground", "secondary", "secondaryForeground", "muted", "mutedForeground",
  "accent", "accentForeground", "destructive", "destructiveForeground", "success", "successForeground",
  "warning", "warningForeground", "info", "infoForeground", "border", "input", "ring",
  "chart1", "chart2", "chart3", "chart4", "chart5",
  "sidebar", "sidebarForeground", "sidebarPrimary", "sidebarPrimaryForeground", "sidebarAccent",
  "sidebarAccentForeground", "sidebarBorder", "sidebarRing", "gradientFrom", "gradientTo", "shadowColor",
];

const HEX = /^#[0-9a-f]{6}$/i;

describe("tema kayıt defteri", () => {
  it("5 proje temasını içerir", () => {
    expect(themes.map((t) => t.name)).toEqual(["deploylens", "dolap", "randevu", "glowscan", "fisly"]);
  });

  it("tema adları benzersiz ve kebab-case", () => {
    const names = themes.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
    for (const n of names) expect(n).toMatch(/^[a-z][a-z0-9-]*$/);
  });

  it("getTheme bilinmeyen temada açıklayıcı hata fırlatır", () => {
    expect(getTheme("dolap").label).toBe("Dolap");
    expect(() => getTheme("yok")).toThrow(/Bilinmeyen tema/);
  });
});

describe.each(themes.map((t) => [t.name, t] as const))("%s teması", (_name, theme) => {
  it.each(["light", "dark"] as const)("%s modunda tüm semantik renk tokenları geçerli hex", (mode) => {
    const colors = theme.colors[mode];
    const keys = Object.keys(colors).sort();
    expect(keys).toEqual([...REQUIRED_COLOR_TOKENS].sort());
    for (const k of REQUIRED_COLOR_TOKENS) expect(colors[k], `${mode}.${k}`).toMatch(HEX);
  });

  it("light ve dark modları gerçekten farklı (dark modu kopyalanmamış)", () => {
    expect(theme.colors.dark.background.toLowerCase()).not.toBe(theme.colors.light.background.toLowerCase());
    expect(theme.colors.dark.foreground.toLowerCase()).not.toBe(theme.colors.light.foreground.toLowerCase());
  });

  it("tipografi ve yarıçap tanımlı", () => {
    for (const k of ["fontSans", "fontSerif", "fontMono", "fontDisplay"] as const) {
      expect(theme.typography[k].trim().length, k).toBeGreaterThan(0);
    }
    expect(theme.radius.base).toBeGreaterThanOrEqual(0);
    expect(theme.radius.base).toBeLessThanOrEqual(32);
  });
});
