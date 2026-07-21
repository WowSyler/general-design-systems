/**
 * Show / Hide — SSR-guvenli responsive gorunurluk yardimcilari (JS DEGIL, saf CSS).
 *
 * Gorunurluk tamamen Tailwind responsive `display` siniflari ile kontrol edilir;
 * hicbir JS medya sorgusu / hydration adimi calismaz, bu yuzden sunucuda ve
 * istemcide ayni HTML uretilir (kayma/flicker olmaz).
 *
 * `above` / `below` / `only` proplarindan yalnizca biri verilir; birden fazlasi
 * verilirse oncelik sirasi: above > below > only.
 *
 *   <Show above="md">   md (768px) ve USTUNDE gorunur    -> hidden md:block
 *   <Show below="md">   md ALTINDA gorunur               -> block md:hidden
 *   <Show only="md">    yalnizca md araliginda gorunur   -> hidden md:block lg:hidden
 *
 * `Hide` ayni proplarla tam TERS davranir (Hide above="md" === Show below="md").
 *
 * Ornek kullanimlar (design-system projeleri):
 *  - DeployLens: <Hide below="lg"> ile genis dagitim tablosunu yalnizca masaustunde goster.
 *  - Randevu: <Show below="md"> ile mobilde alt navigasyon cubugunu goster.
 *  - Dolap: <Show only="sm"> ile yalnizca kucuk ekranda kompakt filtre rozetini goster.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

/** Tailwind kirilim noktalari: sm=640 md=768 lg=1024 xl=1280 2xl=1536. */
type ShowBreakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

/** Gorunur durumdayken uygulanacak `display` degeri. Varsayilan: "block". */
type ShowDisplay =
  | "block"
  | "inline-block"
  | "flex"
  | "inline-flex"
  | "grid";

/**
 * Bir kirilim noktasinda gorunuru acan `display` sinifi (or. "md:block").
 * Siniflar Tailwind JIT tarafindan taranabilmesi icin TAM METIN yazilmistir.
 */
const shownAtBreakpoint: Record<ShowDisplay, Record<ShowBreakpoint, string>> = {
  block: {
    sm: "sm:block",
    md: "md:block",
    lg: "lg:block",
    xl: "xl:block",
    "2xl": "2xl:block",
  },
  "inline-block": {
    sm: "sm:inline-block",
    md: "md:inline-block",
    lg: "lg:inline-block",
    xl: "xl:inline-block",
    "2xl": "2xl:inline-block",
  },
  flex: {
    sm: "sm:flex",
    md: "md:flex",
    lg: "lg:flex",
    xl: "xl:flex",
    "2xl": "2xl:flex",
  },
  "inline-flex": {
    sm: "sm:inline-flex",
    md: "md:inline-flex",
    lg: "lg:inline-flex",
    xl: "xl:inline-flex",
    "2xl": "2xl:inline-flex",
  },
  grid: {
    sm: "sm:grid",
    md: "md:grid",
    lg: "lg:grid",
    xl: "xl:grid",
    "2xl": "2xl:grid",
  },
};

/** Bir kirilim noktasinda icerigi gizleyen sinif (or. "md:hidden"). */
const hiddenAtBreakpoint: Record<ShowBreakpoint, string> = {
  sm: "sm:hidden",
  md: "md:hidden",
  lg: "lg:hidden",
  xl: "xl:hidden",
  "2xl": "2xl:hidden",
};

/** Taban (en kucuk ekran) `display` degeri. */
const baseDisplay: Record<ShowDisplay, string> = {
  block: "block",
  "inline-block": "inline-block",
  flex: "flex",
  "inline-flex": "inline-flex",
  grid: "grid",
};

/** Verilen kirilim noktasindan bir sonraki (ust) kirilim; "2xl" icin ust sinir yok. */
const nextBreakpoint: Record<ShowBreakpoint, ShowBreakpoint | undefined> = {
  sm: "md",
  md: "lg",
  lg: "xl",
  xl: "2xl",
  "2xl": undefined,
};

