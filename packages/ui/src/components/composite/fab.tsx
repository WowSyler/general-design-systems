/**
 * Fab — Yüzen aksiyon butonu.
 * Ekranın birincil aksiyonunu (ör. fiş tarama) parlayan yuvarlak bir
 * butonla sunar; label verildiğinde genişleyen (extended) forma geçer.
 */
import * as React from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export interface FabProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  /** Verilirse buton genişler ve metin gösterir (extended fab). */
  label?: string;
  position?: "static" | "bottom-right";
}

const positionClasses: Record<NonNullable<FabProps["position"]>, string> = {
  static: "",
  "bottom-right": "fixed bottom-6 right-6 z-50",
};

const Fab = React.forwardRef<HTMLButtonElement, FabProps>(
  ({ icon, label, position = "static", className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-primary font-medium text-primary-foreground shadow-glow transition-all duration-200 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 disabled:pointer-events-none disabled:opacity-50",
        label ? "h-14 px-6" : "size-14",
        positionClasses[position],
        className
      )}
      {...props}
    >
      <span className="flex size-6 items-center justify-center" aria-hidden="true">
        {icon ?? <Plus className="size-6" />}
      </span>
      {label ? <span>{label}</span> : null}
    </button>
  )
);
Fab.displayName = "Fab";

export { Fab };
