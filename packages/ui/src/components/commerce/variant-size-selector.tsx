/**
 * VariantSizeSelector — interaktif beden/renk varyant secici.
 * Beden secenekleri buton-grid (XS-XXL veya numerik 36-44), renkler
 * swatch chip satiri olarak sunulur. Her secenek durum tasir: secili
 * (ring-primary), tukenmis (ustu-cizili + devre disi), az-stok rozeti.
 * Her grup role="radiogroup"; secenekler role="radio" ve klavye
 * (Ok tuslari/Home/End/Space) ile gezilir. value {size?,color?} +
 * onValueChange kontrollu/kontrolsuz calisir.
 * Dolap urun detay sayfasi varyant secimi.
 */
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface VariantSizeSelectorSizeOption {
  /** Benzersiz beden degeri (or. "M", "42"). */
  value: string;
  /** Gorunen etiket; verilmezse value kullanilir. */
  label?: React.ReactNode;
  /** Stokta yok: ustu-cizili ve secilemez. */
  soldOut?: boolean;
  /** Az stok rozeti gosterir. */
  lowStock?: boolean;
}

export interface VariantSizeSelectorColorOption {
  /** Benzersiz renk degeri (or. "antrasit"). */
  value: string;
  /** Erisilebilir renk adi. */
  label: string;
  /** Swatch dolgu rengi (urun verisi; CSS renk degeri). */
  swatch: string;
  /** Stokta yok: ustu-cizili ve secilemez. */
  soldOut?: boolean;
  /** Az stok rozeti gosterir. */
  lowStock?: boolean;
}

export interface VariantSizeSelectorValue {
  /** Secili beden degeri. */
  size?: string;
  /** Secili renk degeri. */
  color?: string;
}

export interface VariantSizeSelectorProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  > {
  /** Beden secenekleri. */
  sizes?: VariantSizeSelectorSizeOption[];
  /** Renk secenekleri. */
  colors?: VariantSizeSelectorColorOption[];
  /** Kontrollu deger. */
  value?: VariantSizeSelectorValue;
  /** Kontrolsuz baslangic degeri. */
  defaultValue?: VariantSizeSelectorValue;
  /** Secim degistiginde cagrilir. */
  onValueChange?: (value: VariantSizeSelectorValue) => void;
  /** Beden grubu basligi. */
  sizeLabel?: React.ReactNode;
  /** Renk grubu basligi. */
  colorLabel?: React.ReactNode;
  /** Tum kontrolu devre disi birakir. */
  disabled?: boolean;
}

interface RadioOptionBase {
  value: string;
  soldOut?: boolean;
  lowStock?: boolean;
}

interface VariantRadioGroupProps<T extends RadioOptionBase> {
  label: React.ReactNode;
  ariaLabel: string;
  options: T[];
  selected?: string;
  disabled?: boolean;
  selectedLabel?: React.ReactNode;
  optionAriaLabel: (option: T) => string;
  renderOption: (
    option: T,
    state: { selected: boolean; disabled: boolean },
  ) => React.ReactNode;
  optionClassName: (
    option: T,
    state: { selected: boolean; disabled: boolean },
  ) => string;
  onSelect: (value: string) => void;
}

