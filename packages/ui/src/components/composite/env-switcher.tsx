"use client";

/**
 * EnvSwitcher — Ortam / dagitim hedefi degistirici (DeployLens header).
 * Tetik aktif ortamin renkli durum noktasini ve adini gosterir
 * (or. "Production"); tiklandiginda DropdownMenu icinde secilebilir
 * ortam listesi acilir. Her satirda renkli nokta, ortam adi, opsiyonel
 * alt bilgi (branch / alan adi) ve aktif ortam icin Check isareti bulunur.
 * account-switcher'dan farkli olarak hesap degil ortam odaklidir; tonlu
 * noktalarla Production/Staging/Development ayrimini gorsellestirir.
 * Tema-agnostik; yalnizca semantik tokenlar kullanir.
 */
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Ortam durum tonu; renkli nokta bu tona gore boyanir. */
export type EnvSwitcherTone =
  | "success"
  | "warning"
  | "info"
  | "primary"
  | "destructive"
  | "neutral";

export interface EnvSwitcherEnvironment {
  /** Benzersiz kimlik (secim degeri). */
  id: string;
  /** Ortam adi, or. "Production". */
  name: string;
  /** Alt bilgi: branch, alan adi veya bolge, or. "main · eu-west-1". */
  description?: string;
  /** Renkli nokta tonu; verilmezse "neutral". */
  tone?: EnvSwitcherTone;
  /** Satiri secilemez yapar (or. erisim yetkisi yok). */
  disabled?: boolean;
}

export interface EnvSwitcherProps {
  /** Secilebilir ortamlar. */
  environments: EnvSwitcherEnvironment[];
  /** Kontrollu aktif ortam kimligi. */
  value?: string;
  /** Kontrolsuz baslangic ortami. */
  defaultValue?: string;
  /** Aktif ortam degistiginde tetiklenir. */
  onValueChange?: (id: string) => void;
  /** Tetikte ad ustunde gosterilen kucuk etiket, or. "Ortam". */
  label?: React.ReactNode;
  /** Listenin ustundeki baslik, or. "Dagitim hedefi". */
  heading?: React.ReactNode;
  /** Aktif noktayi nabiz gibi canlandirir (canli ortam vurgusu). */
  pulse?: boolean;
  /** Statik onizleme icin listeyi acik baslatir. */
  defaultOpen?: boolean;
  disabled?: boolean;
  /** Menu hizalamasi. */
  align?: "start" | "center" | "end";
  className?: string;
}

const toneDot: Record<EnvSwitcherTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  primary: "bg-primary",
  destructive: "bg-destructive",
  neutral: "bg-muted-foreground",
};

const toneHalo: Record<EnvSwitcherTone, string> = {
  success: "bg-success/25",
  warning: "bg-warning/25",
  info: "bg-info/25",
  primary: "bg-primary/25",
  destructive: "bg-destructive/25",
  neutral: "bg-muted-foreground/25",
};

const toneLabel: Record<EnvSwitcherTone, string> = {
  success: "canli",
  warning: "hazirlik",
  info: "gelistirme",
  primary: "onizleme",
  destructive: "durduruldu",
  neutral: "notr",
};

function EnvDot({
  tone = "neutral",
  pulse = false,
  className,
}: {
  tone?: EnvSwitcherTone;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("relative flex size-2.5 shrink-0 items-center justify-center", className)}
      aria-hidden="true"
    >
      {pulse ? (
        <span
          className={cn(
            "absolute inline-flex size-full animate-ping rounded-full opacity-75",
            toneHalo[tone]
          )}
        />
      ) : null}
      <span className={cn("relative inline-flex size-2.5 rounded-full", toneDot[tone])} />
    </span>
  );
}

const EnvSwitcher = React.forwardRef<HTMLButtonElement, EnvSwitcherProps>(
  (
    {
      environments,
      value,
      defaultValue,
      onValueChange,
      label = "Ortam",
      heading,
      pulse = false,
      defaultOpen = false,
      disabled,
      align = "start",
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? environments[0]?.id ?? ""
    );
    const currentValue = value ?? internalValue;
    const active =
      environments.find((env) => env.id === currentValue) ?? environments[0];

    const handleSelect = (id: string) => {
      if (value === undefined) setInternalValue(id);
      onValueChange?.(id);
      setOpen(false);
    };

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            ref={ref}
            type="button"
            aria-label={
              active
                ? `Aktif ortam: ${active.name}. Ortam değiştir`
                : "Ortam seç"
            }
            disabled={disabled}
            className={cn(
              "group flex items-center gap-2.5 rounded-lg border border-input bg-background px-3 py-1.5 text-left shadow-sm transition-all duration-200",
              "hover:border-ring/60 hover:bg-accent/60 active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
              "disabled:pointer-events-none disabled:opacity-50",
              className
            )}
          >
            {active ? (
              <>
                <EnvDot tone={active.tone} pulse={pulse} />
                <span className="min-w-0">
                  {label ? (
                    <span className="block text-[0.625rem] font-medium uppercase leading-none tracking-wide text-muted-foreground">
                      {label}
                    </span>
                  ) : null}
                  <span className="mt-0.5 block truncate text-sm font-semibold leading-none text-foreground">
                    {active.name}
                  </span>
                </span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Ortam seçin…</span>
            )}
            <ChevronsUpDown
              className="ml-1 size-4 shrink-0 text-muted-foreground opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180"
              aria-hidden="true"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          className="w-64 p-1"
        >
          {heading ? (
            <>
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                {heading}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          ) : null}
          {environments.map((env) => {
            const selected = env.id === currentValue;
            const tone = env.tone ?? "neutral";
            return (
              <DropdownMenuItem
                key={env.id}
                disabled={env.disabled}
                onSelect={(event) => {
                  event.preventDefault();
                  if (env.disabled) return;
                  handleSelect(env.id);
                }}
                className="gap-2.5 py-2"
              >
                <EnvDot tone={tone} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {env.name}
                  </span>
                  {env.description ? (
                    <span className="block truncate text-xs text-muted-foreground">
                      {env.description}
                    </span>
                  ) : null}
                </span>
                <span className="sr-only">({toneLabel[tone]})</span>
                <Check
                  className={cn(
                    "size-4 shrink-0 text-primary",
                    selected ? "opacity-100" : "opacity-0"
                  )}
                  aria-hidden="true"
                />
                {selected ? <span className="sr-only">(aktif ortam)</span> : null}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
EnvSwitcher.displayName = "EnvSwitcher";

export { EnvSwitcher };
