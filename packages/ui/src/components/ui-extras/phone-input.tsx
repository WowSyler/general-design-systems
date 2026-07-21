/**
 * PhoneInput — Uluslararasi telefon girisi.
 * Solda ulke secici (bayrak emojisi + arama kodu), sagda numara alani.
 * Ulke secici Popover + Command ile aranabilir bir listedir (ulke adi veya
 * arama koduna gore filtreler); varsayilan Turkiye (+90). Numara girildikce
 * ulkeye ozgu gruplama ile bicimlenir (orn. 5XX XXX XX XX). Deger
 * { country, number } seklindedir; number yalnizca rakamlardan olusan ulusal
 * numaradir. Kontrollu/kontrolsuz calisir. Randevu musteri kaydi/SMS akislari
 * ve Dolap iletisim formlari icin uygundur.
 */
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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

/** Tek bir ulke/bolge tanimi. */
export interface PhoneInputCountry {
  /** ISO 3166-1 alpha-2 kodu, orn. "TR". */
  code: string;
  /** Ulkenin Turkce adi, orn. "Turkiye". */
  name: string;
  /** Uluslararasi arama kodu, orn. "+90". */
  dial: string;
  /** Bayrak emojisi. */
  flag: string;
  /** Ulusal numaranin gorsel gruplama boyutlari, orn. [3, 3, 2, 2]. */
  groups?: number[];
  /** Numara alani icin ornek yer tutucu. */
  example?: string;
}

/** Telefon girisinin degeri. */
export interface PhoneInputValue {
  /** Secili ulkenin ISO kodu. */
  country: string;
  /** Yalnizca rakamlardan olusan ulusal numara. */
  number: string;
}

export interface PhoneInputProps {
  /** Listelenecek ulkeler. Verilmezse on tanimli set kullanilir. */
  countries?: PhoneInputCountry[];
  /** Kontrollu deger. */
  value?: PhoneInputValue;
  /** Kontrolsuz baslangic degeri. */
  defaultValue?: PhoneInputValue;
  onValueChange?: (value: PhoneInputValue) => void;
  /** Numara alani yer tutucusu; verilmezse ulkenin ornegi kullanilir. */
  placeholder?: string;
  /** Ulke arama alani yer tutucusu. */
  searchPlaceholder?: string;
  /** Arama sonucsuzken gosterilen mesaj. */
  emptyMessage?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  /** Numara alani icin erisim etiketi. */
  numberAriaLabel?: string;
  /** Statik onizleme icin ulke listesini acik baslatir. */
  defaultOpen?: boolean;
  className?: string;
  contentClassName?: string;
}

/** Kesin var olan geri donus ulkesi (bos liste durumunda tip guvencesi). */
const DEFAULT_COUNTRY: PhoneInputCountry = {
  code: "TR",
  name: "Turkiye",
  dial: "+90",
  flag: "🇹🇷",
  groups: [3, 3, 2, 2],
  example: "5XX XXX XX XX",
};

/** DeployLens/Dolap/Randevu/GlowScan/Fisly icin dengeli bir on tanimli ulke seti. */
export const phoneInputCountries: PhoneInputCountry[] = [
  DEFAULT_COUNTRY,
  { code: "DE", name: "Almanya", dial: "+49", flag: "🇩🇪", groups: [3, 3, 4], example: "1XX XXX XXXX" },
  { code: "NL", name: "Hollanda", dial: "+31", flag: "🇳🇱", groups: [1, 2, 3, 3], example: "6 XX XXX XXX" },
  { code: "GB", name: "Birlesik Krallik", dial: "+44", flag: "🇬🇧", groups: [4, 3, 3], example: "7XXX XXX XXX" },
  { code: "FR", name: "Fransa", dial: "+33", flag: "🇫🇷", groups: [1, 2, 2, 2, 2], example: "6 XX XX XX XX" },
  { code: "US", name: "Amerika Birlesik Devletleri", dial: "+1", flag: "🇺🇸", groups: [3, 3, 4], example: "XXX XXX XXXX" },
  { code: "AZ", name: "Azerbaycan", dial: "+994", flag: "🇦🇿", groups: [2, 3, 2, 2], example: "5X XXX XX XX" },
  { code: "RU", name: "Rusya", dial: "+7", flag: "🇷🇺", groups: [3, 3, 2, 2], example: "9XX XXX XX XX" },
  { code: "AE", name: "Birlesik Arap Emirlikleri", dial: "+971", flag: "🇦🇪", groups: [2, 3, 4], example: "5X XXX XXXX" },
  { code: "SA", name: "Suudi Arabistan", dial: "+966", flag: "🇸🇦", groups: [2, 3, 4], example: "5X XXX XXXX" },
  { code: "QA", name: "Katar", dial: "+974", flag: "🇶🇦", groups: [4, 4], example: "XXXX XXXX" },
  { code: "GE", name: "Gurcistan", dial: "+995", flag: "🇬🇪", groups: [3, 2, 2, 2], example: "5XX XX XX XX" },
];

