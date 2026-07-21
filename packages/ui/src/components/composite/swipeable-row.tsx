"use client";

/**
 * SwipeableRow + SwipeableRowGroup — kaydirilabilir mobil liste satiri.
 * Pointer/touch ile sola kaydirinca on katman kayar ve arkadaki aksiyon
 * butonlari (or. Sil destructive / Arsivle / Favori) ortaya cikar. Yariyi
 * gecince acik kalir, tam kaydirinca (esik gecince) uctaki birincil aksiyon
 * tetiklenir; birakinca geri yaylanir (spring-back). Dikey kaydirma serbest
 * kalir (touch-pan-y + yon kilidi). Erisilebilir alternatif olarak aksiyonlar
 * gercek <button> ogeleridir: klavye ile Tab'lanip odaklaninca satir acilir,
 * Escape kapatir. Dolap urun listesi, Fisly islem akisi ve Randevu mobil
 * listeleri gibi dokunmatik desenler icin uygundur. SwipeableRowGroup
 * satirlari divide-y ile ayrilmis kart icinde toplar.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

/** Aksiyon butonunun tonu — semantik token setine baglanir. */
export type SwipeableRowActionVariant =
  | "default"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "muted";

export interface SwipeableRowAction {
  /** Benzersiz anahtar. */
  key: string;
  /** Buton etiketi (erisilebilir ad olarak da kullanilir). */
  label: string;
  /** Opsiyonel ikon (lucide onerilir). */
  icon?: React.ReactNode;
  /** Ton; verilmezse "default". */
  variant?: SwipeableRowActionVariant;
  /** Tiklama/tetikleme davranisi. */
  onAction?: () => void;
}

export interface SwipeableRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrag"> {
  /** Satir icerigi (on katman). */
  children: React.ReactNode;
  /** Sagda ortaya cikan aksiyonlar. Uctaki (ilk) aksiyon birincil sayilir. */
  actions: SwipeableRowAction[];
  /** Her aksiyon butonu genisligi (px). Varsayilan 76. */
  actionWidth?: number;
  /** Tam kaydirinca uctaki birincil aksiyonu tetikle. Varsayilan true. */
  swipeToTrigger?: boolean;
  /** Kaydirmayi tumuyle devre disi birakir (icerik sabit kalir). */
  disabled?: boolean;
  /** Acilma/kapanma degisiminde cagrilir. */
  onOpenChange?: (open: boolean) => void;
}

const actionVariantClasses: Record<SwipeableRowActionVariant, string> = {
  default: "bg-primary text-primary-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  info: "bg-info text-info-foreground",
  muted: "bg-muted text-muted-foreground",
};

/** Yaylanma direnci ve tetikleme esigi icin ek pikseller. */
const OVERSHOOT_MAX = 96;
const TRIGGER_EXTRA = 56;

