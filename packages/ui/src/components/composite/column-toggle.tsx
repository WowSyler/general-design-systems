"use client";

/**
 * ColumnToggle — Tablo kolon gorunurluk secici (data-table-advanced ile).
 * "Kolonlar" tetik butonu (Columns3 ikon) bir DropdownMenu acar; her kolon
 * icin bir checkbox ogesi (goster/gizle) ve ustte "Tumunu goster/gizle"
 * kisayolu bulunur. Kilitli (locked) kolonlar her zaman gorunur kalir ve
 * degistirilemez. Gorunurluk haritasi kontrollu (visibility) veya kontrolsuz
 * (defaultVisibility) calisir; her degisimde onVisibilityChange tetiklenir.
 */
import * as React from "react";
import { Columns3 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Gorunurlugu degistirilebilen tek bir tablo kolonu. */
export interface ColumnToggleColumn {
  /** Gorunurluk haritasindaki benzersiz anahtar. */
  key: string;
  /** Menude gosterilecek insan-okur etiket. */
  label: string;
  /** Kolonu her zaman gorunur ve degistirilemez yapar (or. birincil kolon). */
  locked?: boolean;
}

/** key -> gorunur mu bilgisini tutan harita. */
export type ColumnToggleVisibility = Record<string, boolean>;

export interface ColumnToggleProps {
  /** Menude listelenecek kolonlar (sira korunur). */
  columns: ColumnToggleColumn[];
  /** Kontrollu gorunurluk haritasi. */
  visibility?: ColumnToggleVisibility;
  /** Kontrolsuz baslangic haritasi (varsayilan: tumu gorunur). */
  defaultVisibility?: ColumnToggleVisibility;
  /** Her gorunurluk degisiminde tam guncel harita ile cagrilir. */
  onVisibilityChange?: (visibility: ColumnToggleVisibility) => void;
  /** Tetik butonu metni. */
  label?: string;
  /** "Tumunu goster" eylem metni. */
  showAllLabel?: string;
  /** "Tumunu gizle" eylem metni. */
  hideAllLabel?: string;
  /** Menu basligi (DropdownMenuLabel). */
  menuLabel?: string;
  /** Statik onizleme icin menuyu acik baslatir. */
  defaultOpen?: boolean;
  /** Menunun tetige gore hizalanmasi. */
  align?: "start" | "center" | "end";
  disabled?: boolean;
  className?: string;
}

/** Bir kolonun mevcut gorunurlugunu cozer (harita bos ise varsayilan gorunur). */
function isVisible(map: ColumnToggleVisibility, key: string): boolean {
  return map[key] !== false;
}

const ColumnToggle = React.forwardRef<HTMLButtonElement, ColumnToggleProps>(
  (
    {
      columns,
      visibility,
      defaultVisibility,
      onVisibilityChange,
      label = "Kolonlar",
      showAllLabel = "Tümünü göster",
      hideAllLabel = "Tümünü gizle",
      menuLabel = "Görünür kolonlar",
      defaultOpen = false,
      align = "end",
      disabled,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const [internalVisibility, setInternalVisibility] =
      React.useState<ColumnToggleVisibility>(defaultVisibility ?? {});
    const currentVisibility = visibility ?? internalVisibility;

    const commit = (next: ColumnToggleVisibility) => {
      if (visibility === undefined) setInternalVisibility(next);
      onVisibilityChange?.(next);
    };

    const toggleColumns = columns.filter((column) => !column.locked);
    const visibleToggleCount = toggleColumns.filter((column) =>
      isVisible(currentVisibility, column.key)
    ).length;
    const hiddenCount = toggleColumns.length - visibleToggleCount;
    const allVisible = hiddenCount === 0;

    const setColumn = (key: string, value: boolean) => {
      commit({ ...currentVisibility, [key]: value });
    };

    const toggleAll = () => {
      const next: ColumnToggleVisibility = { ...currentVisibility };
      for (const column of toggleColumns) {
        next[column.key] = !allVisible;
      }
      commit(next);
    };

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            size="sm"
            disabled={disabled}
            aria-label={`${label} — ${visibleToggleCount}/${toggleColumns.length} görünür`}
            className={cn("h-9 gap-2", className)}
          >
            <Columns3 className="size-4 shrink-0 opacity-70" aria-hidden="true" />
            {label}
            {hiddenCount > 0 ? (
              <Badge
                variant="secondary"
                className="ml-0.5 rounded px-1.5 font-normal tabular-nums"
              >
                {visibleToggleCount}/{toggleColumns.length}
              </Badge>
            ) : null}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} className="w-52">
          <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              toggleAll();
            }}
            className="font-medium"
          >
            {allVisible ? hideAllLabel : showAllLabel}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {columns.map((column) => {
            const checked = column.locked
              ? true
              : isVisible(currentVisibility, column.key);
            return (
              <DropdownMenuCheckboxItem
                key={column.key}
                checked={checked}
                disabled={column.locked}
                onSelect={(event) => event.preventDefault()}
                onCheckedChange={(value) => {
                  if (column.locked) return;
                  setColumn(column.key, value === true);
                }}
                className="capitalize"
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
ColumnToggle.displayName = "ColumnToggle";

export { ColumnToggle };
