/**
 * Marquee — sonsuz kayan şerit (imza hareket bileşeni).
 * children kesintisiz döngü için iki kez render edilir; tek animasyonlu şerit
 * -%50 kayarak ikinci kopyayı ilk kopyanın yerine getirir. Yatay/dikey kayar,
 * hover'da duraklar, kenarlar maske ile yumuşatılır.
 * Yakalamada animasyon donar; şeridin ilk kopyası tam görünür kalır.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Kayma süresi (CSS süre değeri, ör. "20s"). Küçük değer = hızlı. */
  speed?: string;
  /** Ters yönde kaydırır. */
  reverse?: boolean;
  /** Dikey kaydırma modu. */
  vertical?: boolean;
  /** Hover'da duraklat (varsayılan true). */
  pauseOnHover?: boolean;
  /** Kayan içerik. */
  children: React.ReactNode;
}

const maskMap: Record<"horizontal" | "vertical", string> = {
  horizontal:
    "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
  vertical:
    "[mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]",
};

const animationMap: Record<"horizontal" | "vertical", string> = {
  horizontal: "animate-marquee",
  vertical: "animate-marquee-vertical",
};

export const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      speed,
      reverse = false,
      vertical = false,
      pauseOnHover = true,
      children,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const axis = vertical ? "vertical" : "horizontal";

    const copyClassName = cn(
      "flex shrink-0 items-center gap-8",
      vertical && "flex-col",
    );

    return (
      <div
        ref={ref}
        className={cn(
          "group flex overflow-hidden [--marquee-duration:30s]",
          vertical ? "flex-col" : "flex-row",
          maskMap[axis],
          className,
        )}
        style={
          speed
            ? ({ ...style, ["--marquee-duration"]: speed } as React.CSSProperties)
            : style
        }
        {...props}
      >
        <div
          className={cn(
            "flex shrink-0 items-center gap-8 motion-reduce:animate-none",
            vertical && "flex-col",
            animationMap[axis],
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
        >
          <div className={copyClassName}>{children}</div>
          <div className={copyClassName} aria-hidden="true">
            {children}
          </div>
        </div>
      </div>
    );
  },
);
Marquee.displayName = "Marquee";