const SwipeableRow = React.forwardRef<HTMLDivElement, SwipeableRowProps>(
  (
    {
      children,
      actions,
      actionWidth = 76,
      swipeToTrigger = true,
      disabled = false,
      onOpenChange,
      className,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [offset, setOffset] = React.useState(0);
    const [dragging, setDragging] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const startXRef = React.useRef(0);
    const startYRef = React.useRef(0);
    const startOffsetRef = React.useRef(0);
    const dirRef = React.useRef<"none" | "h" | "v">("none");
    const movedRef = React.useRef(false);
    const pointerIdRef = React.useRef<number | null>(null);

    const enabled = !disabled && actions.length > 0;
    const revealWidth = actions.length * actionWidth;
    const maxDrag = revealWidth + OVERSHOOT_MAX;
    const triggerAt = revealWidth + TRIGGER_EXTRA;

    const setContainerRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const close = React.useCallback(() => {
      setOffset(0);
      setOpen(false);
      onOpenChange?.(false);
    }, [onOpenChange]);

    const openRow = React.useCallback(() => {
      setOffset(-revealWidth);
      setOpen(true);
      onOpenChange?.(true);
    }, [revealWidth, onOpenChange]);

    const settle = React.useCallback(
      (distance: number) => {
        const dist = -distance;
        if (swipeToTrigger && dist >= triggerAt) {
          close();
          actions[0]?.onAction?.();
        } else if (dist >= revealWidth / 2) {
          openRow();
        } else {
          close();
        }
      },
      [swipeToTrigger, triggerAt, revealWidth, actions, close, openRow]
    );

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      startXRef.current = event.clientX;
      startYRef.current = event.clientY;
      startOffsetRef.current = offset;
      dirRef.current = "none";
      movedRef.current = false;
      pointerIdRef.current = event.pointerId;
      setDragging(true);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging || pointerIdRef.current !== event.pointerId) return;
      const dx = event.clientX - startXRef.current;
      const dy = event.clientY - startYRef.current;

      if (dirRef.current === "none") {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          // Dikey jest: kaydirmayi birak, sayfa scroll'una izin ver.
          dirRef.current = "v";
          setDragging(false);
          return;
        }
        dirRef.current = "h";
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      if (dirRef.current !== "h") return;

      movedRef.current = true;
      let next = startOffsetRef.current + dx;
      if (next > 0) next = 0;
      if (next < -revealWidth) {
        const over = -revealWidth - next;
        next = -revealWidth - over * 0.4;
      }
      if (next < -maxDrag) next = -maxDrag;
      setOffset(next);
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== event.pointerId) return;
      setDragging(false);
      if (dirRef.current === "h") settle(offset);
      dirRef.current = "none";
      pointerIdRef.current = null;
    };

    const handlePointerCancel = () => {
      setDragging(false);
      if (dirRef.current === "h") settle(offset);
      dirRef.current = "none";
      pointerIdRef.current = null;
    };

    const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
      if (movedRef.current) {
        event.preventDefault();
        event.stopPropagation();
        movedRef.current = false;
        return;
      }
      if (open) {
        event.preventDefault();
        event.stopPropagation();
        close();
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape" && open) {
        event.stopPropagation();
        close();
      }
    };

    const runAction = (action: SwipeableRowAction) => {
      action.onAction?.();
      close();
    };

    if (!enabled) {
      return (
        <div
          ref={setContainerRef}
          className={cn("relative bg-card", className)}
          {...props}
        >
          {children}
        </div>
      );
    }

    const distance = -offset;
    const currentReveal = Math.max(revealWidth, distance);
    const isFull = swipeToTrigger && distance >= triggerAt;

    return (
      <div
        ref={setContainerRef}
        role="group"
        onKeyDown={handleKeyDown}
        className={cn("relative overflow-hidden bg-card", className)}
        {...props}
      >
        {/* Arka aksiyon katmani — flex-row-reverse ile ilk aksiyon en ucta (sagda). */}
        <div
          className="absolute inset-y-0 right-0 flex flex-row-reverse items-stretch"
          style={{ width: currentReveal }}
          onFocus={() => {
            if (!open) openRow();
          }}
          onBlur={(event) => {
            if (!containerRef.current?.contains(event.relatedTarget as Node)) {
              close();
            }
          }}
          aria-hidden={distance <= 0 ? true : undefined}
        >
          {actions.map((action, index) => {
            const grow = index === 0 && distance > revealWidth;
            return (
              <button
                key={action.key}
                type="button"
                onClick={() => runAction(action)}
                aria-label={action.label}
                tabIndex={disabled ? -1 : 0}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-2 text-xs font-medium transition-[filter,flex] duration-200 hover:brightness-110 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset [&_svg]:size-4",
                  actionVariantClasses[action.variant ?? "default"],
                  grow && "flex-1"
                )}
                style={{ minWidth: actionWidth, flexBasis: actionWidth }}
              >
                {action.icon}
                <span className="leading-none">{action.label}</span>
              </button>
            );
          })}
        </div>

        {/* On katman — kaydirilan icerik. */}
        <div
          className={cn(
            "relative touch-pan-y select-none bg-card",
            !dragging &&
              "transition-transform duration-300 ease-out will-change-transform"
          )}
          style={{ transform: `translate3d(${offset}px, 0, 0)` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onClickCapture={handleClickCapture}
        >
          {children}
        </div>
      </div>
    );
  }
);
SwipeableRow.displayName = "SwipeableRow";

export type SwipeableRowGroupProps = React.HTMLAttributes<HTMLDivElement>;

const SwipeableRowGroup = React.forwardRef<HTMLDivElement, SwipeableRowGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "divide-y overflow-hidden rounded-xl border bg-card shadow-sm",
        className
      )}
      {...props}
    />
  )
);
SwipeableRowGroup.displayName = "SwipeableRowGroup";

export { SwipeableRow, SwipeableRowGroup };
