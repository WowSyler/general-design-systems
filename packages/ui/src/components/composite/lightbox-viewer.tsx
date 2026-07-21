"use client";

/**
 * LightboxViewer — Tam-ekran gorsel buyutec (galeri overlay'i).
 * Kucuk resim seridine (grid) tiklaninca tam-ekran bir role=dialog overlay
 * acilir; buyuk gorsel, onceki/sonraki gezinme (ok butonlari + klavye),
 * tiklama/buton ile zoom, alt kisimda kucuk-resim seridi (thumbnails),
 * X veya Escape ile kapatma ve "2 / 8" sayaci sunar. Acik durum ve aktif
 * indeks hem kontrollu hem kontrolsuz kullanilabilir. Dolap urun fotograf
 * galerisi ve GlowScan tarama detay gorselleri icin uygundur.
 */
import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { cn } from "@/lib/utils";

/** Galerideki tek bir gorsel. */
export interface LightboxViewerImage {
  /** Buyuk gorsel kaynagi; yoksa fallback (ImageOff) gosterilir. */
  src?: string;
  /** Erisilebilirlik icin zorunlu alternatif metin. */
  alt: string;
  /** Gorsel altinda gosterilecek opsiyonel aciklama. */
  caption?: React.ReactNode;
  /** Serit/kucuk resim icin ayri kaynak; verilmezse src kullanilir. */
  thumbnail?: string;
}

export interface LightboxViewerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Gosterilecek gorseller. */
  images: LightboxViewerImage[];
  /** Kontrollu acik durum. */
  open?: boolean;
  /** Kontrolsuz baslangic acik durumu. */
  defaultOpen?: boolean;
  /** Acik durum degisince cagrilir. */
  onOpenChange?: (open: boolean) => void;
  /** Kontrollu aktif indeks. */
  index?: number;
  /** Kontrolsuz baslangic indeksi. */
  defaultIndex?: number;
  /** Aktif indeks degisince cagrilir. */
  onIndexChange?: (index: number) => void;
  /** Tetikleyici kucuk-resim grid'ini render et (varsayilan: true). */
  showTriggerGrid?: boolean;
  /** Overlay altindaki kucuk-resim seridini goster (varsayilan: true). */
  showThumbnails?: boolean;
  /** Tetikleyici grid'e ek sinif. */
  gridClassName?: string;
  /** Overlay'in erisilebilir baslik etiketi. */
  label?: string;
}

const NAV_LABEL = { prev: "Onceki gorsel", next: "Sonraki gorsel" } as const;