function VariantRadioGroup<T extends RadioOptionBase>({
  label,
  ariaLabel,
  options,
  selected,
  disabled = false,
  selectedLabel,
  optionAriaLabel,
  renderOption,
  optionClassName,
  onSelect,
}: VariantRadioGroupProps<T>) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const isEnabled = (index: number) => !disabled && !options[index]?.soldOut;

  const selectAt = (index: number) => {
    const option = options[index];
    if (!option || !isEnabled(index)) return;
    onSelect(option.value);
    refs.current[index]?.focus();
  };

  const move = (from: number, dir: 1 | -1) => {
    const n = options.length;
    for (let step = 1; step <= n; step += 1) {
      const next = (from + dir * step + n * step) % n;
      if (isEnabled(next)) {
        selectAt(next);
        return;
      }
    }
  };

  const edge = (dir: 1 | -1) => {
    const order =
      dir === 1
        ? options.map((_, i) => i)
        : options.map((_, i) => options.length - 1 - i);
    const target = order.find((i) => isEnabled(i));
    if (target !== undefined) selectAt(target);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        move(index, 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        move(index, -1);
        break;
      case "Home":
        event.preventDefault();
        edge(1);
        break;
      case "End":
        event.preventDefault();
        edge(-1);
        break;
      case " ":
      case "Enter":
        event.preventDefault();
        selectAt(index);
        break;
      default:
        break;
    }
  };

  const selectedIndex = options.findIndex(
    (option) => option.value === selected && !option.soldOut,
  );
  const firstEnabled = options.findIndex((_, i) => isEnabled(i));
  const tabbableIndex = selectedIndex >= 0 ? selectedIndex : firstEnabled;

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      className={cn("flex flex-col gap-2", disabled && "opacity-60")}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {selectedLabel ? (
          <span className="text-sm text-muted-foreground">{selectedLabel}</span>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const isSelected =
            option.value === selected && !option.soldOut;
          const state = {
            selected: isSelected,
            disabled: disabled || Boolean(option.soldOut),
          };
          return (
            <button
              key={option.value}
              ref={(el) => {
                refs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={optionAriaLabel(option)}
              aria-disabled={state.disabled || undefined}
              disabled={state.disabled}
              tabIndex={index === tabbableIndex ? 0 : -1}
              onClick={() => selectAt(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={optionClassName(option, state)}
            >
              {renderOption(option, state)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Tukenmis secenekler icin capraz cizgi. */
function SoldOutStrike() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-[inherit]"
    >
      <span className="h-px w-[150%] rotate-45 bg-border" />
    </span>
  );
}

/** Az stok kose rozeti. */
function LowStockDot() {
  return (
    <span
      aria-hidden="true"
      className="absolute -right-1 -top-1 size-2.5 rounded-full bg-warning ring-2 ring-background"
    />
  );
}

function optionStateSuffix(option: RadioOptionBase): string {
  if (option.soldOut) return ", tükendi";
  if (option.lowStock) return ", az stok";
  return "";
}

export const VariantSizeSelector = React.forwardRef<
  HTMLDivElement,
  VariantSizeSelectorProps
>(
  (
    {
      sizes,
      colors,
      value,
      defaultValue,
      onValueChange,
      sizeLabel = "Beden",
      colorLabel = "Renk",
      disabled = false,
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<VariantSizeSelectorValue>(
      defaultValue ?? {},
    );
    const current = isControlled ? value : internal;

    const commit = (next: VariantSizeSelectorValue) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    };

    const selectedSize = sizes?.find((s) => s.value === current.size);
    const selectedColor = colors?.find((c) => c.value === current.color);

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        {sizes && sizes.length > 0 ? (
          <VariantRadioGroup
            label={sizeLabel}
            ariaLabel={typeof sizeLabel === "string" ? sizeLabel : "Beden"}
            options={sizes}
            selected={current.size}
            disabled={disabled}
            selectedLabel={
              selectedSize
                ? (selectedSize.label ?? selectedSize.value)
                : "Seçiniz"
            }
            optionAriaLabel={(option) =>
              `${
                typeof option.label === "string" ? option.label : option.value
              } beden${optionStateSuffix(option)}`
            }
            optionClassName={(option, state) =>
              cn(
                "relative inline-flex h-10 min-w-10 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium tabular-nums outline-none transition-all duration-200 ring-offset-background hover:border-ring/60 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                state.selected &&
                  "border-primary text-primary ring-2 ring-primary ring-offset-2 shadow-sm hover:translate-y-0",
                state.disabled &&
                  "cursor-not-allowed text-muted-foreground/60 hover:translate-y-0 hover:border-input",
                option.soldOut && "line-through",
              )
            }
            renderOption={(option) => (
              <>
                <span>{option.label ?? option.value}</span>
                {option.soldOut ? <SoldOutStrike /> : null}
                {option.lowStock && !option.soldOut ? <LowStockDot /> : null}
              </>
            )}
            onSelect={(size) => commit({ ...current, size })}
          />
        ) : null}

        {colors && colors.length > 0 ? (
          <VariantRadioGroup
            label={colorLabel}
            ariaLabel={typeof colorLabel === "string" ? colorLabel : "Renk"}
            options={colors}
            selected={current.color}
            disabled={disabled}
            selectedLabel={selectedColor ? selectedColor.label : "Seçiniz"}
            optionAriaLabel={(option) =>
              `${option.label} rengi${optionStateSuffix(option)}`
            }
            optionClassName={(option, state) =>
              cn(
                "relative inline-flex size-9 items-center justify-center rounded-full border border-input p-0.5 outline-none transition-all duration-200 ring-offset-background hover:border-ring/60 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                state.selected &&
                  "border-primary ring-2 ring-primary ring-offset-2 hover:translate-y-0",
                state.disabled &&
                  "cursor-not-allowed hover:translate-y-0 hover:border-input",
              )
            }
            renderOption={(option) => (
              <>
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-full rounded-full",
                    option.soldOut && "opacity-50",
                  )}
                  style={{ backgroundColor: option.swatch }}
                />
                {option.soldOut ? <SoldOutStrike /> : null}
                {option.lowStock && !option.soldOut ? <LowStockDot /> : null}
              </>
            )}
            onSelect={(color) => commit({ ...current, color })}
          />
        ) : null}
      </div>
    );
  },
);
VariantSizeSelector.displayName = "VariantSizeSelector";
