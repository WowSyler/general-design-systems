/**
 * SearchBar — Arama cubugu (DeployLens komut arama).
 * Solda buyutec ikonu, sagda opsiyonel klavye kisayolu (Kbd) bulunan
 * Input tabanli arama alani. Odak parlama deseni Input'tan gelir.
 * className sarmalayiciya uygulanir.
 */
"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import { Kbd } from "./kbd";

export interface SearchBarProps
  extends Omit<React.ComponentProps<typeof Input>, "type"> {
  /** Sagda gosterilecek kisayol metni (or. "⌘K"). */
  shortcut?: string;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ shortcut, placeholder = "Ara...", className, ...props }, ref) => (
    <div className={cn("relative w-full", className)}>
      <Search
        className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        className={cn("ps-9", shortcut && "pe-12")}
        {...props}
      />
      {shortcut ? (
        <Kbd
          aria-hidden="true"
          className="pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2"
        >
          {shortcut}
        </Kbd>
      ) : null}
    </div>
  )
);
SearchBar.displayName = "SearchBar";

export { SearchBar };
