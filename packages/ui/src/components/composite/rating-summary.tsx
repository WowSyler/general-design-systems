/**
 * RatingSummary — Puan dagilim ozeti (Dolap urun, Randevu isletme).
 * Buyuk ortalama puan + yildizli gosterge + toplam degerlendirme sayisi ve
 * en yuksekten en dusuk yildiza (5->1) oran cubuklu dagilim satirlari gosterir.
 * Yildizlar orana gore kismi doldurulur; ozet butunu role="img" ile etiketlenir.
 */
import * as React from "react";
import { Star } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface RatingSummaryProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Ortalama puan (orn. 4.6). */
  average: number;
  /**
   * Yildiz sayisina gore adet dizisi; en yuksek yildizdan en dusuge dogru
   * siralanir (max=5 icin [5yildiz, 4yildiz, 3yildiz, 2yildiz, 1yildiz]).
   */
  distribution: number[];
  /** Maksimum yildiz. Varsayilan 5. */
  max?: number;
  /** Toplam degerlendirme sayisi; verilmezse dagilim toplamindan hesaplanir. */
  total?: number;
  /** Sayi yaninda gosterilen etiket. Varsayilan "degerlendirme". */
  reviewLabel?: React.ReactNode;
  loading?: boolean;
}

type StarSize = "sm" | "md" | "lg";

const starSizeClasses: Record<StarSize, string> = {
  sm: "size-3",
  md: "size-3.5",
  lg: "size-5",
};

function formatTr(value: number): string {
  return value.toLocaleString("tr-TR");
}

/** Orana gore kismi doldurulan yildiz siralamasi (salt gorsel). */
function RatingStars({
  value,
  max,
  size,
}: {
  value: number;
  max: number;
  size: StarSize;
}) {
  const fraction = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const cls = starSizeClasses[size];
  const stars = Array.from({ length: max });

  return (
    <span className="relative inline-flex shrink-0" aria-hidden="true">
      <span className="inline-flex text-muted-foreground/30">
        {stars.map((_, i) => (
          <Star key={i} className={cn(cls, "shrink-0")} />
        ))}
      </span>
      <span
        className="absolute inset-y-0 start-0 inline-flex overflow-hidden text-warning"
        style={{ width: `${fraction * 100}%` }}
      >
        {stars.map((_, i) => (
          <Star key={i} className={cn(cls, "shrink-0")} fill="currentColor" />
        ))}
      </span>
    </span>
  );
}

const RatingSummary = React.forwardRef<HTMLDivElement, RatingSummaryProps>(
  (
    {
      average,
      distribution,
      max = 5,
      total,
      reviewLabel = "degerlendirme",
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    const sum = distribution.reduce((acc, n) => acc + Math.max(0, n), 0);
    const totalCount = total ?? sum;
    const averageText = average.toFixed(1).replace(".", ",");

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn("flex flex-wrap gap-6", className)}
          {...props}
        >
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="min-w-[12rem] flex-1 space-y-2">
            {Array.from({ length: max }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-full" />
            ))}
          </div>
        </div>
      );
    }

    const summary = `Ortalama puan ${averageText} / ${max}, ${formatTr(
      totalCount
    )} ${typeof reviewLabel === "string" ? reviewLabel : "degerlendirme"}`;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={summary}
        className={cn(
          "flex flex-wrap items-center gap-x-8 gap-y-5",
          className
        )}
        {...props}
      >
        <div className="flex shrink-0 flex-col items-center gap-1 text-center">
          <div className="text-5xl font-bold leading-none tabular-nums text-foreground font-display">
            {averageText}
          </div>
          <RatingStars value={average} max={max} size="lg" />
          <div className="text-xs text-muted-foreground tabular-nums">
            {formatTr(totalCount)} {reviewLabel}
          </div>
        </div>

        <div className="min-w-[12rem] flex-1 space-y-1.5">
          {distribution.map((count, index) => {
            const starValue = max - index;
            const safeCount = Math.max(0, count);
            const percent = totalCount > 0 ? (safeCount / totalCount) * 100 : 0;
            return (
              <div
                key={starValue}
                className="flex items-center gap-2.5 text-sm"
              >
                <span className="flex w-8 shrink-0 items-center justify-end gap-0.5 tabular-nums text-muted-foreground">
                  {starValue}
                  <Star
                    className="size-3 shrink-0 text-warning"
                    fill="currentColor"
                    aria-hidden="true"
                  />
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-warning transition-[width] duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </span>
                <span className="w-10 shrink-0 text-end tabular-nums text-muted-foreground">
                  {formatTr(safeCount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
RatingSummary.displayName = "RatingSummary";

export { RatingSummary };
