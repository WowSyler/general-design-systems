/**
 * Sparkline — Mini cizgi grafik.
 * Normalize edilmis noktalarla SVG polyline cizer; altinda saydamlasan
 * gradyan dolgu bulunur. Grafik dekoratiftir (aria-hidden), sr-only
 * ozet metniyle erisilebilir kalir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type SparklineTone = "primary" | "success" | "warning" | "destructive";

export interface SparklineProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  data: number[];
  /** Piksel cinsinden yukseklik. Varsayilan 40. */
  height?: number;
  tone?: SparklineTone;
}

const toneStrokes: Record<SparklineTone, string> = {
  primary: "hsl(var(--primary))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  destructive: "hsl(var(--destructive))",
};

const VIEW_WIDTH = 100;

const Sparkline = React.forwardRef<HTMLDivElement, SparklineProps>(
  ({ data, height = 40, tone = "primary", className, ...props }, ref) => {
    const gradientId = React.useId();
    const color = toneStrokes[tone];

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const pad = 3;

    const points = data.map((value, index) => {
      const x = data.length > 1 ? (index / (data.length - 1)) * VIEW_WIDTH : VIEW_WIDTH / 2;
      const y =
        range > 0
          ? height - pad - ((value - min) / range) * (height - pad * 2)
          : height / 2;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });

    const areaPoints = [`0,${height}`, ...points, `${VIEW_WIDTH},${height}`].join(" ");
    const summary =
      data.length > 0
        ? `Egilim grafigi: ${data.length} veri noktasi, en dusuk ${min}, en yuksek ${max}, son deger ${data[data.length - 1]}`
        : "Egilim grafigi: veri yok";

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
          preserveAspectRatio="none"
          className="block w-full"
          style={{ height }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {data.length > 0 ? (
            <>
              <polygon points={areaPoints} fill={`url(#${gradientId})`} stroke="none" />
              <polyline
                points={points.join(" ")}
                fill="none"
                stroke={color}
                className="stroke-2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </>
          ) : null}
        </svg>
        <span className="sr-only">{summary}</span>
      </div>
    );
  }
);
Sparkline.displayName = "Sparkline";

export { Sparkline };
