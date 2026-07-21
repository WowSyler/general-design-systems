"use client";

/**
 * NumericKeypad — Sayisal tus takimi (mobil hizli tutar girisi).
 * 0-9 rakamlari, ondalik ayirici (virgul) ve geri-sil tuslarini 3x4
 * grid halinde buyuk dokunmatik butonlarla sunar; ustte girilen tutari
 * bicimlenmis (binlik ayirici) olarak gosteren canli bir ekran bulunur.
 * Kontrollu/kontrolsuz calisir; onChange ham deger string'ini ("1234,50"),
 * onKeyPress ise basilan tusu iletir. Fizyolojik klavye de desteklenir
 * (rakam / virgul / Backspace). Fisly hizli islem ekleme akislari icin.
 * Deger, tuketici tarafinda sayiya cevrilirken virgul noktaya donusturulur:
 * Number(value.replace(",", ".")).
 */

import * as React from "react";
import { Delete } from "lucide-react";

import { cn } from "@/lib/utils";

export type NumericKeypadKey =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | ","
  | "backspace";

export interface NumericKeypadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onKeyPress"> {
  /** Kontrollu ham deger (virgul ondalik ayiricili string), orn. "1234,50". */
  value?: string;
  /** Kontrolsuz baslangic degeri. */
  defaultValue?: string;
  /** Deger her degistiginde ham string ile tetiklenir. */
  onChange?: (value: string) => void;
  /** Herhangi bir tusa basilinca (degeri degistirmese bile) tetiklenir. */
  onKeyPress?: (key: NumericKeypadKey) => void;
  /** Ekranda tutarin onunde gosterilecek para birimi simgesi, orn. "₺". */
  currency?: React.ReactNode;
  /** Ondalik ayiricidan sonra izin verilen basamak sayisi. Varsayilan 2. */
  decimalScale?: number;
  /** Ondalik (virgul) tusu ve girisine izin ver. Varsayilan true. */
  allowDecimal?: boolean;
  /** Tam kisimda izin verilen azami basamak sayisi. Varsayilan 9. */
  maxIntegerDigits?: number;
  /** Deger bosken ekranda gosterilecek yer tutucu. Varsayilan "0". */
  placeholder?: string;
  /** Tum etkilesimi kapatir. */
  disabled?: boolean;
  /** Ekran icin erisilebilir etiket (ekran okuyucuya okunur). */
  label?: string;
}

interface ReduceOptions {
  decimalScale: number;
  allowDecimal: boolean;
  maxIntegerDigits: number;
}

/**
 * Mevcut ham degere basilan tusu uygular ve yeni ham degeri dondurur.
 * Basta sifir sadelestirilir, tek ondalik ayiriciya ve basamak sinirlarina uyulur.
 */
function reduceValue(
  current: string,
  key: NumericKeypadKey,
  opts: ReduceOptions
): string {
  if (key === "backspace") return current.slice(0, -1);

  if (key === ",") {
    if (!opts.allowDecimal || opts.decimalScale <= 0) return current;
    if (current.includes(",")) return current;
    if (current === "") return "0,";
    return `${current},`;
  }

  const hasDecimal = current.includes(",");
  const [intPart = "", decPart = ""] = current.split(",");

  if (hasDecimal) {
    if (decPart.length >= opts.decimalScale) return current;
    return current + key;
  }

  if (current === "0") return key === "0" ? current : key;
  if (intPart.length >= opts.maxIntegerDigits) return current;
  return current + key;
}

/** Ham degeri binlik ("." ile) ayirir; sondaki virgul korunur. */
function formatAmount(raw: string): string {
  if (!raw) return "";
  const [intPart = "", decPart] = raw.split(",");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (raw.includes(",")) return `${grouped},${decPart ?? ""}`;
  return grouped;
}

interface KeyDef {
  key: NumericKeypadKey;
  label: React.ReactNode;
  ariaLabel: string;
  tone: "digit" | "action";
}

