"use client";

/**
 * FilterPanel — Yan panel/kenar cubugu faceted filtre.
 * Acilir-kapanir bolumlerden olusur: checkbox facet listesi (opsiyonel
 * sayac rozetli), radio grup ve fiyat/aralik icin min-max slider + sayi
 * girisleri. Her bolum baslik + Collapsible ile ac/kapa yapar; en altta
 * "Filtreleri uygula" ve "Temizle" aksiyonlari bulunur. Deger controlled
 * veya uncontrolled (defaultValue) kullanilabilir.
 * Kullanim: Dolap (beden/renk/marka/fiyat), Fisly (kategori/hesap/tarih),
 * DeployLens (ortam/durum).
 */
import * as React from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

export interface FilterPanelOption {
  value: string;
  label: string;
  /** Opsiyonel sonuc sayaci; secenek satirinin sonunda rozet olarak gosterilir. */
  count?: number;
}

interface FilterPanelSectionBase {
  /** Deger nesnesinde bu bolumu anahtarlayan benzersiz kimlik. */
  id: string;
  title: string;
  /** Bolum baslangicta acik mi. Varsayilan true. */
  defaultOpen?: boolean;
}

export interface FilterPanelCheckboxSection extends FilterPanelSectionBase {
  type: "checkbox";
  options: FilterPanelOption[];
}

export interface FilterPanelRadioSection extends FilterPanelSectionBase {
  type: "radio";
  options: FilterPanelOption[];
}

export interface FilterPanelRangeSection extends FilterPanelSectionBase {
  type: "range";
  min: number;
  max: number;
  step?: number;
  /** Deger onune eklenen simge (orn. "₺"). */
  prefix?: string;
  /** Deger sonuna eklenen simge (orn. " gun"). */
  suffix?: string;
}

export type FilterPanelSection =
  | FilterPanelCheckboxSection
  | FilterPanelRadioSection
  | FilterPanelRangeSection;

/** [min, max] ikilisi olarak aralik degeri. */
export type FilterPanelRange = [number, number];

/** Bir bolumun tuttugu deger: checkbox -> string[], radio -> string, range -> [min, max]. */
export type FilterPanelSectionValue = string | string[] | FilterPanelRange;

/** Bolum kimliginden degere esleyen tam filtre durumu. */
export type FilterPanelValue = Record<string, FilterPanelSectionValue>;

export interface FilterPanelProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  > {
  sections: FilterPanelSection[];
  /** Panel basligi. Varsayilan "Filtreler". */
  title?: string;
  /** Controlled deger. */
  value?: FilterPanelValue;
  /** Uncontrolled baslangic degeri. */
  defaultValue?: FilterPanelValue;
  onValueChange?: (value: FilterPanelValue) => void;
  /** "Filtreleri uygula" tiklandiginda guncel degerle cagrilir. */
  onApply?: (value: FilterPanelValue) => void;
  /** "Temizle" tiklandiginda cagrilir. */
  onClear?: () => void;
  applyLabel?: string;
  clearLabel?: string;
  /** Alt aksiyon cubugunu (Uygula/Temizle) gizler — aninda filtreleme icin. */
  hideActions?: boolean;
}

function emptyValueForSection(
  section: FilterPanelSection
): FilterPanelSectionValue {
  switch (section.type) {
    case "checkbox":
      return [];
    case "radio":
      return "";
    case "range":
      return [section.min, section.max];
  }
}

/** Her bolum icin deger uretir; verilen seed varsa onu, yoksa bos degeri kullanir. */
function buildValue(
  sections: FilterPanelSection[],
  seed?: FilterPanelValue
): FilterPanelValue {
  const result: FilterPanelValue = {};
  for (const section of sections) {
    result[section.id] = seed?.[section.id] ?? emptyValueForSection(section);
  }
  return result;
}

function readStringArray(value: FilterPanelSectionValue | undefined): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function readString(value: FilterPanelSectionValue | undefined): string {
  return typeof value === "string" ? value : "";
}

