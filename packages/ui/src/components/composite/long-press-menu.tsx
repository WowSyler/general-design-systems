"use client";

/**
 * LongPressMenu — Uzun-basma aksiyon menusu (mobil context-menu karsiligi).
 * Sardigi ogeye parmakla/isaretciyle uzun basildiginda (varsayilan 500ms,
 * kayma esigi asilmadan) bir aksiyon menusu belirir. Menu, basilan noktadan
 * "haptik" tarzi bir olcek animasyonuyla acilir (scale-in + hafif titresim);
 * ogeler ikon + etiket ve opsiyonel kisayol ipucu tasir, "destructive" tonunu
 * destekler. Disari-tik ve Escape ile kapanir; menu ekran kenarina tasarsa
 * otomatik ters yone (sol/yukari) doner. Basili tutarken sardigi oge hafifce
 * kuculerek dokunsal geri bildirim verir.
 *
 * Klavye/masaustu icin erisilebilir alternatifler: tetik oge odaklanabilir
 * (role=button, aria-haspopup=menu); Enter/Space/ContextMenu tusu ya da sag
 * tik menuyu ortalayarak acar. Menu role=menu, ogeler role=menuitem olup Ok
 * tuslari, Home/End ve Escape ile gezilir.
 *
 * Dolap urun kartlari, Fisly islem satirlari ve Randevu liste ogeleri gibi
 * dokunmatik akislarda context-menu yerine kullanilir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

/** Menudeki tek bir aksiyon ogesi. */
export interface LongPressMenuItem {
  /** Benzersiz anahtar. */
  key: string;
  /** Oge etiketi (erisilebilir ad olarak da kullanilir). */
  label: string;
  /** Sol taraftaki opsiyonel ikon (lucide onerilir). */
  icon?: React.ReactNode;
  /** Sag tarafta gosterilen kisayol/ipucu (or. "Kopyala"). */
  shortcut?: string;
  /** Ton; "destructive" yikici aksiyonlar icin. Varsayilan "default". */
  variant?: "default" | "destructive";
  /** Oge secildiginde calisir (menu kapanir). */
  onSelect?: () => void;
  disabled?: boolean;
}

export interface LongPressMenuProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Uzun basilacak icerik (tetik). */
  children: React.ReactNode;
  /** Menu aksiyonlari. */
  items: LongPressMenuItem[];
  /** Uzun basma esigi (ms). Varsayilan 500. */
  delay?: number;
  /** Menu ustunde gosterilen opsiyonel baslik. */
  label?: string;
  /** Acilista cihaz titresimi (varsa). Varsayilan true. */
  haptics?: boolean;
  /** Tumuyle devre disi birakir (menu acilmaz). */
  disabled?: boolean;
  /** Herhangi bir oge secildiginde anahtariyla cagrilir. */
  onSelect?: (key: string) => void;
  /** Acilma/kapanma degisiminde cagrilir. */
  onOpenChange?: (open: boolean) => void;
  /** Statik onizleme icin menuyu tetigin altinda acik baslatir. */
  defaultOpen?: boolean;
  /** Menu icin ek sinif. */
  menuClassName?: string;
}

/** Kayma esigi: bu kadar px hareket edilirse uzun basma iptal edilir. */
const MOVE_CANCEL = 10;
/** Menuyu ekran kenarindan uzak tutan bosluk (px). */
const VIEWPORT_MARGIN = 8;

interface MenuPosition {
  left: number;
  top: number;
  transformOrigin: string;
}

