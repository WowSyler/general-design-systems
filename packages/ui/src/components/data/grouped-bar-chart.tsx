/**
 * GroupedBarChart — Gruplu (yan yana) cubuk grafik.
 * Her x kategorisinde birden cok seri yan yana cubuk olarak SVG icinde cizilir;
 * cubuklar hsl(var(--chartN)) renkleriyle doldurulur, y ekseni izgarasi,
 * kategori etiketleri ve renk noktali seri lejandi eslik eder.
 * Grafik butunu role="img" ve ozet aria-label ile etiketlenir.
 * Uniform olcekli viewBox sayesinde metin bozulmadan responsive olur.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type ChartColorIndex = 1 | 2 | 3 | 4 | 5;

export interface GroupedBarChartSeries {
  label: string;
  /** categories ile ayni sirada, kategori basina bir deger. */
  data: number[];
  /** 1-5 arasi chart rengi. Verilmezse sira ile atanir. */
  colorIndex?: ChartColorIndex;
}

export interface GroupedBarChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** X eksenindeki kategori adlari. */
  categories: string[];
  /** Yan yana cizilecek seriler. */
  series: GroupedBarChartSeries[];
  /** Cizim alaninin (user-unit) yuksekligi. Varsayilan 240. */
  height?: number;
  /** Cubuklarin ustunde degerleri goster. */
  showValues?: boolean;
  /** Altta renk noktali seri lejandi goster. Varsayilan true. */
  showLegend?: boolean;
  /** Y ekseni izgara cizgisi sayisi. Varsayilan 4. */
  tickCount?: number;
  /** Deger bicimlendirici (etiket, izgara ve ozet icin). */
  valueFormatter?: (value: number) => string;
}

const barFills: Record<ChartColorIndex, string> = {
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

function resolveColorIndex(
  series: GroupedBarChartSeries,
  index: number
): ChartColorIndex {
  return series.colorIndex ?? (((index % 5) + 1) as ChartColorIndex);
}

/** Degeri 1/2/5 * 10^n formunda yukari yuvarlar (izgara ust siniri icin). */
function niceCeil(value: number): number {
  if (value <= 0) return 0;
  const exponent = Math.floor(Math.log10(value));
  const base = Math.pow(10, exponent);
  const fraction = value / base;
  const niceFraction =
    fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * base;
}

const GroupedBarChart = React.forwardRef<HTMLDivElement, GroupedBarChartProps>(
  (
    {
      categories,
      series,
      height = 240,
      showValues = false,
      showLegend = true,
      tickCount = 4,
      valueFormatter,
      className,
      ...props
    },
    ref
  ) => {
    const formatValue = React.useCallback(
      (value: number) =>
        valueFormatter ? valueFormatter(value) : String(value),
      [valueFormatter]
    );

    // Geometri (user-unit). viewBox uniform olcekle responsive olur.
    const marginLeft = 44;
    const marginRight = 14;
    const marginTop = 18;
    const marginBottom = 30;
    const groupWidth = 60;

    const categoryCount = Math.max(categories.length, 1);
    const seriesCount = Math.max(series.length, 1);

    const plotWidth = categoryCount * groupWidth;
    const totalWidth = marginLeft + plotWidth + marginRight;
    const plotHeight = height - marginTop - marginBottom;
    const baselineY = marginTop + plotHeight;

    const rawMax = Math.max(
      0,
      ...series.flatMap((s) => s.data.map((v) => Math.max(0, v)))
    );
    const niceMax = niceCeil(rawMax) || 1;

    const innerPad = groupWidth * 0.16;
    const barGap = seriesCount > 1 ? 3 : 0;
    const barsAreaWidth = groupWidth - innerPad * 2;
    const barWidth = Math.max(
      2,
      (barsAreaWidth - barGap * (seriesCount - 1)) / seriesCount
    );

    const ticks = Array.from({ length: tickCount + 1 }, (_, i) => {
      const value = (niceMax * i) / tickCount;
      const y = baselineY - (value / niceMax) * plotHeight;
      return { value, y };
    });

    const summary =
      series.length > 0 && categories.length > 0
        ? `Gruplu cubuk grafik. Kategoriler: ${categories.join(", ")}. ` +
          series
            .map(
              (s) =>
                `${s.label} serisi degerleri ${s.data
                  .map((v) => formatValue(v))
                  .join(", ")}`
            )
            .join("; ")
        : "Gruplu cubuk grafik: veri yok";

    return (
      <div
        ref={ref}
        role="img"
        aria-label={summary}
        className={cn("w-full", className)}
        {...props}
      >
        <svg
          viewBox={`0 0 ${totalWidth} ${height}`}
          className="block w-full"
          aria-hidden="true"
        >
          {/* Y ekseni izgarasi ve etiketleri */}
          {ticks.map((tick, index) => (
            <g key={index}>
              <line
                x1={marginLeft}
                y1={tick.y}
                x2={marginLeft + plotWidth}
                y2={tick.y}
                className={index === 0 ? "text-border" : "text-border/60"}
                stroke="currentColor"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={marginLeft - 8}
                y={tick.y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[11px] tabular-nums"
              >
                {formatValue(tick.value)}
              </text>
            </g>
          ))}

          {/* Cubuklar */}
          {categories.map((category, categoryIndex) => {
            const groupX = marginLeft + categoryIndex * groupWidth;
            return (
              <g key={categoryIndex}>
                {series.map((item, seriesIndex) => {
                  const value = Math.max(0, item.data[categoryIndex] ?? 0);
                  const ratio = niceMax > 0 ? value / niceMax : 0;
                  const barHeight = Math.max(
                    value > 0 ? 1.5 : 0,
                    ratio * plotHeight
                  );
                  const x =
                    groupX + innerPad + seriesIndex * (barWidth + barGap);
                  const y = baselineY - barHeight;
                  const colorIndex = resolveColorIndex(item, seriesIndex);
                  return (
                    <rect
                      key={seriesIndex}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx={2}
                      fill={barFills[colorIndex]}
                      className="transition-opacity duration-200 hover:opacity-80"
                    >
                      <title>{`${item.label} - ${category}: ${formatValue(
                        item.data[categoryIndex] ?? 0
                      )}`}</title>
                    </rect>
                  );
                })}

                {/* Deger etiketleri */}
                {showValues
                  ? series.map((item, seriesIndex) => {
                      const value = Math.max(0, item.data[categoryIndex] ?? 0);
                      const ratio = niceMax > 0 ? value / niceMax : 0;
                      const barHeight = Math.max(
                        value > 0 ? 1.5 : 0,
                        ratio * plotHeight
                      );
                      const cx =
                        groupX +
                        innerPad +
                        seriesIndex * (barWidth + barGap) +
                        barWidth / 2;
                      return (
                        <text
                          key={seriesIndex}
                          x={cx}
                          y={baselineY - barHeight - 5}
                          textAnchor="middle"
                          className="fill-foreground text-[9px] font-medium tabular-nums"
                        >
                          {formatValue(item.data[categoryIndex] ?? 0)}
                        </text>
                      );
                    })
                  : null}

                {/* Kategori etiketi */}
                <text
                  x={groupX + groupWidth / 2}
                  y={baselineY + 18}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[11px]"
                >
                  {category}
                </text>
              </g>
            );
          })}
        </svg>

        {showLegend ? (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {series.map((item, seriesIndex) => {
              const colorIndex = resolveColorIndex(item, seriesIndex);
              return (
                <div key={seriesIndex} className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "size-2.5 rounded-full",
                      legendDotClasses[colorIndex]
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
);
GroupedBarChart.displayName = "GroupedBarChart";

export { GroupedBarChart };
