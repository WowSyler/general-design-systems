/**
 * LineChart — Cok serili cizgi grafik.
 * Her seri normalize edilmis noktalarla SVG polyline olarak cizilir;
 * renkler chart-1..5 token'larindan literal harita ile secilir.
 * Grafik butunu role="img" ve ozet aria-label ile etiketlenir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type ChartColorIndex = 1 | 2 | 3 | 4 | 5;

export interface LineChartSeries {
  label: string;
  data: number[];
  /** 1-5 arasi chart rengi. Verilmezse sira ile atanir. */
  colorIndex?: ChartColorIndex;
}

export interface LineChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  series: LineChartSeries[];
  /** Cizim alaninin piksel yuksekligi. Varsayilan 200. */
  height?: number;
  /** Veri noktalarinda daire isaretleri goster. */
  showDots?: boolean;
  /** Altta renk noktali seri lejandi goster. */
  showLegend?: boolean;
}

const strokeColors: Record<ChartColorIndex, string> = {
  1: "hsl(var(--chart-1))",
  2: "hsl(var(--chart-2))",
  3: "hsl(var(--chart-3))",
  4: "hsl(var(--chart-4))",
  5: "hsl(var(--chart-5))",
};

const legendDotClasses: Record<ChartColorIndex, string> = {
  1: "bg-chart-1",
  2: "bg-chart-2",
  3: "bg-chart-3",
  4: "bg-chart-4",
  5: "bg-chart-5",
};

const VIEW_WIDTH = 100;

const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  (
    { series, height = 200, showDots = false, showLegend = false, className, ...props },
    ref
  ) => {
    const allValues = series.flatMap((s) => s.data);
    const min = allValues.length > 0 ? Math.min(...allValues) : 0;
    const max = allValues.length > 0 ? Math.max(...allValues) : 0;
    const range = max - min;
    const pad = 6;

    const toPoint = (value: number, index: number, length: number) => {
      const x =
        length > 1 ? (index / (length - 1)) * VIEW_WIDTH : VIEW_WIDTH / 2;
      const y =
        range > 0
          ? height - pad - ((value - min) / range) * (height - pad * 2)
          : height / 2;
      return { x, y };
    };

    const summary =
      series.length > 0
        ? `Cizgi grafik: ${series
            .map((s) => {
              const last = s.data[s.data.length - 1];
              return `${s.label} serisi ${s.data.length} nokta, son deger ${last ?? "yok"}`;
            })
            .join("; ")}`
        : "Cizgi grafik: veri yok";

    return (
      <div
        ref={ref}
        role="img"
        aria-label={summary}
        className={cn("w-full", className)}
        {...props}
      >
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
          preserveAspectRatio="none"
          className="block w-full"
          style={{ height }}
          aria-hidden="true"
        >
          {series.map((item, seriesIndex) => {
            const colorIndex =
              item.colorIndex ?? (((seriesIndex % 5) + 1) as ChartColorIndex);
            const color = strokeColors[colorIndex];
            const points = item.data.map((value, index) =>
              toPoint(value, index, item.data.length)
            );

            return (
              <g key={seriesIndex}>
                <polyline
                  points={points
                    .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
                    .join(" ")}
                  fill="none"
                  stroke={color}
                  className="stroke-2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
                {showDots
                  ? points.map((p, pointIndex) => (
                      <path
                        key={pointIndex}
                        d={`M ${p.x.toFixed(2)} ${p.y.toFixed(2)} l 0.01 0`}
                        stroke={color}
                        strokeWidth={6}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))
                  : null}
              </g>
            );
          })}
        </svg>
        {showLegend ? (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            {series.map((item, seriesIndex) => {
              const colorIndex =
                item.colorIndex ?? (((seriesIndex % 5) + 1) as ChartColorIndex);
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
LineChart.displayName = "LineChart";

export { LineChart };