/** Ulusal numarayi ulkenin grup deseniyle bicimler. */
function formatNationalNumber(raw: string, groups?: number[]): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (!groups || groups.length === 0) {
    return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
  }
  const parts: string[] = [];
  let i = 0;
  for (const size of groups) {
    if (i >= digits.length) break;
    parts.push(digits.slice(i, i + size));
    i += size;
  }
  if (i < digits.length) parts.push(digits.slice(i));
  return parts.join(" ");
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      countries = phoneInputCountries,
      value,
      defaultValue,
      onValueChange,
      placeholder,
      searchPlaceholder = "Ulke veya kod ara…",
      emptyMessage = "Ulke bulunamadi.",
      disabled,
      id,
      name,
      required,
      numberAriaLabel = "Telefon numarasi",
      defaultOpen = false,
      className,
      contentClassName,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const [internal, setInternal] = React.useState<PhoneInputValue>(
      () => defaultValue ?? { country: countries[0]?.code ?? "TR", number: "" }
    );
    const current = value ?? internal;
    const innerRef = React.useRef<HTMLInputElement | null>(null);

    const setInputRef = (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    };

    const countryOf = (code: string): PhoneInputCountry =>
      countries.find((c) => c.code.toLowerCase() === code.toLowerCase()) ??
      countries[0] ??
      DEFAULT_COUNTRY;

    const selected = countryOf(current.country);
    const maxDigits = selected.groups
      ? selected.groups.reduce((sum, size) => sum + size, 0)
      : undefined;

    const emit = (next: PhoneInputValue) => {
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    };

    const handleCountrySelect = (next: string) => {
      const picked = countryOf(next);
      emit({ ...current, country: picked.code });
      setOpen(false);
      window.requestAnimationFrame(() => innerRef.current?.focus());
    };

    const handleNumberChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const digits = event.target.value.replace(/\D/g, "");
      const trimmed =
        maxDigits !== undefined ? digits.slice(0, maxDigits) : digits;
      emit({ ...current, number: trimmed });
    };

    const display = formatNationalNumber(current.number, selected.groups);

    return (
      <div
        role="group"
        aria-label={numberAriaLabel}
        className={cn(
          "flex h-9 w-full items-center rounded-md border border-input bg-transparent shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-ring/40 focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/15",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-label={`Ulke kodu: ${selected.name} (${selected.dial})`}
              disabled={disabled}
              className="inline-flex h-full shrink-0 items-center gap-1.5 rounded-l-md border-r border-input px-2.5 text-sm font-medium text-foreground outline-none transition-colors duration-200 hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:pointer-events-none"
            >
              <span className="text-base leading-none" aria-hidden="true">
                {selected.flag}
              </span>
              <span className="tabular-nums">{selected.dial}</span>
              <ChevronsUpDown
                className={cn(
                  "size-3.5 shrink-0 opacity-50 transition-transform duration-200",
                  open && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className={cn("w-[280px] p-0", contentClassName)}
          >
            <Command>
              <CommandInput placeholder={searchPlaceholder} />
              <CommandList>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {countries.map((c) => {
                    const isActive =
                      c.code.toLowerCase() === current.country.toLowerCase();
                    return (
                      <CommandItem
                        key={c.code}
                        value={c.code}
                        keywords={[c.name, c.dial, c.dial.replace("+", "")]}
                        onSelect={handleCountrySelect}
                        className="gap-2.5"
                      >
                        <span
                          className="text-base leading-none"
                          aria-hidden="true"
                        >
                          {c.flag}
                        </span>
                        <span className="min-w-0 flex-1 truncate">
                          {c.name}
                        </span>
                        <span className="tabular-nums text-xs text-muted-foreground">
                          {c.dial}
                        </span>
                        <Check
                          className={cn(
                            "size-4 shrink-0 text-primary",
                            isActive ? "opacity-100" : "opacity-0"
                          )}
                          aria-hidden="true"
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <input
          ref={setInputRef}
          id={id}
          name={name}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required={required}
          disabled={disabled}
          aria-label={numberAriaLabel}
          placeholder={placeholder ?? selected.example ?? "Telefon numarasi"}
          value={display}
          onChange={handleNumberChange}
          className="h-full min-w-0 flex-1 rounded-r-md bg-transparent px-3 text-sm tabular-nums text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
