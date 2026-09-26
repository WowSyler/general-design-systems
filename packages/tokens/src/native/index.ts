/**
 * React Native girişi — CSS'e bağımlılık yok; temalar hex + sayı olarak
 * doğrudan tüketilir. ThemeProvider @wowsyler/ds-ui-native paketindedir.
 */
import { scales } from "../scales.js";
import { themes, getTheme } from "../themes/index.js";
import type { ColorTokens, ThemeDefinition } from "../types.js";

export { scales, themes, getTheme };
export type { ColorTokens, ThemeDefinition };

export type ColorMode = "light" | "dark";

/** WCAG 2.1 AA minimum dokunma hedefi (pt) */
export const MIN_TOUCH_TARGET = 44;

/** Semantik aralık ölçeği — GlowScan/Fisly konvansiyonu (4pt taban) */
export const space = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/** RN bileşenlerinin tükettiği çözümlenmiş tema: tek modun renkleri + ölçekler */
export interface NativeTheme {
  name: string;
  mode: ColorMode;
  colors: ColorTokens;
  radius: { sm: number; md: number; lg: number; xl: number; pill: number };
  /** Semantik aralıklar: none/xs/sm/md/lg/xl/xxl */
  space: typeof space;
  spacing: typeof scales.spacing;
  fontSize: typeof scales.fontSize;
  fontWeight: typeof scales.fontWeight;
}

export function resolveNativeTheme(
  theme: ThemeDefinition,
  mode: ColorMode,
): NativeTheme {
  const base = theme.radius.base;
  return {
    name: theme.name,
    mode,
    colors: theme.colors[mode],
    radius: {
      sm: Math.max(2, base - 4),
      md: Math.max(4, base - 2),
      lg: base,
      xl: base + 4,
      pill: 999,
    },
    space,
    spacing: scales.spacing,
    fontSize: scales.fontSize,
    fontWeight: scales.fontWeight,
  };
}
