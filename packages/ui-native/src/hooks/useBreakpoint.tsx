/**
 * Responsive/tablet araçları — useWindowDimensions + @wowsyler/ds-tokens kırılımları.
 *
 * - Kırılım adı (base/sm/md/lg/xl/2xl) pencere GENİŞLİĞİNE göre çözülür; web
 *   Tailwind kırılımlarıyla birebir aynıdır (640/768/1024/1280/1536).
 * - Cihaz sınıfı (isTablet) ise KISA KENARA göre belirlenir (≥ 600pt): yatay
 *   tutulan telefon (844×390) tablet sayılmaz, dikey iPad (820×1180) sayılır.
 */
import * as React from "react";
import { useWindowDimensions } from "react-native";

import { scales } from "@wowsyler/ds-tokens/native";

export type BreakpointName = "base" | "sm" | "md" | "lg" | "xl" | "2xl";

/** Kırılım eşikleri (pt) — web ile ortak kaynak. */
export const breakpoints: Record<Exclude<BreakpointName, "base">, number> = {
  sm: scales.breakpoints["sm"] ?? 640,
  md: scales.breakpoints["md"] ?? 768,
  lg: scales.breakpoints["lg"] ?? 1024,
  xl: scales.breakpoints["xl"] ?? 1280,
  "2xl": scales.breakpoints["2xl"] ?? 1536,
};

/** Tablet sayılmak için gereken en kısa kenar (pt). */
export const TABLET_MIN_SHORT_SIDE = 600;

const ORDER: BreakpointName[] = ["base", "sm", "md", "lg", "xl", "2xl"];

function minWidthOf(name: BreakpointName): number {
  return name === "base" ? 0 : breakpoints[name];
}

export function breakpointForWidth(width: number): BreakpointName {
  let current: BreakpointName = "base";
  for (const name of ORDER) {
    if (width >= minWidthOf(name)) current = name;
  }
  return current;
}

export interface BreakpointState {
  width: number;
  height: number;
  /** Genişliğe göre aktif kırılım. */
  breakpoint: BreakpointName;
  /** Kısa kenar < 600pt. */
  isPhone: boolean;
  /** Kısa kenar ≥ 600pt. */
  isTablet: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  /** Genişlik verilen kırılımın eşiğine eşit/üstünde mi. */
  up: (name: BreakpointName) => boolean;
  /** Genişlik verilen kırılımın eşiğinin altında mı. */
  down: (name: BreakpointName) => boolean;
}

export function computeBreakpointState(
  width: number,
  height: number,
): BreakpointState {
  const shortSide = Math.min(width, height);
  const isTablet = shortSide >= TABLET_MIN_SHORT_SIDE;
  return {
    width,
    height,
    breakpoint: breakpointForWidth(width),
    isPhone: !isTablet,
    isTablet,
    isLandscape: width > height,
    isPortrait: width <= height,
    up: (name) => width >= minWidthOf(name),
    down: (name) => width < minWidthOf(name),
  };
}

export function useBreakpoint(): BreakpointState {
  const { width, height } = useWindowDimensions();
  return React.useMemo(
    () => computeBreakpointState(width, height),
    [width, height],
  );
}

/** Kırılım bazlı değer haritası; en az `base` önerilir. */
export type ResponsiveValue<T> = Partial<Record<BreakpointName, T>>;

/** Aktif kırılıma uyan en büyük anahtarın değerini seçer (mobil-öncelikli). */
export function resolveResponsiveValue<T>(
  values: ResponsiveValue<T>,
  breakpoint: BreakpointName,
): T | undefined {
  const idx = ORDER.indexOf(breakpoint);
  for (let i = idx; i >= 0; i -= 1) {
    const key = ORDER[i]!;
    if (values[key] !== undefined) return values[key];
  }
  // Hiçbir alt kırılım tanımlı değilse en küçük tanımlı değere düş.
  for (const key of ORDER) {
    if (values[key] !== undefined) return values[key];
  }
  return undefined;
}

export function useResponsiveValue<T>(values: ResponsiveValue<T>): T | undefined {
  const { breakpoint } = useBreakpoint();
  return resolveResponsiveValue(values, breakpoint);
}

export interface ShowProps {
  /** Bu kırılım ve üstünde göster. */
  above?: BreakpointName;
  /** Bu kırılımın altında göster. */
  below?: BreakpointName;
  /** Yalnızca bu cihaz sınıfında göster. */
  device?: "phone" | "tablet";
  children?: React.ReactNode;
}

function matches(state: BreakpointState, props: ShowProps): boolean {
  if (props.above !== undefined && !state.up(props.above)) return false;
  if (props.below !== undefined && !state.down(props.below)) return false;
  if (props.device === "phone" && !state.isPhone) return false;
  if (props.device === "tablet" && !state.isTablet) return false;
  return true;
}

/** Koşul sağlanırsa çocukları render eder. */
export function Show({ children, ...conditions }: ShowProps): React.JSX.Element | null {
  const state = useBreakpoint();
  return matches(state, conditions) ? <>{children}</> : null;
}

/** Koşul sağlanırsa çocukları GİZLER (Show'un tersi). */
export function Hide({ children, ...conditions }: ShowProps): React.JSX.Element | null {
  const state = useBreakpoint();
  return matches(state, conditions) ? null : <>{children}</>;
}
