/**
 * CompareSlider — Once/sonra karsilastirma gorunumu.
 * Iki icerik katmanini statik bir yuzde konumunda dikey ayirici ile
 * yan yana gosterir; once katmani inline clipPath ile kirpilir.
 * DeployLens gorsel diff karsilastirmalari icin tasarlanmistir.
 */
import * as React from "react";
import { ChevronsLeftRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CompareSliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Sol tarafta (kirpilan katman) gosterilen icerik. */
  before: React.ReactNode;
  /** Sag tarafta (zemin katmani) gosterilen icerik. */
  after: React.ReactNode;
  /** Ayirici cizginin statik yuzde konumu (0-100). Varsayilan 50. */
  position?: number;
  beforeLabel?: string;
  afterLabel?: string;
}

const CompareSlider = React.forwardRef<HTMLDivElement, CompareSliderProps>(
  (
    {
      before,
      after,
      position = 50,
      beforeLabel = "Önce",
      afterLabel = "Sonra",
      className,
      ...props
    },
    ref
  ) => {
    const clamped = Math.min(100, Math.max(0, position));

    return (
      <div
        ref={ref}
        role="group"
        aria-label={`${beforeLabel} / ${afterLabel} karşılaştırması`}
        className={cn(
          "relative overflow-hidden rounded-xl border shadow-md",
          className
        )}
        {...props}
      >
        {/* Zemin katmani: sonra */}
        <div className="absolute inset-0">{after}</div>
        {/* Kirpilan katman: once */}
        <div
          className="relative"
          style={{ clipPath: `inset(0 ${100 - clamped}% 0 0)` }}
        >
          {before}
        </div>
        {/* Dikey ayirici */}
        <div
          className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-background shadow"
          style={{ left: `${clamped}%` }}
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-lg"
          style={{ left: `${clamped}%` }}
          aria-hidden="true"
        >
          <ChevronsLeftRight className="size-4 text-muted-foreground" />
        </div>
        {/* Kose rozetleri */}
        <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium backdrop-blur">
          {beforeLabel}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium backdrop-blur">
          {afterLabel}
        </span>
      </div>
    );
  }
);
CompareSlider.displayName = "CompareSlider";

export { CompareSlider };
