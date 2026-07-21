"use client";

/**
 * BottomSheetDraggable — Surukleyerek boyutlandirilan alt sayfa (snap noktali).
 * Mevcut Sheet/Drawer'dan farkli olarak birden fazla snap yuksekligi (or.
 * peek/half/full) arasinda gecis yapar: ust kenardaki tutma kolu (drag handle)
 * yukari/asagi surukledikce panel yuksekligi canli degisir, birakilinca en
 * yakin snap noktasina yumusakca oturur. Hizli asagi savurma (flick) veya en
 * kucuk snap altina cekme paneli kapatir. Arka plan karartma (overlay), overlay'e
 * tiklayarak hizli kapatma, klavye (Ok tuslari ile snap gecisi, Escape ile
 * kapatma) ve odak yonetimi icerir. Kontrollu (open/onOpenChange, snapIndex/
 * onSnapIndexChange) veya kontrolsuz (defaultOpen/defaultSnapIndex) kullanilir.
 *
 * Mobil detay/aksiyon sayfalari icin: Dolap urun detayi, GlowScan tarama
 * secenekleri, Randevu hizli aksiyon menusu gibi akislarda kullanilir.
 * Tema-agnostik, erisilebilir bir kompozittir.
 */
import * as React from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const DEFAULT_SNAP_POINTS = [0.3, 0.58, 0.92];

