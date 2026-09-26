/**
 * SkeletonTemplates — Hazir yukleme (skeleton) kompozisyonlari.
 * Mevcut Skeleton primitifinden turetilen alti hazir sablon: liste, tablo,
 * kart, KPI izgarasi, grafik ve profil detay. Her biri veri gelene kadar
 * gosterilen yer tutuculardir; sarmalayici role="status" + aria-busy ile
 * ekran okuyuculara "yukleniyor" diye duyurulur, gorsel iskeletler ise
 * aria-hidden ile gizlenir. Animasyon Skeleton primitifinden gelir.
 * Kullanim: DeployLens dagitim listesi, Dolap urun izgarasi, Randevu takvimi,
 * GlowScan analiz karti, Fisly gider tablosu yuklenirken.
 */
import * as React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Dogal gorunum icin satir bazli, deterministik metin genislikleri. */
const lineWidths = ["w-full", "w-11/12", "w-4/5", "w-3/4", "w-5/6", "w-2/3"];

/** SkeletonChart bar yukseklikleri (yuzde) — sabit, hidrasyon-guvenli. */
const barHeights = [58, 82, 44, 70, 92, 50, 76, 64, 40, 88];

/** Yardimci: ekran okuyucu icin gizli yukleme etiketi. */
function LoadingLabel({ label }: { label: string }): React.JSX.Element {
  return <span className="sr-only">{label}</span>;
}

/* ------------------------------------------------------------------ */
/* SkeletonList                                                        */
/* ------------------------------------------------------------------ */

export interface SkeletonListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Satir sayisi. Varsayilan 5. */
  count?: number;
  /** Her satirin solunda dairesel avatar yer tutucu gosterir. */
  showAvatar?: boolean;
  /** Her satirin sagindaki rozet/aksiyon yer tutucusunu gizler. */
  hideTrailing?: boolean;
  /** Ekran okuyucu etiketi. */
  label?: string;
}

