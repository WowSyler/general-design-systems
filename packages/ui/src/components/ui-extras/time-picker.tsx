"use client";

/**
 * TimePicker — Saat secici.
 * Saat ve dakika icin iki Select ile (12 saat kipinde ek AM/PM Select'i)
 * gruplu, tek bir kontrol gibi gorunen kompakt bir alan. Clock ikonu, ayar
 * lanabilir dakika adimi (minuteStep) ve odaklandiginda focus-within halkasi.
 * Kanonik deger her zaman 24 saat "HH:mm" dizesidir; kontrollu (`value`) veya
 * kontrolsuz (`defaultValue`) calisir. Randevu randevu saati, GlowScan
 * hatirlatma saati gibi alanlar icin uygundur.
 */
import * as React from "react";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Saat kipi: 24 saat (00-23) veya 12 saat (01-12 + AM/PM). */
export type TimePickerHourCycle = 12 | 24;

type TimePickerPeriod = "AM" | "PM";

interface ParsedTime {
  hour: number | null;
  minute: number | null;
}

export interface TimePickerProps {
  /** Kontrollu deger, 24 saat "HH:mm" bicimi (orn. "14:30"). */
  value?: string;
  /** Kontrolsuz baslangic degeri, "HH:mm" bicimi. */
  defaultValue?: string;
  /** Deger degistiginde 24 saat "HH:mm" dizesiyle tetiklenir. */
  onChange?: (value: string) => void;
  /** 12 ya da 24 saat kipi. Varsayilan 24. */
  hourCycle?: TimePickerHourCycle;
  /** Dakika secenekleri arasindaki adim (dakika). Varsayilan 5. */
  minuteStep?: number;
  /** Tum alani devre disi birakir. */
  disabled?: boolean;
  /** Form gonderiminde kullanilacak gizli input adi. */
  name?: string;
  /** Erisilebilirlik icin grup etiketi. Varsayilan "Saat secici". */
  "aria-label"?: string;
  /** Grup elemanini bir etikete baglar. */
  "aria-labelledby"?: string;
  id?: string;
  className?: string;
}

const HOUR_PLACEHOLDER = "--";
const MINUTE_PLACEHOLDER = "--";

function pad2(value: number): string {
  return value.toString().padStart(2, "0");
}

/** 24 saat degerini 12 saatlik gosterime cevirir (0 ve 12 -> 12). */
function to12Hour(hour24: number): number {
  const mod = hour24 % 12;
  return mod === 0 ? 12 : mod;
}

/** 12 saatlik saat + periyodu 24 saatlik degere birlestirir. */
function combine12Hour(hour12: number, period: TimePickerPeriod): number {
  const base = hour12 % 12;
  return period === "PM" ? base + 12 : base;
}

/** "HH:mm" dizesini gecerliyse saat/dakikaya cozer, degilse null dondurur. */
function parseTime(value?: string): ParsedTime {
  if (!value) return { hour: null, minute: null };
  const match = /^(\d{1,2}):(\d{1,2})$/.exec(value.trim());
  if (!match) return { hour: null, minute: null };
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return { hour: null, minute: null };
  }
  return { hour, minute };
}

const triggerClassName =
  "h-8 w-auto min-w-[2.75rem] justify-center rounded-md border-0 bg-transparent px-2 shadow-none tabular-nums font-medium text-foreground transition-colors hover:bg-accent/60 focus:outline-none focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:bg-accent data-[placeholder]:font-normal data-[placeholder]:text-muted-foreground [&>svg]:hidden";

const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      hourCycle = 24,
      minuteStep = 5,
      disabled = false,
      name,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      id,
      className,
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const parsedControlled = React.useMemo(() => parseTime(value), [value]);
    const [internal, setInternal] = React.useState<ParsedTime>(() =>
      parseTime(defaultValue)
    );

    const current = isControlled ? parsedControlled : internal;
    const currentHour = current.hour;
    const currentMinute = current.minute;
    const currentPeriod: TimePickerPeriod =
      currentHour !== null && currentHour >= 12 ? "PM" : "AM";

    const hourOptions = React.useMemo<number[]>(() => {
      if (hourCycle === 12) {
        return Array.from({ length: 12 }, (_, i) => i + 1);
      }
      return Array.from({ length: 24 }, (_, i) => i);
    }, [hourCycle]);

    const minuteOptions = React.useMemo<number[]>(() => {
      const step = minuteStep > 0 ? Math.floor(minuteStep) : 1;
      const values = new Set<number>();
      for (let m = 0; m < 60; m += step) values.add(m);
      if (currentMinute !== null) values.add(currentMinute);
      return Array.from(values).sort((a, b) => a - b);
    }, [minuteStep, currentMinute]);

    const commit = (hour: number, minute: number) => {
      const next: ParsedTime = { hour, minute };
      if (!isControlled) setInternal(next);
      onChange?.(`${pad2(hour)}:${pad2(minute)}`);
    };

    const handleHourChange = (raw: string) => {
      const parsed = Number(raw);
      const hour24 =
        hourCycle === 12 ? combine12Hour(parsed, currentPeriod) : parsed;
      commit(hour24, currentMinute ?? 0);
    };

    const handleMinuteChange = (raw: string) => {
      commit(currentHour ?? 0, Number(raw));
    };

    const handlePeriodChange = (raw: string) => {
      const period: TimePickerPeriod = raw === "PM" ? "PM" : "AM";
      const hour12 = currentHour !== null ? to12Hour(currentHour) : 12;
      commit(combine12Hour(hour12, period), currentMinute ?? 0);
    };

    const hourValue =
      currentHour === null
        ? ""
        : hourCycle === 12
          ? pad2(to12Hour(currentHour))
          : pad2(currentHour);
    const minuteValue = currentMinute === null ? "" : pad2(currentMinute);
    const periodValue = currentHour === null ? "" : currentPeriod;

    const hiddenValue =
      currentHour !== null && currentMinute !== null
        ? `${pad2(currentHour)}:${pad2(currentMinute)}`
        : "";

    return (
      <div
        ref={ref}
        id={id}
        role="group"
        aria-label={ariaLabelledby ? undefined : (ariaLabel ?? "Saat secici")}
        aria-labelledby={ariaLabelledby}
        aria-disabled={disabled || undefined}
        className={cn(
          "inline-flex w-fit items-center gap-0.5 rounded-md border border-input bg-transparent px-2.5 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-ring/40 focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/15",
          disabled && "pointer-events-none opacity-50",
          className
        )}
      >
        <Clock
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />

        <Select
          value={hourValue}
          onValueChange={handleHourChange}
          disabled={disabled}
        >
          <SelectTrigger aria-label="Saat" className={triggerClassName}>
            <SelectValue placeholder={HOUR_PLACEHOLDER} />
          </SelectTrigger>
          <SelectContent className="min-w-[4rem]">
            {hourOptions.map((hour) => (
              <SelectItem
                key={hour}
                value={pad2(hour)}
                className="justify-center tabular-nums"
              >
                {pad2(hour)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span
          className="text-sm font-medium text-muted-foreground"
          aria-hidden="true"
        >
          :
        </span>

        <Select
          value={minuteValue}
          onValueChange={handleMinuteChange}
          disabled={disabled}
        >
          <SelectTrigger aria-label="Dakika" className={triggerClassName}>
            <SelectValue placeholder={MINUTE_PLACEHOLDER} />
          </SelectTrigger>
          <SelectContent className="min-w-[4rem]">
            {minuteOptions.map((minute) => (
              <SelectItem
                key={minute}
                value={pad2(minute)}
                className="justify-center tabular-nums"
              >
                {pad2(minute)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hourCycle === 12 ? (
          <Select
            value={periodValue}
            onValueChange={handlePeriodChange}
            disabled={disabled}
          >
            <SelectTrigger
              aria-label="Ogleden once / sonra"
              className={cn(triggerClassName, "ms-0.5 min-w-[3rem]")}
            >
              <SelectValue placeholder={HOUR_PLACEHOLDER} />
            </SelectTrigger>
            <SelectContent className="min-w-[4rem]">
              <SelectItem value="AM" className="justify-center">
                AM
              </SelectItem>
              <SelectItem value="PM" className="justify-center">
                PM
              </SelectItem>
            </SelectContent>
          </Select>
        ) : null}

        {name ? <input type="hidden" name={name} value={hiddenValue} /> : null}
      </div>
    );
  }
);
TimePicker.displayName = "TimePicker";

export { TimePicker };
