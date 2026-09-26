/**
 * WeekCalendar — haftalik randevu takvimi gorunumu.
 * Salt-okunur CSS grid: zaman kolonu + gun kolonlari; randevular durumlarina
 * gore yumusak renklerle, dakika bazli konumlandirilarak gosterilir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export type WeekCalendarEventStatus =
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled"
  | "noshow";

export interface WeekCalendarDay {
  key: string;
  label: React.ReactNode;
}

export interface WeekCalendarEvent {
  id: string;
  dayKey: string;
  /** Gun baslangicindan (00:00) itibaren dakika. */
  startMinutes: number;
  durationMinutes: number;
  title: React.ReactNode;
  status?: WeekCalendarEventStatus;
}

export interface WeekCalendarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Gun kolonlari (or. 7 gun). */
  days: WeekCalendarDay[];
  /** Gorunen ilk saat. */
  startHour?: number;
  /** Gorunen son saat. */
  endHour?: number;
  /** Satir araligi (dakika). */
  slotMinutes?: 30 | 60;
  /** Gosterilecek randevular. */
  events: WeekCalendarEvent[];
  /** Randevuya tiklandiginda cagrilir. */
  onEventClick?: (id: string) => void;
}

const statusClasses: Record<WeekCalendarEventStatus, string> = {
  confirmed: "border-info/30 bg-info/15 text-info",
  pending: "border-warning/30 bg-warning/15 text-warning",
  completed: "border-success/30 bg-success/15 text-success",
  cancelled: "border-border bg-muted text-muted-foreground line-through",
  noshow: "border-destructive/30 bg-destructive/15 text-destructive",
};

const SLOT_ROW_HEIGHT = 48;

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

export const WeekCalendar = React.forwardRef<HTMLDivElement, WeekCalendarProps>(
  (
    {
      days,
      startHour = 8,
      endHour = 20,
      slotMinutes = 60,
      events,
      onEventClick,
      className,
      ...props
    },
    ref,
  ) => {
    const totalMinutes = (endHour - startHour) * 60;
    const slotCount = Math.max(1, Math.floor(totalMinutes / slotMinutes));
    const bodyHeight = slotCount * SLOT_ROW_HEIGHT;
    const pxPerMinute = SLOT_ROW_HEIGHT / slotMinutes;

    const gridTemplateColumns = `4rem repeat(${days.length}, minmax(8rem, 1fr))`;

    return (
      <div
        ref={ref}
        className={cn("relative overflow-x-auto rounded-lg border bg-card", className)}
        {...props}
      >
        <div className="min-w-max">
          {/* Baslik satiri */}
          <div className="grid border-b" style={{ gridTemplateColumns }}>
            <div />
            {days.map((day) => (
              <div
                key={day.key}
                className="border-s px-2 py-2 text-center text-sm font-medium"
              >
                {day.label}
              </div>
            ))}
          </div>
          {/* Govde */}
          <div className="grid" style={{ gridTemplateColumns }}>
            {/* Zaman kolonu */}
            <div className="relative" style={{ height: bodyHeight }}>
              {Array.from({ length: slotCount }, (_, index) => {
                const minutes = index * slotMinutes;
                const isHourStart = minutes % 60 === 0;
                return (
                  <div
                    key={index}
                    className="flex items-start justify-end pe-2"
                    style={{ height: SLOT_ROW_HEIGHT }}
                  >
                    {isHourStart ? (
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {formatHour(startHour + minutes / 60)}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {/* Gun kolonlari */}
            {days.map((day) => {
              const dayEvents = events.filter(
                (event) => event.dayKey === day.key,
              );
              return (
                <div
                  key={day.key}
                  className="relative border-s"
                  style={{ height: bodyHeight }}
                >
                  {/* Saat cizgileri */}
                  {Array.from({ length: slotCount }, (_, index) => (
                    <div
                      key={index}
                      className="border-b border-border/50"
                      style={{ height: SLOT_ROW_HEIGHT }}
                    />
                  ))}
                  {/* Randevular */}
                  {dayEvents.map((event) => {
                    const top =
                      (event.startMinutes - startHour * 60) * pxPerMinute;
                    const height = event.durationMinutes * pxPerMinute;
                    const status = event.status ?? "confirmed";
                    const eventClassName = cn(
                      "absolute inset-x-1 overflow-hidden rounded-md border px-2 py-1 text-start text-xs shadow-sm hover:shadow transition-shadow",
                      statusClasses[status],
                    );
                    const eventStyle: React.CSSProperties = {
                      top,
                      height,
                    };
                    return onEventClick ? (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => onEventClick(event.id)}
                        className={cn(
                          eventClassName,
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        )}
                        style={eventStyle}
                      >
                        {event.title}
                      </button>
                    ) : (
                      <div
                        key={event.id}
                        className={eventClassName}
                        style={eventStyle}
                      >
                        {event.title}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);
WeekCalendar.displayName = "WeekCalendar";
