/**
 * MetricBar — Etiketli yatay ilerleme cubugu.
 * GlowScan metrikleri ve DeployLens kullanim olceri icin; deger 0-100
 * araliginda gosterilir, ton ve boyut prop ile secilir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type MetricBarSize = "sm" | "md";
type MetricBarTone = "primary" | "success" | "warning" | "destructive";

export interface MetricBarProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  /** 0-100 arasi deger. */
  value: number;
  displayValue?: React.ReactNode;
  size?: MetricBarSize;
  tone?: MetricBarTone;
}

const trackSizeClasses: Record<MetricBarSize, string> = {
  sm: "h-1.5",
  md: "h-2.5",
};

const fillToneClasses: Record<MetricBarTone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

const MetricBar = React.forwardRef<HTMLDivElement, MetricBarProps>(
  (
    { label, value, displayValue, size = "md", tone = "primary", className, ...props },
    ref
  ) => {
    const clamped = Math.min(100, Math.max(0, value));
    const shown = displayValue ?? `${clamped}%`;
    const ariaLabel = typeof label === "string" ? label : undefined;

    return (
      <div ref={ref} className={cn("space-y-1.5", className)} {...props}>
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="text-foreground">{label}</span>
          <span className="font-medium tabular-nums text-muted-foreground">{shown}</span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={clamped}
          aria-label={ariaLabel}
          className={cn(
            "w-full overflow-hidden rounded-full bg-muted",
            trackSizeClasses[size]
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-500",
              fillToneClasses[tone]
            )}
            style={{ width: `${clamped}%` }}
          />
        </div>
      </div>
    );
  }
);
MetricBar.displayName = "MetricBar";

export { MetricBar };
