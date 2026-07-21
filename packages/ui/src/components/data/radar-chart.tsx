/**
 * RadarChart — SVG radar/orumcek grafigi.
 * N eksen esit acilarla merkez etrafina dizilir; her seri, eksen degerlerini
 * (0-max, varsayilan 100) birlestiren dolgu-opaklikli bir poligon olarak cizilir.
 * Halka izgara (es-merkezli poligonlar), eksen cizgileri ve eksen etiketleri
 * hsl(var(--border))/hsl(var(--muted-foreground)) token'lariyla; seri renkleri
 * hsl(var(--chartN)) ile atanir. Grafik butunu role="img" ve ozet aria-label
 * ile etiketlenir. GlowScan cilt analizi cekirdegi.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type ChartColorIndex = 1 | 2 | 3 | 4 | 5;

export interface RadarChartAxis {
  label: string;
  /** Bu eksen icin tam deger (100'e denk gelen). Varsayilan 100. */
  max?: number;
}

export interface RadarChartSeries {
  label: string;
  /** Eksen sirasina karsilik gelen degerler (0-max). */
  values: number[];
  /** 1-5 arasi chart rengi. Verilmezse sira ile atanir. */
  colorIndex?: ChartColorIndex;
}

export interface RadarChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  axes: RadarChartAxis[];
  series: RadarChartSeries[];
  /** Piksel cinsinden kare tuval boyutu. Varsayilan 300. */
  size?: number;
  /** Es-merkezli izgara halkasi sayisi. Varsayilan 4. */
  levels?: number;
  /** Poligon koselerinde daire isaretleri goster. */
  showDots?: boolean;
  /** Eksen etiketlerini goster. */
  showAxisLabels?: boolean;
  /** Altta renk noktali seri lejandi goster. */
  showLegend?: boolean;
}

const seriesStrokes: Record<ChartColorIndex, string> = {
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

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function resolveColorIndex(
  series: RadarChartSeries,
  index: number
): ChartColorIndex {
  return series.colorIndex ?? (((index % 5) + 1) as ChartColorIndex);
}

const RadarChart = React.forwardRef<HTMLDivElement, RadarChartProps>(
  (
    {
      axes,
      series,
      size = 300,
      levels = 4,
      showDots = true,
      showAxisLabels = true,
      showLegend = true,
      className,
      ...props
    },
    ref
  ) => {
    const axisCount = axes.length;
    const cx = size / 2;
    const cy = size / 2;
    const labelPad = showAxisLabels ? 62 : 20;
    const radius = Math.max(0, size / 2 - labelPad);
    const ringCount = Math.max(1, Math.round(levels));

    const angleFor = (index: number): number =>
      -Math.PI / 2 + (index * 2 * Math.PI) / Math.max(1, axisCount);

    const pointAt = (ratio: number, index: number) => {
      const angle = angleFor(index);
      return {
        x: cx + radius * ratio * Math.cos(angle),
        y: cy + radius * ratio * Math.sin(angle),
      };
    };

    const ratioFor = (series: RadarChartSeries, axisIndex: number): number => {
      const max = axes[axisIndex]?.max ?? 100;
      const value = series.values[axisIndex] ?? 0;
      return max > 0 ? clamp01(value / max) : 0;
    };

    const polygonPoints = (ratioResolver: (axisIndex: number) => number) =>
      axes
        .map((_, axisIndex) => {
          const p = pointAt(ratioResolver(axisIndex), axisIndex);
          return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
        })
        .join(" ");

    const summary =
      axisCount > 0 && series.length > 0
        ? `Radar grafik. Eksenler: ${axes
            .map((a) => a.label)
            .join(", ")}. ${series
            .map(
              (s) =>
                `${s.label}: ${axes
                  .map((a, i) => `${a.label} ${s.values[i] ?? 0}`)
                  .join(", ")}`
            )
            .join("; ")}`
        : "Radar grafik: veri yok";

    return (
      <div
        ref={ref}
        role="img"
        aria-label={summary}
        className={cn("inline-flex flex-col items-center", className)}
        {...props}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="block max-w-full"
          aria-hidden="true"
        >
          {/* Es-merkezli izgara halkalari */}
          {axisCount >= 3
            ? Array.from({ length: ringCount }, (_, level) => {
                const ratio = (level + 1) / ringCount;
                return (
                  <polygon
                    key={`ring-${level}`}
                    points={polygonPoints(() => ratio)}
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth={1}
                  />
                );
              })
            : null}

          {/* Eksen cizgileri (jant telleri) */}
          {axes.map((_, axisIndex) => {
            const outer = pointAt(1, axisIndex);
            return (
              <line
                key={`spoke-${axisIndex}`}
                x1={cx}
                y1={cy}
                x2={outer.x}
                y2={outer.y}
                stroke="hsl(var(--border))"
                strokeWidth={1}
              />
            );
          })}

          {/* Seri poligonlari */}
          {axisCount >= 3
            ? series.map((item, seriesIndex) => {
                const colorIndex = resolveColorIndex(item, seriesIndex);
                const color = seriesStrokes[colorIndex];
                const points = polygonPoints((axisIndex) =>
                  ratioFor(item, axisIndex)
                );
                return (
                  <g key={`series-${seriesIndex}`}>
                    <polygon
                      points={points}
                      fill={color}
                      fillOpacity={0.15}
                      stroke={color}
                      strokeWidth={2}
                      strokeLinejoin="round"
                    />
                    {showDots
                      ? axes.map((_, axisIndex) => {
                          const p = pointAt(
                            ratioFor(item, axisIndex),
                            axisIndex
                          );
                          return (
                            <circle
                              key={`dot-${seriesIndex}-${axisIndex}`}
                              cx={p.x}
                              cy={p.y}
                              r={2.5}
                              fill={color}
                            />
                          );
                        })
                      : null}
                  </g>
                );
              })
            : null}

          {/* Eksen etiketleri */}
          {showAxisLabels
            ? axes.map((axis, axisIndex) => {
                const angle = angleFor(axisIndex);
                const lx = cx + (radius + 14) * Math.cos(angle);
                const ly = cy + (radius + 14) * Math.sin(angle);
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                const anchor =
                  cos > 0.25 ? "start" : cos < -0.25 ? "end" : "middle";
                const baseline =
                  sin > 0.25 ? "hanging" : sin < -0.25 ? "auto" : "middle";
                return (
                  <text
                    key={`label-${axisIndex}`}
                    x={lx.toFixed(2)}
                    y={ly.toFixed(2)}
                    textAnchor={anchor}
                    dominantBaseline={baseline}
                    fill="hsl(var(--muted-foreground))"
                    className="text-[11px] font-medium"
                  >
                    {axis.label}
                  </text>
                );
              })
            : null}
        </svg>

        {showLegend && series.length > 0 ? (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {series.map((item, seriesIndex) => {
              const colorIndex = resolveColorIndex(item, seriesIndex);
              return (
                <div
                  key={`legend-${seriesIndex}`}
                  className="flex items-center gap-1.5"
                >
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
RadarChart.displayName = "RadarChart";

export { RadarChart };
