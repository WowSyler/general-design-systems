"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    // Erişilebilir ad verilmediyse varsayılan (aria-label/aria-labelledby ile ezilir)
    aria-label={props["aria-labelledby"] ? undefined : "İlerleme"}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      // RTL'de dolgu sağdan başlar (öteleme yönü aynalanır)
      className="h-full w-full flex-1 bg-brand-gradient transition-[width,transform] duration-200 [transform:translateX(calc(-1*var(--ds-progress-offset)))] rtl:[transform:translateX(var(--ds-progress-offset))]"
      style={{ "--ds-progress-offset": `${100 - (value || 0)}%` } as React.CSSProperties}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
