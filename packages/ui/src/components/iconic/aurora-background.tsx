/**
 * AuroraBackground — animasyonlu mesh gradyan arka plan (imza atmosfer bileşeni).
 * Tema gradyan renklerinden yumuşak bir aurora bulutu yavaşça kayar; opsiyonel
 * grain dokusu üstüne eklenir. İçerik daima okunur biçimde ön katmanda durur.
 * Yakalamada animasyon donar; aurora katmanı yerleşik hâlde tam görünür.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface AuroraBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Aurora yoğunluğu (opaklık haritası). Varsayılan "vivid". */
  intensity?: "subtle" | "vivid";
  /** Üste ince grain/noise dokusu ekler. */
  grain?: boolean;
  /** Ön katman içeriği. */
  children?: React.ReactNode;
}

const intensityMap: Record<NonNullable<AuroraBackgroundProps["intensity"]>, string> =
  {
    subtle: "opacity-50",
    vivid: "opacity-90",
  };

export const AuroraBackground = React.forwardRef<
  HTMLDivElement,
  AuroraBackgroundProps
>(({ intensity = "vivid", grain = false, children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-aurora animate-aurora motion-reduce:animate-none blur-2xl",
          intensityMap[intensity],
        )}
      />
      {grain ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-grain opacity-[0.15] mix-blend-overlay"
        />
      ) : null}
      <div className="relative z-10">{children}</div>
    </div>
  );
});
AuroraBackground.displayName = "AuroraBackground";
