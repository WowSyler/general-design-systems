/**
 * AreaChart — SVG alan grafigi.
 * Tek ya da coklu seri; her seri chart-1..5 renginden turetilen bir
 * linearGradient ile doldurulur ve ustune yumusak (Catmull-Rom) cizgi
 * cizilir. Opsiyonel yatay izgara, alt x etiketleri ve son-nokta vurgusu
 * bulunur. Grafik butunu role="img" ve ozet aria-label ile etiketlenir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type ChartColorIndex = 1 | 2 | 3 | 4 | 5;

export interface AreaChartSeries {
  label: string;
  data: number[];
  /** 1-5 arasi chart rengi. Verilmezse sira ile atanir. */
  colorIndex?: ChartColorIndex;
}

export interface AreaChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  series: AreaChartSeries[];
  /** X ekseni alt etiketleri (nokta sayisiyla hizali). */
  labels?: string[];
  /** Cizim alaninin piksel yuksekligi. Varsayilan 200. */
  height?: number;
  /** Yatay referans izgarasini goster. */
  showGrid?: boolean;
  /** Duz cizgi yerine yumusatilmis egri kullan. Varsayilan true. */
  smooth?: boolean;
  /** Her serinin son noktasini daire ile vurgula. */
  highlightLast?: boolean;
  /** Altta renk noktali seri lejandi goster. */
  showLegend?: boolean;
}

const strokeColors: Record<ChartColorIndex, string> = {
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

const VIEW_WIDTH = 100;
const GRID_ROWS = 4;

interface Point {
  x: number;
  y: number;
}

/** Catmull-Rom noktalarindan yumusak bir bezier "d" komutu uretir. */
function buildSmoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const p = points[0]!;
    return `M ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }

  let d = `M ${points[0]!.x.toFixed(2)} ${points[0]!.y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

/** Duz cizgili "d" komutu uretir. */
function buildLinearPath(points: Point[]): string {
  if (points.length === 0) return "";
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
}

const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
  (
    {
      series,
      labels,
      height = 200,
      showGrid = false,
      smooth = true,
      highlightLast = false,
      showLegend = false,
      className,
      ...props
    },
    ref
  ) => {
    const baseId = React.useId();

    const allValues = series.flatMap((s) => s.data);
    const min = allValues.length > 0 ? Math.min(...allValues) : 0;
    const max = allValues.length > 0 ? Math.max(...allValues) : 0;
    const range = max - min;
    const pad = 8;

    const toPoint = (value: number, index: number, length: number): Point => {
      const x = length > 1 ? (index / (length - 1)) * VIEW_WIDTH : VIEW_WIDTH / 2;
      const y =
        range > 0
          ? height - pad - ((value - min) / range) * (height - pad * 2)
          : height / 2;
      return { x, y };
    };

    const summary =
      series.length > 0
        ? `Alan grafigi: ${series
            .map((s) => {
              const last = s.data[s.data.length - 1];
              return `${s.label} serisi ${s.data.length} nokta, son deger ${last ?? "yok"}`;
            })
            .join("; ")}`
        : "Alan grafigi: veri yok";

    const gridYs = Array.from(
      { length: GRID_ROWS + 1 },
      (_, i) => pad + (i / GRID_ROWS) * (height - pad * 2)
    );

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
          className="block w-full overflow-visible"
          style={{ height }}
          aria-hidden="true"
        >
          <defs>
            {series.map((item, seriesIndex) => {
              const colorIndex =
                item.colorIndex ?? (((seriesIndex % 5) + 1) as ChartColorIndex);
              return (
                <linearGradient
                  key={seriesIndex}
                  id={`${baseId}-fill-${seriesIndex}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={strokeColors[colorIndex]}
                    stopOpacity={0.32}
                  />
                  <stop
                    offset="100%"
                    stopColor={strokeColors[colorIndex]}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              );
            })}
          </defs>

          {showGrid
            ? gridYs.map((y, i) => (
                <line
                  key={`grid-${i}`}
                  x1={0}
                  y1={y}
                  x2={VIEW_WIDTH}
                  y2={y}
                  stroke="hsl(var(--border))"
                  strokeWidth={1}
                  strokeOpacity={0.7}
                  vectorEffect="non-scaling-stroke"
                />
              ))
            : null}

          {series.map((item, seriesIndex) => {
            if (item.data.length === 0) return null;
            const colorIndex =
              item.colorIndex ?? (((seriesIndex % 5) + 1) as ChartColorIndex);
            const color = strokeColors[colorIndex];
            const points = item.data.map((value, index) =>
              toPoint(value, index, item.data.length)
            );
            const linePath = smooth
              ? buildSmoothPath(points)
              : buildLinearPath(points);
            const first = points[0]!;
            const last = points[points.length - 1]!;
            const areaPath = `${linePath} L ${last.x.toFixed(2)} ${height} L ${first.x.toFixed(2)} ${height} Z`;

            return (
              <g key={seriesIndex}>
                <path
                  d={areaPath}
                  fill={`url(#${baseId}-fill-${seriesIndex})`}
                  stroke="none"
                />
                <path
                  d={linePath}
                  fill="none"
                  stroke={color}
                  className="stroke-2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
                {highlightLast ? (
                  <path
                    d={`M ${last.x.toFixed(2)} ${last.y.toFixed(2)} l 0.01 0`}
                    stroke={color}
                    strokeWidth={8}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null}
              </g>
            );
          })}
        </svg>

        {labels && labels.length > 0 ? (
          <div className="mt-1.5 flex gap-2">
            {labels.map((label, index) => (
              <div
                key={index}
                className="min-w-0 flex-1 truncate text-center text-xs tabular-nums text-muted-foreground"
              >
                {label}
              </div>
            ))}
          </div>
        ) : null}

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
AreaChart.displayName = "AreaChart";

export { AreaChart };
