"use client";

/**
 * CategoryPicker — Ikon + etiketli kategori secici (Fisly islem kategorisi, butce).
 * Tonlu ikon karolarindan olusan bir grid; secili karo ring-primary + Check rozeti
 * gosterir. Opsiyonel arama kutusu etikete gore filtreler; opsiyonel
 * "+ Yeni kategori" karosu yeni kategori olusturmayi tetikler.
 * Grid role="radiogroup", her karo role="radio" olarak isaretlenir.
 * value + onValueChange ile kontrollu kullanilir.
 */
import * as React from "react";
import { Check, Plus, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Tonlu ikon karosu icin grafik renk tonu (1-5). */
export type CategoryPickerTone = 1 | 2 | 3 | 4 | 5;

export interface CategoryPickerOption {
  /** Benzersiz kategori degeri. */
  value: string;
  /** Kategori etiketi (arama bu metne gore filtreler). */
  label: React.ReactNode;
  /** Kategori ikonu (lucide ikonu onerilir). */
  icon?: React.ReactNode;
  /** Ikon karosunun renk tonu; verilmezse siraya gore atanir. */
  tone?: CategoryPickerTone;
  /** Kategorinin devre disi olup olmadigi. */
  disabled?: boolean;
}

const toneTileClasses: Record<CategoryPickerTone, string> = {
  1: "bg-chart-1/15",
  2: "bg-chart-2/15",
  3: "bg-chart-3/15",
  4: "bg-chart-4/15",
  5: "bg-chart-5/15",
};

export interface CategoryPickerItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** Kategori ikonu. */
  icon?: React.ReactNode;
  /** Kategori etiketi. */
  label: React.ReactNode;
  /** Ikon karosunun renk tonu (1-5). */
  tone?: CategoryPickerTone;
  /** Karonun secili olup olmadigi. */
  selected?: boolean;
}

const CategoryPickerItem = React.forwardRef<HTMLButtonElement, CategoryPickerItemProps>(
  ({ icon, label, tone = 1, selected = false, disabled, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={selected}
        disabled={disabled}
        className={cn(
          "group relative flex flex-col items-center justify-center gap-2 rounded-xl border bg-card p-3 text-center text-card-foreground transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          selected
            ? "border-transparent ring-2 ring-primary shadow-glow"
            : "shadow-sm hover:-translate-y-0.5 hover:border-ring hover:shadow-md",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
        {...props}
      >
        {/* Secim gostergesi */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute end-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform duration-200",
            selected ? "scale-100" : "scale-0",
          )}
        >
          <Check className="size-2.5" />
        </span>

        {/* Tonlu ikon karosu */}
        <span
          aria-hidden="true"
          className={cn(
            "flex size-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 [&_svg]:size-5",
            toneTileClasses[tone],
          )}
          style={{ color: `hsl(var(--chart${tone}))` }}
        >
          {icon}
        </span>

        <span className="line-clamp-2 text-xs font-medium leading-tight">{label}</span>
      </button>
    );
  },
);
CategoryPickerItem.displayName = "CategoryPickerItem";

export interface CategoryPickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Gosterilecek kategoriler. */
  options: CategoryPickerOption[];
  /** Secili kategori degeri. */
  value?: string;
  /** Secim degistiginde cagrilir. */
  onValueChange?: (value: string) => void;
  /** Genis ekranda sutun sayisi (mobilde daralir). */
  columns?: 2 | 3 | 4 | 5;
  /** Arama kutusunu gosterir; etikete gore filtreler. */
  searchable?: boolean;
  /** Arama kutusu placeholder metni. */
  searchPlaceholder?: string;
  /** Verilirse "+ Yeni kategori" karosu gosterilir ve tiklaninca cagrilir. */
  onAddCategory?: () => void;
  /** "Yeni kategori" karosunun etiketi. */
  addLabel?: string;
  /** Radiogroup icin erisilebilir etiket. */
  label?: string;
  /** Arama sonucu bos oldugunda gosterilecek metin. */
  emptyText?: string;
}

const columnClasses: Record<2 | 3 | 4 | 5, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-3 sm:grid-cols-5",
};

/** Etiketi arama icin duz metne cevirir (string/number degilse value'ye duser). */
function optionSearchText(option: CategoryPickerOption): string {
  if (typeof option.label === "string") return option.label;
  if (typeof option.label === "number") return String(option.label);
  return option.value;
}

const CategoryPicker = React.forwardRef<HTMLDivElement, CategoryPickerProps>(
  (
    {
      options,
      value,
      onValueChange,
      columns = 4,
      searchable = false,
      searchPlaceholder = "Kategori ara...",
      onAddCategory,
      addLabel = "Yeni kategori",
      label = "Kategori",
      emptyText = "Kategori bulunamadi",
      className,
      ...props
    },
    ref,
  ) => {
    const [query, setQuery] = React.useState("");
    const trimmed = query.trim().toLocaleLowerCase("tr-TR");
    const filtered =
      searchable && trimmed
        ? options.filter((option) =>
            optionSearchText(option).toLocaleLowerCase("tr-TR").includes(trimmed),
          )
        : options;

    return (
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
        {searchable ? (
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="ps-9"
            />
          </div>
        ) : null}

        {filtered.length > 0 ? (
          <div
            role="radiogroup"
            aria-label={label}
            className={cn("grid gap-2.5", columnClasses[columns])}
          >
            {filtered.map((option, index) => (
              <CategoryPickerItem
                key={option.value}
                icon={option.icon}
                label={option.label}
                tone={option.tone ?? (((index % 5) + 1) as CategoryPickerTone)}
                selected={option.value === value}
                disabled={option.disabled}
                onClick={() => onValueChange?.(option.value)}
              />
            ))}
            {onAddCategory ? (
              <button
                type="button"
                onClick={onAddCategory}
                className={cn(
                  "group flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-muted/30 p-3 text-center text-muted-foreground transition-all duration-200",
                  "hover:-translate-y-0.5 hover:border-ring hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                )}
              >
                <span
                  aria-hidden="true"
                  className="flex size-11 items-center justify-center rounded-xl bg-background transition-transform duration-200 group-hover:scale-105 [&_svg]:size-5"
                >
                  <Plus />
                </span>
                <span className="line-clamp-2 text-xs font-medium leading-tight">{addLabel}</span>
              </button>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-input bg-muted/20 px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">{emptyText}</p>
            {onAddCategory ? (
              <button
                type="button"
                onClick={onAddCategory}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 pointer-coarse:min-h-11 text-sm font-medium shadow-sm transition-all duration-200",
                  "hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground hover:shadow-md",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                )}
              >
                <Plus className="size-3.5" />
                {addLabel}
              </button>
            ) : null}
          </div>
        )}
      </div>
    );
  },
);
CategoryPicker.displayName = "CategoryPicker";

export { CategoryPicker, CategoryPickerItem };
