/**
 * Rating — yildizli puan gostergesi.
 * 0-5 arasi degeri dolu/bos yildizlarla, istege bagli sayisal
 * degerle ve erisilebilir etiketle sunar.
 */
import * as React from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Puan degeri (0 - max arasi). */
  value: number;
  /** Maksimum yildiz sayisi. */
  max?: number;
  /** Yildiz boyutu. */
  size?: "sm" | "md";
  /** Sayisal degeri yildizlarin yaninda goster. */
  showValue?: boolean;
}

const sizeClasses: Record<"sm" | "md", string> = {
  sm: "size-3.5",
  md: "size-4",
};

const valueClasses: Record<"sm" | "md", string> = {
  sm: "text-xs",
  md: "text-sm",
};

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ value, max = 5, size = "md", showValue = false, className, ...props }, ref) => {
    const filled = Math.round(Math.min(Math.max(value, 0), max));

    return (
      <div
        ref={ref}
        role="img"
        aria-label={`${max} üzerinden ${value}`}
        className={cn("flex items-center gap-1", className)}
        {...props}
      >
        <div className="flex items-center gap-0.5">
          {Array.from({ length: max }, (_, index) => (
            <Star
              key={index}
              aria-hidden="true"
              className={cn(
                sizeClasses[size],
                index < filled
                  ? "fill-current text-warning"
                  : "text-muted-foreground/40",
              )}
            />
          ))}
        </div>
        {showValue ? (
          <span
            className={cn(
              "font-medium tabular-nums text-muted-foreground",
              valueClasses[size],
            )}
          >
            {value.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}
          </span>
        ) : null}
      </div>
    );
  },
);
Rating.displayName = "Rating";
