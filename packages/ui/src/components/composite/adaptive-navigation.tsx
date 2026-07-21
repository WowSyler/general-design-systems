"use client";

/**
 * AdaptiveNavigation — Cihaza-uyarlanan ana uygulama gezinmesi.
 * Tek bir `items` listesinden (ikon + etiket + aktif + rozet) uc farkli
 * yerlesim uretir ve ekran genisligine gore otomatik gecis yapar:
 *  - Masaustu (lg >=1024): `desktopVariant` ile ya yatay ust-nav (topbar)
 *    ya da dikey yan sidebar.
 *  - Mobil/tablet (< lg): alt sabit gezinme cubugu (BottomNav deseni),
 *    istege bagli yukseltilmis orta eylem butonu ile.
 * Gecis `useBreakpoint` (isDesktop = lg+) ile JS tabanli yapilir; hook
 * SSR-guvenlidir. Aktif oge kontrollu (`value` + `onValueChange`) veya
 * her ogenin `active` bayragi ile belirlenir. DeployLens, Dolap, Randevu,
 * GlowScan, Fisly gibi 5 uygulamanin app-shell navigasyonu icin uygundur.
 */
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/components/ui-extras/use-breakpoint";

/** Masaustu (lg+) yerlesim secimi. */
export type AdaptiveNavigationVariant = "topbar" | "sidebar";

export interface AdaptiveNavigationItem {
  /** Benzersiz kimlik; kontrollu secim ve React key icin kullanilir. */
  id: string;
  /** Sol/ust ikon (lucide vb.). */
  icon: React.ReactNode;
  /** Gorunen metin etiketi. */
  label: string;
  /** Kontrolsuz kullanimda aktif oge isareti. */
  active?: boolean;
  /** Sayac veya kisa metin rozeti (or. 3, "Yeni"). */
  badge?: React.ReactNode;
  /** Oge secildiginde tetiklenir. */
  onSelect?: () => void;
  /** Ogeyi devre disi birakir. */
  disabled?: boolean;
}

export interface AdaptiveNavigationProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Gezinme ogeleri. */
  items: AdaptiveNavigationItem[];
  /** Masaustu (lg+) yerlesimi: "topbar" (yatay) veya "sidebar" (dikey). */
  desktopVariant?: AdaptiveNavigationVariant;
  /** Kontrollu aktif oge kimligi. Verilirse `active` bayragi yok sayilir. */
  value?: string;
  /** Aktif oge degisince cagirilir (oge kimligi ile). */
  onValueChange?: (id: string) => void;
  /** Baslangicta (marka/logo) gosterilen alan; topbar solunda, sidebar ustunde. */
  brand?: React.ReactNode;
  /** Aksiyon alani; topbar saginda, sidebar altinda gorunur. */
  actions?: React.ReactNode;
  /** Mobil alt cubukta ortadaki yukseltilmis eylem (or. GlowScan tarama). */
  mobileCenterAction?: React.ReactNode;
  /** Orta eylem butonunun erisilebilir etiketi. Varsayilan "Ana eylem". */
  mobileCenterActionLabel?: string;
  /** <nav> erisilebilir etiketi. Varsayilan "Ana gezinme". */
  "aria-label"?: string;
}

/* -------------------------------------------------------------------------- */
/* Yardimcilar                                                                */
/* -------------------------------------------------------------------------- */

const hasBadge = (badge: React.ReactNode): boolean =>
  badge !== undefined && badge !== null && badge !== false && badge !== "";

/** Masaustu (topbar + sidebar) oge tabani. */
const desktopItemVariants = cva(
  "relative inline-flex select-none items-center gap-2 whitespace-nowrap text-sm font-medium transition-colors duration-200 outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      surface: {
        topbar:
          "h-9 min-h-9 justify-center rounded-md px-3 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        sidebar:
          "w-full justify-start rounded-md px-3 py-2 text-left focus-visible:ring-2 focus-visible:ring-sidebar-ring",
      },
      active: { true: "", false: "" },
    },
    compoundVariants: [
      {
        surface: "topbar",
        active: false,
        class:
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      },
      {
        surface: "topbar",
        active: true,
        class: "bg-primary/10 font-semibold text-primary",
      },
      {
        surface: "sidebar",
        active: false,
        class:
          "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
      },
      {
        surface: "sidebar",
        active: true,
        class: "bg-sidebar-accent font-semibold text-sidebar-accent-foreground",
      },
    ],
    defaultVariants: { surface: "topbar", active: false },
  }
);

/* -------------------------------------------------------------------------- */
/* Bilesen                                                                    */
/* -------------------------------------------------------------------------- */

const AdaptiveNavigation = React.forwardRef<
  HTMLElement,
  AdaptiveNavigationProps
