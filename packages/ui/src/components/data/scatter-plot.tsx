/**
 * ScatterPlot — SVG dagilim grafigi.
 * X-Y nokta bulutu; bir ya da coklu seri, her seri hsl(var(--chartN))
 * renginden turetilir. Eksenler, es-araliklarla yatay/dikey izgara ve
 * sayisal eksen etiketleri cizilir. Noktalarda opsiyonel r degeri varsa
 * kabarcik (bubble) olarak boyutlandirilir. Grafik butunu role="img" ve
 * ozet aria-label ile etiketlenir. DeployLens performans dagilimi ve
 * korelasyon incelemesi cekirdegi.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type ChartColorIndex = 1 | 2 | 3 | 4 | 5;

export interface ScatterPlotPoint {
  x: number;
  y: number;
  /** Kabarcik yaricapi icin ham deger; verilirse noktalar boyutlandirilir. */
  r?: number;
}

export interface ScatterPlotSeries {
  label: string;
  points: ScatterPlotPoint[];
  /** 1-5 arasi chart rengi. Verilmezse sira ile atanir. */
  colorIndex?: ChartColorIndex;
}

export interface ScatterPlotProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  series: ScatterPlotSeries[];
  /** X ekseni basligi. */
  xLabel?: string;
  /** Y ekseni basligi. */
  yLabel?: string;
  /** Cizim alaninin piksel yuksekligi. Varsayilan 260. */
  height?: number;
  /** Yatay/dikey referans izgarasini goster. Varsayilan true. */
  showGrid?: boolean;
  /** Altta renk noktali seri lejandi goster. Varsayilan true. */
  showLegend?: boolean;
}

const seriesColors: Record<ChartColorIndex, string> = {
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

const VIEW_WIDTH = 360;
const PAD_LEFT = 46;
const PAD_RIGHT = 14;
const PAD_TOP = 14;
const PAD_BOTTOM = 40;
const GRID = 4;
const DOT_RADIUS = 4.5;
const BUBBLE_MIN = 4;
const BUBBLE_MAX = 15;

function resolveColorIndex(series: ScatterPlotSeries, index: number): ChartColorIndex {
  return series.colorIndex ?? (((index % 5) + 1) as ChartColorIndex);
}

/** Eksen etiketleri icin sade sayisal bicimleme. */
function formatTick(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1000) return Math.round(value).toLocaleString("tr-TR");
  if (abs >= 10 || Number.isInteger(value)) return String(Math.round(value));
  return value.toFixed(1);
}

