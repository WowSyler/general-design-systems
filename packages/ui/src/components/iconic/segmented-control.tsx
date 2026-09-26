/**
 * SegmentedControl — iOS tarzı kayan pill segmented kontrol.
 * Seçenekler eşit genişlikte kolonlara yerleşir; aktif seçeneğin
 * arkasında yüzen bir pill (bg-background + shadow) bulunur ve seçim
 * değişince yumuşakça kayar. Pill konumu ölçüme değil, indeks/adet
 * yüzdesine dayanır → SSR/hydration güvenli ve statik yakalamada aktif
 * pill her zaman görünür (deterministik ilk render).
 */
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface SegmentedControlOption {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SegmentedControlOption[];
  value: string;
  onValueChange: (value: string) => void;
}

const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ options, value, onValueChange, className, ...props }, ref) => {
    const count = Math.max(options.length, 1);
    const activeIndex = Math.max(
      0,
      options.findIndex((option) => option.value === value)
    );

    return (
      <div
        ref={ref}
        role="group"
        aria-label="Segmentli seçim"
        className={cn(
          "relative inline-flex rounded-xl bg-muted p-1",
          className
        )}
        {...props}
      >
        <div
          className="relative grid w-full auto-cols-fr grid-flow-col"
          style={{ minWidth: `${count * 4.5}rem` }}
        >
          {/* Kayan aktif pill — indeks/adet yüzdesiyle konumlanır. */}
          <span
            aria-hidden="true"
            style={{
              width: `${100 / count}%`,
              // mantıksal konum: RTL'de pill sağdan başlar
              insetInlineStart: `${(activeIndex * 100) / count}%`,
            }}
            className="absolute inset-y-0 rounded-lg bg-background shadow-sm transition-all duration-300 ease-out motion-reduce:transition-none"
          />

          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => onValueChange(option.value)}
                className={cn(
                  "relative z-10 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&>svg]:size-4",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.icon ? (
                  <span aria-hidden="true" className="flex items-center">
                    {option.icon}
                  </span>
                ) : null}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);
SegmentedControl.displayName = "SegmentedControl";

export { SegmentedControl };
