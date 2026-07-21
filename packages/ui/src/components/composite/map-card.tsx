/**
 * MapCard — Konum/harita karti (Randevu mekan, Dolap satici konumu).
 * Gercek harita YOK; stilize edilmis bir placeholder harita arka plani
 * (SVG izgara + yollar + bloklar) uzerine merkez konum pini (MapPin) yerlestirir.
 * Opsiyonel adres basligi, mesafe rozeti ve "Yol tarifi" / "Buyut" eylemleri sunar.
 * Sunumsal bilesen: eylem butonlari tuketici tarafindan onDirections/onExpand
 * ile baglanir; loading durumunda Skeleton yer tutuculari render eder.
 */
import * as React from "react";
import { Maximize2, Navigation, MapPin } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Pin tonu — konum turune gore renk vurgusu (mekan, satici, uyari vb.). */
export type MapCardTone = "primary" | "success" | "info" | "destructive" | "warning";

/** Merkez konum pininin stil varyantlari (ton bazli). */
const mapCardMarkerVariants = cva(
  "relative z-10 flex items-center justify-center rounded-full text-background shadow-lg ring-4 ring-background/70 [&_svg]:size-4",
  {
    variants: {
      tone: {
        primary: "bg-primary",
        success: "bg-success",
        info: "bg-info",
        destructive: "bg-destructive",
        warning: "bg-warning",
      },
    },
    defaultVariants: {
      tone: "primary",
    },
  }
);

const pulseTone: Record<MapCardTone, string> = {
  primary: "bg-primary/30",
  success: "bg-success/30",
  info: "bg-info/30",
  destructive: "bg-destructive/30",
  warning: "bg-warning/30",
};

const aspectClasses = {
  video: "aspect-video",
  wide: "aspect-[21/9]",
  square: "aspect-square",
} as const;

export interface MapCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof mapCardMarkerVariants> {
  /** Mekan/yer adi (or. "Kadikoy Subesi"); pin uzerinde balon olarak da gosterilir. */
  place?: React.ReactNode;
  /** Acik adres metni. */
  address?: React.ReactNode;
  /** Mesafe rozeti icerigi (or. "1,2 km"); verilmezse rozet gizlenir. */
  distance?: React.ReactNode;
  /** Harita alaninin en-boy orani. */
  aspect?: keyof typeof aspectClasses;
  /** Pin balonunu (place adiyla) gosterir. */
  showMarkerLabel?: boolean;
  /** "Yol tarifi" eylemi; verilmezse buton gizlenir. */
  onDirections?: React.MouseEventHandler<HTMLButtonElement>;
  /** "Buyut" eylemi; verilmezse buton gizlenir. */
  onExpand?: React.MouseEventHandler<HTMLButtonElement>;
  /** Yol tarifi buton metni. */
  directionsLabel?: string;
  /** Buyut buton metni. */
  expandLabel?: string;
  /** Harita alani icin erisilebilirlik etiketi (role=img). */
  mapLabel?: string;
  /** Yukleme durumu (skeleton yer tutucular). */
  loading?: boolean;
}

const MapCard = React.forwardRef<HTMLDivElement, MapCardProps>(
  (
    {
      place,
      address,
      distance,
      tone = "primary",
      aspect = "video",
      showMarkerLabel = false,
      onDirections,
      onExpand,
      directionsLabel = "Yol tarifi",
      expandLabel = "Büyüt",
      mapLabel,
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    const gridId = React.useId();

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            "overflow-hidden rounded-xl border bg-card shadow-sm",
            className
          )}
          {...props}
        >
          <Skeleton className={cn("w-full rounded-none", aspectClasses[aspect])} />
          <div className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      );
    }

    const resolvedTone = (tone ?? "primary") as MapCardTone;
    const hasActions = Boolean(onDirections || onExpand);
    const computedMapLabel =
      mapLabel ??
      (typeof place === "string"
        ? `${place} konumunu gosteren harita`
        : "Konumu gosteren harita");

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "group overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
          className
        )}
        {...props}
      >
        {/* Stilize harita alani (gercek harita degil) */}
        <div
          role="img"
          aria-label={computedMapLabel}
          className={cn(
            "relative w-full overflow-hidden bg-muted",
            aspectClasses[aspect]
          )}
        >
          {/* Izgara + yollar + bloklar */}
          <svg
            viewBox="0 0 400 225"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id={gridId}
                width="26"
                height="26"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M26 0H0V26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            {/* Ince izgara */}
            <rect
              width="400"
              height="225"
              fill={`url(#${gridId})`}
              className="text-border/70"
            />
            {/* Yesil alan / park blogu */}
            <rect
              x="30"
              y="132"
              width="96"
              height="64"
              rx="8"
              fill="currentColor"
              className="text-success/15"
            />
            {/* Yapi bloklari */}
            <g fill="currentColor" className="text-muted-foreground/10">
              <rect x="252" y="26" width="70" height="48" rx="6" />
              <rect x="286" y="150" width="80" height="52" rx="6" />
            </g>
            {/* Yollar */}
            <g
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              className="text-muted-foreground/25"
            >
              <path d="M-10 128 H410" strokeWidth="12" />
              <path d="M168 -10 V235" strokeWidth="16" />
              <path d="M-10 46 Q200 96 410 30" strokeWidth="6" />
            </g>
            {/* Yol serit cizgisi */}
            <path
              d="M168 -10 V235"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="8 10"
              className="text-background/60"
              fill="none"
            />
          </svg>

          {/* Mesafe rozeti */}
          {distance != null ? (
            <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium tabular-nums text-foreground shadow-sm ring-1 ring-border backdrop-blur-sm">
              <Navigation className="size-3.5" aria-hidden="true" />
              {distance}
            </div>
          ) : null}

          {/* Merkez konum pini */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            {showMarkerLabel && place != null ? (
              <span className="mb-2 max-w-[12rem] truncate rounded-md bg-background/95 px-2 py-0.5 text-xs font-semibold text-foreground shadow-sm ring-1 ring-border">
                {place}
              </span>
            ) : null}
            <span className="relative flex size-8 items-center justify-center">
              <span
                className={cn(
                  "absolute inline-flex size-8 rounded-full animate-glow-pulse",
                  pulseTone[resolvedTone]
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  mapCardMarkerVariants({ tone }),
                  "size-8 transition-transform duration-300 group-hover:-translate-y-0.5"
                )}
              >
                <MapPin aria-hidden="true" />
              </span>
            </span>
            {/* Zemin golgesi */}
            <span
              className="mt-1 h-1.5 w-3 rounded-full bg-foreground/25 blur-[2px]"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Alt bilgi: adres basligi + eylemler */}
        {place != null || address != null || hasActions ? (
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            {place != null || address != null ? (
              <div className="flex min-w-0 items-start gap-2">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <div className="min-w-0 leading-tight">
                  {place != null ? (
                    <div className="truncate text-sm font-semibold text-foreground">
                      {place}
                    </div>
                  ) : null}
                  {address != null ? (
                    <div className="truncate text-xs text-muted-foreground">
                      {address}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {hasActions ? (
              <div className="flex shrink-0 items-center gap-2">
                {onDirections ? (
                  <Button type="button" size="sm" onClick={onDirections}>
                    <Navigation aria-hidden="true" />
                    {directionsLabel}
                  </Button>
                ) : null}
                {onExpand ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onExpand}
                  >
                    <Maximize2 aria-hidden="true" />
                    {expandLabel}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
);
MapCard.displayName = "MapCard";

export { MapCard, mapCardMarkerVariants };