const ScatterPlot = React.forwardRef<HTMLDivElement, ScatterPlotProps>(
  (
    {
      series,
      xLabel,
      yLabel,
      height = 260,
      showGrid = true,
      showLegend = true,
      className,
      ...props
    },
    ref
  ) => {
    const allPoints = series.flatMap((s) => s.points);
    const xs = allPoints.map((p) => p.x);
    const ys = allPoints.map((p) => p.y);
    const rValues = allPoints
      .map((p) => p.r)
      .filter((r): r is number => typeof r === "number");
    const hasBubble = rValues.length > 0;
    const rMax = hasBubble ? Math.max(...rValues) : 0;

    const rawXMin = xs.length > 0 ? Math.min(...xs) : 0;
    const rawXMax = xs.length > 0 ? Math.max(...xs) : 0;
    const rawYMin = ys.length > 0 ? Math.min(...ys) : 0;
    const rawYMax = ys.length > 0 ? Math.max(...ys) : 0;

    // Noktalar kenara yapismasin diye alan adini %8 genislet.
    const xSpan = rawXMax - rawXMin || 1;
    const ySpan = rawYMax - rawYMin || 1;
    const xMin = rawXMin - xSpan * 0.08;
    const xMax = rawXMax + xSpan * 0.08;
    const yMin = rawYMin - ySpan * 0.08;
    const yMax = rawYMax + ySpan * 0.08;
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;

    const plotW = VIEW_WIDTH - PAD_LEFT - PAD_RIGHT;
    const plotH = height - PAD_TOP - PAD_BOTTOM;

    const toX = (x: number) =>
      PAD_LEFT + (xRange > 0 ? (x - xMin) / xRange : 0.5) * plotW;
    const toY = (y: number) =>
      PAD_TOP + (yRange > 0 ? 1 - (y - yMin) / yRange : 0.5) * plotH;

    const radiusFor = (r?: number) => {
      if (!hasBubble || typeof r !== "number" || rMax <= 0) return DOT_RADIUS;
      const t = Math.max(0, r) / rMax;
      return BUBBLE_MIN + t * (BUBBLE_MAX - BUBBLE_MIN);
    };

    const ticks = Array.from({ length: GRID + 1 }, (_, i) => i / GRID);

    const summary =
      series.length > 0
        ? `Dagilim grafigi${xLabel && yLabel ? ` (${xLabel} - ${yLabel})` : ""}: ${series
            .map((s) => `${s.label} serisi ${s.points.length} nokta`)
            .join(", ")}`
        : "Dagilim grafigi: veri yok";

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
          className="block w-full"
          aria-hidden="true"
        >
          {/* Izgara + eksen etiketleri */}
          {ticks.map((t, i) => {
            const y = PAD_TOP + t * plotH;
            const value = yMax - t * yRange;
            return (
              <g key={`y-${i}`}>
                {showGrid ? (
                  <line
                    x1={PAD_LEFT}
                    y1={y}
                    x2={VIEW_WIDTH - PAD_RIGHT}
                    y2={y}
                    stroke="hsl(var(--border))"
                    strokeWidth={1}
                    strokeOpacity={i === GRID ? 1 : 0.55}
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null}
                <text
                  x={PAD_LEFT - 8}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={9}
                  fill="hsl(var(--muted-foreground))"
                  className="tabular-nums"
                >
                  {formatTick(value)}
                </text>
              </g>
            );
          })}

          {ticks.map((t, i) => {
            const x = PAD_LEFT + t * plotW;
            const value = xMin + t * xRange;
            return (
              <g key={`x-${i}`}>
                {showGrid && i > 0 ? (
                  <line
                    x1={x}
                    y1={PAD_TOP}
                    x2={x}
                    y2={PAD_TOP + plotH}
                    stroke="hsl(var(--border))"
                    strokeWidth={1}
                    strokeOpacity={0.35}
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null}
                <text
                  x={x}
                  y={PAD_TOP + plotH + 14}
                  textAnchor="middle"
                  fontSize={9}
                  fill="hsl(var(--muted-foreground))"
                  className="tabular-nums"
                >
                  {formatTick(value)}
                </text>
              </g>
            );
          })}

          {/* Sol dikey eksen */}
          <line
            x1={PAD_LEFT}
            y1={PAD_TOP}
            x2={PAD_LEFT}
            y2={PAD_TOP + plotH}
            stroke="hsl(var(--border))"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />

          {/* Eksen basliklari */}
          {xLabel ? (
            <text
              x={PAD_LEFT + plotW / 2}
              y={height - 6}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill="hsl(var(--foreground))"
            >
              {xLabel}
            </text>
          ) : null}
          {yLabel ? (
            <text
              x={12}
              y={PAD_TOP + plotH / 2}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill="hsl(var(--foreground))"
              transform={`rotate(-90 12 ${PAD_TOP + plotH / 2})`}
            >
              {yLabel}
            </text>
          ) : null}

          {/* Nokta bulutu */}
          {series.map((item, seriesIndex) => {
            const colorIndex = resolveColorIndex(item, seriesIndex);
            const color = seriesColors[colorIndex];
            return (
              <g key={seriesIndex}>
                {item.points.map((point, pointIndex) => (
                  <circle
                    key={pointIndex}
                    cx={toX(point.x)}
                    cy={toY(point.y)}
                    r={radiusFor(point.r)}
                    fill={color}
                    fillOpacity={0.72}
                    stroke={color}
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </g>
            );
          })}
        </svg>

        {showLegend && series.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            {series.map((item, seriesIndex) => (
              <div key={seriesIndex} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-2.5 rounded-full",
                    legendDotClasses[resolveColorIndex(item, seriesIndex)]
                  )}
                  aria-hidden="true"
                />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);
ScatterPlot.displayName = "ScatterPlot";

export { ScatterPlot };
