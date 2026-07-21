/**
 * useBreakpoint — Duyarli (responsive) breakpoint hook koleksiyonu.
 * Bir bilesen degil; matchMedia tabanli, SSR-guvenli hook'lar sunar:
 *  - useMediaQuery(query): verilen medya sorgusunun eslesip eslesmedigini
 *    dondurur. useSyncExternalStore ile abone olur; sunucu tarafinda (SSR)
 *    guvenle false doner, istemcide mount sonrasi gercek degere gecer.
 *  - useBreakpoint(): aktif breakpoint adini ("base"|"sm"|"md"|"lg"|"xl"|"2xl")
 *    ve {isMobile,isTablet,isDesktop} kolaylik bayraklarini dondurur.
 *  - useBreakpointValue({base,sm,...}): mobil-oncelikli kademeli secim ile
 *    aktif breakpoint icin uygun degeri dondurur (tanimli en yakin kucuk
 *    breakpoint'e duser).
 * Breakpoint px degerleri Tailwind ile ayni: sm640 md768 lg1024 xl1280 2xl1536.
 * Kullanim: cihaza-uyarlanan duzenler, mobilde farkli bilesen davranisi,
 * grid kolon sayisini ekran genisligine gore degistirme vb.
 */
"use client";

import * as React from "react";

/** Tailwind ile ayni min-width breakpoint px degerleri. */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/** Aktif breakpoint adi; "base" en kucuk (henuz hicbir esigi gecmemis) durumdur. */
export type Breakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";

/** Kucukten buyuge sirali breakpoint listesi (kademeli secim icin). */
const BREAKPOINT_ORDER: readonly Breakpoint[] = [
  "base",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
];

/** useBreakpointValue'ya verilen duyarli deger haritasi. */
export type ResponsiveValue<T> = Partial<Record<Breakpoint, T>>;

/** useBreakpoint'in dondurdugu durum nesnesi. */
export interface BreakpointState {
  /** Aktif breakpoint adi. */
  breakpoint: Breakpoint;
  /** Genislik < md (768px): telefon boyutu. */
  isMobile: boolean;
  /** md <= genislik < lg (768–1023px): tablet boyutu. */
  isTablet: boolean;
  /** Genislik >= lg (1024px): masaustu boyutu. */
  isDesktop: boolean;
}

const noopSubscribe = () => () => {};

/**
 * useMediaQuery — Bir CSS medya sorgusunun eslesme durumunu (boolean) dondurur.
 * SSR-guvenlidir: sunucuda ve ilk render'da false doner, istemcide mount
 * sonrasi gercek degere gecer. matchMedia "change" olayina abone olur.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined" || !window.matchMedia) {
        return () => {};
      }
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  const getSnapshot = React.useCallback(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = React.useCallback(() => false, []);

  // matchMedia yoksa (SSR) sabit false: kararli abonelik.
  const canMatch = typeof window !== "undefined" && !!window.matchMedia;

  return React.useSyncExternalStore(
    canMatch ? subscribe : noopSubscribe,
    getSnapshot,
    getServerSnapshot
  );
}

/**
 * useBreakpoint — Aktif breakpoint adini ve cihaz sinifi bayraklarini dondurur.
 * Her esik icin ayri min-width medya sorgusu izler; en buyuk eslesen esik
 * aktif breakpoint olur. isMobile/isTablet/isDesktop kolaylik icindir.
 */
export function useBreakpoint(): BreakpointState {
  const isSm = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px)`);
  const isMd = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
  const isLg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
  const isXl = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);
  const is2xl = useMediaQuery(`(min-width: ${BREAKPOINTS["2xl"]}px)`);

  const breakpoint: Breakpoint = is2xl
    ? "2xl"
    : isXl
      ? "xl"
      : isLg
        ? "lg"
        : isMd
          ? "md"
          : isSm
            ? "sm"
            : "base";

  return {
    breakpoint,
    isMobile: !isMd,
    isTablet: isMd && !isLg,
    isDesktop: isLg,
  };
}

/**
 * useBreakpointValue — Aktif breakpoint icin uygun degeri dondurur.
 * Mobil-oncelikli kademeli secim: aktif breakpoint'te deger yoksa tanimli
 * en yakin kucuk breakpoint'e duser. Ornek: {base:1, md:2, lg:3} -> md'de 2.
 * Hicbir uygun deger yoksa (yalnizca daha buyuk breakpoint'ler tanimliysa)
 * undefined doner.
 */
export function useBreakpointValue<T>(
  values: ResponsiveValue<T>
): T | undefined {
  const { breakpoint } = useBreakpoint();
  const currentIndex = BREAKPOINT_ORDER.indexOf(breakpoint);

  for (let i = currentIndex; i >= 0; i -= 1) {
    const key = BREAKPOINT_ORDER[i];
    if (key !== undefined && values[key] !== undefined) return values[key];
  }
  return undefined;
}
