/**
 * InfiniteScroll — IntersectionObserver tabanli sonsuz kaydirma sarmalayici.
 * Cocuk liste + gorunmez alt sentinel render eder; sentinel gorunur alana
 * girdiginde (ve hasMore=true, loading=false iken) onLoadMore tetikler.
 * Yuklenirken loader satiri (spinner/skeleton), liste bittiginde endMessage
 * gosterir. rootMargin/threshold ile onceden yukleme ayarlanabilir.
 * Dolap urun akisi / GlowScan analiz gecmisi gibi feed'ler icin.
 */
"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface InfiniteScrollProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Liste icerigi (halihazirda yuklenmis ogeler). */
  children: React.ReactNode;
  /** Sentinel gorunur olunca cagrilir; sonraki sayfayi yuklemelidir. */
  onLoadMore: () => void;
  /** Yuklenecek baska oge var mi. false ise sentinel/loader kapanir. */
  hasMore: boolean;
  /** Su an bir sayfa yukleniyor mu. true iken tekrar tetiklenmez. */
  loading?: boolean;
  /** IntersectionObserver root marjini (onceden yukleme). Varsayilan 200px. */
  rootMargin?: string;
  /** IntersectionObserver esigi (0-1). Varsayilan 0. */
  threshold?: number;
  /** Ozel gozlem kok elemani; verilmezse viewport kullanilir. */
  root?: Element | null;
  /** Loader yerine gosterilecek ozel dugum (or. Skeleton satirlari). */
  loader?: React.ReactNode;
  /** Liste bittiginde gosterilecek dugum. */
  endMessage?: React.ReactNode;
  /** Loader'in ekran okuyucu etiketi. Varsayilan "Daha fazla yukleniyor". */
  loadingLabel?: string;
}

/** Varsayilan spinner satiri — role=status ile duyurulur. */
function DefaultLoader({ label }: { label: string }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground"
    >
      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

/** Hazir skeleton loader — loader prop'una gecirilebilir. */
const InfiniteScrollSkeleton = React.forwardRef<
  HTMLDivElement,
  { rows?: number } & React.HTMLAttributes<HTMLDivElement>
>(({ rows = 3, className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn("space-y-3 py-2", className)}
    {...props}
  >
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    ))}
  </div>
));
InfiniteScrollSkeleton.displayName = "InfiniteScrollSkeleton";

const InfiniteScroll = React.forwardRef<HTMLDivElement, InfiniteScrollProps>(
  (
    {
      children,
      onLoadMore,
      hasMore,
      loading = false,
      rootMargin = "200px",
      threshold = 0,
      root = null,
      loader,
      endMessage,
      loadingLabel = "Daha fazla yukleniyor",
      className,
      ...props
    },
    ref
  ) => {
    const sentinelRef = React.useRef<HTMLDivElement | null>(null);

    // onLoadMore kimligi her render degisebilir; ref ile guncel tutulur.
    const onLoadMoreRef = React.useRef(onLoadMore);
    React.useEffect(() => {
      onLoadMoreRef.current = onLoadMore;
    }, [onLoadMore]);

    React.useEffect(() => {
      const node = sentinelRef.current;
      if (!node || !hasMore || loading) return;
      if (typeof IntersectionObserver === "undefined") return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting) {
            onLoadMoreRef.current();
          }
        },
        { root, rootMargin, threshold }
      );

      observer.observe(node);
      return () => observer.disconnect();
    }, [hasMore, loading, root, rootMargin, threshold]);

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {children}

        <div aria-live="polite" aria-busy={loading}>
          {loading
            ? loader ?? <DefaultLoader label={loadingLabel} />
            : null}
          {!hasMore && !loading && endMessage ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              {endMessage}
            </div>
          ) : null}
        </div>

        {/* Gorunmez tetikleyici: sadece yuklenecek oge varken DOM'da olur. */}
        {hasMore ? (
          <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
        ) : null}
      </div>
    );
  }
);
InfiniteScroll.displayName = "InfiniteScroll";

export { InfiniteScroll, InfiniteScrollSkeleton };
