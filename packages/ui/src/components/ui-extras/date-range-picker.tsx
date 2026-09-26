/**
 * DateRangePicker — Tarih araligi secici (Fisly rapor, DeployLens deploy filtresi).
 * Outline tetik butonda "baslangic — bitis" gosterir; Popover icinde solda
 * hazir kisayollar (Bugun, Son 7 gun, Son 30 gun, Bu ay, Gecen ay), sagda
 * mode=range Calendar bulunur. Bicimlendirme date-fns + tr yerel ayari ile yapilir.
 * Kontrollu (value/onValueChange) veya kontrolsuz (defaultValue) calisir.
 */
"use client";

import * as React from "react";
import {
  endOfMonth,
  format,
  isSameDay,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import { tr, type Locale } from "date-fns/locale";
import { CalendarRange, X } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/** Sol paneldeki hazir aralik kisayolu. Araligi tiklama aninda uretir. */
export interface DateRangePreset {
  label: string;
  getRange: () => DateRange;
}

/** Bugun'e gore hesaplanan varsayilan kisayollar (rapor ve deploy filtreleri icin). */
export const dateRangePickerPresets: DateRangePreset[] = [
  {
    label: "Bugun",
    getRange: () => {
      const today = startOfDay(new Date());
      return { from: today, to: today };
    },
  },
  {
    label: "Son 7 gun",
    getRange: () => ({
      from: startOfDay(subDays(new Date(), 6)),
      to: startOfDay(new Date()),
    }),
  },
  {
    label: "Son 30 gun",
    getRange: () => ({
      from: startOfDay(subDays(new Date(), 29)),
      to: startOfDay(new Date()),
    }),
  },
  {
    label: "Bu ay",
    getRange: () => ({
      from: startOfMonth(new Date()),
      to: startOfDay(new Date()),
    }),
  },
  {
    label: "Gecen ay",
    getRange: () => {
      const previous = subMonths(new Date(), 1);
      return { from: startOfMonth(previous), to: endOfMonth(previous) };
    },
  },
];

export interface DateRangePickerProps {
  /** Kontrollu deger. */
  value?: DateRange;
  /** Kontrolsuz baslangic degeri. */
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  /** Sol panelde gosterilecek kisayollar; bos dizi gecilirse panel gizlenir. */
  presets?: DateRangePreset[];
  placeholder?: string;
  /** Yan yana gosterilecek ay sayisi. */
  numberOfMonths?: number;
  /** Gun formati (date-fns kalibi). */
  formatString?: string;
  locale?: Locale;
  align?: React.ComponentProps<typeof PopoverContent>["align"];
  disabled?: boolean;
  /** Statik onizleme icin popover'i acik baslatir. */
  defaultOpen?: boolean;
  className?: string;
}

/** Iki araligin ayni takvim gunlerini kapsayip kapsamadigini karsilastirir. */
function isSameRange(a?: DateRange, b?: DateRange): boolean {
  if (!a?.from || !b?.from) return false;
  const sameFrom = isSameDay(a.from, b.from);
  const sameTo =
    a.to && b.to ? isSameDay(a.to, b.to) : a.to === undefined && b.to === undefined;
  return sameFrom && sameTo;
}

const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      presets = dateRangePickerPresets,
      placeholder = "Tarih araligi secin",
      numberOfMonths = 2,
      formatString = "d MMM yyyy",
      locale = tr,
      align = "start",
      disabled,
      defaultOpen = false,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const [internalRange, setInternalRange] = React.useState<DateRange | undefined>(
      defaultValue
    );
    const isControlled = value !== undefined;
    const currentRange = isControlled ? value : internalRange;

    const commit = (next: DateRange | undefined) => {
      if (!isControlled) setInternalRange(next);
      onValueChange?.(next);
    };

    const label = React.useMemo(() => {
      if (!currentRange?.from) return placeholder;
      const from = format(currentRange.from, formatString, { locale });
      if (!currentRange.to) return from;
      return `${from} — ${format(currentRange.to, formatString, { locale })}`;
    }, [currentRange, formatString, locale, placeholder]);

    const dayCount = React.useMemo(() => {
      if (!currentRange?.from || !currentRange.to) return 0;
      const start = startOfDay(currentRange.from).getTime();
      const end = startOfDay(currentRange.to).getTime();
      return Math.round((end - start) / 86_400_000) + 1;
    }, [currentRange]);

    const hasValue = Boolean(currentRange?.from);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            disabled={disabled}
            aria-label={hasValue ? `Secili aralik: ${label}` : placeholder}
            className={cn(
              "h-11 w-full sm:w-auto sm:min-w-60 justify-start gap-2 font-normal tabular-nums",
              !hasValue && "text-muted-foreground",
              className
            )}
          >
            <CalendarRange className="size-4 shrink-0 opacity-70" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align={align}
          className="w-auto p-0"
        >
          <div className="flex flex-col sm:flex-row">
            {presets.length > 0 ? (
              <div className="flex flex-col gap-1 border-b border-border/60 p-2 sm:w-40 sm:border-b-0 sm:border-e">
                <p className="px-2 pb-1 pt-1.5 text-xs font-medium text-muted-foreground">
                  Hizli secim
                </p>
                {presets.map((preset) => {
                  const presetRange = preset.getRange();
                  const active = isSameRange(currentRange, presetRange);
                  return (
                    <Button
                      key={preset.label}
                      variant={active ? "secondary" : "ghost"}
                      size="sm"
                      className="justify-start font-normal"
                      aria-pressed={active}
                      onClick={() => commit(presetRange)}
                    >
                      {preset.label}
                    </Button>
                  );
                })}
              </div>
            ) : null}
            <div className="flex flex-col">
              <Calendar
                mode="range"
                selected={currentRange}
                onSelect={commit}
                numberOfMonths={numberOfMonths}
                defaultMonth={currentRange?.from ?? new Date()}
                locale={locale}
                autoFocus
              />
              <Separator />
              <div className="flex items-center justify-between gap-2 p-2">
                <span className="ps-1 text-xs text-muted-foreground tabular-nums">
                  {dayCount > 0
                    ? `${dayCount} gun secili`
                    : "Aralik secilmedi"}
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!hasValue}
                    onClick={() => commit(undefined)}
                  >
                    <X className="size-3.5" aria-hidden="true" />
                    Temizle
                  </Button>
                  <Button
                    size="sm"
                    disabled={!currentRange?.to}
                    onClick={() => setOpen(false)}
                  >
                    Uygula
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);
DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker };
