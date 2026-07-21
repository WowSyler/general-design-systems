/**
 * AspectRatio — Sabit en-boy orani kutusu (RADIX YOK, saf CSS `aspect-ratio`).
 * `ratio` prop'u sayi (16 / 9) veya string ("16/9", "4 / 3") kabul eder;
 * icerideki img/video/iframe alani tam doldurur (varsayilan object-cover).
 * `rounded` ve `overflow` opsiyonlari ile cerceve yumusatilir/kirpilir.
 * Dolap urun gorseli, GlowScan tarama karesi, DeployLens ekran goruntusu cercevesi.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const aspectRatioVariants = cva(
  "relative w-full [&>img]:size-full [&>video]:size-full [&>iframe]:size-full [&>iframe]:border-0",
  {
    variants: {
      /** Kose yuvarlatma kademesi. */
      rounded: {
        none: "",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        full: "rounded-full",
      },
      /** img/video icin dolgu davranisi. */
      fit: {
        cover: "[&>img]:object-cover [&>video]:object-cover",
        contain: "[&>img]:object-contain [&>video]:object-contain",
      },
      /** Tasan icerigin kirpilmasi. */
      overflow: {
        hidden: "overflow-hidden",
        visible: "overflow-visible",
      },
    },
    defaultVariants: {
      rounded: "lg",
      fit: "cover",
      overflow: "hidden",
    },
  }
);

export interface AspectRatioProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof aspectRatioVariants> {
  /** En-boy orani: sayi (16 / 9) ya da string ("16/9", "4 / 3"). Varsayilan 16/9. */
  ratio?: number | string;
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  (
    { ratio = 16 / 9, rounded, fit, overflow, className, style, children, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(aspectRatioVariants({ rounded, fit, overflow }), className)}
      style={{ aspectRatio: typeof ratio === "number" ? String(ratio) : ratio, ...style }}
      {...props}
    >
      {children}
    </div>
  )
);
AspectRatio.displayName = "AspectRatio";

export { AspectRatio, aspectRatioVariants };
