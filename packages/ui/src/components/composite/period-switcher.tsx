/**
 * PeriodSwitcher — Donem secici (Fisly dashboard).
 * Segmentli kontrol (hafta/ay/yil vb.) ve opsiyonel onceki/sonraki
 * oklari ile donem gezinmesi saglar.
 */
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface PeriodSwitcherOption {
  value: string;
  label: React.ReactNode;
}

export interface PeriodSwitcherProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: PeriodSwitcherOption[];
  value: string;
  onValueChange: (v: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  /** Oklarin arasinda gosterilen mevcut donem metni. */
  periodLabel?: React.ReactNode;
}

function PeriodSwitcher({
  options,
  value,
  onValueChange,
  onPrevious,
  onNext,
  periodLabel,
  className,
  ...props
}: PeriodSwitcherProps) {
  const hasNavigation = Boolean(onPrevious || onNext || periodLabel);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)} {...props}>
      <div
        role="group"
        aria-label="Donem secimi"
        className="inline-flex rounded-lg bg-muted p-1"
      >
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onValueChange(option.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-background text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {hasNavigation ? (
        <div className="flex items-center gap-1">
          {onPrevious ? (
            <button
              type="button"
              onClick={onPrevious}
              aria-label="Onceki donem"
              className="flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
          ) : null}
          {periodLabel ? (
            <span className="min-w-24 text-center text-sm font-medium tabular-nums text-foreground">
              {periodLabel}
            </span>
          ) : null}
          {onNext ? (
            <button
              type="button"
              onClick={onNext}
              aria-label="Sonraki donem"
              className="flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export { PeriodSwitcher };
