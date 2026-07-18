/**
 * TiltCard — hover'da 3B perspektif eğim kartı.
 * Fare hareketiyle en fazla ±8° rotateX/rotateY uygulanır; imleç ayrılınca
 * düz konuma döner. Varsayılan/durağan render DÜZ'dür (rotate 0), bu yüzden
 * statik yakalamada anlamlı görünür. prefers-reduced-motion'da eğim devre dışı.
 * Tema-agnostik: yalnızca semantik tokenlar kullanılır.
 */
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/** İzin verilen en yüksek eğim açısı (derece). */
const MAX_TILT = 8;

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Üst yüzeyde ince bir ışık (glare) katmanı gösterir. */
  glare?: boolean;
}

export const TiltCard = React.forwardRef<HTMLDivElement, TiltCardProps>(
  (
    { glare = false, className, children, onMouseMove, onMouseLeave, ...props },
    ref,
  ) => {
    const handleMouseMove = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        onMouseMove?.(event);
        if (
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          return;
        }
        const el = event.currentTarget;
        const rect = el.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 2 * MAX_TILT;
        const rotateX = -(py - 0.5) * 2 * MAX_TILT;
        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      },
      [onMouseMove],
    );

    const handleMouseLeave = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        onMouseLeave?.(event);
        event.currentTarget.style.transform = "";
      },
      [onMouseLeave],
    );

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "group relative rounded-2xl border bg-card p-6 shadow-md transition-transform duration-200 [transform-style:preserve-3d] will-change-transform",
          className,
        )}
        {...props}
      >
        <div className="relative z-10">{children}</div>
        {glare ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-2xl bg-sheen opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          />
        ) : null}
      </div>
    );
  },
);
TiltCard.displayName = "TiltCard";