const LongPressMenu = React.forwardRef<HTMLDivElement, LongPressMenuProps>(
  (
    {
      children,
      items,
      delay = 500,
      label,
      haptics = true,
      disabled = false,
      onSelect,
      onOpenChange,
      defaultOpen = false,
      menuClassName,
      className,
      ...props
    },
    ref
  ) => {
    const triggerRef = React.useRef<HTMLDivElement | null>(null);
    const menuRef = React.useRef<HTMLDivElement | null>(null);
    const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const startRef = React.useRef({ x: 0, y: 0 });
    const rawCoordsRef = React.useRef({ x: 0, y: 0 });
    const pointerIdRef = React.useRef<number | null>(null);
    const openedByKeyboardRef = React.useRef(false);

    const [open, setOpen] = React.useState(false);
    const [pressing, setPressing] = React.useState(false);
    const [entered, setEntered] = React.useState(false);
    const [position, setPosition] = React.useState<MenuPosition>({
      left: 0,
      top: 0,
      transformOrigin: "top left",
    });
    const [activeIndex, setActiveIndex] = React.useState(-1);

    const enabled = !disabled && items.length > 0;
    const firstEnabled = React.useMemo(
      () => items.findIndex((item) => !item.disabled),
      [items]
    );

    const setTriggerRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const clearTimer = React.useCallback(() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }, []);

    const openAt = React.useCallback(
      (x: number, y: number, viaKeyboard = false) => {
        rawCoordsRef.current = { x, y };
        openedByKeyboardRef.current = viaKeyboard;
        setActiveIndex(viaKeyboard ? firstEnabled : -1);
        setEntered(false);
        setPressing(false);
        setOpen(true);
        onOpenChange?.(true);
        if (
          haptics &&
          typeof navigator !== "undefined" &&
          typeof navigator.vibrate === "function"
        ) {
          navigator.vibrate(12);
        }
      },
      [firstEnabled, haptics, onOpenChange]
    );

    const close = React.useCallback(
      (returnFocus = false) => {
        setOpen(false);
        setPressing(false);
        setActiveIndex(-1);
        onOpenChange?.(false);
        if (returnFocus) triggerRef.current?.focus();
      },
      [onOpenChange]
    );

    // Acilinca konumu ekran icine sigacak sekilde hesapla + giris animasyonu.
    React.useLayoutEffect(() => {
      if (!open) return;
      const menu = menuRef.current;
      if (!menu) return;
      const rect = menu.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const { x, y } = rawCoordsRef.current;

      let left = x;
      let flipX = false;
      if (left + rect.width + VIEWPORT_MARGIN > vw) {
        left = x - rect.width;
        flipX = true;
      }
      left = Math.max(
        VIEWPORT_MARGIN,
        Math.min(left, vw - rect.width - VIEWPORT_MARGIN)
      );

      let top = y;
      let flipY = false;
      if (top + rect.height + VIEWPORT_MARGIN > vh) {
        top = y - rect.height;
        flipY = true;
      }
      top = Math.max(
        VIEWPORT_MARGIN,
        Math.min(top, vh - rect.height - VIEWPORT_MARGIN)
      );

      setPosition({
        left,
        top,
        transformOrigin: `${flipX ? "right" : "left"} ${flipY ? "bottom" : "top"}`,
      });
    }, [open]);

    // Giris animasyonunu bir sonraki karede tetikle (scale-in).
    React.useEffect(() => {
      if (!open) return;
      const id = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(id);
    }, [open]);

    // Klavye ile acildiysa ilk ogeye, dokunmayla acildiysa menu kabina odaklan
    // (Escape'in calismasi icin odak menu icinde olmali).
    React.useEffect(() => {
      if (!open) return;
      if (openedByKeyboardRef.current && activeIndex >= 0) {
        itemRefs.current[activeIndex]?.focus();
      } else if (!openedByKeyboardRef.current) {
        menuRef.current?.focus();
      }
    }, [open, activeIndex]);

    // Statik onizleme: tetigin altinda ac.
    React.useEffect(() => {
      if (!defaultOpen || !enabled) return;
      const node = triggerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      openAt(rect.left + 12, rect.bottom + 6);
      // Yalnizca ilk montajda.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => clearTimer, [clearTimer]);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled || open) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      startRef.current = { x: event.clientX, y: event.clientY };
      pointerIdRef.current = event.pointerId;
      setPressing(true);
      clearTimer();
      timerRef.current = setTimeout(() => {
        openAt(startRef.current.x, startRef.current.y);
      }, delay);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== event.pointerId) return;
      const dx = event.clientX - startRef.current.x;
      const dy = event.clientY - startRef.current.y;
      if (Math.abs(dx) > MOVE_CANCEL || Math.abs(dy) > MOVE_CANCEL) {
        clearTimer();
        setPressing(false);
        pointerIdRef.current = null;
      }
    };

    const handlePointerEnd = () => {
      clearTimer();
      setPressing(false);
      pointerIdRef.current = null;
    };

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled) return;
      // Yerel context menuyu bastir; kendi menumuzu ac (sag tik / masaustu).
      event.preventDefault();
      clearTimer();
      if (!open) openAt(event.clientX, event.clientY);
    };

    const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!enabled || open) return;
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ContextMenu"
      ) {
        event.preventDefault();
        const rect = event.currentTarget.getBoundingClientRect();
        openAt(rect.left + 12, rect.bottom + 6, true);
      }
    };

    const runItem = (item: LongPressMenuItem) => {
      if (item.disabled) return;
      close(openedByKeyboardRef.current);
      item.onSelect?.();
      onSelect?.(item.key);
    };

    const moveActive = (dir: 1 | -1) => {
      const count = items.length;
      if (count === 0) return;
      let next = activeIndex;
      for (let i = 0; i < count; i += 1) {
        next = (next + dir + count) % count;
        if (!items[next]?.disabled) break;
      }
      setActiveIndex(next);
      itemRefs.current[next]?.focus();
    };

    const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case "Escape":
          event.preventDefault();
          close(true);
          break;
        case "ArrowDown":
          event.preventDefault();
          moveActive(1);
          break;
        case "ArrowUp":
          event.preventDefault();
          moveActive(-1);
          break;
        case "Home": {
          event.preventDefault();
          const idx = items.findIndex((it) => !it.disabled);
          if (idx >= 0) {
            setActiveIndex(idx);
            itemRefs.current[idx]?.focus();
          }
          break;
        }
        case "End": {
          event.preventDefault();
          for (let i = items.length - 1; i >= 0; i -= 1) {
            if (!items[i]?.disabled) {
              setActiveIndex(i);
              itemRefs.current[i]?.focus();
              break;
            }
          }
          break;
        }
        default:
          break;
      }
    };

    return (
      <>
        <div
          ref={setTriggerRef}
          role="button"
          tabIndex={enabled ? 0 : undefined}
          aria-haspopup={enabled ? "menu" : undefined}
          aria-expanded={enabled ? open : undefined}
          aria-disabled={disabled || undefined}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onContextMenu={handleContextMenu}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            "relative inline-block select-none rounded-[inherit] outline-none [-webkit-touch-callout:none]",
            "transition-transform duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
            pressing && "scale-[0.97]",
            !enabled && "cursor-default",
            className
          )}
          {...props}
        >
          {children}
          {/* Basili tutarken beliren ince halka — dokunsal geri bildirim. */}
          {pressing ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[inherit] ring-2 ring-ring/50 animate-[pulse_600ms_ease-in-out_infinite]"
            />
          ) : null}
        </div>

        {open ? (
          <div className="fixed inset-0 z-50" role="presentation">
            {/* Disari-tik/scrim katmani. */}
            <div
              className={cn(
                "absolute inset-0 bg-foreground/5 transition-opacity duration-200",
                entered ? "opacity-100" : "opacity-0"
              )}
              onPointerDown={() => close()}
              onContextMenu={(event) => {
                event.preventDefault();
                close();
              }}
            />
            <div
              ref={menuRef}
              role="menu"
              aria-label={label ?? "Aksiyonlar"}
              tabIndex={-1}
              onKeyDown={handleMenuKeyDown}
              style={{
                left: position.left,
                top: position.top,
                transformOrigin: position.transformOrigin,
              }}
              className={cn(
                "absolute min-w-56 origin-top-left overflow-hidden rounded-xl border bg-popover bg-sheen p-1 text-popover-foreground shadow-xl",
                "transition-[transform,opacity] duration-150 ease-out",
                entered ? "scale-100 opacity-100" : "scale-90 opacity-0",
                menuClassName
              )}
            >
              {label ? (
                <div className="px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </div>
              ) : null}
              {items.map((item, index) => {
                const destructive = item.variant === "destructive";
                return (
                  <button
                    key={item.key}
                    ref={(node) => {
                      itemRefs.current[index] = node;
                    }}
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    tabIndex={index === activeIndex ? 0 : -1}
                    onClick={() => runItem(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none transition-colors duration-150",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                      "disabled:pointer-events-none disabled:opacity-50",
                      "[&_svg]:size-4 [&_svg]:shrink-0",
                      destructive
                        ? "text-destructive hover:bg-destructive/10 focus:bg-destructive/10 [&_svg]:text-destructive"
                        : "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground [&_svg]:text-muted-foreground",
                      index === activeIndex &&
                        (destructive
                          ? "bg-destructive/10"
                          : "bg-accent text-accent-foreground")
                    )}
                  >
                    {item.icon}
                    <span className="flex-1 truncate text-left">{item.label}</span>
                    {item.shortcut ? (
                      <span className="ml-auto text-xs tabular-nums text-muted-foreground/70">
                        {item.shortcut}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </>
    );
  }
);
LongPressMenu.displayName = "LongPressMenu";

export { LongPressMenu };
