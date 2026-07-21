/**
 * TrendDeltaBadge — Trend/delta rozeti (yon oku + yuzde/deger).
 * cva ile hap formunda kucuk bir rozet: yone gore ok ikonu
 * (TrendingUp/Down/Minus) ve tabular-nums ile hizalanmis delta degeri.
 * Varsayilan semantik: up=success (yesil), down=destructive (kirmizi),
 * flat=muted. invertColors ile ters semantik metrikler icin renkler
 * cevrilir (or. gider artisi kotu, gecikme dususu iyi) — up=destructive,
 * down=success olur. kpi-tile disinda standalone da kullanilabilir.
 * Kullanim: Fisly gider trendi (dususu iyi), DeployLens gecikme/latency
 * (dususu iyi), Dolap satis artisi (artisi iyi) gibi metrik gostergeleri.
 */
import * as React from "react";
import {
  Minus,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

type TrendDeltaDirection = "up" | "down" | "flat";
type TrendDeltaTone = "success" | "destructive" | "muted";

const trendDeltaBadgeVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-transparent font-medium tabular-nums transition-all duration-200 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        success: "bg-success/15 text-success",
        destructive: "bg-destructive/15 text-destructive",
        muted: "bg-muted text-muted-foreground",
      },
      size: {
        sm: "px-1.5 py-0.5 text-xs [&_svg]:size-3",
        md: "px-2 py-0.5 text-sm [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      tone: "muted",
      size: "md",
    },
  }
);

/** Yone gore ok ikonu. */
const directionIcon: Record<TrendDeltaDirection, LucideIcon> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

/** Duz (normal) semantik: yukselis iyi, dusus kotu. */
const toneByDirection: Record<TrendDeltaDirection, TrendDeltaTone> = {
  up: "success",
  down: "destructive",
  flat: "muted",
};

/** Ters semantik: yukselis kotu, dusus iyi (gider, gecikme, hata orani). */
const invertedToneByDirection: Record<TrendDeltaDirection, TrendDeltaTone> = {
  up: "destructive",
  down: "success",
  flat: "muted",
};

/** Ekran okuyucular icin yon aciklamasi. */
const directionLabel: Record<TrendDeltaDirection, string> = {
  up: "yükseliş",
  down: "düşüş",
  flat: "değişim yok",
};

export interface TrendDeltaBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    Pick<VariantProps<typeof trendDeltaBadgeVariants>, "size"> {
  /** Trend yonu; ok ikonu ve varsayilan renk bunu izler. */
  direction: TrendDeltaDirection;
  /** Rozet uzerinde gorunen delta degeri (or. "%12,4", "-38 ms", "+1.240"). */
  value: React.ReactNode;
  /**
   * Ters semantik metrikler icin renkleri cevirir: dususu iyi olan
   * (gider/gecikme/hata) gostergelerde up=destructive, down=success olur.
   */
  invertColors?: boolean;
  /** Ok ikonunu gizler; yalnizca deger gosterilir. */
  hideIcon?: boolean;
}

const TrendDeltaBadge = React.forwardRef<HTMLSpanElement, TrendDeltaBadgeProps>(
  (
    {
      direction,
      value,
      invertColors = false,
      hideIcon = false,
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    const tone = (invertColors ? invertedToneByDirection : toneByDirection)[
      direction
    ];
    const Icon = directionIcon[direction];

    return (
      <span
        ref={ref}
        className={cn(trendDeltaBadgeVariants({ tone, size }), className)}
        {...props}
      >
        {hideIcon ? null : <Icon aria-hidden="true" />}
        <span>{value}</span>
        <span className="sr-only">({directionLabel[direction]})</span>
      </span>
    );
  }
);
TrendDeltaBadge.displayName = "TrendDeltaBadge";

export { TrendDeltaBadge, trendDeltaBadgeVariants };