const KEY_LAYOUT: KeyDef[] = [
  { key: "1", label: "1", ariaLabel: "1", tone: "digit" },
  { key: "2", label: "2", ariaLabel: "2", tone: "digit" },
  { key: "3", label: "3", ariaLabel: "3", tone: "digit" },
  { key: "4", label: "4", ariaLabel: "4", tone: "digit" },
  { key: "5", label: "5", ariaLabel: "5", tone: "digit" },
  { key: "6", label: "6", ariaLabel: "6", tone: "digit" },
  { key: "7", label: "7", ariaLabel: "7", tone: "digit" },
  { key: "8", label: "8", ariaLabel: "8", tone: "digit" },
  { key: "9", label: "9", ariaLabel: "9", tone: "digit" },
  { key: ",", label: ",", ariaLabel: "Ondalik virgul", tone: "action" },
  { key: "0", label: "0", ariaLabel: "0", tone: "digit" },
  {
    key: "backspace",
    label: <Delete className="size-5" aria-hidden="true" />,
    ariaLabel: "Geri sil",
    tone: "action",
  },
];

const NumericKeypad = React.forwardRef<HTMLDivElement, NumericKeypadProps>(
  (
    {
      value: valueProp,
      defaultValue = "",
      onChange,
      onKeyPress,
      currency,
      decimalScale = 2,
      allowDecimal = true,
      maxIntegerDigits = 9,
      placeholder = "0",
      disabled = false,
      label = "Tutar",
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const value = valueProp ?? internalValue;

    const reactId = React.useId();
    const displayId = `${reactId}-display`;

    const handleKey = React.useCallback(
      (key: NumericKeypadKey) => {
        if (disabled) return;
        onKeyPress?.(key);
        const next = reduceValue(value, key, {
          decimalScale,
          allowDecimal,
          maxIntegerDigits,
        });
        if (next === value) return;
        if (valueProp === undefined) setInternalValue(next);
        onChange?.(next);
      },
      [
        disabled,
        onKeyPress,
        value,
        decimalScale,
        allowDecimal,
        maxIntegerDigits,
        valueProp,
        onChange,
      ]
    );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const { key } = event;
      if (/^[0-9]$/.test(key)) {
        handleKey(key as NumericKeypadKey);
        return;
      }
      if (key === "," || key === ".") {
        event.preventDefault();
        handleKey(",");
        return;
      }
      if (key === "Backspace") {
        event.preventDefault();
        handleKey("backspace");
      }
    };

    const formatted = formatAmount(value);

    return (
      <div
        ref={ref}
        role="group"
        aria-label="Sayisal tus takimi"
        onKeyDown={handleKeyDown}
        className={cn(
          "flex w-full max-w-xs flex-col gap-4",
          disabled && "opacity-60",
          className
        )}
        {...props}
      >
        <div
          id={displayId}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="flex min-h-16 items-baseline justify-end gap-1.5 rounded-xl border bg-muted/40 px-4 py-3 shadow-inner"
        >
          <span className="sr-only">{label}: </span>
          {currency ? (
            <span className="text-xl font-medium text-muted-foreground">
              {currency}
            </span>
          ) : null}
          <span
            className={cn(
              "truncate text-3xl font-semibold tabular-nums tracking-tight",
              formatted ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {formatted || placeholder}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {KEY_LAYOUT.map((item) => {
            const isDecimal = item.key === ",";
            const decimalDisabled =
              isDecimal && (!allowDecimal || decimalScale <= 0);
            return (
              <button
                key={item.key}
                type="button"
                disabled={disabled || decimalDisabled}
                aria-label={item.ariaLabel}
                aria-describedby={displayId}
                onClick={() => handleKey(item.key)}
                className={cn(
                  "flex h-14 items-center justify-center rounded-xl border text-2xl font-semibold tabular-nums select-none transition-all duration-200 sm:h-16",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "active:scale-[0.97]",
                  item.tone === "action"
                    ? "bg-muted/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    : "bg-background text-foreground hover:-translate-y-0.5 hover:border-ring/60 hover:bg-accent hover:shadow-md",
                  "disabled:pointer-events-none disabled:opacity-40"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);
NumericKeypad.displayName = "NumericKeypad";

export { NumericKeypad };
