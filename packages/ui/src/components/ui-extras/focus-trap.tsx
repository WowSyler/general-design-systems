"use client";

/**
 * FocusTrap — Odak tuzagi sarmalayici (headless altyapi).
 * active iken Tab/Shift+Tab odagini yalnizca kendi cocuk odaklanabilir ogeleri
 * icinde dongude tutar: son ogede Tab basildiginda ilk ogeye, ilk ogede
 * Shift+Tab basildiginda son ogeye sarar. Etkinlestiginde ilk odaklanabilir
 * ogeye (veya verilen initialFocusRef'e) odaklanir; devre disi kaldiginda
 * odagi tuzak acilmadan onceki ogeye geri verir (restoreFocus). Escape,
 * opsiyonel onEscape geri cagrisini tetikler.
 *
 * Gorsel stil tasimaz; kendi dialog / menu / cekmece bilesenlerini kuranlar
 * icin erisilebilir odak yonetimi katmani saglar. Verilen className ve diger
 * div prop'lari saran kaba aktarilir.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

/** Odaklanabilir ogeleri secmek icin kullanilan CSS secici listesi. */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])",
].join(",");

/**
 * Verilen kap icindeki gorunur ve odaklanabilir ogeleri DOM sirasinda dondurur.
 * Gizli (offset boyutu 0), disabled veya aria-hidden ogeleri eler.
 */
function getFocusTrapTargets(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  const nodes = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  );
  return nodes.filter((element) => {
    if (element.hasAttribute("disabled")) return false;
    if (element.getAttribute("aria-hidden") === "true") return false;
    if (element.tabIndex < 0) return false;
    const visible =
      element.offsetWidth > 0 ||
      element.offsetHeight > 0 ||
      element.getClientRects().length > 0;
    return visible;
  });
}

export interface FocusTrapProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onEscape"> {
  /** Tuzagin etkin olup olmadigi. Varsayilan true. */
  active?: boolean;
  /** Etkinlestiginde ilk odaklanabilir ogeye odaklanir. Varsayilan true. */
  autoFocus?: boolean;
  /**
   * Devre disi kaldiginda / kaldirildiginda odagi tuzak oncesi odakli ogeye
   * geri verir. Varsayilan true.
   */
  restoreFocus?: boolean;
  /**
   * autoFocus sirasinda oncelikli olarak odaklanacak oge. Verilmezse ilk
   * odaklanabilir cocuk kullanilir.
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Escape tusuna basildiginda cagrilir (menu/dialog kapatmak icin). */
  onEscape?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

const FocusTrap = React.forwardRef<HTMLDivElement, FocusTrapProps>(
  (
    {
      active = true,
      autoFocus = true,
      restoreFocus = true,
      initialFocusRef,
      onEscape,
      onKeyDown,
      className,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const previouslyFocused = React.useRef<HTMLElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef]
    );

    // Etkinlestiginde odagi tuzaga al; devre disi kalinca geri ver.
    React.useEffect(() => {
      if (!active) return;
      const container = containerRef.current;
      if (!container) return;

      previouslyFocused.current =
        (document.activeElement as HTMLElement | null) ?? null;

      if (autoFocus) {
        const target =
          initialFocusRef?.current ?? getFocusTrapTargets(container)[0] ?? container;
        if (target === container && !container.hasAttribute("tabindex")) {
          // Icinde odaklanabilir oge yoksa kabin kendisini odaklanabilir kil.
          container.setAttribute("tabindex", "-1");
        }
        // Icerik yerlestikten sonra odakla (portal/animasyon ile uyumlu).
        const frame = window.requestAnimationFrame(() => target.focus());
        return () => {
          window.cancelAnimationFrame(frame);
          if (restoreFocus) previouslyFocused.current?.focus?.();
        };
      }

      return () => {
        if (restoreFocus) previouslyFocused.current?.focus?.();
      };
    }, [active, autoFocus, restoreFocus, initialFocusRef]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (!active || event.defaultPrevented) return;

      if (event.key === "Escape") {
        onEscape?.(event);
        return;
      }

      if (event.key !== "Tab") return;

      const targets = getFocusTrapTargets(containerRef.current);
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (!first || !last) {
        // Odaklanabilir oge yoksa odagi disari kacirma.
        event.preventDefault();
        return;
      }

      const activeElement = document.activeElement as HTMLElement | null;
      const inside = containerRef.current?.contains(activeElement) ?? false;

      if (event.shiftKey) {
        if (activeElement === first || !inside) {
          event.preventDefault();
          last.focus();
        }
      } else if (activeElement === last || !inside) {
        event.preventDefault();
        first.focus();
      }
    };

    return (
      <div
        ref={setRefs}
        onKeyDown={handleKeyDown}
        className={cn("outline-none", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FocusTrap.displayName = "FocusTrap";

export { FocusTrap, getFocusTrapTargets };
