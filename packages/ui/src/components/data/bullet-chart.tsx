/**
 * BulletChart — SVG mermi grafigi (KPI vs hedef).
 * Her satir; kalitatif esik bantlari (arka planda muted tonlari),
 * gercek degeri gosteren yatay olcum cubugu ve hedefi isaretleyen
 * dikey isaretci cizgiden olusur. Kompakt yapisiyla coklu satir icin
 * uygundur (butce vs gerceklesme, SLA vs hedef gibi).
 *
 * ranges: artan sirali esik degerleri (or. [40, 70, 100]). Her bant
 * bir onceki esikten kendi degerine kadar cizilir; sifira yakin bantlar
 * daha koyu, disa dogru daha acik muted tonu alir.
 *
 * Olcek: max verilmezse her satir kendi max(deger, hedef, ranges)
 * degerine gore olceklenir; verilirse tum satirlar ortak olcegi paylasir.
 *
 * Grafik butunu role="img" ve ozet aria-label ile etiketlenir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type ChartColorIndex = 1 | 2 | 3 | 4 | 5;

export interface BulletChartRow {
  /** Satir etiketi (KPI adi). */
  label: string;
  /** Gerceklesen deger (olcum cubugu). */
  value: number;
  /** Hedef deger (dikey isaretci). */
  target: number;
  /**
   * Kalitatif esik degerleri, artan sirali (or. [40, 70, 100]).
   * Arka planda muted tonlu bantlar olarak cizilir.
   */
  ranges?: number[];
  /** Olcum cubugu icin 1-5 arasi chart rengi. Verilmezse primary kullanilir. */
  colorIndex?: ChartColorIndex;
}

export interface BulletChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Gosterilecek satirlar. */
  rows: BulletChartRow[];
  /** Tum satirlar icin ortak olcek ust siniri. Verilmezse her satir kendi max'ina gore olceklenir. */
  max?: number;
  /** Olcum cubugunun (ve bant izinin) piksel yuksekligi. Varsayilan 26. */
  barHeight?: number;
  /** Sag tarafta gerceklesen/hedef degerlerini goster. Varsayilan true. */
  showValues?: boolean;
  /** Deger bicimlendirici (deger ve hedef icin). Varsayilan yerel sayi bicimi. */
  formatValue?: (value: number) => string;
  /** Sol etiket sutununun piksel genisligi. Varsayilan 128. */
  labelWidth?: number;
}

const measureFills: Record<ChartColorIndex, string> = {
  1: "hsl(var(--chart1))",
  2: "hsl(var(--chart2))",
  3: "hsl(var(--chart3))",
  4: "hsl(var(--chart4))",
  5: "hsl(var(--chart5))",
};

const VIEW_WIDTH = 100;

function defaultFormat(value: number): string {
  return value.toLocaleString("tr-TR");
}

/** Satir olcegini belirleyen ust sinir (0'a bolme korumali). */
function resolveRowMax(row: BulletChartRow, sharedMax?: number): number {
  if (sharedMax && sharedMax > 0) return sharedMax;
  const candidates = [row.value, row.target, ...(row.ranges ?? [])];
  return Math.max(...candidates, 0) || 1;
}

/** Bant opakligini; sifira yakin koyu, disa dogru acik olacak sekilde uretir. */
function bandOpacity(index: number, count: number): number {
  if (count <= 1) return 0.32;
  const t = (count - 1 - index) / (count - 1);
  return 0.14 + t * 0.34;
}

