"use client";

/**
 * ResponsiveTable — Cihaza-uyarlanan tipli tablo.
 * Masaustunde (md+) gercek <table> render eder; mobilde her satiri
 * yiginlanmis bir KART olarak gosterir (primaryColumn baslik olur,
 * geri kalan kolonlar etiket-deger cifleri olarak listelenir).
 * Gecis useIsMobile hook'u ile yapilir; boylece DeployLens build'leri,
 * Fisly islemleri ve Dolap ilan listeleri mobilde de okunur kalir.
 *
 * Salt sunum (onRowClick haricinde); kolon tanimi + veri alir, ek
 * bagimlilik gerektirmez. Generic <T> ile tip guvenli calisir.
 */
import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export type ResponsiveTableAlign = "left" | "right" | "center";

export interface ResponsiveTableColumn<T> {
  /** Kolonun benzersiz anahtari; cell verilmezse veriden bu anahtarla okunur. */
  key: string;
  /** Baslik hucresi (th) ve mobil kartta etiket olarak kullanilir. */
  header: React.ReactNode;
  /** Hucre icerigini ozel render eden fonksiyon. */
  cell?: (row: T) => React.ReactNode;
  /** Hucreye eklenecek sinif (masaustu td/th). */
  className?: string;
  /** Masaustu hizalama (varsayilan left). */
  align?: ResponsiveTableAlign;
  /** Mobil kart gorunumunde bu kolonu gizle (yalnizca masaustunde goster). */
  hideOnMobile?: boolean;
}

export interface ResponsiveTableProps<T> {
  /** Kolon tanimlari. */
  columns: ResponsiveTableColumn<T>[];
  /** Satir verisi. */
  data: T[];
  /** Her satir icin benzersiz React key uretir. */
  rowKey: (row: T) => string;
  /**
   * Mobil kartta baslik olarak kullanilacak kolonun key'i.
   * Verilmezse ilk kolon baslik kabul edilir.
   */
  primaryColumn?: string;
  /** Satir/kart tiklama olayi; verilirse satirlar etkilesimli olur. */
  onRowClick?: (row: T) => void;
  /** Veri bos oldugunda gosterilecek icerik. */
  emptyState?: React.ReactNode;
  /** true iken 3 iskelet satir/kart gosterilir. */
  loading?: boolean;
  /** Tablo/liste alt bilgisi (caption). */
  caption?: React.ReactNode;
  /** Kok ogeye ek sinif. */
  className?: string;
}

const alignClasses: Record<ResponsiveTableAlign, string> = {
  left: "text-start",
  right: "text-end",
  center: "text-center",
};

function defaultCell<T>(row: T, key: string): React.ReactNode {
  return (row as Record<string, unknown>)[key] as React.ReactNode;
}

const SKELETON_ROWS = 3;

function ResponsiveTable<T>({
  columns,
  data,
  rowKey,
  primaryColumn,
  onRowClick,
  emptyState,
  loading = false,
  caption,
  className,
}: ResponsiveTableProps<T>) {
  const isMobile = useIsMobile();
  const clickable = Boolean(onRowClick);
  const isEmpty = !loading && data.length === 0;

  const primaryKey = primaryColumn ?? columns[0]?.key;
  const primaryCol = columns.find((c) => c.key === primaryKey);
  // Mobil kartta etiket-deger olarak listelenecek kolonlar (baslik ve gizliler haric).
  const detailCols = columns.filter(
    (c) => c.key !== primaryKey && !c.hideOnMobile
  );

  const renderCell = React.useCallback(
    (column: ResponsiveTableColumn<T>, row: T) =>
      column.cell ? column.cell(row) : defaultCell(row, column.key),
    []
  );

  const emptyNode = emptyState ?? (
    <span className="text-sm text-muted-foreground">Kayıt bulunamadı</span>
  );

  // ------------------------------ Mobil: kartlar ------------------------------
  if (isMobile) {
    return (
      <div className={cn("space-y-3", className)}>
        {loading
          ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <Skeleton className="mb-3 h-5 w-2/3" />
                <div className="space-y-2.5">
                  {detailCols.map((column) => (
                    <div
                      key={column.key}
                      className="flex items-center justify-between gap-4"
                    >
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>
            ))
          : null}

        {isEmpty ? (
          <div className="rounded-xl border border-border bg-card px-4 py-8 text-center">
            {emptyNode}
          </div>
        ) : null}

        {!loading
          ? data.map((row) => (
              <div
                key={rowKey(row)}
                role={clickable ? "button" : undefined}
                tabIndex={clickable ? 0 : undefined}
                onClick={clickable ? () => onRowClick?.(row) : undefined}
                onKeyDown={
                  clickable
                    ? (event: React.KeyboardEvent<HTMLDivElement>) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onRowClick?.(row);
                        }
                      }
                    : undefined
                }
                className={cn(
                  "rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200",
                  clickable &&
                    "cursor-pointer hover:border-ring/60 hover:shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                )}
              >
                {primaryCol ? (
                  <div className="mb-3 min-w-0 break-words text-base font-semibold text-foreground">
                    {renderCell(primaryCol, row)}
                  </div>
                ) : null}
                <dl className="space-y-2.5 text-sm">
                  {detailCols.map((column) => (
                    <div
                      key={column.key}
                      className="flex items-start justify-between gap-4"
                    >
                      <dt className="shrink-0 font-medium text-muted-foreground">
                        {column.header}
                      </dt>
                      <dd className="min-w-0 break-words text-end text-foreground">
                        {renderCell(column, row)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))
          : null}

        {caption ? (
          <p className="pt-1 text-sm text-muted-foreground">{caption}</p>
        ) : null}
      </div>
    );
  }

  // --------------------------- Masaustu: gercek tablo ---------------------------
  return (
    <Table className={cn(className)}>
      {caption ? <TableCaption>{caption}</TableCaption> : null}
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.key}
              className={cn(alignClasses[column.align ?? "left"], column.className)}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading
          ? Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      alignClasses[column.align ?? "left"],
                      column.className
                    )}
                  >
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : null}

        {isEmpty ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="py-8 text-center">
              {emptyNode}
            </TableCell>
          </TableRow>
        ) : null}

        {!loading
          ? data.map((row) => (
              <TableRow
                key={rowKey(row)}
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
                  clickable &&
                    "cursor-pointer hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                )}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      alignClasses[column.align ?? "left"],
                      column.className
                    )}
                  >
                    {renderCell(column, row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          : null}
      </TableBody>
    </Table>
  );
}
ResponsiveTable.displayName = "ResponsiveTable";

export { ResponsiveTable };
