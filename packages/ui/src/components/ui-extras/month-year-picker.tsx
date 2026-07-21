"use client";
/**
 * MonthYearPicker — Ay-yil secici (gun yok).
 * Popover icinde 12 aylik grid + yil ileri/geri oklari; tetik butonu
 * secili donemi "Temmuz 2026" biciminde gosterir. Fisly aylik rapor ve
 * donem secimi icin controlled {year, month} (0-11) ile calisir.
 */
import * as React from "react";
import { CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface MonthYearPickerValue {
  /** Dort haneli yil, ornek 2026. */
  year: number;
  /** 0-11 arasi ay indeksi (0 = Ocak). */
  month: number;
}

export interface MonthYearPickerProps {
  /** Kontrollu secili donem. */
  value?: MonthYearPickerValue;
  /** Baslangic secimi (kontrolsuz kullanim). */
  defaultValue?: MonthYearPickerValue;
  onValueChange?: (value: MonthYearPickerValue) => void;
  /** Secilebilecek en kucuk yil. Varsayilan gecerli yil - 5. */
  minYear?: number;
  /** Secilebilecek en buyuk yil. Varsayilan gecerli yil + 5. */
  maxYear?: number;
  /** Secim yokken tetikte gorunen metin. */
  placeholder?: string;
  /** Statik onizleme icin popover'i acik baslatir. */
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
}

const MONTH_LABELS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
] as const;

const MONTH_SHORT = [
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
  "Haz",
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
] as const;

function formatValue(value: MonthYearPickerValue): string {
  return `${MONTH_LABELS[value.month] ?? ""} ${value.year}`;
}

const MonthYearPicker = React.forwardRef<HTMLButtonElement, MonthYearPickerProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      minYear,
      maxYear,
      placeholder = "Dönem seçin…",
      defaultOpen = false,
      disabled,
      className,
    },
    ref
  ) => {
    const currentYear = new Date().getFullYear();
    const lowerYear = minYear ?? currentYear - 5;
    const upperYear = maxYear ?? currentYear + 5;

    const [open, setOpen] = React.useState(defaultOpen);
    const [internalValue, setInternalValue] = React.useState<
      MonthYearPickerValue | undefined
    >(defaultValue);
    const selected = value ?? internalValue;

    const [displayYear, setDisplayYear] = React.useState(
      selected?.year ?? currentYear
    );

    // Popover her acildiginda gorunen yili secili donemle esitle.
    React.useEffect(() => {
      if (open) {
        setDisplayYear(selected?.year ?? currentYear);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const canGoPrev = displayYear > lowerYear;
    const canGoNext = displayYear < upperYear;

    const handleSelectMonth = (monthIndex: number) => {
      const next: MonthYearPickerValue = { year: displayYear, month: monthIndex };
      setInternalValue(next);
      onValueChange?.(next);
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            aria-haspopup="dialog"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "h-11 w-full justify-between font-normal tabular-nums",
              !selected && "text-muted-foreground",
              className
            )}
          >
            <span className="truncate">
              {selected ? formatValue(selected) : placeholder}
            </span>
            <CalendarRange
              className="ml-2 size-4 shrink-0 opacity-60"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          role="dialog"
          aria-label="Ay ve yıl seçici"
          className="w-72 p-3"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              disabled={!canGoPrev}
              onClick={() => setDisplayYear((y) => Math.max(lowerYear, y - 1))}
              aria-label="Önceki yıl"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </Button>
            <div
              className="text-sm font-semibold tabular-nums text-foreground"
              aria-live="polite"
            >
              {displayYear}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              disabled={!canGoNext}
              onClick={() => setDisplayYear((y) => Math.min(upperYear, y + 1))}
              aria-label="Sonraki yıl"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <div
            role="group"
            aria-label={`${displayYear} yılı ayları`}
            className="grid grid-cols-3 gap-1.5"
          >
            {MONTH_SHORT.map((label, index) => {
              const isSelected =
                selected?.year === displayYear && selected?.month === index;
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`${MONTH_LABELS[index]} ${displayYear}`}
                  onClick={() => handleSelectMonth(index)}
                  className={cn(
                    "flex h-10 items-center justify-center rounded-md text-sm font-medium transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background",
                    "active:scale-[0.97]",
                    isSelected
                      ? "bg-primary bg-sheen text-primary-foreground shadow hover:brightness-[1.06]"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);
MonthYearPicker.displayName = "MonthYearPicker";

export { MonthYearPicker, MONTH_LABELS as monthYearPickerMonths };
