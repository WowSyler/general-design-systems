"use client";

/**
 * PullToRefresh — Asagi-cekerek yenile sarmalayici (mobil liste/feed).
 * Kaydirilabilir icerigi sarar; kullanici en ustteyken (scrollTop=0) parmagi/
 * imleci asagi cektikce donen bir RefreshCw gostergesi belirir. Cekme mesafesi
 * esigi (threshold) gecince birakildiginda onRefresh async tetiklenir ve islem
 * bitene kadar gosterge spinner olarak doner. Dokunma ve isaretci (pointer)
 * girdisini destekler; tarayicinin kendi pull-to-refresh davranisini
 * overscroll-contain ile bastirir. Tema-agnostik, erisilebilir bir kompozittir.
 *
 * Dolap urun akisi, GlowScan tarama gecmisi, Randevu bildirim listesi gibi
 * mobil akislarda kullanilir.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";

type PullToRefreshStatus = "idle" | "pulling" | "ready" | "refreshing";

const pullToRefreshBadgeVariants = cva(
  "flex items-center justify-center rounded-full border shadow-md transition-colors duration-200",
  {
    variants: {
      tone: {
        primary: "bg-card text-primary border-border",
        accent: "bg-card text-accent-foreground border-border",
        muted: "bg-card text-muted-foreground border-border",
      },
      size: {
        sm: "size-8 [&_svg]:size-3.5",
        md: "size-10 [&_svg]:size-4",
        lg: "size-12 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      tone: "primary",
      size: "md",
    },
  }
);

export interface PullToRefreshProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onScroll">,
    VariantProps<typeof pullToRefreshBadgeVariants> {
  /** Kaydirilabilir icerik. */
  children: React.ReactNode;
  /**
   * Esik gecilip birakildiginda cagrilir. Promise donerse, cozulene kadar
   * gosterge spinner olarak doner. Senkron fonksiyon da desteklenir.
   */
  onRefresh: () => void | Promise<void>;
  /** Yenilemeyi tetikleyen minimum cekme mesafesi (px). Varsayilan 72. */
  threshold?: number;
  /** Gorsel en fazla cekme mesafesi (px). Varsayilan 120. */
  maxPull?: number;
  /** Cekme direnci (0-1); dusuk deger daha "agir" his verir. Varsayilan 0.5. */
  resistance?: number;
  /** true iken cekme devre disidir (or. ilk yukleme sirasinda). */
  disabled?: boolean;
  /** Esik altinda gosterge etiketi. Varsayilan "Yenilemek icin cekin". */
  pullingLabel?: string;
  /** Esik gecildiginde gosterge etiketi. Varsayilan "Yenilemek icin birakin". */
  releaseLabel?: string;
  /** Yenileme sirasindaki etiket. Varsayilan "Yenileniyor". */
  refreshingLabel?: string;
}

