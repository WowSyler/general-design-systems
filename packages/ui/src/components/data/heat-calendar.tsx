/**
 * HeatCalendar — GitHub katki izgarasi tarzinda yogunluk takvimi.
 * 0-4 arasi yogunluk kademeleri hafta x 7 sutun akisiyla dizilir;
 * kademe renkleri bg-muted -> bg-primary literal haritasindan gelir.
 * Izgara role="img" ve ozet aria-label ile etiketlenir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type HeatLevel = 0 | 1 | 2 | 3 | 4;

export interface HeatCalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 0-4 arasi yogunluk degerleri; her 7 deger bir hafta sutunu olusturur. */
  values: number[];
  /** Gosterilecek hafta (sutun) sayisi. Varsayilan 12. */
  weeks?: number;
  /** Izgaranin ustunde gosterilen aciklama etiketi. */
  label?: string;
}

const levelClasses: Record<HeatLevel, string> = {
  0: "bg-muted",
  1: "bg-primary/25",
  2: "bg-primary/50",
  3: "bg-primary/75",
  4: "bg-primary",
};

const clampLevel = (value: number): HeatLevel => {
  if (value <= 0) return 0;
  if (value >= 4) return 4;
  return Math.round(value) as HeatLevel;
};

const HeatCalendar = React.forwardRef<HTMLDivElement, HeatCalendarProps>(
  ({ values, weeks = 12, label, className, ...props }, ref) => {
    const cells = values.slice(0, weeks * 7).map(clampLevel);
    const columns: HeatLevel[][] = [];
    for (let week = 0; week < weeks; week += 1) {
      const column = cells.slice(week * 7, week * 7 + 7);
      if (column.length === 0) break;
      columns.push(column);
    }

    const activeDays = cells.filter((level) => level > 0).length;
    const summary = `${label ?? "Yogunluk takvimi"}: ${columns.length} hafta, ${
      cells.length
    } gun, ${activeDays} aktif gun`;

    return (
      <div ref={ref} className={cn("inline-flex flex-col gap-2", className)} {...props}>
        {label ? (
          <span className="text-xs font-medium text-muted-foreground">
            {label}
          </span>
        ) : null}
        <div role="img" aria-label={summary} className="flex gap-1">
          {columns.map((column, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {column.map((level, dayIndex) => (
                <div
                  key={dayIndex}
                  className={cn("size-3 rounded-[3px]", levelClasses[level])}
                />
              ))}
            </div>
          ))}
        </div>
        <div
          className="flex items-center gap-1 text-[10px] text-muted-foreground"
          aria-hidden="true"
        >
          <span>Az</span>
          <div className="size-3 rounded-[3px] bg-muted" />
          <div className="size-3 rounded-[3px] bg-primary/25" />
          <div className="size-3 rounded-[3px] bg-primary/50" />
          <div className="size-3 rounded-[3px] bg-primary/75" />
          <div className="size-3 rounded-[3px] bg-primary" />
          <span>Çok</span>
        </div>
      </div>
    );
  }
);
HeatCalendar.displayName = "HeatCalendar";

export { HeatCalendar };
