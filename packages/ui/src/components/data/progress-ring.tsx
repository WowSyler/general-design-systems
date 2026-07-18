/**
 * ProgressRing — Dairesel ilerleme halkasi.
 * SVG iki cember: iz (muted) ve tona gore dolgu; merkezde etiket
 * veya yuzde degeri gosterir. role="meter" ile erisilebilir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type ProgressRingTone = "primary" | "success" | "warning" | "destructive";

export interface ProgressRingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 0-100 arasi deger. */
  value: number;
  /** Piksel cinsinden cap. Varsayilan 96. */
  size?: number;
  /** Halka kalinligi. Varsayilan 8. */
  strokeWidth?: number;
  /** Merkezde gosterilecek icerik; yoksa %deger yazilir. */
  label?: React.ReactNode;
  tone?: ProgressRingTone;
}

const toneStrokes: Record<ProgressRingTone, string> = {
  primary: "hsl(var(--primary))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  destructive: "hsl(var(--destructive))",
};

const ProgressRing = React.forwardRef<HTMLDivElement, ProgressRingProps>(
  (
    { value, size = 96, strokeWidth = 8, label, tone = "primary", className, ...props },
    ref
  ) => {
    const clamped = Math.min(100, Math.max(0, value));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - clamped / 100);

    return (
      <div
        ref={ref}
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-label={typeof label === "string" ? label : `Ilerleme: %${Math.round(clamped)}`}
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={toneStrokes[tone]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums text-foreground">
          {label ?? `%${Math.round(clamped)}`}
        </div>
      </div>
    );
  }
);
ProgressRing.displayName = "ProgressRing";

export { ProgressRing };
