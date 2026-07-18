/**
 * ThemeModeToggle — light/dark geçiş düğmesi (Sun/Moon).
 * ThemeSelect — tema seçici (kayıtlı temalar arasında geçiş).
 * Her ikisi de DsThemeProvider bağlamını kullanır.
 */
import * as React from "react";
import { Moon, Palette, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDsTheme } from "@/components/theme/theme-provider";

export function ThemeModeToggle({ className }: { className?: string }) {
  const { resolvedMode, setMode } = useDsTheme();
  const next = resolvedMode === "dark" ? "light" : "dark";
  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      aria-label={next === "dark" ? "Koyu moda geç" : "Açık moda geç"}
      onClick={() => setMode(next)}
    >
      {resolvedMode === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}

export interface ThemeSelectProps {
  /** {name, label} listesi — genelde @ds/tokens'taki themes kaydından gelir */
  themes: { name: string; label: string }[];
  className?: string;
}

export function ThemeSelect({ themes, className }: ThemeSelectProps) {
  const { theme, setTheme } = useDsTheme();
  const active = themes.find((t) => t.name === theme);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Palette className="mr-2 size-4" />
          {active?.label ?? theme}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => (
          <DropdownMenuItem key={t.name} onSelect={() => setTheme(t.name)}>
            {t.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
