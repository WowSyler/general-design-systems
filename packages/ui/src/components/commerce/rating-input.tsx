/**
 * RatingInput — interaktif yildiz puanlama girisi.
 * Salt-gosterim Rating'den ayridir: tiklanabilir yildizlar, hover
 * onizleme, opsiyonel yarim yildiz (allowHalf) ve klavye destegi
 * (Ok tuslari, Home, End) sunar. role="slider" ile kontrollu
 * value/onValueChange semasi kullanir.
 * Dolap urun degerlendirme, Randevu uzman puanlama, GlowScan memnuniyet.
 */
"use client";

import * as React from "react";
import { Star } from "lucide-react";

import { cn, isRtl, logicalArrowKey } from "@/lib/utils";

type RatingInputSize = "sm" | "md" | "lg";

export interface RatingInputProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  > {
  /** Guncel puan degeri (0 - max arasi). */
  value: number;
  /** Deger degistiginde cagrilir. readOnly/disabled iken tetiklenmez. */
  onValueChange?: (value: number) => void;
  /** Maksimum yildiz sayisi. */
  max?: number;
  /** Yarim yildiz secimine izin ver (0.5 adim). */
  allowHalf?: boolean;
  /** Salt-gosterim: etkilesim kapali, deger degismez. */
  readOnly?: boolean;
  /** Tum kontrolu devre disi birakir. */
  disabled?: boolean;
  /** Yildiz boyutu. */
  size?: RatingInputSize;
  /** Erisilebilir etiket. */
  "aria-label"?: string;
}

const sizeClasses: Record<RatingInputSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function formatValue(value: number): string {
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 1 });
}

export const RatingInput = React.forwardRef<HTMLDivElement, RatingInputProps>(
  (
    {
      value,
      onValueChange,
      max = 5,
      allowHalf = false,
      readOnly = false,
      disabled = false,
      size = "md",
      className,
      onKeyDown,
      onMouseLeave,
      ...props
    },
    ref,
  ) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);
    const interactive = !readOnly && !disabled;
    const step = allowHalf ? 0.5 : 1;

    const displayValue = clamp(hoverValue ?? value, 0, max);
    const ariaLabel = props["aria-label"] ?? "Puanlama";

    const commit = (next: number) => {
      if (!interactive) return;
      onValueChange?.(clamp(next, 0, max));
    };

    const valueFromEvent = (
      index: number,
      event: React.MouseEvent<HTMLElement>,
    ) => {
      if (!allowHalf) return index + 1;
      const rect = event.currentTarget.getBoundingClientRect();
      // Yıldızın başlangıç yarısı (RTL'de sağ yarı) → yarım puan
      const fromStart = isRtl(event.currentTarget)
        ? rect.right - event.clientX
        : event.clientX - rect.left;
      return fromStart < rect.width / 2 ? index + 0.5 : index + 1;
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || !interactive) return;
      switch (logicalArrowKey(event.key, event.currentTarget)) {
        case "ArrowRight":
        case "ArrowUp":
          event.preventDefault();
          commit(value + step);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          event.preventDefault();
          commit(value - step);
          break;
        case "Home":
          event.preventDefault();
          commit(0);
          break;
        case "End":
          event.preventDefault();
          commit(max);
          break;
        default:
          break;
      }
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(event);
      setHoverValue(null);
    };

    return (
      <div
        ref={ref}
        role="slider"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${max} uzerinden ${formatValue(value)}`}
        aria-readonly={readOnly || undefined}
        aria-disabled={disabled || undefined}
        tabIndex={interactive ? 0 : -1}
        onKeyDown={handleKeyDown}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "inline-flex items-center gap-1 rounded-md outline-none pointer-coarse:min-h-11 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        {...props}
      >
        {Array.from({ length: max }, (_, index) => {
          const fraction = clamp(displayValue - index, 0, 1);
          return (
            <span
              key={index}
              className={cn(
                "relative inline-flex shrink-0",
                interactive ? "cursor-pointer" : "cursor-default",
              )}
              onMouseMove={
                interactive
                  ? (event) => setHoverValue(valueFromEvent(index, event))
                  : undefined
              }
              onClick={
                interactive
                  ? (event) => commit(valueFromEvent(index, event))
                  : undefined
              }
            >
              <Star
                aria-hidden="true"
                className={cn(
                  sizeClasses[size],
                  "text-muted-foreground/30 transition-colors duration-200",
                )}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
                style={{ width: `${fraction * 100}%` }}
              >
                <Star
                  className={cn(
                    sizeClasses[size],
                    "fill-current text-warning transition-colors duration-200",
                  )}
                />
              </span>
            </span>
          );
        })}
      </div>
    );
  },
);
RatingInput.displayName = "RatingInput";
