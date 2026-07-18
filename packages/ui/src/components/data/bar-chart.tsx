/**
 * BarChart — Basit dikey cubuk grafik.
 * CSS-only cubuklar: bg-chart-1..5 dongusu, yukseklik degere gore.
 * Grafik butunu role="img" ve ozet aria-label ile etiketlenir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface BarChartDatum {
  label: string;
  value: number;
}

export interface BarChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  data: BarChartDatum[];
  /** Cubuk alaninin piksel yuksekligi. Varsayilan 160. */
  height?: number;
  /** Cubuklarin ustunde degerleri goster. */
  showValues?: boolean;
}

type ChartColorIndex = 1 | 2 | 3 | 4 | 5;

const barColorClasses: Record<ChartColorIndex, string> = {
  1: "bg-chart-1",
  2: "bg-chart-2",
  3: "bg-chart-3",
  4: "bg-chart-4",
  5: "bg-chart-5",
};

const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  ({ data, height = 160, showValues = false, className, ...props }, ref) => {
    const max = Math.max(...data.map((d) => d.value), 0);
    const valueReserve = showValues ? 20 : 0;
    const summary = `Cubuk grafik: ${data
      .map((d) => `${d.label} ${d.value}`)
      .join(", ")}`;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={summary}
        className={cn("w-full", className)}
        {...props}
      >
        <div className="flex items-end gap-2" style={{ height }}>
          {data.map((item, index) => {
            const colorIndex = ((index % 5) + 1) as ChartColorIndex;
            const ratio = max > 0 ? item.value / max : 0;
            const barHeight = Math.max(4, Math.round(ratio * (height - valueReserve)));
            return (
              <div
                key={index}
                className="flex h-full min-w-0 flex-1 flex-col items-stretch justify-end gap-1"
              >
                {showValues ? (
                  <span className="truncate text-center text-xs tabular-nums text-muted-foreground">
                    {item.value}
                  </span>
                ) : null}
                <div
                  className={cn(
                    "w-full rounded-t-md transition-[height] duration-300",
                    barColorClasses[colorIndex]
                  )}
                  style={{ height: barHeight }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-1.5 flex gap-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="min-w-0 flex-1 truncate text-center text-xs text-muted-foreground"
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
BarChart.displayName = "BarChart";

export { BarChart };
