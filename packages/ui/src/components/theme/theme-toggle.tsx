/**
 * ThemeModeToggle — light/dark geçiş düğmesi (Sun/Moon).
 * ThemeDirectionToggle — ltr/rtl yazı yönü geçişi.
 * ThemeSelect — tema seçici (kayıtlı temalar arasında geçiş).
 * Hepsi DsThemeProvider bağlamını kullanır.
 */
import * as React from "react";
import { Languages, Moon, Palette, Sun } from "lucide-react";

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

export function ThemeDirectionToggle({ className }: { className?: string }) {
  const { dir, setDir } = useDsTheme();
  const next = dir === "rtl" ? "ltr" : "rtl";
  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      aria-label={next === "rtl" ? "Sağdan sola yöne geç" : "Soldan sağa yöne geç"}
      onClick={() => setDir(next)}
    >
      <Languages className="size-4" />
      <span className="font-mono text-xs uppercase">{dir}</span>
    </Button>
  );
}

export interface ThemeSelectProps {
  /** {name, label} listesi — genelde @wowsyler/ds-tokens'taki themes kaydından gelir */
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
          <Palette className="me-2 size-4" />
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
