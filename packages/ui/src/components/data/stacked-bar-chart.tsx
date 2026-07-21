/**
 * StackedBarChart — SVG yiginlanmis cubuk grafik.
 * Her kategori (x ekseni) icin seriler ust uste segmentler olarak cizilir;
 * renkler hsl(var(--chartN)) token'larindan literal harita ile secilir.
 * stackMode="percent" ile her cubuk yuzde-100 dolar (yigin orani);
 * "absolute" ile en yuksek toplam olcegi belirler.
 * Renk noktali lejand, y/x eksen etiketleri ve ince kilavuz cizgileri icerir.
 * Grafik butunu role="img" ve ozet aria-label ile etiketlenir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type ChartColorIndex = 1 | 2 | 3 | 4 | 5;

export type StackedBarChartMode = "absolute" | "percent";

export interface StackedBarChartSeries {
  label: string;
  /** Her kategori icin bir deger; categories ile ayni sirada. */
  data: number[];
  /** 1-5 arasi chart rengi. Verilmezse sira ile atanir. */
  colorIndex?: ChartColorIndex;
}

export interface StackedBarChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** X ekseni kategori etiketleri. */
  categories: string[];
  /** Yiginlanacak seriler. */
  series: StackedBarChartSeries[];
  /** "absolute" gercek degerler, "percent" yuzde-100 yigin. Varsayilan "absolute". */
  stackMode?: StackedBarChartMode;
  /** Cizim alaninin piksel yuksekligi. Varsayilan 220. */
  height?: number;
  /** Altta renk noktali seri lejandi goster. Varsayilan true. */
  showLegend?: boolean;
  /** Sol y ekseni etiketlerini goster. Varsayilan true. */
  showAxis?: boolean;
  /** Her cubugun ustunde toplam degeri goster. */
  showValues?: boolean;
}

const segmentFills: Record<ChartColorIndex, string> = {
  1: "hsl(var(--chart1))",
  2: "hsl(var(--chart2))",
  3: "hsl(var(--chart3))",
  4: "hsl(var(--chart4))",
  5: "hsl(var(--chart5))",
};

const legendDotClasses: Record<ChartColorIndex, string> = {
  1: "bg-chart-1",
  2: "bg-chart-2",
  3: "bg-chart-3",
  4: "bg-chart-4",
  5: "bg-chart-5",
};

const GRID_LEVELS = [1, 0.75, 0.5, 0.25, 0] as const;
const VIEW_WIDTH = 100;

function resolveColorIndex(
  series: StackedBarChartSeries,
  index: number
): ChartColorIndex {
  return series.colorIndex ?? (((index % 5) + 1) as ChartColorIndex);
}

