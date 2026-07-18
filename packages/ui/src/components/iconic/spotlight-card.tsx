/**
 * SpotlightCard — imleç takipli radyal glow kartı (Linear/Vercel imzası).
 * Fare hareketiyle --spot-x/--spot-y CSS değişkenleri güncellenir ve
 * hover'da primary tonlu bir radyal ışık imleci takip eder. Durağan
 * (yakalama) hâlinde sağ-üstte her zaman görünür hafif bir glow kalır.
 * Tema-agnostik: yalnızca semantik primary tonları kullanılır.
 */
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type SpotlightCardProps = React.HTMLAttributes<HTMLDivElement>;

export const SpotlightCard = React.forwardRef<
  HTMLDivElement,
  SpotlightCardProps
>(({ className, children, onMouseMove, style, ...props }, ref) => {
  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty(
        "--spot-x",
        `${event.clientX - rect.left}px`,
      );
      event.currentTarget.style.setProperty(
        "--spot-y",
        `${event.clientY - rect.top}px`,
      );
      onMouseMove?.(event);
    },
    [onMouseMove],
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      style={
        {
          "--spot-x": "50%",
          "--spot-y": "0%",
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-6",
        className,
      )}
      {...props}
    >
      {/* Varsayılan durağan glow: sağ-üstte her zaman görünür — statik yakalamada da vardır. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/5 blur-2xl"
      />
      {/* İmleç takipli glow: yalnızca hover'da belirir. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(200px circle at var(--spot-x) var(--spot-y), hsl(var(--primary) / 0.18), transparent 60%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
});
SpotlightCard.displayName = "SpotlightCard";
