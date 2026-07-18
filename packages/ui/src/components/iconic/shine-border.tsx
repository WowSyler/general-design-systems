/**
 * ShineBorder — animasyonlu gradyan kenarlık sarmalayıcı.
 * İnce (1.5px) bir çerçeve içinde tema gradyan renkleriyle akan bir
 * ışık şeridi (animate-shine-border) döner; iç yüzey düz kart zeminidir.
 * Randevu öne çıkan plan kartı gibi vurgulu içerikler için imza çerçeve.
 * prefers-reduced-motion'da animasyon durur (motion-reduce:animate-none).
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** İç yüzeyin köşe yarıçapı (px). Verilmezse rounded-2xl kullanılır. */
  radius?: number;
}

export const ShineBorder = React.forwardRef<HTMLDivElement, ShineBorderProps>(
  ({ radius, className, children, style, ...props }, ref) => (
    <div
      ref={ref}
      style={radius !== undefined ? { borderRadius: radius, ...style } : style}
      className={cn("relative overflow-hidden rounded-2xl p-[1.5px]", className)}
      {...props}
    >
      <div
        aria-hidden="true"
        style={radius !== undefined ? { borderRadius: radius } : undefined}
        className="absolute inset-0 rounded-2xl bg-[linear-gradient(110deg,transparent,hsl(var(--gradient-from)),hsl(var(--gradient-to)),transparent)] bg-[length:200%_100%] animate-shine-border motion-reduce:animate-none"
      />
      <div
        style={
          radius !== undefined
            ? { borderRadius: `calc(${radius}px - 1.5px)` }
            : undefined
        }
        className="relative rounded-[calc(1rem-1.5px)] bg-card p-6"
      >
        {children}
      </div>
    </div>
  ),
);
ShineBorder.displayName = "ShineBorder";
