/**
 * FilterToolbar — Liste/koleksiyon ust arac cubugu (Dolap urunler, DeployLens dagitimlar).
 * Arama girisi + "Filtrele" butonu (aktif filtre sayaci rozetli) + sirala
 * dropdown'u + grid/liste gorunum degistiricisinden olusur. Responsive: mobilde
 * arama tam genislik alir, kontroller alta sarar. active-filter-chips ile birlikte kullanilir.
 */
"use client";

import * as React from "react";
import {
  ArrowUpDown,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FilterToolbarView = "grid" | "list";

export interface FilterToolbarSortOption {
  value: string;
  label: string;
}

export interface FilterToolbarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Arama metni (kontrollu). Verilmezse bilesen kendi durumunu tutar. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** "Filtrele" butonuna tiklanma. Verilmezse buton gizlenir. */
  onFilterClick?: () => void;
  filterLabel?: string;
  /** Aktif filtre sayisi; > 0 ise butonda rozet gosterilir. */
  activeFilterCount?: number;
  /** Sirala secenekleri. Verilmezse sirala dropdown'u gizlenir. */
  sortOptions?: FilterToolbarSortOption[];
  sortValue?: string;
  onSortChange?: (value: string) => void;
  sortLabel?: string;
  /** Grid/liste gorunumu. onViewChange verilmezse gorunum degistirici gizlenir. */
  view?: FilterToolbarView;
  onViewChange?: (view: FilterToolbarView) => void;
}

const FilterToolbar = React.forwardRef<HTMLDivElement, FilterToolbarProps>(
  (
    {
      searchValue,
      onSearchChange,
      searchPlaceholder = "Ara...",
      onFilterClick,
      filterLabel = "Filtrele",
      activeFilterCount = 0,
      sortOptions,
      sortValue,
      onSortChange,
      sortLabel = "Sirala",
      view,
      onViewChange,
      className,
      ...props
    },
    ref
  ) => {
    const [internalSearch, setInternalSearch] = React.useState(searchValue ?? "");
    const currentSearch = searchValue ?? internalSearch;

    const handleSearch = (next: string) => {
      setInternalSearch(next);
      onSearchChange?.(next);
    };

    const hasFilterCount = activeFilterCount > 0;
    const activeSort = sortOptions?.find((option) => option.value === sortValue);
    const showSort = Boolean(sortOptions && sortOptions.length > 0);
    const showView = Boolean(onViewChange);
    const showFilter = Boolean(onFilterClick);

    const viewButtonClasses = (active: boolean) =>
      cn(
        "flex size-8 items-center justify-center rounded-md text-muted-foreground pointer-coarse:min-h-11 pointer-coarse:min-w-11 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-background text-foreground shadow-sm"
          : "hover:text-foreground"
      );

    return (
      <div
        ref={ref}
        role="toolbar"
        aria-label="Liste araclari"
        aria-orientation="horizontal"
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-center",
          className
        )}
        {...props}
      >
        {/* Arama */}
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={currentSearch}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Ara"
            className={cn("ps-9", currentSearch && "pe-9")}
          />
          {currentSearch ? (
            <button
              type="button"
              onClick={() => handleSearch("")}
              aria-label="Aramayi temizle"
              className="absolute end-1 top-1/2 flex size-8 touch-hitbox -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {/* Kontroller */}
        <div className="flex items-center gap-2">
          {showFilter ? (
            <Button
              type="button"
              variant="outline"
              onClick={onFilterClick}
              aria-label={
                hasFilterCount
                  ? `${filterLabel} (${activeFilterCount} aktif)`
                  : filterLabel
              }
              className="shrink-0"
            >
              <SlidersHorizontal aria-hidden="true" />
              <span className="hidden sm:inline">{filterLabel}</span>
              {hasFilterCount ? (
                <Badge
                  variant="secondary"
                  className="ms-0.5 min-w-5 justify-center rounded-full px-1.5 tabular-nums"
                >
                  {activeFilterCount}
                </Badge>
              ) : null}
            </Button>
          ) : null}

          {showSort ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0"
                  aria-label={
                    activeSort ? `Sirala: ${activeSort.label}` : sortLabel
                  }
                >
                  <ArrowUpDown aria-hidden="true" />
                  <span className="hidden truncate sm:inline">
                    {activeSort ? activeSort.label : sortLabel}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuLabel>{sortLabel}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sortValue}
                  onValueChange={onSortChange}
                >
                  {sortOptions?.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          {showView ? (
            <div
              role="group"
              aria-label="Gorunum degistir"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-muted p-1"
            >
              <button
                type="button"
                aria-label="Grid gorunum"
                aria-pressed={view === "grid"}
                onClick={() => onViewChange?.("grid")}
                className={viewButtonClasses(view === "grid")}
              >
                <LayoutGrid className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Liste gorunum"
                aria-pressed={view === "list"}
                onClick={() => onViewChange?.("list")}
                className={viewButtonClasses(view === "list")}
              >
                <List className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);
FilterToolbar.displayName = "FilterToolbar";

export { FilterToolbar };