const SkeletonList = React.forwardRef<HTMLDivElement, SkeletonListProps>(
  (
    {
      count = 5,
      showAvatar = true,
      hideTrailing = false,
      label = "Liste yükleniyor",
      className,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      role="status"
      aria-busy="true"
      className={cn("space-y-3", className)}
      {...props}
    >
      <LoadingLabel label={label} />
      <div aria-hidden="true" className="space-y-3">
        {Array.from({ length: Math.max(1, count) }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
          >
            {showAvatar ? (
              <Skeleton className="size-10 shrink-0 rounded-full" />
            ) : null}
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className={cn("h-3.5", lineWidths[i % lineWidths.length])} />
              <Skeleton className="h-3 w-1/2" />
            </div>
            {hideTrailing ? null : (
              <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
);
SkeletonList.displayName = "SkeletonList";

/* ------------------------------------------------------------------ */
/* SkeletonTable                                                       */
/* ------------------------------------------------------------------ */

export interface SkeletonTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Govde satiri sayisi. Varsayilan 5. */
  rows?: number;
  /** Kolon sayisi. Varsayilan 4. */
  columns?: number;
  /** Ust baslik satirini gizler. */
  hideHeader?: boolean;
  /** Ekran okuyucu etiketi. */
  label?: string;
}

const SkeletonTable = React.forwardRef<HTMLDivElement, SkeletonTableProps>(
  (
    {
      rows = 5,
      columns = 4,
      hideHeader = false,
      label = "Tablo yükleniyor",
      className,
      ...props
    },
    ref
  ) => {
    const safeColumns = Math.max(1, columns);
    const gridStyle: React.CSSProperties = {
      gridTemplateColumns: `repeat(${safeColumns}, minmax(0, 1fr))`,
    };
    return (
      <div
        ref={ref}
        role="status"
        aria-busy="true"
        className={cn(
          "divide-y divide-border overflow-hidden rounded-xl border border-border bg-card",
          className
        )}
        {...props}
      >
        <LoadingLabel label={label} />
        {hideHeader ? null : (
          <div
            aria-hidden="true"
            className="grid gap-4 bg-muted/40 px-4 py-3"
            style={gridStyle}
          >
            {Array.from({ length: safeColumns }).map((_, c) => (
              <Skeleton key={c} className="h-3.5 w-2/3" />
            ))}
          </div>
        )}
        <div aria-hidden="true" className="divide-y divide-border">
          {Array.from({ length: Math.max(1, rows) }).map((_, r) => (
            <div key={r} className="grid gap-4 px-4 py-3.5" style={gridStyle}>
              {Array.from({ length: safeColumns }).map((_, c) => (
                <Skeleton
                  key={c}
                  className={cn(
                    "h-3.5",
                    c === 0 ? "w-4/5" : lineWidths[(r + c) % lineWidths.length]
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
SkeletonTable.displayName = "SkeletonTable";

/* ------------------------------------------------------------------ */
/* SkeletonCard                                                        */
/* ------------------------------------------------------------------ */

export interface SkeletonCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Govdedeki metin satiri sayisi. Varsayilan 3. */
  lines?: number;
  /** Basligin ustunde genis bir gorsel/medya yer tutucusu gosterir. */
  showMedia?: boolean;
  /** Alt kisimda aksiyon butonu yer tutucularini gizler. */
  hideFooter?: boolean;
  /** Ekran okuyucu etiketi. */
  label?: string;
}

const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  (
    {
      lines = 3,
      showMedia = false,
      hideFooter = false,
      label = "Kart yükleniyor",
      className,
      ...props
    },
    ref
  ) => (
    <Card
      ref={ref}
      role="status"
      aria-busy="true"
      className={cn("w-full", className)}
      {...props}
    >
      <LoadingLabel label={label} />
      {showMedia ? (
        <div aria-hidden="true" className="px-6 pt-6">
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      ) : null}
      <CardHeader aria-hidden="true" className="space-y-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-3.5 w-3/4" />
      </CardHeader>
      <CardContent aria-hidden="true" className="space-y-2.5">
        {Array.from({ length: Math.max(1, lines) }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn("h-3.5", lineWidths[i % lineWidths.length])}
          />
        ))}
        {hideFooter ? null : (
          <div className="flex gap-2 pt-3">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        )}
      </CardContent>
    </Card>
  )
);
SkeletonCard.displayName = "SkeletonCard";

/* ------------------------------------------------------------------ */
/* SkeletonStatGrid                                                    */
/* ------------------------------------------------------------------ */

export interface SkeletonStatGridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** KPI karti sayisi. Varsayilan 4. */
  count?: number;
  /** Izgara kolon sayisi. Varsayilan 4. */
  columns?: number;
  /** Ekran okuyucu etiketi. */
  label?: string;
}

const SkeletonStatGrid = React.forwardRef<
  HTMLDivElement,
  SkeletonStatGridProps
>(
  (
    {
      count = 4,
      columns = 4,
      label = "Özet kartları yükleniyor",
      className,
      ...props
    },
    ref
  ) => {
    const safeColumns = Math.max(1, columns);
    // Mobil-öncelikli: <640px tek sütun, sm'de en fazla 2, lg'de istenen sütun sayısı
    const gridStyle = {
      "--ds-skeleton-cols": `repeat(${safeColumns}, minmax(0, 1fr))`,
    } as React.CSSProperties;
    return (
      <div
        ref={ref}
        role="status"
        aria-busy="true"
        className={cn(
          "grid grid-cols-1 gap-4 lg:[grid-template-columns:var(--ds-skeleton-cols)]",
          safeColumns >= 2 && "sm:grid-cols-2",
          className
        )}
        style={gridStyle}
        {...props}
      >
        <LoadingLabel label={label} />
        {Array.from({ length: Math.max(1, count) }).map((_, i) => (
          <Card key={i} aria-hidden="true">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-3.5 w-24 max-w-full" />
              <Skeleton className="size-8 shrink-0 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-7 w-28 max-w-full" />
              <Skeleton className="h-3.5 w-20 max-w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
);
SkeletonStatGrid.displayName = "SkeletonStatGrid";

/* ------------------------------------------------------------------ */
/* SkeletonChart                                                       */
/* ------------------------------------------------------------------ */

export interface SkeletonChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Bar (cubuk) sayisi. Varsayilan 7. */
  bars?: number;
  /** Sol eksen etiketlerini gizler. */
  hideAxis?: boolean;
  /** Ekran okuyucu etiketi. */
  label?: string;
}

const SkeletonChart = React.forwardRef<HTMLDivElement, SkeletonChartProps>(
  (
    {
      bars = 7,
      hideAxis = false,
      label = "Grafik yükleniyor",
      className,
      ...props
    },
    ref
  ) => {
    const safeBars = Math.max(1, bars);
    return (
      <Card
        ref={ref}
        role="status"
        aria-busy="true"
        className={cn("w-full", className)}
        {...props}
      >
        <LoadingLabel label={label} />
        <CardHeader aria-hidden="true" className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </CardHeader>
        <CardContent aria-hidden="true">
          <div className="flex gap-3">
            {hideAxis ? null : (
              <div className="flex h-48 flex-col justify-between py-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-3 w-8" />
                ))}
              </div>
            )}
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex h-48 items-end justify-between gap-2">
                {Array.from({ length: safeBars }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-full rounded-t-md rounded-b-none"
                    style={{ height: `${barHeights[i % barHeights.length]}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between gap-2 border-t border-border pt-2">
                {Array.from({ length: safeBars }).map((_, i) => (
                  <Skeleton key={i} className="h-3 w-full max-w-10" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);
SkeletonChart.displayName = "SkeletonChart";

/* ------------------------------------------------------------------ */
/* SkeletonDetail                                                      */
/* ------------------------------------------------------------------ */

export interface SkeletonDetailProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Alt kisimda gosterilecek alan (etiket + deger) sayisi. Varsayilan 4. */
  fields?: number;
  /** Sagdaki aksiyon butonu yer tutucusunu gizler. */
  hideAction?: boolean;
  /** Ekran okuyucu etiketi. */
  label?: string;
}

const SkeletonDetail = React.forwardRef<HTMLDivElement, SkeletonDetailProps>(
  (
    {
      fields = 4,
      hideAction = false,
      label = "Detaylar yükleniyor",
      className,
      ...props
    },
    ref
  ) => (
    <Card
      ref={ref}
      role="status"
      aria-busy="true"
      className={cn("w-full", className)}
      {...props}
    >
      <LoadingLabel label={label} />
      <CardHeader aria-hidden="true">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3.5 w-28" />
          </div>
          {hideAction ? null : (
            <Skeleton className="h-9 w-24 shrink-0 rounded-md" />
          )}
        </div>
      </CardHeader>
      <CardContent aria-hidden="true">
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 border-t border-border pt-4 sm:grid-cols-2">
          {Array.from({ length: Math.max(1, fields) }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton
                className={cn("h-4", i % 2 === 0 ? "w-32" : "w-24")}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
);
SkeletonDetail.displayName = "SkeletonDetail";

export {
  SkeletonList,
  SkeletonTable,
  SkeletonCard,
  SkeletonStatGrid,
  SkeletonChart,
  SkeletonDetail,
};
