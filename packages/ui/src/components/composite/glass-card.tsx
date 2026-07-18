/**
 * GlassCard — glassmorphism kart.
 * Gradyan arka planlar (or. GradientHero) uzerinde yari saydam,
 * bulanik cam efektli icerik kutusu saglar.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Bulaniklik yogunlugu. */
  intensity?: "sm" | "md";
}

const intensityClasses: Record<"sm" | "md", string> = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
};

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ intensity = "md", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-white/20 bg-white/10 p-4",
        intensityClasses[intensity],
        className,
      )}
      {...props}
    />
  ),
);
GlassCard.displayName = "GlassCard";
