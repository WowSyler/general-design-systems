"use client";

/**
 * SortDropdown — Siralama secici.
 * dropdown-menu tabanli tek dugmeli siralama menusu; her secenek yonunu
 * ArrowUp/ArrowDown ikonuyla belli eder, secili secenekte Check gorunur.
 * Tetik dugmesi "Sirala: <secili>" metnini tasir; kontrollu/kontrolsuz calisir.
 */
import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Check, ChevronDown } from "lucide-react";

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

/** Secenegin siralama yonu: artan, azalan veya notr. */
export type SortDropdownDirection = "asc" | "desc" | "none";

export interface SortDropdownOption {
  /** Benzersiz secenek anahtari. */
  value: string;
  /** Menude ve tetik dugmesinde gorunen etiket. */
  label: string;
  /** Yon ikonu: asc -> ArrowUp, desc -> ArrowDown, none -> notr. */
  direction?: SortDropdownDirection;
}

export interface SortDropdownProps {
  options: SortDropdownOption[];
  /** Kontrollu secili deger. */
  value?: string;
  /** Kontrolsuz baslangic degeri. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Tetik onundeki etiket. Varsayilan "Sirala". */
  label?: string;
  /** Secim yokken gosterilecek metin. Varsayilan label ile aynidir. */
  placeholder?: string;
  /** Menu hizalamasi. Varsayilan "end". */
  align?: "start" | "center" | "end";
  /** Statik onizleme icin menuyu acik baslatir. */
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

const directionIcons: Record<SortDropdownDirection, React.ReactNode> = {
  asc: <ArrowUp className="text-muted-foreground" aria-hidden="true" />,
  desc: <ArrowDown className="text-muted-foreground" aria-hidden="true" />,
  none: <ArrowUpDown className="text-muted-foreground" aria-hidden="true" />,
};

const directionText: Record<SortDropdownDirection, string> = {
  asc: "artan",
  desc: "azalan",
  none: "notr",
};

const SortDropdown = React.forwardRef<HTMLButtonElement, SortDropdownProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      label = "Sirala",
      placeholder,
      align = "end",
      defaultOpen = false,
      disabled,
      className,
      contentClassName,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const currentValue = value ?? internalValue;
    const selected = options.find((option) => option.value === currentValue);
    const emptyText = placeholder ?? label;

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
            size="sm"
            disabled={disabled}
            aria-label={selected ? `${label}: ${selected.label}` : emptyText}
            className={cn(
              "gap-2 font-medium",
              !selected && "text-muted-foreground",
              className
            )}
          >
            <ArrowUpDown className="size-4 shrink-0 opacity-60" aria-hidden="true" />
            <span className="truncate">
              {selected ? `${label}: ${selected.label}` : emptyText}
            </span>
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
          className={cn("min-w-[13rem]", contentClassName)}
        >
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
            {label}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {options.map((option) => {
            const direction = option.direction ?? "none";
            const isSelected = option.value === currentValue;
            return (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
                className={cn("gap-2", isSelected && "font-medium")}
              >
                {directionIcons[direction]}
                <span className="flex-1 truncate">{option.label}</span>
                <span className="sr-only">({directionText[direction]})</span>
                <Check
                  className={cn(
                    "size-4 shrink-0 text-primary",
                    isSelected ? "opacity-100" : "opacity-0"
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
SortDropdown.displayName = "SortDropdown";

export { SortDropdown };
