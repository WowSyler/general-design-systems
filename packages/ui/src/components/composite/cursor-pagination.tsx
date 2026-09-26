/**
 * CursorPagination — Imlec (cursor) tabanli sayfalama (DeployLens/Dolap liste).
 * Numarali sayfalamadan farkli olarak API'nin dondurdugu imlecle ilerler:
 * Onceki/Sonraki butonlari, opsiyonel "Sayfa X" etiketi, hasPrev/hasNext ile
 * pasiflik ve opsiyonel sayfa boyutu Select'i sunar. Rastgele sayfaya atlama
 * yoktur; yalnizca komsu sayfalar arasinda gezinilir.
 */
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface CursorPaginationProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Onceki (daha yeni/onceki imlec) sayfaya gecis. */
  onPrevious?: () => void;
  /** Sonraki (daha eski/sonraki imlec) sayfaya gecis. */
  onNext?: () => void;
  /** false iken "Onceki" butonu pasiflesir (ilk sayfa). */
  hasPrevious?: boolean;
  /** false iken "Sonraki" butonu pasiflesir (son sayfa). */
  hasNext?: boolean;
  /** Butonlar arasinda gosterilen mevcut konum, or. "Sayfa 3". */
  pageLabel?: React.ReactNode;
  /** Secili sayfa boyutu; verilirse boyut Select'i render edilir. */
  pageSize?: number;
  /** Sayfa boyutu secenekleri. */
  pageSizeOptions?: number[];
  /** Sayfa boyutu degisince cagrilir. */
  onPageSizeChange?: (size: number) => void;
  /** Boyut Select'inin yanindaki etiket. */
  pageSizeLabel?: React.ReactNode;
  /** Butonlarin metinleri gizlenip yalnizca ikon gosterilir. */
  iconOnly?: boolean;
  /** true iken tum kontroller pasiflesir (agdan yukleme). */
  loading?: boolean;
}

const CursorPagination = React.forwardRef<HTMLElement, CursorPaginationProps>(
  (
    {
      onPrevious,
      onNext,
      hasPrevious = true,
      hasNext = true,
      pageLabel,
      pageSize,
      pageSizeOptions = [10, 25, 50, 100],
      onPageSizeChange,
      pageSizeLabel = "Sayfa boyutu",
      iconOnly = false,
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    const prevDisabled = loading || !hasPrevious;
    const nextDisabled = loading || !hasNext;
    const showPageSize = pageSize != null;
    const sizeLabelId = React.useId();

    return (
      <nav
        ref={ref}
        aria-label="Imlec tabanli sayfalama"
        className={cn(
          "flex flex-wrap items-center justify-between gap-3",
          className
        )}
        {...props}
      >
        {showPageSize ? (
          <div className="flex items-center gap-2">
            <span
              id={sizeLabelId}
              className="text-sm text-muted-foreground"
            >
              {pageSizeLabel}
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => onPageSizeChange?.(Number(v))}
              disabled={loading}
            >
              <SelectTrigger
                aria-labelledby={sizeLabelId}
                className="h-8 w-[4.5rem] tabular-nums"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem
                    key={option}
                    value={String(option)}
                    className="tabular-nums"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <span aria-hidden="true" />
        )}

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size={iconOnly ? "icon" : "sm"}
            onClick={onPrevious}
            disabled={prevDisabled}
            aria-label="Onceki sayfa"
          >
            <ChevronLeft className="rtl:-scale-x-100" aria-hidden="true" />
            {iconOnly ? null : <span>Onceki</span>}
          </Button>

          {pageLabel != null ? (
            <span
              aria-live="polite"
              className="min-w-16 px-1 text-center text-sm font-medium tabular-nums text-foreground"
            >
              {pageLabel}
            </span>
          ) : null}

          <Button
            type="button"
            variant="outline"
            size={iconOnly ? "icon" : "sm"}
            onClick={onNext}
            disabled={nextDisabled}
            aria-label="Sonraki sayfa"
          >
            {iconOnly ? null : <span>Sonraki</span>}
            <ChevronRight className="rtl:-scale-x-100" aria-hidden="true" />
          </Button>
        </div>
      </nav>
    );
  }
);
CursorPagination.displayName = "CursorPagination";

export { CursorPagination };
