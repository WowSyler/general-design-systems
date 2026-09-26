"use client";

/**
 * CurrencySelector — Aranabilir para birimi secici.
 * Popover + Command bilesimi ile para birimlerini listeler; her satirda
 * sembol, kod (orn. TRY ₺), Turkce ad ve opsiyonel guncel kur bulunur.
 * Tetik dugmesi secili kodu ve sembolu tasir. Kontrollu/kontrolsuz calisir.
 * Fisly cok-para-birimli hesap akislarinda tutar goruntuleme birimini
 * secmek icin kullanilir. Ekstra bagimlilik yoktur; kur bicimleme
 * Intl.NumberFormat (tr-TR) ile yapilir.
 */
import * as React from "react";
import { Check, ChevronsUpDown, Coins } from "lucide-react";

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

/** Tek bir para birimi secenegi. */
export interface CurrencySelectorOption {
  /** ISO 4217 kodu, orn. "TRY", "USD". Benzersiz olmali. */
  value: string;
  /** Para birimi sembolu, orn. "₺", "$". */
  symbol: string;
  /** Para biriminin Turkce adi, orn. "Turk Lirasi". */
  name: string;
  /** Opsiyonel guncel kur: 1 birimin taban para birimindeki karsiligi. */
  rate?: number;
}

export interface CurrencySelectorProps {
  /** Listelenecek para birimleri. Verilmezse on tanimli set kullanilir. */
  currencies?: CurrencySelectorOption[];
  /** Kontrollu secili kod (ISO 4217). */
  value?: string;
  /** Kontrolsuz baslangic kodu. Verilmezse ilk para birimi secilir. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  /** Kur satiri gosterilsin mi. Varsayilan true (rate tanimli olan satirlarda). */
  showRate?: boolean;
  /** Kur satirinda kullanilan taban sembol, orn. "₺". Varsayilan "₺". */
  rateSymbol?: string;
  /** Statik onizleme icin listeyi acik baslatir. */
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

/** Fisly cok-para-birimli akislari icin dengeli bir on tanimli set (kurlar demo). */
export const currencySelectorPresets: CurrencySelectorOption[] = [
  { value: "TRY", symbol: "₺", name: "Turk Lirasi", rate: 1 },
  { value: "USD", symbol: "$", name: "Amerikan Dolari", rate: 34.25 },
  { value: "EUR", symbol: "€", name: "Euro", rate: 37.1 },
  { value: "GBP", symbol: "£", name: "Ingiliz Sterlini", rate: 43.6 },
  { value: "CHF", symbol: "₣", name: "Isvicre Frangi", rate: 38.4 },
  { value: "JPY", symbol: "¥", name: "Japon Yeni", rate: 0.22 },
  { value: "AED", symbol: "د.إ", name: "BAE Dirhemi", rate: 9.32 },
  { value: "SAR", symbol: "﷼", name: "Suudi Riyali", rate: 9.13 },
  { value: "RUB", symbol: "₽", name: "Rus Rublesi", rate: 0.36 },
  { value: "CNY", symbol: "¥", name: "Cin Yuani", rate: 4.71 },
];

/** Kur degerini tr-TR biciminde, taban sembolle birlikte dondurur. */
function formatRate(rate: number, rateSymbol: string): string {
  const formatted = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(rate);
  return `${formatted} ${rateSymbol}`;
}

const CurrencySelector = React.forwardRef<
  HTMLButtonElement,
  CurrencySelectorProps
>(
  (
    {
      currencies = currencySelectorPresets,
      value,
      defaultValue,
      onValueChange,
      placeholder = "Para birimi secin...",
      searchPlaceholder = "Kod, sembol veya ad ara...",
      emptyMessage = "Para birimi bulunamadi.",
      showRate = true,
      rateSymbol = "₺",
      defaultOpen = false,
      disabled,
      className,
      contentClassName,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const [internalValue, setInternalValue] = React.useState(
      () => defaultValue ?? currencies[0]?.value ?? ""
    );
    const currentValue = value ?? internalValue;
    const selected =
      currencies.find((currency) => currency.value === currentValue) ??
      (value === undefined ? currencies[0] : undefined);

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
            aria-label={
              selected
                ? `Para birimi: ${selected.name} (${selected.value})`
                : placeholder
            }
            disabled={disabled}
            className={cn(
              "h-11 w-full justify-between font-normal",
              !selected && "text-muted-foreground",
              className
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              {selected ? (
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary"
                  aria-hidden="true"
                >
                  {selected.symbol}
                </span>
              ) : (
                <Coins
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
              <span className="truncate font-medium tabular-nums">
                {selected ? selected.value : placeholder}
              </span>
            </span>
            <ChevronsUpDown
              className="ms-2 size-4 shrink-0 opacity-50"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-[--radix-popover-trigger-width] min-w-72 p-0",
            contentClassName
          )}
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {currencies.map((currency) => {
                  const isActive = currency.value === currentValue;
                  return (
                    <CommandItem
                      key={currency.value}
                      value={currency.value}
                      keywords={[currency.name, currency.symbol]}
                      onSelect={handleSelect}
                      className="gap-3 py-2"
                    >
                      <Check
                        className={cn(
                          "size-4 shrink-0 text-primary",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                        aria-hidden="true"
                      />
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-base font-semibold text-foreground"
                        aria-hidden="true"
                      >
                        {currency.symbol}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium tabular-nums text-foreground">
                          {currency.value}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {currency.name}
                        </span>
                      </span>
                      {showRate && currency.rate !== undefined ? (
                        <span
                          className="shrink-0 text-end text-xs font-medium tabular-nums text-muted-foreground"
                          aria-label={`Guncel kur ${formatRate(
                            currency.rate,
                            rateSymbol
                          )}`}
                        >
                          {formatRate(currency.rate, rateSymbol)}
                        </span>
                      ) : null}
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
CurrencySelector.displayName = "CurrencySelector";

export { CurrencySelector };
