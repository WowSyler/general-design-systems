/**
 * DonutChart — Halka grafik.
 * SVG stroke-dasharray dilimleri hsl(var(--chartN)) renkleriyle cizilir;
 * ic yaricap bos kalir, yaninda renk noktali legend bulunur.
 * Grafik butunu role="img" ile etiketlenir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type ChartColorIndex = 1 | 2 | 3 | 4 | 5;

export interface DonutChartSegment {
  label: string;
  value: number;
  colorIndex?: ChartColorIndex;
}

export interface DonutChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  segments: DonutChartSegment[];
  /** Piksel cinsinden cap. Varsayilan 160. */
  size?: number;
  /** Halkanin ortasinda gosterilecek icerik. */
  centerLabel?: React.ReactNode;
}

const segmentStrokes: Record<ChartColorIndex, string> = {
  1: "hsl(var(--chart1))",
  2: "hsl(var(--chart2))",
  3: "hsl(var(--chart3))",
  4: "hsl(var(--chart4))",
  5: "hsl(var(--chart5))",
};

const dotColorClasses: Record<ChartColorIndex, string> = {
  1: "bg-chart-1",
  2: "bg-chart-2",
  3: "bg-chart-3",
  4: "bg-chart-4",
  5: "bg-chart-5",
};

function resolveColorIndex(segment: DonutChartSegment, index: number): ChartColorIndex {
  return segment.colorIndex ?? (((index % 5) + 1) as ChartColorIndex);
}

const DonutChart = React.forwardRef<HTMLDivElement, DonutChartProps>(
  ({ segments, size = 160, centerLabel, className, ...props }, ref) => {
    const strokeWidth = Math.max(12, Math.round(size / 8));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);

    const percents = segments.map((s) =>
      total > 0 ? (Math.max(0, s.value) / total) * 100 : 0
    );
    const summary = `Halka grafik: ${segments
      .map((s, i) => `${s.label} yuzde ${Math.round(percents[i] ?? 0)}`)
      .join(", ")}`;

    let accumulated = 0;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={summary}
        className={cn("flex flex-wrap items-center gap-6", className)}
        {...props}
      >
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90"
            aria-hidden="true"
          >
            {segments.map((segment, index) => {
              const fraction = total > 0 ? Math.max(0, segment.value) / total : 0;
              const dash = fraction * circumference;
              const offset = -accumulated * circumference;
              accumulated += fraction;
              return (
                <circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={segmentStrokes[resolveColorIndex(segment, index)]}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={offset}
                />
              );
            })}
          </svg>
          {centerLabel !== undefined ? (
            <div className="absolute inset-0 flex items-center justify-center text-center text-sm font-semibold text-foreground">
              {centerLabel}
            </div>
          ) : null}
        </div>
        <ul className="min-w-0 space-y-2">
          {segments.map((segment, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <span
                className={cn(
                  "size-2.5 shrink-0 rounded-full",
                  dotColorClasses[resolveColorIndex(segment, index)]
                )}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate text-foreground">
                {segment.label}
              </span>
              <span className="tabular-nums text-muted-foreground">
                %{Math.round(percents[index] ?? 0)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);
DonutChart.displayName = "DonutChart";

export { DonutChart };
