/**
 * TimeSlotGrid — saat araligi secici.
 * Randevu akislarinda uygun saat dilimlerini grid halinde listeler;
 * secim, yukleme (skeleton) ve bos durum destekler.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface TimeSlot {
  id: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface TimeSlotGridProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Gosterilecek saat dilimleri. */
  slots: TimeSlot[];
  /** Secili slot id'si. */
  value?: string;
  /** Secim degistiginde cagrilir. */
  onValueChange?: (id: string) => void;
  /** Genis ekranda sutun sayisi (mobilde 2). */
  columns?: 3 | 4 | 6;
  /** Yukleme durumu (skeleton butonlar). */
  loading?: boolean;
  /** Slot yokken gosterilecek mesaj. */
  emptyMessage?: React.ReactNode;
}

const columnClasses: Record<3 | 4 | 6, string> = {
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-6",
};

export const TimeSlotGrid = React.forwardRef<HTMLDivElement, TimeSlotGridProps>(
  (
    {
      slots,
      value,
      onValueChange,
      columns = 4,
      loading = false,
      emptyMessage,
      className,
      ...props
    },
    ref,
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn("grid gap-2", columnClasses[columns], className)}
          aria-busy="true"
          {...props}
        >
          {Array.from({ length: columns * 2 }, (_, index) => (
            <div
              key={index}
              className="h-9 animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      );
    }

    if (slots.length === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground",
            className,
          )}
          {...props}
        >
          {emptyMessage ?? "Uygun saat bulunamadı."}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("grid gap-2", columnClasses[columns], className)}
        {...props}
      >
        {slots.map((slot) => {
          const selected = slot.id === value;
          return (
            <button
              key={slot.id}
              type="button"
              disabled={slot.disabled}
              aria-pressed={selected}
              onClick={() => onValueChange?.(slot.id)}
              className={cn(
                "rounded-md border py-2 text-sm tabular-nums pointer-coarse:min-h-11 transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                selected
                  ? "border-transparent bg-primary font-medium text-primary-foreground shadow-glow"
                  : "bg-background text-foreground hover:border-ring",
                slot.disabled &&
                  "pointer-events-none opacity-50 line-through",
              )}
            >
              {slot.label}
            </button>
          );
        })}
      </div>
    );
  },
);
TimeSlotGrid.displayName = "TimeSlotGrid";
