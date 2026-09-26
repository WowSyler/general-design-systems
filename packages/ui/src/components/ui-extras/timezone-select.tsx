"use client";

/**
 * TimezoneSelect — Aranabilir saat dilimi secici.
 * Popover + Command bilesimi ile IANA saat dilimlerini listeler;
 * her satirda bolge adi, UTC ofseti ve yerel saat onizlemesi bulunur.
 * Varsayilan olarak tarayicinin saat dilimi (Intl) secili gelir ve
 * onizleme saatleri canli tiklar. "appointment-global" akisinda Randevu
 * icin farkli sehirlerdeki musaitlik saatlerini hizalamada kullanilir.
 * Ofset ve yerel saat Intl.DateTimeFormat ile hesaplanir; ekstra bagimlilik yoktur.
 */
import * as React from "react";
import { Check, ChevronsUpDown, Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface TimezoneSelectOption {
  /** IANA saat dilimi kimligi, orn. "Europe/Istanbul". */
  value: string;
  /** Gorunen bolge/sehir adi. Verilmezse kimlikten uretilir. */
  label?: string;
  /** Ulke veya aciklama satiri (opsiyonel). */
  description?: string;
}

export interface TimezoneSelectProps {
  /** Listelenecek saat dilimleri. Verilmezse kuresel bir on tanimli set kullanilir. */
  timezones?: TimezoneSelectOption[];
  /** Kontrollu deger (IANA kimligi). */
  value?: string;
  /** Baslangic degeri. Verilmezse tarayici saat dilimi secilir. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  /** Statik onizleme icin listeyi acik baslatir. */
  defaultOpen?: boolean;
  disabled?: boolean;
  /** Onizleme saatlerini periyodik gunceller. Varsayilan true. */
  liveClock?: boolean;
  /** Deterministik onizleme icin sabit referans tarih (canli tiklamayi kapatir). */
  referenceDate?: Date;
  /** Listeyi UTC ofsetine gore artan sirala. Varsayilan true. */
  sortByOffset?: boolean;
  className?: string;
}

/** Kuresel Randevu akislari icin dengeli bir on tanimli saat dilimi seti. */
export const timezoneSelectPresets: TimezoneSelectOption[] = [
  { value: "Pacific/Honolulu", label: "Honolulu", description: "ABD, Hawaii" },
  { value: "America/Los_Angeles", label: "Los Angeles", description: "ABD, Pasifik" },
  { value: "America/Chicago", label: "Sikago", description: "ABD, Merkez" },
  { value: "America/New_York", label: "New York", description: "ABD, Dogu" },
  { value: "America/Sao_Paulo", label: "Sao Paulo", description: "Brezilya" },
  { value: "Europe/London", label: "Londra", description: "Birlesik Krallik" },
  { value: "Europe/Paris", label: "Paris", description: "Fransa" },
  { value: "Europe/Berlin", label: "Berlin", description: "Almanya" },
  { value: "Europe/Istanbul", label: "Istanbul", description: "Turkiye" },
  { value: "Europe/Moscow", label: "Moskova", description: "Rusya" },
  { value: "Asia/Dubai", label: "Dubai", description: "BAE" },
  { value: "Asia/Kolkata", label: "Yeni Delhi", description: "Hindistan" },
  { value: "Asia/Shanghai", label: "Sanghay", description: "Cin" },
  { value: "Asia/Tokyo", label: "Tokyo", description: "Japonya" },
  { value: "Asia/Singapore", label: "Singapur", description: "Singapur" },
  { value: "Australia/Sydney", label: "Sidney", description: "Avustralya" },
  { value: "Pacific/Auckland", label: "Auckland", description: "Yeni Zelanda" },
  { value: "UTC", label: "UTC", description: "Koordinatli Evrensel Zaman" },
];

/** Tarayicinin cozumlenmis saat dilimini dondurur; erisilemezse "UTC". */
export function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/** Kimlikten okunabilir bir etiket uretir: "Europe/Istanbul" -> "Istanbul". */
function labelFromValue(value: string): string {
  const last = value.split("/").pop() ?? value;
  return last.replace(/_/g, " ");
}

/** Verilen saat diliminin, referans ana gore UTC ofsetini dakika cinsinden hesaplar. */
function offsetMinutes(timeZone: string, date: Date): number {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(date);
    const read = (type: Intl.DateTimeFormatPartTypes): number => {
      const found = parts.find((part) => part.type === type);
      return found ? Number(found.value) : 0;
    };
    const hour = read("hour");
    const asUtc = Date.UTC(
      read("year"),
      read("month") - 1,
      read("day"),
      hour === 24 ? 0 : hour,
      read("minute"),
      read("second")
    );
    return Math.round((asUtc - date.getTime()) / 60000);
  } catch {
    return 0;
  }
}

