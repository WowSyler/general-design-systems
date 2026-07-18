/**
 * KpiTile — Pano kahraman metriği.
 * Card tabanlı büyük istatistik kartı: etiket, iri değer, trend chip'i,
 * opsiyonel ikon ve alt şeritte sparkline. `accent` varyantı marka
 * gradyanı üzerine kurar. Değer `font-display` + `tabular-nums` ile çizilir.
 * Tüm renkler semantik tokenlardan; trend yalnızca renkle değil ok ikonu
 * ve sr-only metinle de anlatılır.
 */
import * as React from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type KpiTrend = "up" | "down" | "neutral";

export interface KpiDelta {
  /** Değişim değeri (ör. "+%12,4"). */
  value: React.ReactNode;
  /** Trend yönü. */
  trend: KpiTrend;
}

export interface KpiTileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Metrik etiketi. */
  label: React.ReactNode;
  /** İri gösterilen metrik değeri. */
  value: React.ReactNode;
  /** Trend chip'i (değer + yön). */
  delta?: KpiDelta;
  /** Alt şeritte gösterilecek grafik (ör. @ds/ui Sparkline). */
  sparkline?: React.ReactNode;
  /** Sağ üstteki ikon. */
  icon?: React.ReactNode;
  /** Marka gradyanlı kahraman görünümü. */
  accent?: boolean;
}

const trendIcon: Record<KpiTrend, React.ComponentType<{ className?: string }>> = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: Minus,
};

const trendChip: Record<KpiTrend, string> = {
  up: "text-success bg-success/10",
  down: "text-destructive bg-destructive/10",
  neutral: "text-muted-foreground bg-muted",
};

const trendLabel: Record<KpiTrend, string> = {
  up: "Artış",
  down: "Azalış",
  neutral: "Değişim yok",
};

const KpiTile = React.forwardRef<HTMLDivElement, KpiTileProps>(
  ({ label, value, delta, sparkline, icon, accent = false, className, ...props }, ref) => {
    const TrendIcon = delta ? trendIcon[delta.trend] : null;

    return (
      <Card
        ref={ref}
        className={cn(
          "relative overflow-hidden p-6",
          accent
            ? "border-transparent bg-brand-gradient text-primary-foreground shadow-lg"
            : "shadow-md",
          className,
        )}
        {...props}
      >
        {accent ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-sheen"
          />
        ) : null}

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p
              className={cn(
                "truncate text-sm font-medium",
                accent ? "text-primary-foreground/80" : "text-muted-foreground",
              )}
            >
              {label}
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-display text-3xl font-bold tabular-nums leading-none">
                {value}
              </span>
              {delta && TrendIcon ? (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
                    accent
                      ? "bg-white/20 text-primary-foreground"
                      : trendChip[delta.trend],
                  )}
                >
                  <TrendIcon className="h-3.5 w-3.5" />
                  <span className="sr-only">{trendLabel[delta.trend]}: </span>
                  {delta.value}
                </span>
              ) : null}
            </div>
          </div>

          {icon ? (
            <span
              className={cn(
                "flex h-11 w-11 flex-none items-center justify-center rounded-xl [&>svg]:h-5 [&>svg]:w-5",
                accent
                  ? "bg-white/15 text-primary-foreground"
                  : "bg-muted text-foreground",
              )}
            >
              {icon}
            </span>
          ) : null}
        </div>

        {sparkline ? (
          <div className="relative mt-5 -mb-1">{sparkline}</div>
        ) : null}
      </Card>
    );
  },
);
KpiTile.displayName = "KpiTile";

export { KpiTile };