const bottomSheetDraggableVariants = cva(
  "absolute inset-x-0 bottom-0 mx-auto flex w-full flex-col overflow-hidden rounded-t-2xl border-t shadow-2xl outline-none sm:max-w-lg",
  {
    variants: {
      tone: {
        default: "bg-background text-foreground border-border",
        card: "bg-card text-card-foreground border-border",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  }
);

export interface BottomSheetDraggableProps
  extends VariantProps<typeof bottomSheetDraggableVariants> {
  /** Kontrollu acik durum. */
  open?: boolean;
  /** Kontrolsuz baslangic acik durumu. */
  defaultOpen?: boolean;
  /** Acik durum degisince cagrilir. */
  onOpenChange?: (open: boolean) => void;
  /** Paneli acan tetikleyici (or. <Button>). Tiklayinca panel acilir. */
  trigger?: React.ReactNode;
  /** Baslik (aria-labelledby ile iliskilendirilir). */
  title?: React.ReactNode;
  /** Aciklama metni (aria-describedby ile iliskilendirilir). */
  description?: React.ReactNode;
  /** Panel govdesi (kaydirilabilir icerik). */
  children?: React.ReactNode;
  /** Panel altina sabitlenen aksiyon alani. */
  footer?: React.ReactNode;
  /**
   * Snap yukseklikleri: viewport yuksekligine oranli (0-1), artan sirada.
   * Varsayilan [0.3, 0.58, 0.92] -> peek / half / full.
   */
  snapPoints?: number[];
  /** Kontrolsuz baslangic snap index'i. Varsayilan orta nokta. */
  defaultSnapIndex?: number;
  /** Kontrollu aktif snap index'i. */
  snapIndex?: number;
  /** Aktif snap degisince cagrilir. */
  onSnapIndexChange?: (index: number) => void;
  /** Arka plani karart. Varsayilan true. */
  showOverlay?: boolean;
  /** Overlay'e tiklayinca kapat. Varsayilan true. */
  closeOnOverlayClick?: boolean;
  /**
   * En kucuk snap altina cekince / Escape ile kapanmaya izin ver.
   * Varsayilan true.
   */
  dismissible?: boolean;
  /** Tutma kolu (drag handle) aria etiketi. */
  handleLabel?: string;
  /** Sag ust kapatma dugmesini goster. Varsayilan true. */
  showCloseButton?: boolean;
  /** Kapatma dugmesi aria etiketi. */
  closeLabel?: string;
  /** Panel ek sinif. */
  className?: string;
}

const clampIndex = (value: number, max: number) =>
  Math.max(0, Math.min(max, value));

const BottomSheetDraggable = React.forwardRef<
  HTMLDivElement,
  BottomSheetDraggableProps
>(
  (
    {
      open,
      defaultOpen,
      onOpenChange,
      trigger,
      title,
      description,
      children,
      footer,
      snapPoints,
      defaultSnapIndex,
      snapIndex,
      onSnapIndexChange,
      showOverlay = true,
      closeOnOverlayClick = true,
      dismissible = true,
      handleLabel = "Paneli sürükleyerek boyutlandır",
      showCloseButton = true,
      closeLabel = "Kapat",
      tone,
      className,
    },
    ref
  ) => {
    const snaps = React.useMemo(
      () =>
        snapPoints && snapPoints.length > 0 ? snapPoints : DEFAULT_SNAP_POINTS,
      [snapPoints]
    );
    const lastIndex = snaps.length - 1;

    // --- Acik durum (kontrollu/kontrolsuz) ---
    const isOpenControlled = open !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
      defaultOpen ?? false
    );
    const actualOpen = isOpenControlled ? open : uncontrolledOpen;

    // --- Aktif snap (kontrollu/kontrolsuz) ---
    const initialSnap = clampIndex(
      defaultSnapIndex ?? (snaps.length > 1 ? 1 : 0),
      lastIndex
    );
    const isSnapControlled = snapIndex !== undefined;
    const [uncontrolledSnap, setUncontrolledSnap] = React.useState(initialSnap);
    const activeSnap = clampIndex(
      isSnapControlled ? snapIndex : uncontrolledSnap,
      lastIndex
    );

    const setSnap = React.useCallback(
      (next: number) => {
        const clamped = clampIndex(next, lastIndex);
        if (!isSnapControlled) setUncontrolledSnap(clamped);
        onSnapIndexChange?.(clamped);
      },
      [isSnapControlled, lastIndex, onSnapIndexChange]
    );

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (next && !isSnapControlled) setUncontrolledSnap(initialSnap);
        if (!isOpenControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
      [isOpenControlled, isSnapControlled, initialSnap, onOpenChange]
    );

    // --- Viewport yuksekligi (px snap hesabi icin) ---
    const [viewportHeight, setViewportHeight] = React.useState(() =>
      typeof window !== "undefined" ? window.innerHeight : 0
    );
    React.useEffect(() => {
      const update = () => setViewportHeight(window.innerHeight);
      update();
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }, []);

    // --- Portal montaj koruma (SSR) ---
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    // --- Surukleme durumu ---
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragHeight, setDragHeight] = React.useState<number | null>(null);
    const draggingRef = React.useRef(false);
    const startYRef = React.useRef(0);
    const startHeightRef = React.useRef(0);
    const dragHeightRef = React.useRef<number | null>(null);
    const lastYRef = React.useRef(0);
    const lastTimeRef = React.useRef(0);
    const velocityRef = React.useRef(0);

    const panelRef = React.useRef<HTMLDivElement | null>(null);
    React.useImperativeHandle(ref, () => panelRef.current as HTMLDivElement);

    const titleId = React.useId();
    const descriptionId = React.useId();

    // --- Govde kaydirma kilidi + Escape + odak yonetimi ---
    React.useEffect(() => {
      if (!actualOpen || typeof document === "undefined") return;
      const previousOverflow = document.body.style.overflow;
      const previouslyFocused = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
      const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 0);
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape" && dismissible) {
          event.preventDefault();
          setOpen(false);
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = previousOverflow;
        document.removeEventListener("keydown", onKeyDown);
        window.clearTimeout(focusTimer);
        previouslyFocused?.focus?.();
      };
    }, [actualOpen, dismissible, setOpen]);

    const nearestSnapIndex = React.useCallback(
      (fraction: number) => {
        let best = 0;
        let bestDistance = Number.POSITIVE_INFINITY;
        snaps.forEach((point, index) => {
          const distance = Math.abs(point - fraction);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = index;
          }
        });
        return best;
      },
      [snaps]
    );

    const settleTo = React.useCallback(
      (heightPx: number, velocity: number) => {
        const vh = viewportHeight || 1;
        const fraction = heightPx / vh;
        const smallest = snaps[0] ?? 0.3;
        const fastDown = velocity > 0.5;
        const fastUp = velocity < -0.5;

        // En kucuk snap altina cekildiyse veya hizli asagi savrulduysa kapat.
        if (dismissible && fraction < smallest * 0.55) {
          setOpen(false);
          return;
        }
        let target = nearestSnapIndex(fraction);
        if (fastDown) {
          if (target === 0 && dismissible) {
            setOpen(false);
            return;
          }
          target = Math.max(0, target - 1);
        } else if (fastUp) {
          target = Math.min(lastIndex, target + 1);
        }
        setSnap(target);
      },
      [viewportHeight, snaps, dismissible, nearestSnapIndex, lastIndex, setOpen, setSnap]
    );

    const snappedHeight = (snaps[activeSnap] ?? snaps[0] ?? 0.3) * viewportHeight;
    const height = dragHeight != null ? dragHeight : snappedHeight;
    const smallestHeight = (snaps[0] ?? 0.3) * viewportHeight;
    const overlayProgress =
      smallestHeight > 0 ? Math.min(1, height / smallestHeight) : 1;

    const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (viewportHeight === 0) return;
      draggingRef.current = true;
      setIsDragging(true);
      startYRef.current = event.clientY;
      startHeightRef.current = snappedHeight;
      dragHeightRef.current = snappedHeight;
      lastYRef.current = event.clientY;
      lastTimeRef.current = event.timeStamp;
      velocityRef.current = 0;
      event.currentTarget.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!draggingRef.current) return;
      const delta = startYRef.current - event.clientY; // yukari = pozitif
      const maxHeight = (snaps[lastIndex] ?? 1) * viewportHeight;
      let next = startHeightRef.current + delta;
      // En buyuk snap ustunde direncli (lastik) his.
      if (next > maxHeight) next = maxHeight + (next - maxHeight) * 0.3;
      if (next < 0) next = 0;
      dragHeightRef.current = next;
      setDragHeight(next);

      const dt = event.timeStamp - lastTimeRef.current;
      if (dt > 0) {
        // px/ms; pozitif = asagi yonlu hareket.
        velocityRef.current = (event.clientY - lastYRef.current) / dt;
      }
      lastYRef.current = event.clientY;
      lastTimeRef.current = event.timeStamp;
    };

    const handlePointerEnd = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
      event.currentTarget.releasePointerCapture?.(event.pointerId);
      const finalHeight = dragHeightRef.current ?? startHeightRef.current;
      dragHeightRef.current = null;
      setDragHeight(null);
      settleTo(finalHeight, velocityRef.current);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSnap(Math.min(lastIndex, activeSnap + 1));
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        if (activeSnap === 0) {
          if (dismissible) setOpen(false);
        } else {
          setSnap(activeSnap - 1);
        }
      } else if (event.key === "Home") {
        event.preventDefault();
        setSnap(lastIndex);
      } else if (event.key === "End") {
        event.preventDefault();
        setSnap(0);
      }
    };

    const transition = isDragging
      ? "none"
      : "height 320ms cubic-bezier(0.32, 0.72, 0, 1)";

    // --- Tetikleyici ---
    let triggerNode: React.ReactNode = null;
    if (trigger) {
      if (React.isValidElement(trigger)) {
        const element = trigger as React.ReactElement<{
          onClick?: React.MouseEventHandler<HTMLElement>;
        }>;
        triggerNode = React.cloneElement(element, {
          onClick: (event: React.MouseEvent<HTMLElement>) => {
            element.props.onClick?.(event);
            setOpen(true);
          },
        });
      } else {
        triggerNode = (
          <button type="button" onClick={() => setOpen(true)}>
            {trigger}
          </button>
        );
      }
    }

    return (
      <>
        {triggerNode}
        {mounted && actualOpen
          ? createPortal(
              <div className="pointer-events-none fixed inset-0 z-50 font-sans">
                {showOverlay ? (
                  <div
                    aria-hidden="true"
                    onClick={() => {
                      if (closeOnOverlayClick && dismissible) setOpen(false);
                    }}
                    className={cn(
                      "pointer-events-auto absolute inset-0 bg-black/60 backdrop-blur-[2px]",
                      !isDragging && "animate-fade-up"
                    )}
                    style={{
                      opacity: overlayProgress,
                      transition: isDragging ? "none" : "opacity 320ms ease",
                    }}
                  />
                ) : null}

                <div
                  ref={panelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={title ? titleId : undefined}
                  aria-label={title ? undefined : "Alt sayfa"}
                  aria-describedby={description ? descriptionId : undefined}
                  tabIndex={-1}
                  className={cn(
                    "pointer-events-auto",
                    bottomSheetDraggableVariants({ tone }),
                    className
                  )}
                  style={{
                    height: viewportHeight ? `${height}px` : undefined,
                    transition,
                    willChange: "height",
                  }}
                >
                  {/* Tutma kolu (drag handle) */}
                  <button
                    type="button"
                    aria-label={handleLabel}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerEnd}
                    onPointerCancel={handlePointerEnd}
                    onKeyDown={handleKeyDown}
                    style={{ touchAction: "none" }}
                    className={cn(
                      "group flex w-full shrink-0 cursor-grab items-center justify-center pb-2 pt-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background active:cursor-grabbing",
                      isDragging && "cursor-grabbing"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-1.5 w-12 rounded-full bg-muted-foreground/30 transition-all duration-200 group-hover:bg-muted-foreground/50 group-active:w-16",
                        isDragging && "w-16 bg-muted-foreground/60"
                      )}
                    />
                  </button>

                  {/* Baslik + kapatma */}
                  {(title || description || showCloseButton) && (
                    <div className="flex shrink-0 items-start justify-between gap-3 px-5 pb-3">
                      <div className="min-w-0 flex-1">
                        {title ? (
                          <h2
                            id={titleId}
                            className="truncate text-lg font-semibold tracking-tight text-foreground"
                          >
                            {title}
                          </h2>
                        ) : null}
                        {description ? (
                          <p
                            id={descriptionId}
                            className="mt-0.5 text-sm text-muted-foreground"
                          >
                            {description}
                          </p>
                        ) : null}
                      </div>
                      {showCloseButton && dismissible ? (
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          aria-label={closeLabel}
                          className="grid size-8 shrink-0 place-content-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background [&_svg]:size-4"
                        >
                          <X aria-hidden="true" />
                        </button>
                      ) : null}
                    </div>
                  )}

                  {/* Kaydirilabilir govde */}
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5">
                    {children}
                  </div>

                  {/* Alt aksiyon alani */}
                  {footer ? (
                    <div className="shrink-0 border-t border-border bg-background/80 px-5 py-3 backdrop-blur-sm">
                      {footer}
                    </div>
                  ) : null}
                </div>
              </div>,
              document.body
            )
          : null}
      </>
    );
  }
);
BottomSheetDraggable.displayName = "BottomSheetDraggable";

export { BottomSheetDraggable, bottomSheetDraggableVariants };
