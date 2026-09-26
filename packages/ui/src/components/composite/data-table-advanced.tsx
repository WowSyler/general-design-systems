"use client";
/**
 * DataTableAdvanced — Gelismis, generic <T> tipli veri tablosu.
 * Mevcut DataTable'in ustune ayri bir bilesen olarak kurulur; TanStack gibi
 * ek bagimlilik gerektirmez. Ozellikler:
 *  - Generic kolon tanimi: accessor (deger), cell (ozel render), sortable,
 *    align, width, sortAccessor.
 *  - Tiklanabilir siralama basligi: asc -> desc -> none dongusu, ArrowUp/Down
 *    ikonlari, aria-sort. Kontrollu veya kendinden-kontrollu sort state.
 *  - Satir secimi: Checkbox + "tumunu sec" (indeterminate), kontrollu selection.
 *  - Secili satirlar icin opsiyonel BulkActionBar entegrasyonu.
 *  - Yogunluk (compact/comfortable), zebra, yapiskan baslik (sticky-header),
 *    maxHeight ile kaydirma, bos + loading durumlari.
 * DeployLens deploy/log ve Fisly islem tablolari icin uygundur.
 */
import * as React from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BulkActionBar,
  type BulkActionBarAction,
} from "@/components/composite/bulk-action-bar";

type DataTableAdvancedAlign = "left" | "center" | "right";
type DataTableAdvancedDensity = "compact" | "comfortable";
type DataTableAdvancedSortDirection = "asc" | "desc";

export interface DataTableAdvancedSort {
  key: string;
  direction: DataTableAdvancedSortDirection;
}

export interface DataTableAdvancedColumn<T> {
  /** Benzersiz kolon anahtari (sort state ile eslesir). */
  key: string;
  header: React.ReactNode;
  /** Hucre degerini uretir; cell verilmediyse render icin de kullanilir. */
  accessor?: (row: T) => React.ReactNode;
  /** Ozel hucre render'i (accessor'i override eder). */
  cell?: (row: T) => React.ReactNode;
  /** Basligin tiklanabilir siralama basligi olmasini saglar. */
  sortable?: boolean;
  /** Siralama icin karsilastirma degeri (yoksa accessor sonucu kullanilir). */
  sortAccessor?: (row: T) => string | number;
  align?: DataTableAdvancedAlign;
  /** Piksel (number) veya CSS genislik degeri. */
  width?: number | string;
  headerClassName?: string;
  className?: string;
}

export interface DataTableAdvancedProps<T> {
  columns: DataTableAdvancedColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;

  /** Kontrollu siralama durumu (null: siralama yok). */
  sort?: DataTableAdvancedSort | null;
  /** Kendinden-kontrollu baslangic siralamasi. */
  defaultSort?: DataTableAdvancedSort | null;
  onSortChange?: (sort: DataTableAdvancedSort | null) => void;
  /** true iken client-side siralama yapilmaz (veri disaridan sirali gelir). */
  manualSort?: boolean;

  /** Satir secim sutununu etkinlestirir. */
  selectable?: boolean;
  /** Kontrollu secili satir anahtarlari. */
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  /** Secim varken beliren toplu islem cubugu icin aksiyonlar. */
  bulkActions?: BulkActionBarAction[];

  density?: DataTableAdvancedDensity;
  /** Alternatif satir arka plani. */
  zebra?: boolean;
  /** Baslik satirini kaydirma sirasinda yapiskan tutar. */
  stickyHeader?: boolean;
  /** Dikey kaydirma icin maksimum yukseklik. */
  maxHeight?: number | string;
  /** Cerceve + koseleri yuvarlar. Varsayilan true. */
  bordered?: boolean;

  onRowClick?: (row: T) => void;

  loading?: boolean;
  /** Loading durumunda gosterilecek skeleton satir sayisi. Varsayilan 4. */
  loadingRows?: number;
  emptyState?: React.ReactNode;
  caption?: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

const alignClasses: Record<DataTableAdvancedAlign, string> = {
  left: "text-start",
  center: "text-center",
  right: "text-end",
};

const cellPadding: Record<DataTableAdvancedDensity, string> = {
  compact: "px-3 py-1.5",
  comfortable: "px-4 py-3",
};

const headHeight: Record<DataTableAdvancedDensity, string> = {
  compact: "h-9",
  comfortable: "h-11",
};

function compareValues(a: unknown, b: unknown): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a ?? "").localeCompare(String(b ?? ""), "tr", {
    numeric: true,
    sensitivity: "base",
  });
}

function DataTableAdvancedSortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: DataTableAdvancedSortDirection;
}) {
  if (!active) {
    return (
      <ChevronsUpDown
        className="size-3.5 shrink-0 opacity-40 transition-opacity"
        aria-hidden="true"
      />
    );
  }
  return direction === "asc" ? (
    <ArrowUp className="size-3.5 shrink-0 text-foreground" aria-hidden="true" />
  ) : (
    <ArrowDown className="size-3.5 shrink-0 text-foreground" aria-hidden="true" />
  );
}

function DataTableAdvanced<T>({
  columns,
  data,
  rowKey,
  sort,
  defaultSort = null,
  onSortChange,
  manualSort = false,
  selectable = false,
  selectedKeys,
  defaultSelectedKeys = [],
  onSelectionChange,
  bulkActions,
  density = "comfortable",
  zebra = false,
  stickyHeader = false,
  maxHeight,
  bordered = true,
  onRowClick,
  loading = false,
  loadingRows = 4,
  emptyState,
  caption,
  className,
  "aria-label": ariaLabel = "Veri tablosu",
}: DataTableAdvancedProps<T>) {
  const [internalSort, setInternalSort] = React.useState<
    DataTableAdvancedSort | null
  >(defaultSort);
  const sortState = sort !== undefined ? sort : internalSort;

  const [internalSelected, setInternalSelected] =
    React.useState<string[]>(defaultSelectedKeys);
  const selectedKeysState =
    selectedKeys !== undefined ? selectedKeys : internalSelected;
  const selectedSet = React.useMemo(
    () => new Set(selectedKeysState),
    [selectedKeysState]
  );

  const commitSelection = (next: string[]) => {
    if (selectedKeys === undefined) setInternalSelected(next);
    onSelectionChange?.(next);
  };

  const handleSort = (column: DataTableAdvancedColumn<T>) => {
    if (!column.sortable) return;
    let next: DataTableAdvancedSort | null;
    if (!sortState || sortState.key !== column.key) {
      next = { key: column.key, direction: "asc" };
    } else if (sortState.direction === "asc") {
      next = { key: column.key, direction: "desc" };
    } else {
      next = null;
    }
    if (sort === undefined) setInternalSort(next);
    onSortChange?.(next);
  };

  const sortedData = React.useMemo(() => {
    if (manualSort || !sortState) return data;
    const column = columns.find((c) => c.key === sortState.key);
    const getValue = column?.sortAccessor ?? column?.accessor;
    if (!getValue) return data;
    const factor = sortState.direction === "asc" ? 1 : -1;
    return [...data].sort(
      (a, b) => factor * compareValues(getValue(a), getValue(b))
    );
  }, [data, columns, sortState, manualSort]);

  const visibleKeys = React.useMemo(
    () => sortedData.map(rowKey),
    [sortedData, rowKey]
  );
  const selectedVisibleCount = visibleKeys.filter((k) =>
    selectedSet.has(k)
  ).length;
  const allSelected =
    visibleKeys.length > 0 && selectedVisibleCount === visibleKeys.length;
  const someSelected = selectedVisibleCount > 0 && !allSelected;
  const headerChecked: boolean | "indeterminate" = allSelected
    ? true
    : someSelected
      ? "indeterminate"
      : false;

  const toggleAll = (checked: boolean) => {
    if (checked) {
      const union = new Set(selectedKeysState);
      visibleKeys.forEach((k) => union.add(k));
      commitSelection(Array.from(union));
    } else {
      const visibleSet = new Set(visibleKeys);
      commitSelection(selectedKeysState.filter((k) => !visibleSet.has(k)));
    }
  };

  const toggleRow = (key: string) => {
    if (selectedSet.has(key)) {
      commitSelection(selectedKeysState.filter((k) => k !== key));
    } else {
      commitSelection([...selectedKeysState, key]);
    }
  };

  const totalCols = columns.length + (selectable ? 1 : 0);
  const isEmpty = !loading && sortedData.length === 0;

  const headCellBase = cn(
    "border-b border-border align-middle font-medium text-muted-foreground",
    headHeight[density],
    cellPadding[density],
    stickyHeader ? "sticky top-0 z-10 bg-background" : "bg-muted/40"
  );

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative w-full overflow-auto",
          bordered && "rounded-xl border border-border"
        )}
        style={maxHeight !== undefined ? { maxHeight } : undefined}
      >
        <table
          className="w-full caption-bottom border-separate border-spacing-0 text-sm"
          aria-label={ariaLabel}
        >
          {caption ? (
            <caption className="px-4 py-2 text-start text-xs text-muted-foreground">
              {caption}
            </caption>
          ) : null}
          <thead>
            <tr>
              {selectable ? (
                <th
                  scope="col"
                  className={cn(headCellBase, "w-10 px-3")}
                >
                  <Checkbox
                    checked={headerChecked}
                    onCheckedChange={(checked) => toggleAll(checked === true)}
                    aria-label="Tumunu sec"
                    disabled={loading || visibleKeys.length === 0}
                  />
                </th>
              ) : null}
              {columns.map((column) => {
                const isActive = sortState?.key === column.key;
                const align = column.align ?? "left";
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={
                      column.sortable
                        ? isActive
                          ? sortState?.direction === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                        : undefined
                    }
                    style={column.width !== undefined ? { width: column.width } : undefined}
                    className={cn(
                      headCellBase,
                      alignClasses[align],
                      column.headerClassName
                    )}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(column)}
                        className={cn(
                          "-mx-1 inline-flex items-center gap-1.5 rounded px-1 touch-hitbox py-0.5 font-medium transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isActive && "text-foreground",
                          align === "right" && "flex-row-reverse",
                          align === "center" && "mx-auto"
                        )}
                      >
                        <span>{column.header}</span>
                        <DataTableAdvancedSortIcon
                          active={isActive}
                          direction={sortState?.direction ?? "asc"}
                        />
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: loadingRows }).map((_, rowIndex) => (
                  <tr key={`skeleton-${rowIndex}`}>
                    {selectable ? (
                      <td
                        className={cn(
                          "border-b border-border align-middle",
                          cellPadding[density]
                        )}
                      >
                        <Skeleton className="size-4 rounded-sm" />
                      </td>
                    ) : null}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          "border-b border-border align-middle",
                          cellPadding[density],
                          alignClasses[column.align ?? "left"]
                        )}
                      >
                        <Skeleton
                          className={cn(
                            "h-4 w-full max-w-[160px]",
                            (column.align ?? "left") === "right" && "ms-auto",
                            (column.align ?? "left") === "center" && "mx-auto"
                          )}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              : null}

            {isEmpty ? (
              <tr>
                <td colSpan={totalCols} className="px-4 py-12 text-center">
                  {emptyState ?? (
                    <span className="text-sm text-muted-foreground">
                      Kayit bulunamadi
                    </span>
                  )}
                </td>
              </tr>
            ) : null}

            {!loading
              ? sortedData.map((row, index) => {
                  const key = rowKey(row);
                  const isSelected = selectedSet.has(key);
                  const clickable = Boolean(onRowClick);
                  return (
                    <tr
                      key={key}
                      data-state={isSelected ? "selected" : undefined}
                      onClick={clickable ? () => onRowClick?.(row) : undefined}
                      onKeyDown={
                        clickable
                          ? (event: React.KeyboardEvent<HTMLTableRowElement>) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                onRowClick?.(row);
                              }
                            }
                          : undefined
                      }
                      tabIndex={clickable ? 0 : undefined}
                      className={cn(
                        "transition-colors duration-200",
                        zebra && index % 2 === 1 && "bg-muted/30",
                        isSelected ? "bg-primary/5" : "hover:bg-muted/50",
                        clickable &&
                          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                      )}
                    >
                      {selectable ? (
                        <td
                          onClick={(event) => event.stopPropagation()}
                          className={cn(
                            "border-b border-border align-middle",
                            cellPadding[density]
                          )}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleRow(key)}
                            aria-label="Satiri sec"
                          />
                        </td>
                      ) : null}
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          style={
                            column.width !== undefined
                              ? { width: column.width }
                              : undefined
                          }
                          className={cn(
                            "border-b border-border align-middle text-foreground",
                            cellPadding[density],
                            alignClasses[column.align ?? "left"],
                            column.className
                          )}
                        >
                          {column.cell
                            ? column.cell(row)
                            : column.accessor
                              ? column.accessor(row)
                              : null}
                        </td>
                      ))}
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>

      {selectable && bulkActions && bulkActions.length > 0 ? (
        <BulkActionBar
          position="static"
          count={selectedKeysState.length}
          actions={bulkActions}
          onClearSelection={() => commitSelection([])}
          className="mt-3"
        />
      ) : null}
    </div>
  );
}
DataTableAdvanced.displayName = "DataTableAdvanced";

export { DataTableAdvanced };
