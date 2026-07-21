"use client";

/**
 * LanguageSelector — Dil/bolge secici.
 * DropdownMenu tabanli; her secenekte bayrak emojisi, dilin Turkce adi ve
 * yerel adi bulunur, aktif dilde Check gorunur. Tetik dugmesi Globe ikonu +
 * kisa kod (orn. TR) tasir. Iki tetik varyanti vardir: "compact" yalnizca
 * Globe + kod gosterir, "full" bayrak + yerel ad + kod gosterir. Kontrollu/
 * kontrolsuz calisir. Cok dilli urun akislarinda (DeployLens, Dolap, Randevu,
 * GlowScan, Fisly) arayuz dilini degistirmek icin kullanilir.
 */
import * as React from "react";
import { Check, ChevronDown, Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Tek bir dil/bolge secenegi. */
export interface LanguageSelectorOption {
  /** Benzersiz dil kodu, orn. "tr", "en". */
  value: string;
  /** Bayrak emojisi, orn. bayrak sembolu. */
  flag: string;
  /** Dilin Turkce adi, orn. "Turkce". */
  name: string;
  /** Dilin kendi dilindeki adi, orn. "Turkce" -> yerel yazim. */
  nativeName: string;
  /** Tetikte gorunen kisa kod; verilmezse value buyuk harfe cevrilir. */
  code?: string;
}

export interface LanguageSelectorProps {
  /** Listelenecek diller. Verilmezse on tanimli set kullanilir. */
  languages?: LanguageSelectorOption[];
  /** Kontrollu secili dil kodu. */
  value?: string;
  /** Kontrolsuz baslangic dil kodu. Verilmezse ilk dil secilir. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Tetik gorunumu. compact: Globe + kod; full: bayrak + yerel ad + kod. */
  variant?: "compact" | "full";
  /** Menu basligi. Varsayilan "Dil secin". */
  label?: string;
  /** Menu hizalamasi. Varsayilan "end". */
  align?: "start" | "center" | "end";
  /** Statik onizleme icin menuyu acik baslatir. */
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

/** DeployLens/Dolap/Randevu/GlowScan/Fisly icin dengeli bir on tanimli dil seti. */
export const languageSelectorPresets: LanguageSelectorOption[] = [
  { value: "tr", flag: "🇹🇷", name: "Turkce", nativeName: "Türkçe", code: "TR" },
  { value: "en", flag: "🇬🇧", name: "Ingilizce", nativeName: "English", code: "EN" },
  { value: "de", flag: "🇩🇪", name: "Almanca", nativeName: "Deutsch", code: "DE" },
  { value: "fr", flag: "🇫🇷", name: "Fransizca", nativeName: "Français", code: "FR" },
  { value: "es", flag: "🇪🇸", name: "Ispanyolca", nativeName: "Español", code: "ES" },
  { value: "ar", flag: "🇸🇦", name: "Arapca", nativeName: "العربية", code: "AR" },
];

function shortCodeOf(lang: LanguageSelectorOption): string {
  return lang.code ?? lang.value.toUpperCase();
}

const LanguageSelector = React.forwardRef<
  HTMLButtonElement,
  LanguageSelectorProps
>(
  (
    {
      languages = languageSelectorPresets,
      value,
      defaultValue,
      onValueChange,
      variant = "compact",
      label = "Dil secin",
      align = "end",
      defaultOpen = false,
      disabled,
      className,
      contentClassName,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const [internalValue, setInternalValue] = React.useState(
      () => defaultValue ?? languages[0]?.value ?? ""
    );
    const currentValue = value ?? internalValue;
    const selected =
      languages.find((lang) => lang.value === currentValue) ?? languages[0];

    const handleSelect = (next: string) => {
      setInternalValue(next);
      onValueChange?.(next);
    };

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            size={variant === "compact" ? "sm" : "default"}
            disabled={disabled}
            aria-label={
              selected
                ? `Dil: ${selected.name} (${selected.nativeName})`
                : label
            }
            className={cn(
              "gap-2 font-medium",
              variant === "full" && "min-w-[10rem] justify-between",
              className
            )}
          >
            {variant === "full" && selected ? (
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="text-base leading-none"
                  aria-hidden="true"
                >
                  {selected.flag}
                </span>
                <span className="truncate">{selected.nativeName}</span>
                <span className="tabular-nums text-xs text-muted-foreground">
                  {shortCodeOf(selected)}
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Globe
                  className="size-4 shrink-0 opacity-70"
                  aria-hidden="true"
                />
                <span className="tabular-nums">
                  {selected ? shortCodeOf(selected) : "--"}
                </span>
              </span>
            )}
            <ChevronDown
              className={cn(
                "size-4 shrink-0 opacity-60 transition-transform duration-200",
                open && "rotate-180"
              )}
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          className={cn("min-w-[15rem]", contentClassName)}
        >
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
            {label}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {languages.map((lang) => {
            const isActive = lang.value === currentValue;
            return (
              <DropdownMenuItem
                key={lang.value}
                onSelect={() => handleSelect(lang.value)}
                className={cn("gap-3", isActive && "font-medium")}
              >
                <span
                  className="text-base leading-none"
                  aria-hidden="true"
                >
                  {lang.flag}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm text-foreground">
                    {lang.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {lang.nativeName}
                  </span>
                </span>
                <span className="tabular-nums text-xs text-muted-foreground">
                  {shortCodeOf(lang)}
                </span>
                <Check
                  className={cn(
                    "size-4 shrink-0 text-primary",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                  aria-hidden="true"
                />
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
LanguageSelector.displayName = "LanguageSelector";

export { LanguageSelector };
