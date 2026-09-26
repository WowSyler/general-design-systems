"use client";

/**
 * ActiveFilterChips — Aktif filtre cip seridi (DeployLens/Dolap filtre panelleri).
 * Uygulanmis filtreleri "etiket: deger" pill'leri olarak sarmalayarak (flex-wrap)
 * gosterir; her cipte X ile tekil kaldirma, ustte sonuc sayaci ("128 sonuc") ve
 * "Tumunu temizle" aksiyonu bulunur. onRemove/onClearAll callback'leri ile
 * kontrol edilir; tag cip stilini taklit eder.
 */
import * as React from "react";
import { Filter, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ActiveFilterChipItem {
  /** Kaldirma callback'ine gecirilen benzersiz kimlik. */
  id: string;
  /** Filtre boyutu etiketi (or. "Durum", "Kategori"). */
  label: string;
  /** Secili deger; metin veya kucuk bir React dugumu olabilir. */
  value: React.ReactNode;
}

export interface ActiveFilterChipsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Gosterilecek aktif filtreler. */
  filters: ActiveFilterChipItem[];
  /** Bir cipin X butonuna basildiginda ilgili id ile cagrilir. */
  onRemove?: (id: string) => void;
  /** "Tumunu temizle" butonuna basildiginda cagrilir. */
  onClearAll?: () => void;
  /** Verildiginde sonuc sayaci ("128 sonuc") gosterilir. */
  resultCount?: number;
  /** Sonuc sayaci ekindeki kelime. Varsayilan "sonuc". */
  resultNoun?: string;
  /** "Tumunu temizle" buton metni. */
  clearAllLabel?: string;
  /** Grubu tanimlayan erisilebilir etiket. */
  ariaLabel?: string;
  /** Hic filtre yokken gosterilecek metin; verilmezse bilesen render edilmez. */
  emptyMessage?: React.ReactNode;
}

const ActiveFilterChips = React.forwardRef<
  HTMLDivElement,
  ActiveFilterChipsProps
>(
  (
    {
      filters,
      onRemove,
      onClearAll,
      resultCount,
      resultNoun = "sonuc",
      clearAllLabel = "Tumunu temizle",
      ariaLabel = "Aktif filtreler",
      emptyMessage,
      className,
      ...props
    },
    ref
  ) => {
    const hasFilters = filters.length > 0;

    if (!hasFilters && emptyMessage === undefined) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {(resultCount !== undefined || (hasFilters && onClearAll)) && (
          <div className="flex items-center justify-between gap-3">
            {resultCount !== undefined ? (
              <p className="text-sm text-muted-foreground" aria-live="polite">
                <span className="font-semibold tabular-nums text-foreground">
                  {resultCount.toLocaleString("tr-TR")}
                </span>{" "}
                {resultNoun}
              </p>
            ) : (
              <span />
            )}
            {hasFilters && onClearAll ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden="true" />
                {clearAllLabel}
              </Button>
            ) : null}
          </div>
        )}

        {hasFilters ? (
          <ul className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <li key={filter.id}>
                <span
                  className={cn(
                    "group inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 py-1 ps-3 pe-1 text-xs font-medium text-secondary-foreground shadow-sm transition-all duration-200",
                    onRemove &&
                      "hover:-translate-y-0.5 hover:border-ring/50 hover:shadow-md"
                  )}
                >
                  <Filter
                    className="size-3 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="text-muted-foreground">{filter.label}:</span>
                  <span className="max-w-[12rem] truncate text-foreground">
                    {filter.value}
                  </span>
                  {onRemove ? (
                    <button
                      type="button"
                      onClick={() => onRemove(filter.id)}
                      aria-label={`${filter.label} filtresini kaldir`}
                      className="ms-0.5 inline-flex size-5 shrink-0 touch-hitbox items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.9]"
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        )}
      </div>
    );
  }
);
ActiveFilterChips.displayName = "ActiveFilterChips";

export { ActiveFilterChips };
