import type { NativeTheme } from "@wowsyler/ds-tokens/native";

/** Temanın grafik paleti (chart1..chart5), sırayla döner. */
export function chartColors(theme: NativeTheme): string[] {
  const c = theme.colors;
  return [c.chart1, c.chart2, c.chart3, c.chart4, c.chart5];
}

export function colorAt(theme: NativeTheme, index: number, override?: string): string {
  if (override) return override;
  const palette = chartColors(theme);
  return palette[index % palette.length]!;
}