const BulletChart = React.forwardRef<HTMLDivElement, BulletChartProps>(
  (
    {
      rows,
      max,
      barHeight = 26,
      showValues = true,
      formatValue = defaultFormat,
      labelWidth = 128,
      className,
      ...props
    },
    ref
  ) => {
    const summary =
      rows.length > 0
        ? `Mermi grafigi. ${rows
            .map((r) => {
              const durum = r.value >= r.target ? "hedef karsilandi" : "hedefin altinda";
              return `${r.label}: gerceklesen ${Math.round(r.value)}, hedef ${Math.round(
                r.target
              )} (${durum})`;
            })
            .join("; ")}.`
        : "Mermi grafigi: veri yok";

    return (
      <div
        ref={ref}
        role="img"
        aria-label={summary}
        className={cn("w-full space-y-3", className)}
        {...props}
      >
        {rows.map((row, rowIndex) => {
          const rowMax = resolveRowMax(row, max);
          const measureFill = row.colorIndex
            ? measureFills[row.colorIndex]
            : "hsl(var(--primary))";
          const valuePct = Math.min(100, (Math.max(0, row.value) / rowMax) * 100);
          const targetPct = Math.min(100, (Math.max(0, row.target) / rowMax) * 100);
          const measureH = Math.round(barHeight * 0.42);
          const measureY = (barHeight - measureH) / 2;
          const metHedef = row.value >= row.target;

          // Kalitatif bantlar: her esik bir onceki esikten kendi degerine kadar.
          const ranges = row.ranges ?? [];
          const bands = ranges.map((end, i) => {
            const start = i === 0 ? 0 : ranges[i - 1] ?? 0;
            return { start, end };
          });

          return (
            <div key={rowIndex} className="flex items-center gap-3">
              <div
                className="max-w-[40%] shrink-0 truncate text-sm font-medium text-foreground sm:max-w-none"
                style={{ width: labelWidth }}
                title={row.label}
              >
                {row.label}
              </div>

              <div className="min-w-0 flex-1">
                <svg
                  viewBox={`0 0 ${VIEW_WIDTH} ${barHeight}`}
                  preserveAspectRatio="none"
                  className="block w-full overflow-visible rounded-sm"
                  style={{ height: barHeight }}
                  aria-hidden="true"
                >
                  {/* Iz zemini (bant yoksa ince bir baglam saglar) */}
                  {bands.length === 0 ? (
                    <rect
                      x={0}
                      y={0}
                      width={VIEW_WIDTH}
                      height={barHeight}
                      fill="hsl(var(--muted))"
                      opacity={0.4}
                    />
                  ) : null}

                  {/* Kalitatif esik bantlari */}
                  {bands.map((band, i) => {
                    const x = (Math.max(0, band.start) / rowMax) * VIEW_WIDTH;
                    const w =
                      ((Math.max(band.start, band.end) - Math.max(0, band.start)) /
                        rowMax) *
                      VIEW_WIDTH;
                    if (w <= 0) return null;
                    return (
                      <rect
                        key={i}
                        x={x}
                        y={0}
                        width={w}
                        height={barHeight}
                        fill="hsl(var(--muted))"
                        opacity={bandOpacity(i, bands.length)}
                      />
                    );
                  })}

                  {/* Olcum cubugu (gerceklesen deger) */}
                  <rect
                    x={0}
                    y={measureY}
                    width={(valuePct / 100) * VIEW_WIDTH}
                    height={measureH}
                    fill={measureFill}
                  />

                  {/* Hedef isaretcisi (dikey cizgi) */}
                  <line
                    x1={(targetPct / 100) * VIEW_WIDTH}
                    x2={(targetPct / 100) * VIEW_WIDTH}
                    y1={-2}
                    y2={barHeight + 2}
                    stroke="hsl(var(--foreground))"
                    strokeWidth={2.5}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>

              {showValues ? (
                <div
                  className="flex min-w-0 shrink items-baseline justify-end gap-1 text-sm tabular-nums"
                  style={{ minWidth: 72 }}
                >
                  <span
                    className={cn(
                      "font-semibold",
                      metHedef ? "text-success" : "text-foreground"
                    )}
                  >
                    {formatValue(row.value)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / {formatValue(row.target)}
                  </span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }
);
BulletChart.displayName = "BulletChart";

export { BulletChart };