/** Dakika ofsetini "UTC+03:00" bicimine cevirir. */
function formatOffset(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${hh}:${mm}`;
}

/** Ilgili saat dilimindeki yerel saati "SS:DD" olarak dondurur. */
function formatLocalTime(timeZone: string, date: Date): string {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return "--:--";
  }
}

interface EnrichedZone {
  value: string;
  label: string;
  description?: string;
  offset: number;
  offsetLabel: string;
  localTime: string;
}

const TimezoneSelect = React.forwardRef<HTMLButtonElement, TimezoneSelectProps>(
  (
    {
      timezones = timezoneSelectPresets,
      value,
      defaultValue,
      onValueChange,
      placeholder = "Saat dilimi secin...",
      searchPlaceholder = "Sehir veya bolge ara...",
      emptyMessage = "Saat dilimi bulunamadi.",
      defaultOpen = false,
      disabled,
      liveClock = true,
      referenceDate,
      sortByOffset = true,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const [internalValue, setInternalValue] = React.useState(
      () => defaultValue ?? getBrowserTimezone()
    );
    const [now, setNow] = React.useState<Date>(() => referenceDate ?? new Date());

    React.useEffect(() => {
      if (referenceDate || !liveClock) return;
      const id = window.setInterval(() => setNow(new Date()), 30000);
      return () => window.clearInterval(id);
    }, [referenceDate, liveClock]);

    const displayDate = referenceDate ?? now;
    const currentValue = value ?? internalValue;

    const zones = React.useMemo<EnrichedZone[]>(() => {
      const enriched = timezones.map((tz) => {
        const offset = offsetMinutes(tz.value, displayDate);
        return {
          value: tz.value,
          label: tz.label ?? labelFromValue(tz.value),
          description: tz.description,
          offset,
          offsetLabel: formatOffset(offset),
          localTime: formatLocalTime(tz.value, displayDate),
        };
      });
      if (sortByOffset) {
        enriched.sort((a, b) => a.offset - b.offset);
      }
      return enriched;
    }, [timezones, displayDate, sortByOffset]);

    const selected = zones.find((zone) => zone.value === currentValue);

    const handleSelect = (next: string) => {
      setInternalValue(next);
      onValueChange?.(next);
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Saat dilimi secici"
            disabled={disabled}
            className={cn(
              "h-11 w-full justify-between font-normal",
              !selected && "text-muted-foreground",
              className
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              <Globe
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="truncate">
                {selected ? selected.label : placeholder}
              </span>
            </span>
            {selected ? (
              <span className="ms-2 flex shrink-0 items-center gap-2">
                <span className="tabular-nums text-xs text-muted-foreground">
                  {selected.offsetLabel}
                </span>
                <ChevronsUpDown
                  className="size-4 opacity-50"
                  aria-hidden="true"
                />
              </span>
            ) : (
              <ChevronsUpDown
                className="ms-2 size-4 shrink-0 opacity-50"
                aria-hidden="true"
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] min-w-72 p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {zones.map((zone) => {
                  const isActive = zone.value === currentValue;
                  return (
                    <CommandItem
                      key={zone.value}
                      value={zone.value}
                      keywords={[
                        zone.label,
                        zone.value,
                        zone.offsetLabel,
                        zone.description ?? "",
                      ]}
                      onSelect={handleSelect}
                      className="gap-3 py-2"
                    >
                      <Check
                        className={cn(
                          "size-4 shrink-0",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                        aria-hidden="true"
                      />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium text-foreground">
                          {zone.label}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {zone.description
                            ? `${zone.description} • ${zone.offsetLabel}`
                            : zone.offsetLabel}
                        </span>
                      </span>
                      <span
                        className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-semibold tabular-nums text-foreground"
                        aria-label={`Yerel saat ${zone.localTime}`}
                      >
                        {zone.localTime}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
TimezoneSelect.displayName = "TimezoneSelect";

export { TimezoneSelect };
