/**
 * CommandPalette — her zaman açık spotlight arama paneli.
 * Dialog değil; sayfa içine gömülen duraıan bir kart olarak render olur.
 * cmdk primitifleri üzerine kurulu: üstte ince marka gradyan şeridi,
 * gruplu komut listesi ve her komutta kısayol Kbd'leri. cmdk ilk öğeyi
 * otomatik seçili gösterdiği için statik yakalamada anlamlı, vurgulu bir
 * duraıan hâl görünür.
 */
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui-extras/kbd";

export interface CommandPaletteItem {
  icon?: React.ReactNode;
  label: string;
  /** Boşlukla ayrılmış kısayol tuşları, ör. "⌘ K" → iki Kbd kapağı. */
  shortcut?: string;
}

export interface CommandPaletteGroup {
  heading: string;
  items: CommandPaletteItem[];
}

export interface CommandPaletteProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  groups: CommandPaletteGroup[];
  placeholder?: string;
  /** Sonuç bulunamadığında gösterilen metin. */
  emptyMessage?: string;
}

const CommandPalette = React.forwardRef<HTMLDivElement, CommandPaletteProps>(
  (
    {
      groups,
      placeholder = "Komut ara veya yaz...",
      emptyMessage = "Sonuç bulunamadı.",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-lg overflow-hidden rounded-2xl border bg-popover shadow-2xl",
          className
        )}
        {...props}
      >
        {/* Marka gradyan şeridi. */}
        <div aria-hidden="true" className="h-1 bg-brand-gradient" />

        <Command className="bg-popover">
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup key={group.heading} heading={group.heading}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.label}
                    value={item.label}
                    className="min-h-11 gap-3"
                  >
                    {item.icon ? (
                      <span
                        aria-hidden="true"
                        className="flex size-4 items-center justify-center text-muted-foreground [&>svg]:size-4"
                      >
                        {item.icon}
                      </span>
                    ) : null}
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.shortcut ? (
                      <KbdGroup className="ms-auto">
                        {item.shortcut.split(/\s+/).map((key, index) => (
                          <Kbd key={index}>{key}</Kbd>
                        ))}
                      </KbdGroup>
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </div>
    );
  }
);
CommandPalette.displayName = "CommandPalette";

export { CommandPalette };