>(
  (
    {
      items,
      desktopVariant = "topbar",
      value,
      onValueChange,
      brand,
      actions,
      mobileCenterAction,
      mobileCenterActionLabel = "Ana eylem",
      className,
      "aria-label": ariaLabel = "Ana gezinme",
      ...props
    },
    ref
  ) => {
    const { isDesktop } = useBreakpoint();

    const isActive = React.useCallback(
      (item: AdaptiveNavigationItem) =>
        value !== undefined ? value === item.id : !!item.active,
      [value]
    );

    const handleSelect = React.useCallback(
      (item: AdaptiveNavigationItem) => {
        if (item.disabled) return;
        item.onSelect?.();
        onValueChange?.(item.id);
      },
      [onValueChange]
    );

    const renderBadge = (
      item: AdaptiveNavigationItem,
      active: boolean,
      pushRight: boolean
    ) => {
      if (!hasBadge(item.badge)) return null;
      return (
        <span
          className={cn(
            "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold leading-none tabular-nums",
            active
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary",
            pushRight && "ml-auto"
          )}
        >
          {item.badge}
        </span>
      );
    };

    /* ------------------------------- Masaustu ------------------------------ */

    const renderDesktopItem = (
      item: AdaptiveNavigationItem,
      surface: AdaptiveNavigationVariant
    ) => {
      const active = isActive(item);
      return (
        <li key={item.id} className={surface === "sidebar" ? "w-full" : undefined}>
          <button
            type="button"
            disabled={item.disabled}
            aria-current={active ? "page" : undefined}
            onClick={() => handleSelect(item)}
            className={cn(desktopItemVariants({ surface, active }))}
          >
            <span aria-hidden="true" className="shrink-0">
              {item.icon}
            </span>
            <span
              className={surface === "sidebar" ? "min-w-0 flex-1 truncate" : undefined}
            >
              {item.label}
            </span>
            {renderBadge(item, active, surface === "sidebar")}
          </button>
        </li>
      );
    };

    if (isDesktop && desktopVariant === "sidebar") {
      return (
        <nav
          ref={ref}
          aria-label={ariaLabel}
          className={cn(
            "flex h-full w-60 max-w-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
            className
          )}
          {...props}
        >
          {brand ? (
            <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-4">
              {brand}
            </div>
          ) : null}
          <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2">
            {items.map((item) => renderDesktopItem(item, "sidebar"))}
          </ul>
          {actions ? (
            <div className="shrink-0 border-t border-sidebar-border p-3">
              {actions}
            </div>
          ) : null}
        </nav>
      );
    }

    if (isDesktop) {
      return (
        <nav
          ref={ref}
          aria-label={ariaLabel}
          className={cn(
            "flex h-14 w-full items-center gap-2 border-b border-border bg-background/95 px-3 backdrop-blur sm:px-4",
            className
          )}
          {...props}
        >
          {brand ? (
            <div className="flex shrink-0 items-center">{brand}</div>
          ) : null}
          <ul className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            {items.map((item) => renderDesktopItem(item, "topbar"))}
          </ul>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </nav>
      );
    }

    /* -------------------------------- Mobil -------------------------------- */

    const renderBottomItem = (item: AdaptiveNavigationItem) => {
      const active = isActive(item);
      return (
        <button
          key={item.id}
          type="button"
          disabled={item.disabled}
          aria-current={active ? "page" : undefined}
          onClick={() => handleSelect(item)}
          className={cn(
            "relative flex h-full min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium leading-tight outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5 [&_svg]:shrink-0",
            active ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className="relative" aria-hidden="true">
            {item.icon}
            {hasBadge(item.badge) ? (
              <span className="absolute -right-2 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
                {item.badge}
              </span>
            ) : null}
          </span>
          <span className="max-w-full truncate">{item.label}</span>
          <span
            className={cn(
              "size-1 rounded-full transition-colors",
              active ? "bg-primary" : "bg-transparent"
            )}
            aria-hidden="true"
          />
        </button>
      );
    };

    const half = Math.ceil(items.length / 2);
    const leftItems = mobileCenterAction ? items.slice(0, half) : items;
    const rightItems = mobileCenterAction ? items.slice(half) : [];

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={cn(
          "relative flex h-16 w-full items-stretch border-t border-border bg-background/95 backdrop-blur",
          className
        )}
        {...props}
      >
        {leftItems.map(renderBottomItem)}
        {mobileCenterAction ? (
          <div className="relative w-16 shrink-0">
            <button
              type="button"
              aria-label={mobileCenterActionLabel}
              className="absolute -top-5 left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background [&_svg]:size-6"
            >
              {mobileCenterAction}
            </button>
          </div>
        ) : null}
        {rightItems.map(renderBottomItem)}
      </nav>
    );
  }
);
AdaptiveNavigation.displayName = "AdaptiveNavigation";

export { AdaptiveNavigation };