const PullToRefresh = React.forwardRef<HTMLDivElement, PullToRefreshProps>(
  (
    {
      children,
      onRefresh,
      threshold = 72,
      maxPull = 120,
      resistance = 0.5,
      disabled = false,
      tone,
      size,
      pullingLabel = "Yenilemek için çekin",
      releaseLabel = "Yenilemek için bırakın",
      refreshingLabel = "Yenileniyor",
      className,
      ...props
    },
    ref
  ) => {
    const viewportRef = React.useRef<HTMLDivElement | null>(null);
    const startYRef = React.useRef(0);
    const trackingRef = React.useRef(false);
    const mountedRef = React.useRef(true);
    // onRefresh kimligi her render degisebilir; ref ile guncel tutulur.
    const onRefreshRef = React.useRef(onRefresh);

    const [pull, setPull] = React.useState(0);
    const [status, setStatus] = React.useState<PullToRefreshStatus>("idle");
    const [dragging, setDragging] = React.useState(false);

    React.useEffect(() => {
      onRefreshRef.current = onRefresh;
    }, [onRefresh]);

    React.useEffect(() => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
      };
    }, []);

    const reset = React.useCallback(() => {
      trackingRef.current = false;
      setDragging(false);
      setPull(0);
      setStatus("idle");
    }, []);

    const triggerRefresh = React.useCallback(() => {
      setDragging(false);
      setStatus("refreshing");
      setPull(threshold);
      Promise.resolve()
        .then(() => onRefreshRef.current())
        .finally(() => {
          if (mountedRef.current) reset();
        });
    }, [threshold, reset]);

    const handlePointerDown = React.useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (disabled || status === "refreshing") return;
        const el = viewportRef.current;
        if (!el || el.scrollTop > 0) return;
        startYRef.current = e.clientY;
        trackingRef.current = true;
      },
      [disabled, status]
    );

    const handlePointerMove = React.useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!trackingRef.current || status === "refreshing") return;
        const el = viewportRef.current;
        // Bu sirada asagi kaydirildiysa cekmeyi iptal et.
        if (el && el.scrollTop > 0) {
          reset();
          return;
        }
        const delta = e.clientY - startYRef.current;
        if (delta <= 0) {
          if (pull !== 0) {
            setPull(0);
            setStatus("idle");
          }
          return;
        }
        // Isaretciyi yakala ki hedef disina cikilsa bile hareket gelsin.
        e.currentTarget.setPointerCapture?.(e.pointerId);
        if (!dragging) setDragging(true);
        const resisted = Math.min(maxPull, delta * resistance);
        setPull(resisted);
        setStatus(resisted >= threshold ? "ready" : "pulling");
      },
      [status, pull, dragging, maxPull, resistance, threshold, reset]
    );

    const handlePointerEnd = React.useCallback(() => {
      if (!trackingRef.current) return;
      trackingRef.current = false;
      if (status === "ready") {
        triggerRefresh();
      } else {
        reset();
      }
    }, [status, triggerRefresh, reset]);

    const progress =
      threshold > 0 ? Math.min(1, pull / threshold) : pull > 0 ? 1 : 0;
    const spinning = status === "refreshing";
    const isReady = status === "ready";
    // Cekme ilerledikce gosterge kismi doner; hazir olunca 270 dereceye ulasir.
    const iconRotation = spinning ? 0 : progress * 270;
    // Aktif surukleme sirasinda animasyon yok; birakinca yumusak geri donus.
    const transition = dragging ? "none" : "transform 300ms ease, height 300ms ease";

    const label = spinning
      ? refreshingLabel
      : isReady
        ? releaseLabel
        : pullingLabel;

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {/* Ust gosterge katmani — icerik cekildikce acilir. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-end justify-center"
          style={{ height: `${pull}px`, transition }}
        >
          <div
            className={cn(
              pullToRefreshBadgeVariants({ tone, size }),
              "mb-2 bg-sheen",
              isReady && "ring-2 ring-ring/40",
              (pull > 0 || spinning) && "shadow-lg"
            )}
            style={{
              opacity: spinning ? 1 : progress,
              transform: `scale(${0.6 + progress * 0.4})`,
            }}
          >
            <RefreshCw
              className={cn("transition-colors", spinning && "animate-spin")}
              style={spinning ? undefined : { transform: `rotate(${iconRotation}deg)` }}
            />
          </div>
        </div>

        {/* Kaydirilabilir gorunum + isaretci olaylari. */}
        <div
          ref={viewportRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          className={cn(
            "h-full overflow-y-auto overscroll-contain",
            dragging && "select-none"
          )}
        >
          <div style={{ transform: `translateY(${pull}px)`, transition }}>
            {children}
          </div>
        </div>

        {/* Ekran okuyucu durumu. */}
        <div role="status" aria-live="polite" className="sr-only">
          {pull > 0 || spinning ? label : ""}
        </div>
      </div>
    );
  }
);
PullToRefresh.displayName = "PullToRefresh";

export { PullToRefresh, pullToRefreshBadgeVariants };
