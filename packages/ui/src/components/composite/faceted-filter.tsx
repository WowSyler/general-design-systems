"use client";

/**
 * FacetedFilter — Tek facet grubu icin kompakt filtre (data-table filtresi gibi).
 * Kesikli outline tetik butonu, secili sayisini rozetle gosterir; Popover +
 * Command icinde aranabilir checkbox listesi acilir. Her secenekte adet sayaci,
 * altta "Secilenleri temizle" eylemi bulunur. Arama cmdk ile yapilir.
 * Secim durumu kontrollu (selected) veya kontrolsuz (defaultSelected) calisir.
 */
import * as React from "react";
import { Check, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface FacetedFilterOption {
  value: string;
  label: string;
  /** Bu secenege dusen kayit adedi (sagda tabular-nums gosterilir). */
  count?: number;
  /** Etiketin solunda gosterilecek lucide ikon (size-4). */
  icon?: React.ReactNode;
}

export interface FacetedFilterProps {
  /** Facet basligi (tetik butonunda ve arama baslangicinda). */
  title: string;
  options: FacetedFilterOption[];
  /** Kontrollu secili degerler. */
  selected?: string[];
  /** Kontrolsuz baslangic secimi. */
  defaultSelected?: string[];
  onSelectedChange?: (values: string[]) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  clearLabel?: string;
  /** Tetikte ozetlenmeden once en fazla kac rozet gosterilecegi. */
  maxBadges?: number;
  /** Statik onizleme icin listeyi acik baslatir. */
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
}

const FacetedFilter = React.forwardRef<HTMLButtonElement, FacetedFilterProps>(
  (
    {
      title,
      options,
      selected,
      defaultSelected = [],
      onSelectedChange,
      searchPlaceholder = "Ara…",
      emptyMessage = "Sonuc bulunamadi.",
      clearLabel = "Secilenleri temizle",
      maxBadges = 2,
      defaultOpen = false,
      disabled,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const [internalSelected, setInternalSelected] =
      React.useState<string[]>(defaultSelected);
    const currentSelected = selected ?? internalSelected;
    const selectedSet = React.useMemo(
      () => new Set(currentSelected),
      [currentSelected]
    );

    const commit = (next: string[]) => {
      if (selected === undefined) setInternalSelected(next);
      onSelectedChange?.(next);
    };

    const toggle = (value: string) => {
      const next = selectedSet.has(value)
        ? currentSelected.filter((v) => v !== value)
        : [...currentSelected, value];
      commit(next);
    };

    const clear = () => commit([]);

    const selectedCount = selectedSet.size;
    const selectedOptions = options.filter((o) => selectedSet.has(o.value));

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            size="sm"
            disabled={disabled}
            aria-expanded={open}
            aria-label={
              selectedCount > 0
                ? `${title}: ${selectedCount} secili`
                : `${title} filtresi`
            }
            className={cn("h-9 border-dashed", className)}
          >
            <PlusCircle className="size-4 shrink-0 opacity-60" aria-hidden="true" />
            {title}
            {selectedCount > 0 ? (
              <>
                <Separator
                  orientation="vertical"
                  className="mx-0.5 h-4"
                />
                <Badge
                  variant="secondary"
                  className="rounded px-1.5 font-normal tabular-nums lg:hidden"
                >
                  {selectedCount}
                </Badge>
                <div className="hidden items-center gap-1 lg:flex">
                  {selectedCount > maxBadges ? (
                    <Badge
                      variant="secondary"
                      className="rounded px-1.5 font-normal tabular-nums"
                    >
                      {selectedCount} secili
                    </Badge>
                  ) : (
                    selectedOptions.map((option) => (
                      <Badge
                        key={option.value}
                        variant="secondary"
                        className="max-w-[8rem] truncate rounded px-1.5 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                  )}
                </div>
              </>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup heading={title}>
                {options.map((option) => {
                  const isSelected = selectedSet.has(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      keywords={[option.label]}
                      onSelect={() => toggle(option.value)}
                    >
                      <div
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input [&_svg]:invisible"
                        )}
                        aria-hidden="true"
                      >
                        <Check className="size-3.5" />
                      </div>
                      {option.icon ? (
                        <span
                          className="text-muted-foreground [&_svg]:size-4"
                          aria-hidden="true"
                        >
                          {option.icon}
                        </span>
                      ) : null}
                      <span className="flex-1 truncate">{option.label}</span>
                      {option.count !== undefined ? (
                        <span className="ms-auto flex h-5 min-w-5 items-center justify-center rounded bg-muted px-1 font-mono text-xs tabular-nums text-muted-foreground">
                          {option.count}
                        </span>
                      ) : null}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedCount > 0 ? (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={clear}
                      className="justify-center text-center text-muted-foreground data-[selected=true]:text-foreground"
                    >
                      {clearLabel}
                    </CommandItem>
                  </CommandGroup>
                </>
              ) : null}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
FacetedFilter.displayName = "FacetedFilter";

export { FacetedFilter };