const StackedBarChart = React.forwardRef<HTMLDivElement, StackedBarChartProps>(
  (
    {
      categories,
      series,
      stackMode = "absolute",
      height = 220,
      showLegend = true,
      showAxis = true,
      showValues = false,
      className,
      ...props
    },
    ref
  ) => {
    const columnCount = Math.max(categories.length, 1);
    const columnWidth = VIEW_WIDTH / columnCount;
    const barWidth = columnWidth * 0.62;
    const isPercent = stackMode === "percent";

    // Kategori bazli toplamlar (negatifler 0'a sabitlenir).
    const totals = categories.map((_, colIndex) =>
      series.reduce((sum, s) => sum + Math.max(0, s.data[colIndex] ?? 0), 0)
    );
    const globalMax = Math.max(...totals, 0);

    // Yukseklik olcegi: absolute -> globalMax; percent -> her sutun kendi toplami.
    const heightDenom = (colIndex: number) =>
      isPercent ? totals[colIndex] || 0 : globalMax;

    const axisLabel = (level: number) =>
      isPercent
        ? `%${Math.round(level * 100)}`
        : `${Math.round(globalMax * level).toLocaleString("tr-TR")}`;

    const summary =
      series.length > 0 && categories.length > 0
        ? `Yiginlanmis cubuk grafik (${
            isPercent ? "yuzde yigin" : "mutlak deger"
          }). Seriler: ${series
            .map((s) => s.label)
            .join(", ")}. ${categories
            .map((c, i) => `${c} toplam ${Math.round(totals[i] ?? 0)}`)
            .join("; ")}.`
        : "Yiginlanmis cubuk grafik: veri yok";

    return (
      <div
        ref={ref}
        role="img"
        aria-label={summary}
        className={cn("w-full", className)}
        {...props}
      >
        <div className="flex gap-2">
          {showAxis ? (
            <div
              className="flex w-10 shrink-0 flex-col justify-between py-0 text-right text-[10px] tabular-nums text-muted-foreground"
              style={{ height }}
              aria-hidden="true"
            >
              {GRID_LEVELS.map((level) => (
                <span key={level} className="-translate-y-1/2 leading-none first:translate-y-0 last:translate-y-0">
                  {axisLabel(level)}
                </span>
              ))}
            </div>
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="relative" style={{ height }}>
              <svg
                viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
                preserveAspectRatio="none"
                className="absolute inset-0 block h-full w-full overflow-visible"
                aria-hidden="true"
              >
                {/* Kilavuz cizgileri */}
                {GRID_LEVELS.map((level) => {
                  const y = height * (1 - level);
                  return (
                    <line
                      key={level}
                      x1={0}
                      y1={y}
                      x2={VIEW_WIDTH}
                      y2={y}
                      stroke="hsl(var(--border))"
                      strokeWidth={1}
                      vectorEffect="non-scaling-stroke"
                      opacity={level === 0 ? 1 : 0.5}
                    />
                  );
                })}

                {/* Yiginlanmis segmentler */}
                {categories.map((_, colIndex) => {
                  const denom = heightDenom(colIndex);
                  const x = colIndex * columnWidth + (columnWidth - barWidth) / 2;
                  let cumulative = 0;

                  return (
                    <g key={colIndex}>
                      {series.map((s, seriesIndex) => {
                        const value = Math.max(0, s.data[colIndex] ?? 0);
                        if (value <= 0 || denom <= 0) return null;
                        const segHeight = (value / denom) * height;
                        const y = height - cumulative - segHeight;
                        cumulative += segHeight;
                        return (
                          <rect
                            key={seriesIndex}
                            x={x}
                            y={y}
                            width={barWidth}
                            height={segHeight}
                            fill={segmentFills[resolveColorIndex(s, seriesIndex)]}
                            stroke="hsl(var(--background))"
                            strokeWidth={1.5}
                            vectorEffect="non-scaling-stroke"
                          />
                        );
                      })}
                    </g>
                  );
                })}
              </svg>

              {/* Toplam deger etiketleri */}
              {showValues ? (
                <div className="pointer-events-none absolute inset-0 flex">
                  {categories.map((_, colIndex) => {
                    const fill =
                      globalMax > 0 ? (totals[colIndex] ?? 0) / globalMax : 0;
                    const bottom = isPercent ? 100 : Math.min(100, fill * 100);
                    return (
                      <div key={colIndex} className="relative min-w-0 flex-1">
                        <span
                          className="absolute left-1/2 -translate-x-1/2 -translate-y-1 whitespace-nowrap text-[11px] font-semibold tabular-nums text-foreground"
                          style={{ bottom: `${bottom}%` }}
                        >
                          {Math.round(totals[colIndex] ?? 0).toLocaleString(
                            "tr-TR"
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {/* X ekseni kategori etiketleri */}
            <div className="mt-1.5 flex">
              {categories.map((category, colIndex) => (
                <div
                  key={colIndex}
                  className="min-w-0 flex-1 truncate px-0.5 text-center text-xs text-muted-foreground"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        </div>

        {showLegend ? (
          <div
            className={cn(
              "mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5",
              showAxis && "pl-12"
            )}
          >
            {series.map((s, seriesIndex) => (
              <div key={seriesIndex} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-2.5 rounded-full",
                    legendDotClasses[resolveColorIndex(s, seriesIndex)]
                  )}
                  aria-hidden="true"
                />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);
StackedBarChart.displayName = "StackedBarChart";

export { StackedBarChart };
