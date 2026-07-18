/**
 * CategoryBreakdown — Yatay cubuklu kategori dagilimi (Fisly).
 * Her satirda renkli nokta, etiket, yuzde ve deger; altinda CSS-only
 * ilerleme cubugu bulunur. Grafik butunu role="img" ile etiketlenir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type ChartColorIndex = 1 | 2 | 3 | 4 | 5;

export interface CategoryBreakdownItem {
  label: React.ReactNode;
  value: React.ReactNode;
  /** 0-100 arasi yuzde. */
  percent: number;
  colorIndex?: ChartColorIndex;
}

export interface CategoryBreakdownProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  items: CategoryBreakdownItem[];
  title?: React.ReactNode;
}

const dotColorClasses: Record<ChartColorIndex, string> = {
  1: "bg-chart-1",
  2: "bg-chart-2",
  3: "bg-chart-3",
  4: "bg-chart-4",
  5: "bg-chart-5",
};

const fillColorClasses: Record<ChartColorIndex, string> = {
  1: "bg-chart-1",
  2: "bg-chart-2",
  3: "bg-chart-3",
  4: "bg-chart-4",
  5: "bg-chart-5",
};

function resolveColorIndex(item: CategoryBreakdownItem, index: number): ChartColorIndex {
  return item.colorIndex ?? (((index % 5) + 1) as ChartColorIndex);
}

function describeItems(items: CategoryBreakdownItem[]): string {
  const parts = items.map((item, index) => {
    const label = typeof item.label === "string" ? item.label : `Kategori ${index + 1}`;
    return `${label} yuzde ${Math.round(item.percent)}`;
  });
  return `Kategori dagilimi: ${parts.join(", ")}`;
}

const CategoryBreakdown = React.forwardRef<HTMLDivElement, CategoryBreakdownProps>(
  ({ items, title, className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-3", className)} {...props}>
      {title ? <div className="text-sm font-medium text-foreground">{title}</div> : null}
      <div role="img" aria-label={describeItems(items)} className="space-y-3">
        {items.map((item, index) => {
          const colorIndex = resolveColorIndex(item, index);
          const clamped = Math.min(100, Math.max(0, item.percent));
          return (
            <div
              key={index}
              className="space-y-1.5 rounded-md hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm">
                <span
                  className={cn("size-2.5 shrink-0 rounded-full", dotColorClasses[colorIndex])}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate text-foreground">{item.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  %{Math.round(clamped)}
                </span>
                <span className="font-medium tabular-nums text-foreground">{item.value}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", fillColorClasses[colorIndex])}
                  style={{ width: `${clamped}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
);
CategoryBreakdown.displayName = "CategoryBreakdown";

export { CategoryBreakdown };
