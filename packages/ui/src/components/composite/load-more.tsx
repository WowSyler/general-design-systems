"use client";

/**
 * LoadMore — "Daha fazla yukle" akis kontrolu (Dolap urun akisi, DeployLens log).
 * Kalan/toplam sayacini gosterir, yuklenirken Spinner + etiket ile pasiflesir ve
 * hasMore=false iken "Tumu yuklendi" durumuna gecer. Opsiyonel ince ilerleme
 * cizgisi gorunen ilerlemeyi ozetler. Yeni sayfa istegi onLoadMore ile tetiklenir.
 */
import * as React from "react";
import { Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui-extras/spinner";
import { cn } from "@/lib/utils";

export interface LoadMoreProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onLoad"> {
  /** Su an gorunen kayit sayisi. */
  loaded: number;
  /** Toplam kayit sayisi. */
  total: number;
  /**
   * Daha fazla kayit olup olmadigi. Verilmezse `loaded < total` uzerinden
   * turetilir.
   */
  hasMore?: boolean;
  /** Yeni sayfa yuklenirken true; buton pasiflesir ve Spinner gosterilir. */
  loading?: boolean;
  /** "Daha fazla yukle" tiklamasi. */
  onLoadMore?: () => void;
  /** Butonun ustunde ince ilerleme cizgisi goster. */
  showProgress?: boolean;
  /** Buton etiketi. Varsayilan "Daha fazla yukle". */
  label?: React.ReactNode;
  /** Yuklenirken gosterilen etiket. Varsayilan "Yukleniyor". */
  loadingLabel?: string;
  /** Tumu yuklendiginde gosterilen etiket. Varsayilan "Tumu yuklendi". */
  allLoadedLabel?: React.ReactNode;
  /** Sayaci bicimlendir. Varsayilan "{loaded} / {total} gosteriliyor". */
  formatCount?: (loaded: number, total: number) => React.ReactNode;
}

const defaultFormatCount = (loaded: number, total: number): React.ReactNode => (
  <>
    <span className="font-semibold text-foreground">
      {loaded.toLocaleString("tr-TR")}
    </span>
    {" / "}
    {total.toLocaleString("tr-TR")} gösteriliyor
  </>
);

const LoadMore = React.forwardRef<HTMLDivElement, LoadMoreProps>(
  (
    {
      loaded,
      total,
      hasMore,
      loading = false,
      onLoadMore,
      showProgress = false,
      label = "Daha fazla yükle",
      loadingLabel = "Yükleniyor",
      allLoadedLabel = "Tümü yüklendi",
      formatCount = defaultFormatCount,
      className,
      ...props
    },
    ref
  ) => {
    const canLoadMore = hasMore ?? loaded < total;
    const percent =
      total > 0 ? Math.min(100, Math.max(0, (loaded / total) * 100)) : 0;

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center gap-3", className)}
        {...props}
      >
        {showProgress ? (
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={loaded}
            aria-label="Yükleme ilerlemesi"
            className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-muted"
          >
            <div
              className={cn(
                "h-full rounded-full bg-primary bg-sheen transition-[width] duration-500",
                loading && "animate-shimmer"
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
        ) : null}

        {canLoadMore ? (
          <Button
            type="button"
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            aria-busy={loading}
            className="min-w-44 transition-all duration-200 hover:-translate-y-0.5 hover:border-ring/60 hover:shadow-md"
          >
            {loading ? (
              <>
                <Spinner size="sm" label={loadingLabel} />
                <span aria-hidden="true">{loadingLabel}</span>
              </>
            ) : (
              <>
                <Plus aria-hidden="true" />
                <span>{label}</span>
              </>
            )}
          </Button>
        ) : (
          <div
            className="inline-flex min-w-44 items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/40 px-4 py-2 text-sm font-medium text-muted-foreground"
            role="status"
          >
            <Check className="size-4 text-success" aria-hidden="true" />
            {allLoadedLabel}
          </div>
        )}

        <p
          className="text-xs tabular-nums text-muted-foreground"
          aria-live="polite"
        >
          {formatCount(loaded, total)}
        </p>
      </div>
    );
  }
);
LoadMore.displayName = "LoadMore";

export { LoadMore };
