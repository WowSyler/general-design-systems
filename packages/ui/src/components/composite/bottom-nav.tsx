/**
 * BottomNav — Mobil alt gezinme cubugu.
 * Ikon + etiketli ogeler ve istege bagli yukseltilmis orta eylem butonu
 * (or. GlowScan tarama butonu) icerir. Aktif oge renk + kalin yazi ve
 * aria-current ile isaretlenir; tum dokunma hedefleri en az 44px'tir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface BottomNavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

export interface BottomNavProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  items: BottomNavItem[];
  /** Yukseltilmis orta buton icerigi (or. tarama ikonu). */
  centerAction?: React.ReactNode;
  /** Orta butonun erisilebilir etiketi. Varsayilan "Ana eylem". */
  centerActionLabel?: string;
}

const BottomNav = React.forwardRef<HTMLElement, BottomNavProps>(
  (
    { items, centerAction, centerActionLabel = "Ana eylem", className, ...props },
    ref
  ) => {
    const half = Math.ceil(items.length / 2);
    const leftItems = centerAction ? items.slice(0, half) : items;
    const rightItems = centerAction ? items.slice(half) : [];

    const renderItem = (item: BottomNavItem, index: number) => (
      <button
        key={index}
        type="button"
        aria-current={item.active ? "page" : undefined}
        className={cn(
          "flex h-full min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          item.active
            ? "font-semibold text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span aria-hidden="true">{item.icon}</span>
        <span>{item.label}</span>
        <span
          className={cn(
            "size-1 rounded-full",
            item.active ? "bg-primary" : "bg-transparent"
          )}
          aria-hidden="true"
        />
      </button>
    );

    return (
      <nav
        ref={ref}
        aria-label="Alt gezinme"
        className={cn(
          "relative flex h-16 items-stretch border-t bg-background/95 backdrop-blur",
          className
        )}
        {...props}
      >
        {leftItems.map(renderItem)}
        {centerAction ? (
          <div className="relative w-16 shrink-0">
            <button
              type="button"
              aria-label={centerActionLabel}
              className="absolute -top-5 left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {centerAction}
            </button>
          </div>
        ) : null}
        {rightItems.map(renderItem)}
      </nav>
    );
  }
);
BottomNav.displayName = "BottomNav";

export { BottomNav };
