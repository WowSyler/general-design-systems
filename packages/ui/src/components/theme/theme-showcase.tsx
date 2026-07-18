/**
 * ThemeShowcase — bir temanın kimlik kartı: light + dark panelleri yan yana,
 * semantik renk paleti, chart renkleri, marka gradyanı, tipografi ve radius
 * örnekleri. Claude Design panelinde tema vitrini olarak kullanılır.
 */
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DsThemeProvider } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

const swatches: { label: string; cls: string }[] = [
  { label: "primary", cls: "bg-primary" },
  { label: "secondary", cls: "bg-secondary" },
  { label: "accent", cls: "bg-accent" },
  { label: "muted", cls: "bg-muted" },
  { label: "destructive", cls: "bg-destructive" },
  { label: "success", cls: "bg-success" },
  { label: "warning", cls: "bg-warning" },
  { label: "info", cls: "bg-info" },
];

const chartDots = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
];

function ShowcasePanel({ modeLabel }: { modeLabel: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-background p-4 text-foreground">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {modeLabel}
        </span>
        <div className="flex gap-1.5" aria-hidden="true">
          {chartDots.map((cls) => (
            <span key={cls} className={cn("size-3 rounded-full", cls)} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {swatches.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <div className={cn("h-8 rounded-md border", s.cls)} />
            <span className="truncate text-[10px] text-muted-foreground">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="h-8 rounded-md bg-brand-gradient" aria-hidden="true" />

      <div className="flex items-baseline gap-3">
        <span className="font-display text-2xl font-semibold">Aa Başlık</span>
        <span className="font-sans text-sm text-muted-foreground">
          Aa Gövde metni 0123
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">Birincil</Button>
        <Button size="sm" variant="outline">
          Çerçeveli
        </Button>
        <Badge variant="success-soft">Onaylandı</Badge>
        <Badge variant="warning-soft">Bekliyor</Badge>
        <div className="ml-auto flex items-end gap-1.5" aria-hidden="true">
          <span className="size-6 rounded-sm border bg-card" />
          <span className="size-6 rounded-md border bg-card" />
          <span className="size-6 rounded-lg border bg-card" />
          <span className="size-6 rounded-xl border bg-card" />
        </div>
      </div>
    </div>
  );
}

export interface ThemeShowcaseProps {
  /** Tema adı: deploylens | dolap | randevu | glowscan | fisly */
  theme: string;
  /** Kart başlığı (varsayılan: tema adı) */
  label?: string;
  className?: string;
}

export function ThemeShowcase({ theme, label, className }: ThemeShowcaseProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <h3 className="text-lg font-semibold capitalize">{label ?? theme}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <DsThemeProvider applyTo="self" theme={theme} mode="light" className="rounded-xl">
          <ShowcasePanel modeLabel="Light" />
        </DsThemeProvider>
        <DsThemeProvider applyTo="self" theme={theme} mode="dark" className="rounded-xl">
          <ShowcasePanel modeLabel="Dark" />
        </DsThemeProvider>
      </div>
    </div>
  );
}
