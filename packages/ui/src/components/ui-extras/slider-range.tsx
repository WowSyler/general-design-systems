"use client";

/**
 * SliderRange — Cift-thumb aralik kaydiricisi.
 * Radix Slider'i iki-degerli kullanir: value [min, max] seklinde bir demet,
 * iki thumb arasindaki secili bolge bg-primary ile vurgulanir (dolgu). Alt
 * uclarda min/max sinir etiketleri gosterilir (showBounds); istege bagli
 * olarak her thumb uzerinde formatlanmis deger baloncuklari belirir
 * (showBubbles). formatValue ile deger bicimi ozellestirilir (or. "1.200 ₺",
 * "%40"). Export adlari SliderRange-onekli, mevcut Slider ile cakismaz.
 * Kullanim: Dolap fiyat araligi filtresi, Fisly tutar araligi, GlowScan
 * esik/threshold secimi gibi iki-uclu aralik girisleri.
 */
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

/** [alt sinir, ust sinir] demeti. */
type SliderRangeValue = [number, number];

export interface SliderRangeProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    "value" | "defaultValue" | "onValueChange"
  > {
  /** Kontrollu deger: [alt, ust]. */
  value?: SliderRangeValue;
  /** Kontrolsuz baslangic degeri: [alt, ust]. */
  defaultValue?: SliderRangeValue;
  /** Deger degistiginde [alt, ust] demeti ile cagrilir. */
  onValueChange?: (value: SliderRangeValue) => void;
  /** Etiket ve baloncuklar icin deger bicimleyici (or. TL, %). */
  formatValue?: (value: number) => string;
  /** Thumb'larin uzerinde secili degeri baloncukta gosterir. */
  showBubbles?: boolean;
  /** Alt uclarda min/max sinir etiketlerini gosterir. Varsayilan true. */
  showBounds?: boolean;
}

const thumbLabels: readonly [string, string] = ["Alt sınır", "Üst sınır"];

const SliderRange = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderRangeProps
>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      minStepsBetweenThumbs = 1,
      formatValue,
      showBubbles = false,
      showBounds = true,
      disabled,
      ...props
    },
    ref
  ) => {
    const format = React.useCallback(
      (v: number) =>
        formatValue ? formatValue(v) : v.toLocaleString("tr-TR"),
      [formatValue]
    );

    const [internal, setInternal] = React.useState<SliderRangeValue>(
      value ?? defaultValue ?? [min, max]
    );
    const current = value ?? internal;

    const handleValueChange = (next: number[]) => {
      const tuple: SliderRangeValue = [next[0] ?? min, next[1] ?? max];
      setInternal(tuple);
      onValueChange?.(tuple);
    };

    return (
      <div className={cn("w-full", showBubbles && "pt-9", className)}>
        <SliderPrimitive.Root
          ref={ref}
          className="relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50"
          value={current}
          min={min}
          max={max}
          step={step}
          minStepsBetweenThumbs={minStepsBetweenThumbs}
          onValueChange={handleValueChange}
          disabled={disabled}
          {...props}
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          {thumbLabels.map((label, index) => (
            <SliderPrimitive.Thumb
              key={label}
              aria-label={label}
              className="group relative block size-4 rounded-full touch-hitbox border border-primary/50 bg-background shadow-md transition-[transform,box-shadow] duration-200 hover:scale-110 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50"
            >
              {showBubbles ? (
                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-xs font-medium tabular-nums text-primary-foreground shadow-md">
                  {format(current[index] ?? 0)}
                </span>
              ) : null}
            </SliderPrimitive.Thumb>
          ))}
        </SliderPrimitive.Root>
        {showBounds ? (
          <div className="mt-2 flex items-center justify-between text-xs tabular-nums text-muted-foreground">
            <span>{format(min)}</span>
            <span>{format(max)}</span>
          </div>
        ) : null}
      </div>
    );
  }
);
SliderRange.displayName = "SliderRange";

export { SliderRange };
export type { SliderRangeValue };
