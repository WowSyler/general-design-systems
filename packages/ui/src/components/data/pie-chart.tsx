/**
 * PieChart — Tam pasta grafik (donut'tan farkli: ic delik yok).
 * SVG icinde her dilim dolu bir daire kesiti (arc path) olarak
 * hsl(var(--chartN)) renkleriyle cizilir; istege bagli padAngle ile
 * dilimler birbirinden ayrilir. Yuzde etiketleri dilim uzerine
 * (hap seklinde) ya da legend'de gosterilir. Grafik butunu role="img"
 * ve ozet aria-label ile etiketlenir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type ChartColorIndex = 1 | 2 | 3 | 4 | 5;

export interface PieChartSegment {
  label: string;
  value: number;
  colorIndex?: ChartColorIndex;
}

export interface PieChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  segments: PieChartSegment[];
  /** Piksel cinsinden cap. Varsayilan 180. */
  size?: number;
  /** Dilimler arasi bosluk (derece). Varsayilan 0. */
  padAngle?: number;
  /** Yuzde etiketlerini dilim uzerinde goster. Varsayilan false. */
  showSliceLabels?: boolean;
  /** Yandaki renkli legend'i goster. Varsayilan true. */
  showLegend?: boolean;
}

const segmentFills: Record<ChartColorIndex, string> = {
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

function resolveColorIndex(segment: PieChartSegment, index: number): ChartColorIndex {
  return segment.colorIndex ?? (((index % 5) + 1) as ChartColorIndex);
}

/** Kutupsal aciyi (derece, tepe = -90) SVG kartezyen noktasina cevirir. */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Merkezden cizilen dolu dilim (wedge) path'i uretir. */
function wedgePath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      segments,
      size = 180,
      padAngle = 0,
      showSliceLabels = false,
      showLegend = true,
      className,
      ...props
    },
    ref
  ) => {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2;
    const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);

    const percents = segments.map((s) =>
      total > 0 ? (Math.max(0, s.value) / total) * 100 : 0
    );
    const summary = `Pasta grafik: ${segments
      .map((s, i) => `${s.label} yuzde ${Math.round(percents[i] ?? 0)}`)
      .join(", ")}`;

    // Dilimlerin acilarini onceden hesapla (tepeden, saat yonunde).
    let cursor = -90;
    const slices = segments.map((segment, index) => {
      const fraction = total > 0 ? Math.max(0, segment.value) / total : 0;
      const startAngle = cursor;
      const endAngle = cursor + fraction * 360;
      cursor = endAngle;
      return { segment, index, fraction, startAngle, endAngle };
    });

    return (
      <div
        ref={ref}
        role="img"
        aria-label={summary}
        className={cn("flex flex-wrap items-center gap-6", className)}
        {...props}
      >
        <div className="relative max-w-full shrink-0" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="h-auto max-w-full overflow-visible drop-shadow-sm"
            aria-hidden="true"
          >
            {slices.map(({ segment, index, startAngle, endAngle }) => {
              const fill = segmentFills[resolveColorIndex(segment, index)];
              const sweep = endAngle - startAngle;
              // Tek dilim tum daireyi kaplarsa arc yerine daire ciz.
              if (sweep >= 359.999) {
                return (
                  <circle
                    key={index}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill={fill}
                    className="transition-opacity duration-300 hover:opacity-90"
                  />
                );
              }
              const drawStart = startAngle + padAngle / 2;
              const drawEnd = endAngle - padAngle / 2;
              if (drawEnd <= drawStart) return null;
              return (
                <path
                  key={index}
                  d={wedgePath(cx, cy, radius, drawStart, drawEnd)}
                  fill={fill}
                  className="transition-opacity duration-300 hover:opacity-90"
                />
              );
            })}
          </svg>

          {showSliceLabels
            ? slices.map(({ index, fraction, startAngle, endAngle }) => {
                // Cok kucuk dilimlerde etiket gosterme (karisiklik olmasin).
                if (fraction < 0.06) return null;
                const mid = (startAngle + endAngle) / 2;
                const pos = polarToCartesian(cx, cy, radius * 0.62, mid);
                return (
                  <span
                    key={index}
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/85 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-foreground shadow-sm ring-1 ring-border/50"
                    style={{ left: pos.x, top: pos.y }}
                  >
                    %{Math.round(percents[index] ?? 0)}
                  </span>
                );
              })
            : null}
        </div>

        {showLegend ? (
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
        ) : null}
      </div>
    );
  }
);
PieChart.displayName = "PieChart";

export { PieChart };
