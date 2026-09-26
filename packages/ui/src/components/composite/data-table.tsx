/**
 * DataTable — Shadcn table primitifleri uzerine kurulu basit tipli tablo.
 * Kolon tanimlari, satir tiklama, yukleme (skeleton) ve bos durum destegi
 * sunar; TanStack gibi ek bagimlilik gerektirmez.
 */
"use client";

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
import { cn } from "@/lib/utils";

type DataTableAlign = "left" | "right" | "center";

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  cell?: (row: T) => React.ReactNode;
  className?: string;
  align?: DataTableAlign;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
  /** true iken 3 skeleton satiri gosterilir. */
  loading?: boolean;
  caption?: React.ReactNode;
  className?: string;
}

const alignClasses: Record<DataTableAlign, string> = {
  left: "text-start",
  right: "text-end",
  center: "text-center",
};

function defaultCell<T>(row: T, key: string): React.ReactNode {
  return (row as Record<string, unknown>)[key] as React.ReactNode;
}

function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  emptyState,
  loading = false,
  caption,
  className,
}: DataTableProps<T>) {
  const isEmpty = !loading && data.length === 0;

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
          ? Array.from({ length: 3 }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(alignClasses[column.align ?? "left"], column.className)}
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
              {emptyState ?? (
                <span className="text-sm text-muted-foreground">Kayit bulunamadi</span>
              )}
            </TableCell>
          </TableRow>
        ) : null}
        {!loading
          ? data.map((row) => {
              const clickable = Boolean(onRowClick);
              return (
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
                      "cursor-pointer hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn(alignClasses[column.align ?? "left"], column.className)}
                    >
                      {column.cell ? column.cell(row) : defaultCell(row, column.key)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          : null}
      </TableBody>
    </Table>
  );
}

export { DataTable };