const LightboxViewer = React.forwardRef<HTMLDivElement, LightboxViewerProps>(
  (
    {
      images,
      open,
      defaultOpen = false,
      onOpenChange,
      index,
      defaultIndex = 0,
      onIndexChange,
      showTriggerGrid = true,
      showThumbnails = true,
      gridClassName,
      label = "Gorsel galerisi",
      className,
      ...props
    },
    ref,
  ) => {
    const count = images.length;

    const isOpenControlled = open !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const actualOpen = isOpenControlled ? open : uncontrolledOpen;

    const isIndexControlled = index !== undefined;
    const [uncontrolledIndex, setUncontrolledIndex] =
      React.useState(defaultIndex);
    const rawIndex = isIndexControlled ? index : uncontrolledIndex;
    const activeIndex = count > 0 ? Math.min(Math.max(rawIndex, 0), count - 1) : 0;

    const [zoomed, setZoomed] = React.useState(false);

    const overlayRef = React.useRef<HTMLDivElement>(null);
    const previouslyFocused = React.useRef<HTMLElement | null>(null);

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (!isOpenControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
      [isOpenControlled, onOpenChange],
    );

    const setIndex = React.useCallback(
      (next: number) => {
        if (count === 0) return;
        const wrapped = ((next % count) + count) % count;
        if (!isIndexControlled) setUncontrolledIndex(wrapped);
        onIndexChange?.(wrapped);
      },
      [count, isIndexControlled, onIndexChange],
    );

    const openAt = React.useCallback(
      (next: number) => {
        setIndex(next);
        setOpen(true);
      },
      [setIndex, setOpen],
    );

    const goPrev = React.useCallback(
      () => setIndex(activeIndex - 1),
      [activeIndex, setIndex],
    );
    const goNext = React.useCallback(
      () => setIndex(activeIndex + 1),
      [activeIndex, setIndex],
    );

    // Indeks veya acik durum degisince zoom sifirla.
    React.useEffect(() => {
      setZoomed(false);
    }, [activeIndex, actualOpen]);

    // Acikken arkaplan kaydirmasini kilitle ve odagi yonet.
    React.useEffect(() => {
      if (!actualOpen || typeof document === "undefined") return;
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const raf = requestAnimationFrame(() => overlayRef.current?.focus());
      return () => {
        cancelAnimationFrame(raf);
        document.body.style.overflow = prevOverflow;
        previouslyFocused.current?.focus?.();
      };
    }, [actualOpen]);

    // Klavye: Escape kapat, oklar gezin, +/- zoom.
    React.useEffect(() => {
      if (!actualOpen || typeof window === "undefined") return;
      const onKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
          case "Escape":
            event.preventDefault();
            setOpen(false);
            break;
          case "ArrowLeft":
            event.preventDefault();
            goPrev();
            break;
          case "ArrowRight":
            event.preventDefault();
            goNext();
            break;
          case "Home":
            event.preventDefault();
            setIndex(0);
            break;
          case "End":
            event.preventDefault();
            setIndex(count - 1);
            break;
          case "+":
          case "=":
            event.preventDefault();
            setZoomed(true);
            break;
          case "-":
            event.preventDefault();
            setZoomed(false);
            break;
        }
      };
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }, [actualOpen, count, goNext, goPrev, setIndex, setOpen]);

    // Basit odak tuzagi: Tab overlay icinde kalsin.
    const handleTrap = React.useCallback((event: React.KeyboardEvent) => {
      if (event.key !== "Tab" || !overlayRef.current) return;
      const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }, []);

    const activeImage = images[activeIndex];

    return (
      <div ref={ref} className={className} {...props}>
        {showTriggerGrid ? (
          <div
            className={cn(
              "grid grid-cols-3 gap-2 sm:grid-cols-4",
              gridClassName,
            )}
          >
            {images.map((image, i) => (
              <button
                key={i}
                type="button"
                onClick={() => openAt(i)}
                aria-label={`Buyut: ${image.alt}`}
                aria-haspopup="dialog"
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {thumbSrc(image) ? (
                  <img
                    src={thumbSrc(image)}
                    alt={image.alt}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span
                    role="img"
                    aria-label={image.alt}
                    className="flex size-full items-center justify-center"
                  >
                    <ImageOff className="size-6" aria-hidden="true" />
                  </span>
                )}
                <span className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/10" />
                <span className="pointer-events-none absolute inset-0 grid place-content-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="rounded-full bg-background/80 p-2 text-foreground shadow-md backdrop-blur-sm">
                    <ZoomIn className="size-4" aria-hidden="true" />
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : null}

        {actualOpen && activeImage ? (
          <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${label} (${activeIndex + 1} / ${count})`}
            tabIndex={-1}
            onKeyDown={handleTrap}
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
            className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-sm outline-none animate-fade-up"
          >
            {/* Ust bar: sayac + zoom + kapat */}
            <div className="flex items-center justify-between gap-3 p-4 text-white">
              <span
                className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium tabular-nums"
                aria-live="polite"
              >
                {activeIndex + 1} / {count}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomed((z) => !z)}
                  aria-pressed={zoomed}
                  aria-label={zoomed ? "Uzaklastir" : "Yakinlastir"}
                  disabled={!activeImage.src}
                  className="grid size-9 place-content-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:opacity-40"
                >
                  {zoomed ? (
                    <ZoomOut className="size-4" aria-hidden="true" />
                  ) : (
                    <ZoomIn className="size-4" aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Kapat"
                  className="grid size-9 place-content-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Ana gorsel alani */}
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
              {count > 1 ? (
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label={NAV_LABEL.prev}
                  className="absolute left-2 z-10 grid size-11 place-content-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:left-4"
                >
                  <ChevronLeft className="size-6" aria-hidden="true" />
                </button>
              ) : null}

              <figure className="flex min-h-0 max-h-full min-w-0 max-w-full flex-col items-center gap-3">
                <div
                  className={cn(
                    "flex min-h-0 items-center justify-center",
                    zoomed ? "overflow-auto" : "overflow-hidden",
                  )}
                >
                  {activeImage.src ? (
                    <img
                      src={activeImage.src}
                      alt={activeImage.alt}
                      onClick={() => setZoomed((z) => !z)}
                      className={cn(
                        "select-none rounded-lg shadow-2xl transition-transform duration-300",
                        zoomed
                          ? "max-w-none cursor-zoom-out scale-150"
                          : "max-h-[70vh] max-w-full cursor-zoom-in object-contain",
                      )}
                    />
                  ) : (
                    <div
                      role="img"
                      aria-label={activeImage.alt}
                      className="grid aspect-video w-[min(70vw,42rem)] place-content-center rounded-lg bg-white/5 text-white/60"
                    >
                      <ImageOff className="size-10" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {activeImage.caption ? (
                  <figcaption className="max-w-2xl text-balance text-center text-sm text-white/80">
                    {activeImage.caption}
                  </figcaption>
                ) : null}
              </figure>

              {count > 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  aria-label={NAV_LABEL.next}
                  className="absolute right-2 z-10 grid size-11 place-content-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:right-4"
                >
                  <ChevronRight className="size-6" aria-hidden="true" />
                </button>
              ) : null}
            </div>

            {/* Kucuk-resim seridi */}
            {showThumbnails && count > 1 ? (
              <div
                className="flex items-center justify-start gap-2 overflow-x-auto p-4 sm:justify-center"
                role="tablist"
                aria-label="Kucuk resimler"
              >
                {images.map((image, i) => {
                  const active = i === activeIndex;
                  return (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-label={`${i + 1}. gorsel: ${image.alt}`}
                      onClick={() => setIndex(i)}
                      className={cn(
                        "relative size-14 shrink-0 overflow-hidden rounded-md ring-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-white",
                        active
                          ? "ring-white opacity-100"
                          : "ring-transparent opacity-50 hover:opacity-90",
                      )}
                    >
                      {thumbSrc(image) ? (
                        <img
                          src={thumbSrc(image)}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="grid size-full place-content-center bg-white/10 text-white/60">
                          <ImageOff className="size-4" aria-hidden="true" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);
LightboxViewer.displayName = "LightboxViewer";

function thumbSrc(image: LightboxViewerImage): string | undefined {
  return image.thumbnail ?? image.src;
}

export { LightboxViewer };