function readRange(
  value: FilterPanelSectionValue | undefined,
  section: FilterPanelRangeSection
): FilterPanelRange {
  if (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  ) {
    return [value[0], value[1]];
  }
  return [section.min, section.max];
}

/** Bir bolumun kac aktif secimi oldugunu dondurur (baslik rozeti + toplam sayaci icin). */
function countSectionActive(
  section: FilterPanelSection,
  value: FilterPanelValue
): number {
  const raw = value[section.id];
  switch (section.type) {
    case "checkbox":
      return readStringArray(raw).length;
    case "radio":
      return readString(raw) ? 1 : 0;
    case "range": {
      const [min, max] = readRange(raw, section);
      return min !== section.min || max !== section.max ? 1 : 0;
    }
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const FilterPanel = React.forwardRef<HTMLDivElement, FilterPanelProps>(
  (
    {
      sections,
      title = "Filtreler",
      value,
      defaultValue,
      onValueChange,
      onApply,
      onClear,
      applyLabel = "Filtreleri uygula",
      clearLabel = "Temizle",
      hideActions = false,
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<FilterPanelValue>(
      () => buildValue(sections, defaultValue)
    );

    // Controlled/uncontrolled fark etmeksizin her bolum icin gecerli deger garantile.
    const current = React.useMemo(
      () => buildValue(sections, isControlled ? value : internalValue),
      [sections, isControlled, value, internalValue]
    );

    const [openMap, setOpenMap] = React.useState<Record<string, boolean>>(() => {
      const state: Record<string, boolean> = {};
      for (const section of sections) {
        state[section.id] = section.defaultOpen ?? true;
      }
      return state;
    });

    const activeCount = React.useMemo(
      () =>
        sections.reduce(
          (sum, section) => sum + countSectionActive(section, current),
          0
        ),
      [sections, current]
    );

    const commit = React.useCallback(
      (next: FilterPanelValue) => {
        if (!isControlled) {
          setInternalValue(next);
        }
        onValueChange?.(next);
      },
      [isControlled, onValueChange]
    );

    const setSection = React.useCallback(
      (id: string, sectionValue: FilterPanelSectionValue) => {
        commit({ ...current, [id]: sectionValue });
      },
      [commit, current]
    );

    const handleClear = () => {
      commit(buildValue(sections));
      onClear?.();
    };

    const handleApply = () => {
      onApply?.(current);
    };

    const toggleCheckbox = (
      section: FilterPanelCheckboxSection,
      optionValue: string,
      checked: boolean
    ) => {
      const selected = readStringArray(current[section.id]);
      const next = checked
        ? [...selected, optionValue]
        : selected.filter((item) => item !== optionValue);
      setSection(section.id, next);
    };

    const updateRangeBound = (
      section: FilterPanelRangeSection,
      index: 0 | 1,
      raw: string
    ) => {
      const parsed = Number(raw);
      if (Number.isNaN(parsed)) return;
      const [min, max] = readRange(current[section.id], section);
      const next: FilterPanelRange = index === 0 ? [parsed, max] : [min, parsed];
      next[0] = clamp(next[0], section.min, section.max);
      next[1] = clamp(next[1], section.min, section.max);
      if (next[0] > next[1]) {
        if (index === 0) next[0] = next[1];
        else next[1] = next[0];
      }
      setSection(section.id, next);
    };

    const renderCount = (count?: number) =>
      typeof count === "number" ? (
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
          {count}
        </span>
      ) : null;

    const renderSection = (section: FilterPanelSection) => {
      if (section.type === "checkbox") {
        const selected = readStringArray(current[section.id]);
        return (
          <div
            role="group"
            aria-label={section.title}
            className="space-y-2.5 pt-0.5"
          >
            {section.options.map((option) => {
              const inputId = `${section.id}-${option.value}`;
              return (
                <div key={option.value} className="flex items-center gap-2.5">
                  <Checkbox
                    id={inputId}
                    checked={selected.includes(option.value)}
                    onCheckedChange={(checked) =>
                      toggleCheckbox(section, option.value, checked === true)
                    }
                  />
                  <Label
                    htmlFor={inputId}
                    className="flex flex-1 cursor-pointer items-center justify-between gap-2 font-normal text-muted-foreground transition-colors peer-data-[state=checked]:text-foreground"
                  >
                    <span className="truncate">{option.label}</span>
                    {renderCount(option.count)}
                  </Label>
                </div>
              );
            })}
          </div>
        );
      }

      if (section.type === "radio") {
        const selected = readString(current[section.id]);
        return (
          <RadioGroup
            value={selected}
            onValueChange={(next) => setSection(section.id, next)}
            className="gap-2.5 pt-0.5"
          >
            {section.options.map((option) => {
              const inputId = `${section.id}-${option.value}`;
              return (
                <div key={option.value} className="flex items-center gap-2.5">
                  <RadioGroupItem id={inputId} value={option.value} />
                  <Label
                    htmlFor={inputId}
                    className="flex flex-1 cursor-pointer items-center justify-between gap-2 font-normal text-muted-foreground"
                  >
                    <span className="truncate">{option.label}</span>
                    {renderCount(option.count)}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        );
      }

      const [minValue, maxValue] = readRange(current[section.id], section);
      const step = section.step ?? 1;
      const format = (n: number) =>
        `${section.prefix ?? ""}${n}${section.suffix ?? ""}`;

      return (
        <div className="space-y-4 pt-1">
          <Slider
            value={[minValue, maxValue]}
            min={section.min}
            max={section.max}
            step={step}
            minStepsBetweenThumbs={0}
            onValueChange={(next) =>
              setSection(section.id, [next[0], next[1]] as FilterPanelRange)
            }
            aria-label={`${section.title} araligi`}
          />
          <div className="flex items-center justify-between text-xs tabular-nums text-muted-foreground">
            <span>{format(minValue)}</span>
            <span>{format(maxValue)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              value={minValue}
              min={section.min}
              max={maxValue}
              step={step}
              onChange={(event) =>
                updateRangeBound(section, 0, event.target.value)
              }
              className="h-8 tabular-nums"
              aria-label={`${section.title} en dusuk deger`}
            />
            <span aria-hidden="true" className="text-muted-foreground">
              —
            </span>
            <Input
              type="number"
              inputMode="numeric"
              value={maxValue}
              min={minValue}
              max={section.max}
              step={step}
              onChange={(event) =>
                updateRangeBound(section, 1, event.target.value)
              }
              className="h-8 tabular-nums"
              aria-label={`${section.title} en yuksek deger`}
            />
          </div>
        </div>
      );
    };

    return (
      <div
        ref={ref}
        role="region"
        aria-label={title}
        className={cn(
          "w-full max-w-xs rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between gap-2 pb-1">
          <div className="flex items-center gap-2">
            <SlidersHorizontal
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          </div>
          {activeCount > 0 ? (
            <Badge variant="secondary" className="tabular-nums">
              {activeCount} aktif
            </Badge>
          ) : null}
        </div>

        <div>
          {sections.map((section) => {
            const sectionActive = countSectionActive(section, current);
            return (
              <Collapsible
                key={section.id}
                open={openMap[section.id] ?? true}
                onOpenChange={(open) =>
                  setOpenMap((prev) => ({ ...prev, [section.id]: open }))
                }
                className="border-b border-border/60 py-3 last:border-b-0"
              >
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="group flex w-full items-center justify-between gap-2 rounded-md text-left text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="flex items-center gap-2">
                      {section.title}
                      {sectionActive > 0 ? (
                        <Badge variant="secondary" className="tabular-nums">
                          {sectionActive}
                        </Badge>
                      ) : null}
                    </span>
                    <ChevronDown
                      className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
                      aria-hidden="true"
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=open]:animate-fade-up">
                  <div className="pt-3">{renderSection(section)}</div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        {!hideActions ? (
          <div className="flex items-center gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={activeCount === 0}
              className="flex-1"
            >
              <X aria-hidden="true" />
              {clearLabel}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApply}
              className="flex-1"
            >
              {applyLabel}
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
);
FilterPanel.displayName = "FilterPanel";

export { FilterPanel };
