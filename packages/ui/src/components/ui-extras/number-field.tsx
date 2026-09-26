/**
 * NumberField — notr sayisal giris alani (spinbutton).
 * Sol/sag [-]/[+] adim butonlari, ondalik destegi, min/max/step sinirlari
 * ve klavye (Ok tuslari, PageUp/PageDown, Home/End) ile artir/azalt sunar.
 * Opsiyonel bicim (plain/currency/percent) + prefix/suffix ile odak
 * disindayken Intl ile bicimlenmis, odaktayken duz duzenlenebilir metin gosterir.
 * Kontrollu deger number | null; role=spinbutton, aria-valuenow/min/max/valuetext.
 * Ticarete bagli, min1 quantity-stepper aksine bu tamamen genel amaclidir
 * (Fisly tutar girisi, Randevu kisi sayisi gibi senaryolar icin).
 */
"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const numberFieldVariants = cva(
  "group inline-flex items-stretch overflow-hidden rounded-md border border-input bg-transparent shadow-sm transition-[border-color,box-shadow] duration-200 focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/15",
  {
    variants: {
      size: {
        sm: "h-8 text-xs pointer-coarse:h-[2.875rem]",
        default: "h-9 text-sm pointer-coarse:h-[2.875rem]",
        lg: "h-11 text-base pointer-coarse:h-[2.875rem]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

type NumberFieldFormat = "plain" | "currency" | "percent";
type NumberFieldAlign = "start" | "center" | "end";

export interface NumberFieldProps
  extends VariantProps<typeof numberFieldVariants> {
  /** Kontrollu deger. Bos alan icin null. */
  value?: number | null;
  /** Kontrolsuz kullanimda baslangic degeri. */
  defaultValue?: number | null;
  /** Deger degistiginde cagrilir. */
  onValueChange?: (value: number | null) => void;
  /** Alt sinir. */
  min?: number;
  /** Ust sinir. */
  max?: number;
  /** Artis/azalis adimi. Varsayilan 1. */
  step?: number;
  /** Gosterilecek ondalik basamak sayisi. Verilmezse step ve bicimden turetilir. */
  precision?: number;
  /** Sayi bicimi. Varsayilan "plain". */
  format?: NumberFieldFormat;
  /** currency biciminde para birimi kodu. Varsayilan "TRY". */
  currency?: string;
  /** Intl yerel ayari. Varsayilan "tr-TR". */
  locale?: string;
  /** Bicimlenmis degerin basina eklenir. */
  prefix?: string;
  /** Bicimlenmis degerin sonuna eklenir. */
  suffix?: string;
  /** Metin hizasi. Varsayilan "center". */
  align?: NumberFieldAlign;
  /** Bos alan yer tutucusu. */
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  id?: string;
  /** Form gonderimi icin gizli input adi. */
  name?: string;
  /** Erisilebilirlik etiketi (gorunur etiket yoksa). */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
}

function decimalsOf(n: number): number {
  if (!Number.isFinite(n)) return 0;
  const s = String(n);
  const dot = s.indexOf(".");
  return dot === -1 ? 0 : s.length - dot - 1;
}

function parseNumber(raw: string): { value: number | null; valid: boolean } {
  const trimmed = raw.trim();
  if (trimmed === "") return { value: null, valid: true };
  if (trimmed === "-" || trimmed === "," || trimmed === ".")
    return { value: null, valid: false };
  const normalized = trimmed.replace(/\s/g, "").replace(",", ".");
  const n = Number(normalized);
  if (!Number.isFinite(n)) return { value: null, valid: false };
  return { value: n, valid: true };
}

const alignClass: Record<NumberFieldAlign, string> = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
};

const NumberField = React.forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      value,
      defaultValue = null,
      onValueChange,
      min,
      max,
      step = 1,
      precision,
      format = "plain",
      currency = "TRY",
      locale = "tr-TR",
      prefix,
      suffix,
      align = "center",
      placeholder,
      disabled = false,
      readOnly = false,
      autoFocus,
      id,
      name,
      size,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<number | null>(
      value ?? defaultValue
    );
    const currentValue = isControlled ? (value ?? null) : internalValue;

    const [focused, setFocused] = React.useState(false);
    const [text, setText] = React.useState("");

    const resolvedPrecision =
      precision ?? Math.max(decimalsOf(step), format === "currency" ? 2 : 0);

    const round = React.useCallback(
      (v: number) => {
        const factor = 10 ** resolvedPrecision;
        return Math.round((v + Number.EPSILON) * factor) / factor;
      },
      [resolvedPrecision]
    );

    const clamp = React.useCallback(
      (v: number) => {
        let r = v;
        if (min !== undefined) r = Math.max(r, min);
        if (max !== undefined) r = Math.min(r, max);
        return r;
      },
      [min, max]
    );

    const editableString = (v: number) => String(v);

    const formatValue = React.useCallback(
      (v: number | null): string => {
        if (v === null) return "";
        let core: string;
        if (format === "currency") {
          core = new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            minimumFractionDigits: resolvedPrecision,
            maximumFractionDigits: resolvedPrecision,
          }).format(v);
        } else if (format === "percent") {
          core = new Intl.NumberFormat(locale, {
            style: "percent",
            minimumFractionDigits: resolvedPrecision,
            maximumFractionDigits: resolvedPrecision,
          }).format(v / 100);
        } else {
          core = new Intl.NumberFormat(locale, {
            minimumFractionDigits: resolvedPrecision,
            maximumFractionDigits: resolvedPrecision,
          }).format(v);
        }
        return `${prefix ?? ""}${core}${suffix ?? ""}`;
      },
      [format, locale, currency, resolvedPrecision, prefix, suffix]
    );

    const emit = React.useCallback(
      (next: number | null) => {
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange]
    );

    const applyStep = (direction: 1 | -1, multiplier = 1) => {
      if (disabled || readOnly) return;
      const base = currentValue ?? min ?? 0;
      const next = clamp(round(base + direction * step * multiplier));
      emit(next);
      if (focused) setText(editableString(next));
    };

    const atMin =
      currentValue !== null && min !== undefined && currentValue <= min;
    const atMax =
      currentValue !== null && max !== undefined && currentValue >= max;
    const canDecrement = !disabled && !readOnly && !atMin;
    const canIncrement = !disabled && !readOnly && !atMax;

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      setText(currentValue === null ? "" : editableString(currentValue));
      event.currentTarget.select();
    };

    const handleBlur = () => {
      setFocused(false);
      if (currentValue === null) {
        setText("");
        return;
      }
      const fixed = clamp(round(currentValue));
      if (fixed !== currentValue) emit(fixed);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      setText(raw);
      const { value: parsed, valid } = parseNumber(raw);
      if (!valid) return;
      emit(parsed);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (readOnly || disabled) return;
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          applyStep(1);
          break;
        case "ArrowDown":
          event.preventDefault();
          applyStep(-1);
          break;
        case "PageUp":
          event.preventDefault();
          applyStep(1, 10);
          break;
        case "PageDown":
          event.preventDefault();
          applyStep(-1, 10);
          break;
        case "Home":
          if (min !== undefined) {
            event.preventDefault();
            emit(min);
            if (focused) setText(editableString(min));
          }
          break;
        case "End":
          if (max !== undefined) {
            event.preventDefault();
            emit(max);
            if (focused) setText(editableString(max));
          }
          break;
        default:
          break;
      }
    };

    const displayValue = focused ? text : formatValue(currentValue);
    const valueText =
      currentValue !== null ? formatValue(currentValue) : undefined;

    const stepButtonClass =
      "inline-flex aspect-square h-full items-center justify-center text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0";

    return (
      <div
        className={cn(
          numberFieldVariants({ size }),
          (disabled || readOnly) && "cursor-not-allowed",
          disabled && "opacity-50",
          className
        )}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Azalt"
          disabled={!canDecrement}
          onClick={() => applyStep(-1)}
          className={cn(stepButtonClass, "border-e border-border")}
        >
          <Minus aria-hidden="true" />
        </button>
        <input
          ref={ref}
          id={id}
          type="text"
          inputMode={resolvedPrecision > 0 ? "decimal" : "numeric"}
          role="spinbutton"
          aria-valuenow={currentValue ?? undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={valueText}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          autoComplete="off"
          autoFocus={autoFocus}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          value={displayValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(
            "h-full w-full min-w-0 flex-1 bg-transparent px-2 font-medium tabular-nums text-foreground placeholder:font-normal placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed",
            alignClass[align]
          )}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="Artır"
          disabled={!canIncrement}
          onClick={() => applyStep(1)}
          className={cn(stepButtonClass, "border-s border-border")}
        >
          <Plus aria-hidden="true" />
        </button>
        {name ? (
          <input type="hidden" name={name} value={currentValue ?? ""} />
        ) : null}
      </div>
    );
  }
);
NumberField.displayName = "NumberField";

export { NumberField, numberFieldVariants };
