"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    /** Her tutamaç için erişilebilir ad (aralık seçicide ["En düşük", "En yüksek"] gibi) */
    thumbLabels?: string[]
  }
>(({ className, thumbLabels, "aria-label": ariaLabel, ...props }, ref) => {
  // Değer dizisi kadar tutamaç: [min, max] aralık seçiciler de çalışır
  const count = (props.value ?? props.defaultValue ?? [props.min ?? 0]).length
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {Array.from({ length: Math.max(1, count) }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          aria-label={thumbLabels?.[i] ?? ariaLabel ?? (props["aria-labelledby"] ? undefined : "Değer")}
          className="touch-hitbox block h-4 w-4 rounded-full border border-primary/50 bg-background shadow-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
