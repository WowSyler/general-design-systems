"use client";

/**
 * DatePicker — Tek tarih secici (Randevu/Fisly tarih alanlari icin).
 * Outline input-tetik butonu (Calendar ikonu + secili tarihi date-fns TR
 * locale ile bicimler, "Tarih secin" placeholder) -> Popover icinde mevcut
 * Calendar bileseni. min/max sinirlar ve ozel gun devre disi birakma
 * destegi. Controlled `value` + `onChange` (kontrolsuz `defaultValue` de
 * desteklenir).
 */
import * as React from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import type { Matcher } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerProps {
  /** Kontrollu secili tarih. */
  value?: Date;
  /** Kontrolsuz baslangic tarihi. */
  defaultValue?: Date;
  /** Secim degistiginde tetiklenir; temizlenirse `undefined` gelir. */
  onChange?: (date: Date | undefined) => void;
  /** date-fns bicim dizesi (varsayilan "d MMMM yyyy" -> 19 Temmuz 2026). */
  dateFormat?: string;
  placeholder?: string;
  /** Bu tarihten oncesi secilemez. */
  minDate?: Date;
  /** Bu tarihten sonrasi secilemez. */
  maxDate?: Date;
  /** Ek olarak devre disi birakilacak gun(ler). */
  disabledDates?: Matcher | Matcher[];
  /** Tetik butonunu tamamen devre disi birakir. */
  disabled?: boolean;
  /** Statik onizleme icin takvimi acik baslatir. */
  defaultOpen?: boolean;
  /** Erisilebilirlik icin buton etiketi. */
  "aria-label"?: string;
  className?: string;
}

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      dateFormat = "d MMMM yyyy",
      placeholder = "Tarih secin",
      minDate,
      maxDate,
      disabledDates,
      disabled,
      defaultOpen = false,
      "aria-label": ariaLabel,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const [internalDate, setInternalDate] = React.useState<Date | undefined>(
      value ?? defaultValue
    );
    const selectedDate = value !== undefined ? value : internalDate;

    const disabledMatchers = React.useMemo<Matcher[]>(() => {
      const matchers: Matcher[] = [];
      if (minDate) matchers.push({ before: minDate });
      if (maxDate) matchers.push({ after: maxDate });
      if (disabledDates) {
        matchers.push(
          ...(Array.isArray(disabledDates) ? disabledDates : [disabledDates])
        );
      }
      return matchers;
    }, [minDate, maxDate, disabledDates]);

    const handleSelect = (next: Date | undefined) => {
      setInternalDate(next);
      onChange?.(next);
      if (next) setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-label={
              ariaLabel ??
              (selectedDate
                ? format(selectedDate, dateFormat, { locale: tr })
                : placeholder)
            }
            className={cn(
              "h-11 w-full justify-start gap-2 font-normal",
              !selectedDate && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="size-4 shrink-0 opacity-70" aria-hidden="true" />
            <span className="truncate tabular-nums">
              {selectedDate
                ? format(selectedDate, dateFormat, { locale: tr })
                : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            locale={tr}
            autoFocus
            selected={selectedDate}
            onSelect={handleSelect}
            defaultMonth={selectedDate ?? minDate}
            startMonth={minDate}
            endMonth={maxDate}
            disabled={disabledMatchers.length ? disabledMatchers : undefined}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
DatePicker.displayName = "DatePicker";

export { DatePicker };
