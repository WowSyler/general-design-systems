"use client";

/**
 * MultiSelect — Coklu secim + kaldirilabilir cip (token) girisi.
 * Combobox tek deger secerken bu bilesen birden fazla degeri bir arada tutar:
 * secilenler girisin icinde X ile kaldirilabilir cip olarak gorunur, Popover +
 * Command ile aranabilir bir liste sunulur (secili ogede Check isareti). Opsiyonel
 * creatable ile listede olmayan yeni deger eklenir; maxItems ile secim adedi
 * sinirlanir. value string[] + onValueChange ile kontrollu/kontrolsuz calisir.
 */
import * as React from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
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

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  /** Kontrollu secili degerler. */
  value?: string[];
  /** Kontrolsuz baslangic degerleri. */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  /** Listede olmayan yeni deger eklemeye izin verir. */
  creatable?: boolean;
  /** "Ekle" satirinin etiketini uretir. */
  createLabel?: (query: string) => string;
  /** En fazla secilebilecek oge sayisi. */
  maxItems?: number;
  /** Statik onizleme icin listeyi acik baslatir. */
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

const normalize = (value: string) => value.trim().toLocaleLowerCase("tr-TR");

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      placeholder = "Seçim yapın…",
      searchPlaceholder = "Ara…",
      emptyMessage = "Sonuç bulunamadı.",
      creatable = false,
      createLabel = (query) => `"${query}" ekle`,
      maxItems,
      defaultOpen = false,
      disabled,
      className,
      contentClassName,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const [uncontrolled, setUncontrolled] = React.useState<string[]>(
      defaultValue ?? []
    );
    const [search, setSearch] = React.useState("");

    const selected = value ?? uncontrolled;
    const atLimit =
      typeof maxItems === "number" && selected.length >= maxItems;

    const labelByValue = React.useMemo(() => {
      const map = new Map<string, string>();
      for (const option of options) map.set(option.value, option.label);
      return map;
    }, [options]);
    const labelFor = (val: string) => labelByValue.get(val) ?? val;

    const commit = (next: string[]) => {
      if (value === undefined) setUncontrolled(next);
      onValueChange?.(next);
    };

    const toggle = (val: string) => {
      if (selected.includes(val)) {
        commit(selected.filter((item) => item !== val));
      } else if (!atLimit) {
        commit([...selected, val]);
      }
    };

    const remove = (val: string) => {
      commit(selected.filter((item) => item !== val));
    };

    const query = search.trim();
    const normalizedQuery = normalize(query);
    const filtered = query
      ? options.filter((option) =>
          normalize(option.label).includes(normalizedQuery)
        )
      : options;

    const exactExists =
      options.some((option) => normalize(option.label) === normalizedQuery) ||
      selected.some((val) => normalize(labelFor(val)) === normalizedQuery);
    const showCreate = creatable && query.length > 0 && !exactExists && !atLimit;

    const create = () => {
      if (!query || atLimit || selected.includes(query)) return;
      commit([...selected, query]);
      setSearch("");
    };

    return (
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (disabled) return;
          setOpen(next);
          if (!next) setSearch("");
        }}
      >
        <PopoverTrigger asChild>
          <div
            ref={ref}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(event) => {
              if (disabled) return;
              if (
                event.key === "Enter" ||
                event.key === " " ||
                event.key === "ArrowDown"
              ) {
                event.preventDefault();
                setOpen(true);
              }
            }}
            className={cn(
              "group flex min-h-11 w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background transition-all duration-200 hover:border-ring/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2 aria-disabled:pointer-events-none aria-disabled:opacity-50",
              className
            )}
          >
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selected.map((val) => (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 rounded-full bg-secondary py-0.5 pl-2.5 pr-1 text-xs font-medium text-secondary-foreground transition-all duration-200"
                >
                  <span className="max-w-[10rem] truncate">{labelFor(val)}</span>
                  <button
                    type="button"
                    aria-label={`${labelFor(val)} etiketini kaldır`}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      remove(val);
                    }}
                    className="-mr-0.5 inline-flex size-4 items-center justify-center rounded-full transition-colors duration-200 hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="size-3" aria-hidden="true" />
                  </button>
                </span>
              ))
            )}
            <ChevronsUpDown
              className="ml-auto size-4 shrink-0 self-center opacity-50"
              aria-hidden="true"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className={cn(
            "w-[--radix-popover-trigger-width] p-0",
            contentClassName
          )}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {filtered.length === 0 && !showCreate ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </p>
              ) : null}
              {showCreate ? (
                <CommandGroup>
                  <CommandItem
                    value={`__create__${query}`}
                    onSelect={create}
                    className="text-primary"
                  >
                    <Plus className="mr-2 size-4" aria-hidden="true" />
                    {createLabel(query)}
                  </CommandItem>
                </CommandGroup>
              ) : null}
              {filtered.length > 0 ? (
                <CommandGroup>
                  {filtered.map((option) => {
                    const isSelected = selected.includes(option.value);
                    const isDisabled = !isSelected && atLimit;
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        disabled={isDisabled}
                        onSelect={() => toggle(option.value)}
                        className={cn(isDisabled && "opacity-50")}
                      >
                        <Check
                          className={cn(
                            "mr-2 size-4 text-primary",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                          aria-hidden="true"
                        />
                        <span className="flex-1 truncate">{option.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : null}
            </CommandList>
            {typeof maxItems === "number" ? (
              <div className="border-t px-3 py-2 text-xs text-muted-foreground">
                <span className="tabular-nums">
                  {selected.length}/{maxItems}
                </span>{" "}
                seçildi
              </div>
            ) : null}
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
