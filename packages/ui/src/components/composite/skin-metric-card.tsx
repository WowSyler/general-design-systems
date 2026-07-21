/**
 * SkinMetricCard — Cilt metrik karti (GlowScan analiz sonuclari).
 * Metrik adi (Nem/Gozenek/Kirisiklik vb) + 0-100 buyuk skor (tabular-nums),
 * durum rozeti (Iyi/Orta/Dikkat -> semantik renk), mini ProgressRing veya
 * yatay bar gostergesi ve opsiyonel trend rozeti (onceki analize gore
 * TrendDeltaBadge) gosterir. loading durumunda Skeleton yer tutucular render eder.
 * Durum semantigi metrigin yonunden bagimsizdir (nem yuksek iyi, gozenek yuksek
 * kotu) — bu yuzden durum acikca prop olarak verilir.
 */
import * as React from "react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgressRing } from "@/components/data/progress-ring";
import {
  TrendDeltaBadge,
  type TrendDeltaBadgeProps,
} from "@/components/ui-extras/trend-delta-badge";
import { cn } from "@/lib/utils";

type SkinMetricCardStatus = "good" | "fair" | "attention";
type SkinMetricCardVisual = "ring" | "bar";
type SkinMetricCardTone = "success" | "warning" | "destructive";

interface SkinMetricCardStatusMeta {
  label: string;
  badgeVariant: BadgeProps["variant"];
  tone: SkinMetricCardTone;
  fillClass: string;
}

const statusMeta: Record<SkinMetricCardStatus, SkinMetricCardStatusMeta> = {
  good: {
    label: "İyi",
    badgeVariant: "success-soft",
    tone: "success",
    fillClass: "bg-success",
  },
  fair: {
    label: "Orta",
    badgeVariant: "warning-soft",
    tone: "warning",
    fillClass: "bg-warning",
  },
  attention: {
    label: "Dikkat",
    badgeVariant: "destructive-soft",
    tone: "destructive",
    fillClass: "bg-destructive",
  },
};

/** Karta gomulu trend rozetinin veri sekli (onceki analize kiyasla). */
export interface SkinMetricCardDelta
  extends Pick<TrendDeltaBadgeProps, "direction" | "invertColors"> {
  /** Rozet uzerinde gorunen delta degeri (or. "+6", "%12"). */
  value: React.ReactNode;
}

export interface SkinMetricCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Metrik adi (Nem, Gözenek, Kırışıklık vb). */
  label: React.ReactNode;
  /** 0-max arasi skor. */
  value: number;
  /** Skor ust siniri. Varsayilan 100. */
  max?: number;
  /** Durum semantigi; rozet rengini ve gosterge tonunu belirler. */
  status: SkinMetricCardStatus;
  /** Varsayilan durum metnini (İyi/Orta/Dikkat) gecersiz kilar. */
  statusLabel?: React.ReactNode;
  /** Metrik ikonu (baslikta gosterilir). */
  icon?: React.ReactNode;
  /** Gosterge turu: dairesel halka veya yatay bar. Varsayilan "ring". */
  visual?: SkinMetricCardVisual;
  /** Opsiyonel trend rozeti (onceki analize gore). */
  delta?: SkinMetricCardDelta;
  /** Trend rozetinin altindaki aciklama. Varsayilan "önceki analize göre". */
  deltaCaption?: React.ReactNode;
  loading?: boolean;
}

const SkinMetricCard = React.forwardRef<HTMLDivElement, SkinMetricCardProps>(
  (
    {
      label,
      value,
      max = 100,
      status,
      statusLabel,
      icon,
      visual = "ring",
      delta,
      deltaCaption = "önceki analize göre",
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    if (loading) {
      return (
        <Card ref={ref} className={cn(className)} {...props}>
          <CardContent className="flex items-start gap-4 p-5">
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="size-[72px] shrink-0 rounded-full" />
          </CardContent>
        </Card>
      );
    }

    const meta = statusMeta[status];
    const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

    return (
      <Card
        ref={ref}
        className={cn(
          "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
          className
        )}
        {...props}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                {icon ? (
                  <span className="text-primary" aria-hidden="true">
                    {icon}
                  </span>
                ) : null}
                <span className="truncate">{label}</span>
              </div>

              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-4xl font-bold leading-none tabular-nums text-foreground">
                  {value}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  /{max}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant={meta.badgeVariant}>
                  {statusLabel ?? meta.label}
                </Badge>
                {delta ? (
                  <TrendDeltaBadge
                    size="sm"
                    direction={delta.direction}
                    value={delta.value}
                    invertColors={delta.invertColors}
                  />
                ) : null}
              </div>

              {delta && deltaCaption ? (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {deltaCaption}
                </p>
              ) : null}
            </div>

            {visual === "ring" ? (
              <ProgressRing
                value={pct}
                size={72}
                strokeWidth={7}
                tone={meta.tone}
                label={<span className="sr-only">gösterge</span>}
                className="shrink-0"
              />
            ) : null}
          </div>

          {visual === "bar" ? (
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pct)}
              className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted"
            >
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-500",
                  meta.fillClass
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  }
);
SkinMetricCard.displayName = "SkinMetricCard";

export { SkinMetricCard };
