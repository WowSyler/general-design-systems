/**
 * ScoreBadge — Ondalikli skor rozeti (GlowScan 0-10 skoru).
 * Degeri bir ondalik basamakla, kucuk "/max" ekiyle hap seklinde gosterir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type ScoreBadgeSize = "sm" | "md" | "lg";

export interface ScoreBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  /** Varsayilan 10. */
  max?: number;
  size?: ScoreBadgeSize;
  /** Erisilebilirlik etiketi (aria-label). */
  label?: string;
}

const sizeClasses: Record<ScoreBadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

const ScoreBadge = React.forwardRef<HTMLSpanElement, ScoreBadgeProps>(
  ({ value, max = 10, size = "md", label, className, ...props }, ref) => (
    <span
      ref={ref}
      aria-label={label ?? `Skor: ${value.toFixed(1)} / ${max}`}
      className={cn(
        "inline-flex items-baseline gap-0.5 rounded-full bg-secondary font-semibold tabular-nums text-secondary-foreground",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span>{value.toFixed(1)}</span>
      <span className="text-[0.75em] font-normal text-muted-foreground">/{max}</span>
    </span>
  )
);
ScoreBadge.displayName = "ScoreBadge";

export { ScoreBadge };
