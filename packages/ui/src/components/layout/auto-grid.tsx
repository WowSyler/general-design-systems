/**
 * AutoGrid — otomatik-akiskan izgara (Grid'den farkli: medya-sorgusuz).
 * `minItemWidth` prop'u ile CSS `repeat(auto-fit, minmax(min, 1fr))` uygulanir;
 * kolon sayisi kap genisligine gore kendiliginden ayarlanir — kirilim noktasi gerekmez.
 * `minmax` icinde `min(minItemWidth, 100%)` kullanildigi icin dar ekranda tasma olmaz.
 * `fill` acikken bos raylar korunur (auto-fill), varsayilan auto-fit ile daralir.
 * Kart izgaralari icin idealdir: Dolap urun kartlari, DeployLens dağıtım kartlari, GlowScan sonuc kartlari.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type AutoGridGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";

const autoGridGapClasses: Record<AutoGridGap, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

/** Sayiyi px'e cevirir; string oldugu gibi (orn. "16rem", "240px") kullanilir. */
function resolveLength(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

interface AutoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Her ogenin en kucuk genisligi. Sayi px kabul edilir (240 → "240px"),
   * string oldugu gibi kullanilir ("16rem"). Varsayilan: "16rem".
   */
  minItemWidth?: number | string;
  /** Ogeler arasi bosluk. Varsayilan: "md". */
  gap?: AutoGridGap;
  /**
   * `true` iken auto-fill: yeterli oge olmasa da bos raylar korunur.
   * Varsayilan `false` (auto-fit): raylar daralir, ogeler mevcut alani doldurur.
   */
  fill?: boolean;
}

const AutoGrid = React.forwardRef<HTMLDivElement, AutoGridProps>(
  (
    { className, minItemWidth = "16rem", gap = "md", fill = false, style, ...props },
    ref
  ) => {
    const mode = fill ? "auto-fill" : "auto-fit";
    const track = resolveLength(minItemWidth);
    return (
      <div
        ref={ref}
        className={cn("grid w-full", autoGridGapClasses[gap], className)}
        style={{
          gridTemplateColumns: `repeat(${mode}, minmax(min(${track}, 100%), 1fr))`,
          ...style,
        }}
        {...props}
      />
    );
  }
);
AutoGrid.displayName = "AutoGrid";

export { AutoGrid, autoGridGapClasses };
export type { AutoGridProps, AutoGridGap };
