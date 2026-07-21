"use client";

/**
 * ColorPicker — Renk secici (Dolap urun/etiket rengi).
 * Popover tetikte secili rengin swatch onizlemesi + HEX metni durur; icerikte
 * onceden tanimli swatch gridi, opsiyonel serbest HEX girisi ve son kullanilanlar
 * satiri bulunur. Marka disi serbest HEX burada kabul edilir cunku deger
 * kullanici-verisidir (urun rengi, etiket rengi). Kontrollu/kontrolsuz calisir.
 */
import * as React from "react";
import { Check, Palette, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/** Palette yuvasindaki tek bir renk secenegi. */
export interface ColorPickerSwatch {
  /** HEX renk degeri — kullanici-verisidir, tema tokenı degildir. */
  value: string;
  /** Erisilebilirlik ve title icin okunabilir renk adi. */
  label: string;
}

export interface ColorPickerProps {
  /** Kontrollu secili HEX deger. */
  value?: string;
  /** Kontrolsuz baslangic HEX degeri. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Onceden tanimli renk yuvalari. Verilmezse yerlesik palet kullanilir. */
  swatches?: ColorPickerSwatch[];
  /** Son kullanilan renkler (HEX). Ilk deger yerlesik listeyi tohumlar. */
  recentColors?: string[];
  /** Serbest HEX girisini gosterir. Varsayilan true. */
  allowCustom?: boolean;
  /** Secim yokken tetikte gorunen metin. */
  placeholder?: string;
  /** Tetigin aria-label degeri. Varsayilan "Renk sec". */
  label?: string;
  /** Statik onizleme icin paleti acik baslatir. */
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

/** Yerlesik Dolap urun-rengi paleti (kullanici-verisi ornegi). */
const defaultSwatches: ColorPickerSwatch[] = [
  { value: "#1c1c1e", label: "Siyah" },
  { value: "#6b7280", label: "Antrasit" },
  { value: "#f5f0e8", label: "Krem" },
  { value: "#ffffff", label: "Beyaz" },
  { value: "#b91c1c", label: "Kirmizi" },
  { value: "#c2410c", label: "Kiremit" },
  { value: "#c9a24b", label: "Hardal" },
  { value: "#2f7d4f", label: "Cam Yesili" },
  { value: "#0e7490", label: "Petrol" },
  { value: "#31427a", label: "Lacivert" },
  { value: "#7c3aed", label: "Mor" },
  { value: "#b0555f", label: "Gul Kurusu" },
];

const HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** Girisi normalize eder: bas # ekler, kirpar, kucuk harfe cevirir. */
function normalizeHex(raw: string): string {
  const trimmed = raw.trim();
  const prefixed = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  return prefixed.toLowerCase();
}

function isValidHex(raw: string): boolean {
  return HEX_PATTERN.test(normalizeHex(raw));
}

/** HEX rengin acik/koyu olusuna gore zit isaret rengi dondurur. */
function contrastColor(hex: string): string {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1a1a1a" : "#ffffff";
}

const ColorPicker = React.forwardRef<HTMLButtonElement, ColorPickerProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      swatches = defaultSwatches,
      recentColors = [],
      allowCustom = true,
      placeholder = "Renk secilmedi",
      label = "Renk sec",
      defaultOpen = false,
      disabled,
      className,
      contentClassName,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const [recents, setRecents] = React.useState<string[]>(() =>
      recentColors.map(normalizeHex).slice(0, 8)
    );
    const [draft, setDraft] = React.useState("");
    const [draftTouched, setDraftTouched] = React.useState(false);

    const currentValue = (value ?? internalValue).toLowerCase();
    const draftInvalid = draftTouched && draft !== "" && !isValidHex(draft);

    const selectedLabel = swatches.find(
      (swatch) => swatch.value.toLowerCase() === currentValue
    )?.label;

    // Palet acildiginda serbest HEX girisini guncel degerle esitle.
    React.useEffect(() => {
      if (open) {
        setDraft(currentValue ? currentValue.toUpperCase() : "");
        setDraftTouched(false);
      }
    }, [open, currentValue]);

    const commit = (next: string, close = true) => {
      const normalized = normalizeHex(next);
      if (value === undefined) {
        setInternalValue(normalized);
      }
      setRecents((prev) =>
        [normalized, ...prev.filter((item) => item !== normalized)].slice(0, 8)
      );
      onValueChange?.(normalized);
      if (close) {
        setOpen(false);
      }
    };

    const applyDraft = () => {
      if (isValidHex(draft)) {
        commit(draft);
      } else {
        setDraftTouched(true);
      }
    };

    const renderGrid = (items: ColorPickerSwatch[], gridLabel: string) => (
      <div role="group" aria-label={gridLabel} className="grid grid-cols-6 gap-1.5">
        {items.map((item) => {
          const hex = item.value.toLowerCase();
          const isSelected = hex === currentValue;
          return (
            <button
              key={`${gridLabel}-${item.value}`}
              type="button"
              aria-pressed={isSelected}
              aria-label={item.label}
              title={item.label}
              onClick={() => commit(item.value)}
              className={cn(
                "relative flex size-8 items-center justify-center rounded-md border border-border/50 transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isSelected &&
                  "ring-2 ring-ring ring-offset-2 ring-offset-background"
              )}
              style={{ backgroundColor: item.value }}
            >
              {isSelected ? (
                <Check
                  className="size-4 drop-shadow-sm"
                  style={{ color: contrastColor(item.value) }}
                  aria-hidden="true"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    );

    const recentSwatches: ColorPickerSwatch[] = recents.map((hex) => ({
      value: hex,
      label: hex.toUpperCase(),
    }));

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            aria-label={selectedLabel ? `${label}: ${selectedLabel}` : label}
            disabled={disabled}
            className={cn(
              "h-11 w-full justify-start gap-2.5 font-normal",
              className
            )}
          >
            {currentValue ? (
              <span
                className="size-5 shrink-0 rounded-md border border-border/60 shadow-inner"
                style={{ backgroundColor: currentValue }}
                aria-hidden="true"
              />
            ) : (
              <Palette
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                "flex-1 truncate text-left",
                !currentValue && "text-muted-foreground"
              )}
            >
              {selectedLabel ?? (currentValue ? "" : placeholder)}
            </span>
            {currentValue ? (
              <span className="font-mono text-xs uppercase tabular-nums text-muted-foreground">
                {currentValue}
              </span>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className={cn("w-64 space-y-3", contentClassName)}
        >
          {renderGrid(swatches, "Renk paleti")}

          {recentSwatches.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                Son kullanilanlar
              </p>
              {renderGrid(recentSwatches, "Son kullanilan renkler")}
            </div>
          ) : null}

          {allowCustom ? (
            <div className="space-y-1.5 border-t border-border pt-3">
              <Label
                htmlFor="color-picker-hex"
                className="text-xs font-medium text-muted-foreground"
              >
                Ozel renk (HEX)
              </Label>
              <div className="flex items-center gap-2">
                <span
                  className="size-9 shrink-0 rounded-md border border-input shadow-inner"
                  style={{
                    backgroundColor: isValidHex(draft)
                      ? normalizeHex(draft)
                      : "transparent",
                  }}
                  aria-hidden="true"
                />
                <Input
                  id="color-picker-hex"
                  value={draft}
                  placeholder="#1c1c1e"
                  spellCheck={false}
                  autoComplete="off"
                  maxLength={7}
                  aria-invalid={draftInvalid || undefined}
                  aria-label="Ozel HEX renk kodu"
                  onChange={(event) => {
                    setDraft(event.target.value);
                    setDraftTouched(true);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      applyDraft();
                    }
                  }}
                  className="h-9 font-mono text-sm uppercase tabular-nums"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={applyDraft}
                  disabled={!isValidHex(draft)}
                  aria-label="Ozel rengi uygula"
                  className="size-9 shrink-0"
                >
                  <Plus aria-hidden="true" />
                </Button>
              </div>
              {draftInvalid ? (
                <p role="alert" className="text-xs text-destructive">
                  Gecerli bir HEX kodu girin (orn. #1c1c1e).
                </p>
              ) : null}
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
    );
  }
);
ColorPicker.displayName = "ColorPicker";

export { ColorPicker, defaultSwatches as colorPickerDefaultSwatches };
