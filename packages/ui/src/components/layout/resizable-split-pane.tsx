"use client";

/**
 * ResizableSplitPane — surukleyerek boyutlandirilan iki panelli duzen.
 * Radix kullanmaz; boyutlandirma manuel pointer olaylari (setPointerCapture)
 * ile yapilir. `direction` yatay (yan yana) ya da dikey (alt alta) olabilir;
 * min/max yuzde sinirlari, klavye ok tuslariyla ayar (role=separator +
 * aria-orientation) ve kola cift-tiklayarak varsayilan orana donme desteklenir.
 * Kontrollu (`ratio`) ve kontrolsuz (`defaultRatio`) kullanim mumkundur.
 * DeployLens'te log akisi + detay ya da kod + canli onizleme bolmelerinde kullanilir.
 */
import * as React from "react";
import { GripHorizontal, GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";

type ResizableSplitPaneDirection = "horizontal" | "vertical";

interface ResizableSplitPaneProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Ilk panel icerigi (sol ya da ust). */
  first: React.ReactNode;
  /** Ikinci panel icerigi (sag ya da alt). */
  second: React.ReactNode;
  /** Panel yerlesimi: "horizontal" yan yana, "vertical" alt alta. Varsayilan: "horizontal". */
  direction?: ResizableSplitPaneDirection;
  /** Kontrollu ilk panel orani (yuzde). Verilirse bilesen kontrollu calisir. */
  ratio?: number;
  /** Kontrolsuz baslangic orani ve cift-tikta donulen varsayilan (yuzde). Varsayilan: 50. */
  defaultRatio?: number;
  /** Ilk panelin en kucuk orani (yuzde). Varsayilan: 15. */
  min?: number;
  /** Ilk panelin en buyuk orani (yuzde). Varsayilan: 85. */
  max?: number;
  /** Klavye ok tuslariyla degisim adimi (yuzde). Varsayilan: 4. */
  step?: number;
  /** Oran her degistiginde tetiklenir (surukleme + klavye). */
  onRatioChange?: (ratio: number) => void;
  /** Boyutlandirma kolunu devre disi birakir. */
  disabled?: boolean;
  /** Tutma koluna eklenen erisilebilirlik etiketi. */
  handleLabel?: string;
  /** Ilk panele eklenen sinif. */
  firstClassName?: string;
  /** Ikinci panele eklenen sinif. */
  secondClassName?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

const ResizableSplitPane = React.forwardRef<
  HTMLDivElement,
  ResizableSplitPaneProps
>(
  (
    {
      first,
      second,
      direction = "horizontal",
      ratio,
      defaultRatio = 50,
      min = 15,
      max = 85,
      step = 4,
      onRatioChange,
      disabled = false,
      handleLabel = "Panelleri yeniden boyutlandir",
      firstClassName,
      secondClassName,
      className,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const isControlled = ratio !== undefined;
    const [internalRatio, setInternalRatio] = React.useState(() =>
      clamp(defaultRatio, min, max)
    );
    const [dragging, setDragging] = React.useState(false);

    const currentRatio = clamp(isControlled ? ratio : internalRatio, min, max);
    const isHorizontal = direction === "horizontal";

    const commitRatio = React.useCallback(
      (next: number) => {
        const clamped = clamp(next, min, max);
        if (!isControlled) setInternalRatio(clamped);
        onRatioChange?.(clamped);
      },
      [isControlled, min, max, onRatioChange]
    );

    const handlePointerDown = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (disabled) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
      },
      [disabled]
    );

    const handlePointerMove = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (disabled) return;
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const next = isHorizontal
          ? ((event.clientX - rect.left) / rect.width) * 100
          : ((event.clientY - rect.top) / rect.height) * 100;
        commitRatio(next);
      },
      [disabled, isHorizontal, commitRatio]
    );

    const handlePointerUp = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        setDragging(false);
      },
      []
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        const decreaseKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
        const increaseKey = isHorizontal ? "ArrowRight" : "ArrowDown";
        switch (event.key) {
          case decreaseKey:
            event.preventDefault();
            commitRatio(currentRatio - step);
            break;
          case increaseKey:
            event.preventDefault();
            commitRatio(currentRatio + step);
            break;
          case "Home":
            event.preventDefault();
            commitRatio(min);
            break;
          case "End":
            event.preventDefault();
            commitRatio(max);
            break;
          default:
            break;
        }
      },
      [disabled, isHorizontal, commitRatio, currentRatio, step, min, max]
    );

    const handleDoubleClick = React.useCallback(() => {
      if (disabled) return;
      commitRatio(defaultRatio);
    }, [disabled, commitRatio, defaultRatio]);

    const roundedRatio = Math.round(currentRatio);
    const GripIcon = isHorizontal ? GripVertical : GripHorizontal;

    return (
      <div
        ref={ref}
        className={cn(
          "flex overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm",
          isHorizontal ? "flex-row" : "flex-col",
          dragging && "select-none",
          className
        )}
        {...props}
      >
        <div ref={containerRef} className="flex flex-1 overflow-hidden">
          <div
            className={cn(
              "flex min-h-0 min-w-0 overflow-auto",
              isHorizontal ? "flex-col" : "flex-row",
              firstClassName
            )}
            style={{ flexBasis: `${currentRatio}%`, flexGrow: 0, flexShrink: 0 }}
          >
            {first}
          </div>

          <div
            role="separator"
            tabIndex={disabled ? -1 : 0}
            aria-orientation={isHorizontal ? "vertical" : "horizontal"}
            aria-label={handleLabel}
            aria-valuenow={roundedRatio}
            aria-valuemin={Math.round(min)}
            aria-valuemax={Math.round(max)}
            aria-disabled={disabled || undefined}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onKeyDown={handleKeyDown}
            onDoubleClick={handleDoubleClick}
            className={cn(
              "group relative flex shrink-0 items-center justify-center bg-border/60 outline-none transition-colors",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
              !disabled && "hover:bg-primary/20 focus-visible:bg-primary/20",
              disabled
                ? "cursor-default"
                : isHorizontal
                  ? "cursor-col-resize"
                  : "cursor-row-resize",
              isHorizontal ? "w-1.5" : "h-1.5",
              dragging && "bg-primary/30"
            )}
          >
            {/* Genisletilmis dokunma/tiklama alani */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute",
                isHorizontal
                  ? "inset-y-0 -left-1.5 -right-1.5"
                  : "inset-x-0 -top-1.5 -bottom-1.5"
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none z-10 flex items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-all duration-200",
                "group-hover:border-ring/60 group-hover:text-foreground group-hover:shadow-md",
                dragging && "border-ring/60 text-foreground shadow-md",
                isHorizontal ? "h-8 w-4" : "h-4 w-8"
              )}
            >
              <GripIcon className="size-3.5" />
            </span>
          </div>

          <div
            className={cn(
              "flex min-h-0 min-w-0 flex-1 overflow-auto",
              isHorizontal ? "flex-col" : "flex-row",
              secondClassName
            )}
          >
            {second}
          </div>
        </div>
      </div>
    );
  }
);
ResizableSplitPane.displayName = "ResizableSplitPane";

export { ResizableSplitPane };
export type { ResizableSplitPaneProps, ResizableSplitPaneDirection };
