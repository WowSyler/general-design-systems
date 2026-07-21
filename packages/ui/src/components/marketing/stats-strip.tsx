/**
 * StatsStrip — istatistik seridi.
 * Buyuk deger + etiket ciftlerini yatay bir serit halinde sunar.
 * "gradient" varyanti marka gradyanli, yuvarlatilmis bir panel cizer.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface StatsStripItem {
  /** Buyuk gosterilen deger (or. "12K+"). */
  value: React.ReactNode;
  /** Degerin altindaki aciklama etiketi. */
  label: React.ReactNode;
}

export type StatsStripVariant = "plain" | "gradient";

export interface StatsStripProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Istatistik ogeleri. */
  items: StatsStripItem[];
  /** Gorunum varyanti. */
  variant?: StatsStripVariant;
}

const rootVariantClasses: Record<StatsStripVariant, string> = {
  plain: "py-8",
  gradient: "rounded-2xl bg-brand-gradient p-8 text-primary-foreground shadow-lg",
};

const listVariantClasses: Record<StatsStripVariant, string> = {
  plain: "md:divide-border",
  gradient: "md:divide-primary-foreground/20",
};

const labelVariantClasses: Record<StatsStripVariant, string> = {
  plain: "text-muted-foreground",
  gradient: "opacity-80",
};

export const StatsStrip = React.forwardRef<HTMLDivElement, StatsStripProps>(
  ({ items, variant = "plain", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(rootVariantClasses[variant], className)}
        {...props}
      >
        <dl
          className={cn(
            "flex flex-col gap-8 md:flex-row md:gap-0 md:divide-x",
            listVariantClasses[variant],
          )}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-1 flex-col items-center gap-1 text-center md:px-8"
            >
              <dd className="font-display text-4xl font-bold tracking-tight">
                {item.value}
              </dd>
              <dt className={cn("text-sm", labelVariantClasses[variant])}>
                {item.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    );
  },
);
StatsStrip.displayName = "StatsStrip";
