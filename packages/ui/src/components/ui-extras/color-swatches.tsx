/**
 * ColorSwatches — Renk yuvası seçici.
 * Ürün verisi olan renkleri (hex) yuvarlak yuvalar halinde sunar;
 * seçili yuvada ring vurgusu ve zıt renkli Check işareti gösterir.
 */
import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ColorSwatchItem {
  /** Hex renk değeri — ürün verisidir, tema tokenı değildir. */
  value: string;
  label: string;
}

export interface ColorSwatchesProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onToggle"> {
  colors: ColorSwatchItem[];
  selected?: string[];
  onToggle?: (value: string) => void;
  size?: "sm" | "md";
}

const sizeClasses: Record<NonNullable<ColorSwatchesProps["size"]>, string> = {
  sm: "size-9",
  md: "size-11",
};

const iconSizeClasses: Record<
  NonNullable<ColorSwatchesProps["size"]>,
  string
> = {
  sm: "size-4",
  md: "size-5",
};

/** Hex rengin açık mı koyu mu olduğuna göre zıt işaret rengi döndürür. */
function contrastColor(hex: string): string {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1a1a1a" : "#ffffff";
}

const ColorSwatches = React.forwardRef<HTMLDivElement, ColorSwatchesProps>(
  (
    { colors, selected = [], onToggle, size = "md", className, ...props },
    ref
  ) => (
    <div
      ref={ref}
      role="group"
      aria-label="Renk seçimi"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      {colors.map((color) => {
        const isSelected = selected.includes(color.value);
        return (
          <button
            key={color.value}
            type="button"
            aria-pressed={isSelected}
            aria-label={color.label}
            title={color.label}
            onClick={() => onToggle?.(color.value)}
            className={cn(
              "flex items-center justify-center rounded-full border pointer-coarse:min-h-11 pointer-coarse:min-w-11 border-border/50 transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              sizeClasses[size],
              isSelected && "ring-2 ring-ring ring-offset-2 ring-offset-background"
            )}
            style={{ backgroundColor: color.value }}
          >
            {isSelected ? (
              <Check
                className={cn(iconSizeClasses[size], "drop-shadow-sm")}
                style={{ color: contrastColor(color.value) }}
                aria-hidden="true"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  )
);
ColorSwatches.displayName = "ColorSwatches";

export { ColorSwatches };
