/**
 * RangeCalendar — Inline iki-ay yan yana aralik takvimi (Randevu rezervasyon,
 * Fisly rapor donemi). Popover yoktur; ekrana dogrudan gomulur. Calendar
 * bileseninin mode=range, numberOfMonths=2 varyanti: secili aralik vurgulanir,
 * bicimlendirme date-fns + tr yerel ayari ile yapilir. Alt bilgi seridi secili
 * araligi ve gun sayisini ozetler. Kontrollu presentational bilesen
 * (value/onValueChange) — durumu tuketici tutar.
 */
import * as React from "react";
import { differenceInCalendarDays, format } from "date-fns";
import { tr, type Locale } from "date-fns/locale";
import { CalendarRange } from "lucide-react";
import type { DateRange, Matcher } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";

export interface RangeCalendarProps {
  /** Secili aralik (kontrollu deger). */
  value?: DateRange;
  /** Aralik degistiginde tetiklenir; range mode onSelect ile birebir. */
  onValueChange?: (range: DateRange | undefined) => void;
  /** Ilk gosterilecek ay; verilmezse araligin baslangicina atlar. */
  defaultMonth?: Date;
  /** Secilemez gunler (gecmis/gelecek, hafta sonu vb.). */
  disabled?: Matcher | Matcher[];
  /** Yan yana gosterilecek ay sayisi. */
  numberOfMonths?: number;
  /** Araligin en az gun sayisi (react-day-picker range kisiti). */
  min?: number;
  /** Araligin en fazla gun sayisi (react-day-picker range kisiti). */
  max?: number;
  locale?: Locale;
  /** Alt bilgideki gun formati (date-fns kalibi). */
  formatString?: string;
  /** Onceki/sonraki aya tasan gunleri gosterir. */
  showOutsideDays?: boolean;
  /** Secili araligi ozetleyen alt bilgi seridini gosterir. */
  showFooter?: boolean;
  /** Dis sarmalayiciya uygulanacak ek sinif. */
  className?: string;
  /** Yalnizca takvim kismina uygulanacak ek sinif. */
  calendarClassName?: string;
}

const RangeCalendar = React.forwardRef<HTMLDivElement, RangeCalendarProps>(
  (
    {
      value,
      onValueChange,
      defaultMonth,
      disabled,
      numberOfMonths = 2,
      min,
      max,
      locale = tr,
      formatString = "d MMM yyyy",
      showOutsideDays = true,
      showFooter = true,
      className,
      calendarClassName,
    },
    ref
  ) => {
    const from = value?.from;
    const to = value?.to;
    const dayCount = from && to ? differenceInCalendarDays(to, from) + 1 : 0;

    const label = from
      ? to
        ? `${format(from, formatString, { locale })} — ${format(to, formatString, {
            locale,
          })}`
        : `${format(from, formatString, { locale })} · bitis tarihini secin`
      : "Tarih araligi secilmedi";

    return (
      <div
        ref={ref}
        role="group"
        aria-label="Tarih araligi takvimi"
        className={cn(
          "inline-flex flex-col rounded-lg border border-border bg-card text-card-foreground shadow-sm",
          className
        )}
      >
        <Calendar
          mode="range"
          selected={value}
          onSelect={onValueChange}
          defaultMonth={defaultMonth ?? from}
          disabled={disabled}
          numberOfMonths={numberOfMonths}
          min={min}
          max={max}
          locale={locale}
          showOutsideDays={showOutsideDays}
          className={cn("p-3", calendarClassName)}
        />
        {showFooter ? (
          <>
            <Separator />
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
              <div
                className="flex items-center gap-2 text-sm"
                role="status"
                aria-live="polite"
              >
                <CalendarRange
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "font-medium tabular-nums",
                    !from && "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </div>
              {dayCount > 0 ? (
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium tabular-nums text-primary">
                  {dayCount} gun
                </span>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    );
  }
);
RangeCalendar.displayName = "RangeCalendar";

export { RangeCalendar };
