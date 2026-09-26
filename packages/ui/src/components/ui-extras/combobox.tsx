/**
 * Combobox — Aranabilir açılır seçim kutusu.
 * Popover + Command birleşimiyle klasik shadcn combobox deseni:
 * outline tetik butonu, arama girişi, seçili öğede Check işareti.
 */
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  /** Statik önizleme için listeyi açık başlatır. */
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
  /** Erişilebilir ad (görünür bir <label> yoksa). Verilmezse placeholder kullanılır. */
  "aria-label"?: string;
  /** Görünür etiketin id'si (aria-labelledby). */
  "aria-labelledby"?: string;
  /** Bir <label htmlFor> ile eşlemek için tetikleyici id'si. */
  id?: string;
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = "Seçim yapın…",
      searchPlaceholder = "Ara…",
      emptyMessage = "Sonuç bulunamadı.",
      defaultOpen = false,
      disabled,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      id,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const [internalValue, setInternalValue] = React.useState(value ?? "");
    const currentValue = value ?? internalValue;
    const selected = options.find((option) => option.value === currentValue);

    const handleSelect = (next: string) => {
      const resolved = next === currentValue ? "" : next;
      setInternalValue(resolved);
      onValueChange?.(resolved);
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            id={id}
            role="combobox"
            aria-expanded={open}
            aria-label={ariaLabelledby || id ? ariaLabel : (ariaLabel ?? placeholder)}
            aria-labelledby={ariaLabelledby}
            disabled={disabled}
            className={cn(
              "h-11 w-full justify-between font-normal",
              !selected && "text-muted-foreground",
              className
            )}
          >
            <span className="truncate">
              {selected ? selected.label : placeholder}
            </span>
            <ChevronsUpDown
              className="ms-2 size-4 shrink-0 opacity-50"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label]}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "me-2 size-4",
                        currentValue === option.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                      aria-hidden="true"
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
Combobox.displayName = "Combobox";

export { Combobox };