interface VisibilityConfig {
  above?: ShowBreakpoint;
  below?: ShowBreakpoint;
  only?: ShowBreakpoint;
  display?: ShowDisplay;
}

/**
 * `Show` icin gorunurluk siniflarini uretir. `invert` true ise `Hide`
 * davranisini (tam ters gorunurluk) verir.
 */
function visibilityClassName(
  { above, below, only, display = "block" }: VisibilityConfig,
  invert: boolean
): string {
  const on = shownAtBreakpoint[display];
  const base = baseDisplay[display];

  // only: yalnizca [bp, next) araliginda gorunur (Show) ya da yalnizca o
  // aralikta gizli (Hide).
  if (only) {
    const next = nextBreakpoint[only];
    if (!invert) {
      // Show only: taban gizli -> bp'de ac -> next'te tekrar gizle.
      return cn("hidden", on[only], next ? hiddenAtBreakpoint[next] : undefined);
    }
    // Hide only: taban gorunur -> bp'de gizle -> next'te tekrar goster.
    return cn(base, hiddenAtBreakpoint[only], next ? on[next] : undefined);
  }

  if (above) {
    // Show above: bp ve ustunde gorunur. Hide above: bp ve ustunde gizli.
    return invert ? cn(base, hiddenAtBreakpoint[above]) : cn("hidden", on[above]);
  }

  if (below) {
    // Show below: bp altinda gorunur. Hide below: bp altinda gizli.
    return invert ? cn("hidden", on[below]) : cn(base, hiddenAtBreakpoint[below]);
  }

  // Kirilim noktasi verilmedi: Show her zaman gorunur, Hide her zaman gizli.
  return invert ? "hidden" : base;
}

interface ShowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Bu kirilim noktasi ve USTUNDE gorunur (or. above="md" -> md, lg, xl, 2xl). */
  above?: ShowBreakpoint;
  /** Bu kirilim noktasinin ALTINDA gorunur (or. below="md" -> taban, sm). */
  below?: ShowBreakpoint;
  /** YALNIZCA bu kirilim noktasi araliginda gorunur (or. only="md" -> [768,1024)). */
  only?: ShowBreakpoint;
  /** Gorunur durumdaki `display` degeri. Varsayilan: "block". */
  display?: ShowDisplay;
}

/**
 * Show — cocugunu yalnizca belirtilen kirilim araliginda gosterir.
 * Sarmalayici bir `<div>` render eder; gizleme `display:none` ile yapilir.
 */
const Show = React.forwardRef<HTMLDivElement, ShowProps>(
  ({ className, above, below, only, display = "block", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        visibilityClassName({ above, below, only, display }, false),
        className
      )}
      {...props}
    />
  )
);
Show.displayName = "Show";

interface HideProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Bu kirilim noktasi ve USTUNDE gizlenir (or. above="md" -> md ve ustu gizli). */
  above?: ShowBreakpoint;
  /** Bu kirilim noktasinin ALTINDA gizlenir (or. below="md" -> taban, sm gizli). */
  below?: ShowBreakpoint;
  /** YALNIZCA bu kirilim noktasi araliginda gizlenir (or. only="md" -> [768,1024)). */
  only?: ShowBreakpoint;
  /** Gorunur durumdaki `display` degeri. Varsayilan: "block". */
  display?: ShowDisplay;
}

/**
 * Hide — cocugunu belirtilen kirilim araliginda GIZLER (Show'un tersi).
 * Hide above="md" === Show below="md".
 */
const Hide = React.forwardRef<HTMLDivElement, HideProps>(
  ({ className, above, below, only, display = "block", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        visibilityClassName({ above, below, only, display }, true),
        className
      )}
      {...props}
    />
  )
);
Hide.displayName = "Hide";

export { Show, Hide };
export type { ShowProps, HideProps, ShowBreakpoint, ShowDisplay };
