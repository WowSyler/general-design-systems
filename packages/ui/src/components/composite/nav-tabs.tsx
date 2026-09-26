"use client";

/**
 * NavTabs — Mevcut Tabs'tan farkli stiller sunan sekme gezinme grubu.
 * cva ile uc gorsel varyant (underline | pill | enclosed) ve iki yon
 * (horizontal | vertical) tasir; her sekmede istege bagli ikon + sayac
 * rozeti gosterilebilir. Kontrollu value + onValueChange (ayrica uncontrolled
 * defaultValue destegi) ile calisir. role=tablist/tab/tabpanel ve ok tuslari
 * (yona gore Sol/Sag veya Yukari/Asagi + Home/End) ile tam klavye erisimi.
 * Ornek: Ayarlar icin dikey rail, icerik icin yatay underline.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

type NavTabsVariant = "underline" | "pill" | "enclosed";
type NavTabsOrientation = "horizontal" | "vertical";

interface NavTabsContextValue {
  value: string;
  setValue: (value: string) => void;
  variant: NavTabsVariant;
  orientation: NavTabsOrientation;
  baseId: string;
}

const NavTabsContext = React.createContext<NavTabsContextValue | null>(null);

function useNavTabsContext(component: string): NavTabsContextValue {
  const context = React.useContext(NavTabsContext);
  if (!context) {
    throw new Error(`${component}, <NavTabs> icinde kullanilmalidir.`);
  }
  return context;
}

const tabId = (baseId: string, value: string) => `${baseId}-tab-${value}`;
const panelId = (baseId: string, value: string) => `${baseId}-panel-${value}`;

/* -------------------------------------------------------------------------- */
/* NavTabs (kok / context)                                                    */
/* -------------------------------------------------------------------------- */

export interface NavTabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Kontrollu secili sekme degeri. */
  value?: string;
  /** Uncontrolled baslangic degeri. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: NavTabsVariant;
  orientation?: NavTabsOrientation;
}

const NavTabs = React.forwardRef<HTMLDivElement, NavTabsProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      variant = "underline",
      orientation = "horizontal",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const currentValue = value ?? internalValue;

    const setValue = React.useCallback(
      (next: string) => {
        if (value === undefined) {
          setInternalValue(next);
        }
        onValueChange?.(next);
      },
      [value, onValueChange]
    );

    const context = React.useMemo<NavTabsContextValue>(
      () => ({
        value: currentValue,
        setValue,
        variant,
        orientation,
        baseId: generatedId,
      }),
      [currentValue, setValue, variant, orientation, generatedId]
    );

    return (
      <NavTabsContext.Provider value={context}>
        <div
          ref={ref}
          data-orientation={orientation}
          className={cn(
            "flex gap-4",
            // Dikey düzen <640px'te üst üste biner (sekmeler üstte, yatay kaydırmalı)
            orientation === "vertical" ? "flex-col sm:flex-row" : "flex-col",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </NavTabsContext.Provider>
    );
  }
);
NavTabs.displayName = "NavTabs";

/* -------------------------------------------------------------------------- */
/* NavTabsList (tablist + ok tusu gezinmesi)                                  */
/* -------------------------------------------------------------------------- */

const navTabsListVariants = cva("flex", {
  variants: {
    variant: {
      underline: "gap-1",
      pill: "gap-1 rounded-lg bg-muted p-1",
      enclosed: "gap-1",
    },
    orientation: {
      horizontal: "flex-row items-center",
      vertical:
        "flex-row items-center max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-col sm:items-stretch sm:overflow-visible",
    },
  },
  compoundVariants: [
    // Yatay liste: dar ekranda yatay kaydırılır (scroll-snap, gizli kaydırma çubuğu).
    // Alt çizgi border yerine inset gölge — overflow kırpması sekmenin 2px
    // çizgisini kesmesin diye (görünüm border ile birebir aynı).
    {
      orientation: "horizontal",
      class:
        "relative max-w-full overflow-x-auto overscroll-x-contain snap-x snap-proximity [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    },
    { variant: "underline", orientation: "horizontal", class: "shadow-[inset_0_-1px_0_hsl(var(--border))]" },
    { variant: "underline", orientation: "vertical", class: "shadow-[inset_0_-1px_0_hsl(var(--border))] sm:shadow-none sm:border-s sm:border-border" },
    { variant: "enclosed", orientation: "horizontal", class: "shadow-[inset_0_-1px_0_hsl(var(--border))]" },
    { variant: "enclosed", orientation: "vertical", class: "shadow-[inset_0_-1px_0_hsl(var(--border))] sm:shadow-none sm:border-s sm:border-border" },
  ],
  defaultVariants: {
    variant: "underline",
    orientation: "horizontal",
  },
});

export interface NavTabsListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Sekmeleri veri odakli uretmek icin. Verilmezse children kullanilir. */
  items?: NavTabsItem[];
  /** tablist icin erisilebilir etiket. */
  "aria-label"?: string;
}

const NavTabsList = React.forwardRef<HTMLDivElement, NavTabsListProps>(
  ({ items, className, children, ...props }, ref) => {
    const { variant, orientation, setValue } = useNavTabsContext("NavTabsList");
    const listRef = React.useRef<HTMLDivElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const navigationKeys = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ];
      if (!navigationKeys.includes(event.key)) return;

      const list = listRef.current;
      if (!list) return;

      const tabs = Array.from(
        list.querySelectorAll<HTMLElement>('[role="tab"]:not([data-disabled="true"])')
      );
      if (tabs.length === 0) return;

      // RTL'de yatay ok tuşları aynalanır (sağ ok = önceki sekme)
      const rtl = getComputedStyle(list).direction === "rtl";
      const forwardKey =
        orientation === "vertical" ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";
      const backwardKey =
        orientation === "vertical" ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
      const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);

      let nextIndex: number;
      if (event.key === forwardKey) {
        nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % tabs.length;
      } else if (event.key === backwardKey) {
        nextIndex =
          currentIndex < 0
            ? tabs.length - 1
            : (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      } else {
        // Yona uymayan ok tusu: varsayilan davranisi bozma.
        return;
      }

      const nextTab = tabs[nextIndex];
      if (!nextTab) return;

      event.preventDefault();
      nextTab.focus();
      const nextValue = nextTab.getAttribute("data-value");
      if (nextValue) setValue(nextValue);
    };

    return (
      <div
        ref={setRefs}
        role="tablist"
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
        className={cn(navTabsListVariants({ variant, orientation }), className)}
        {...props}
      >
        {items
          ? items.map((item) => (
              <NavTabsTab
                key={item.value}
                value={item.value}
                icon={item.icon}
                badge={item.badge}
                disabled={item.disabled}
              >
                {item.label}
              </NavTabsTab>
            ))
          : children}
      </div>
    );
  }
);
NavTabsList.displayName = "NavTabsList";

/* -------------------------------------------------------------------------- */
/* NavTabsTab                                                                  */
/* -------------------------------------------------------------------------- */

const navTabsTabVariants = cva(
  "relative inline-flex select-none items-center gap-2 whitespace-nowrap text-sm font-medium pointer-coarse:min-h-11 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        underline:
          "px-3 py-2 border-transparent text-muted-foreground hover:text-foreground",
        pill: "rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground",
        enclosed:
          "border border-transparent px-3 py-2 text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      },
      orientation: {
        horizontal: "shrink-0 snap-start justify-center",
        vertical: "shrink-0 justify-start text-start sm:shrink",
      },
      active: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // Underline
      {
        variant: "underline",
        orientation: "horizontal",
        class: "border-b-2",
      },
      {
        variant: "underline",
        orientation: "vertical",
        class: "border-b-2 sm:border-b-0 sm:-ms-px sm:border-s-2 sm:rounded-e-md",
      },
      {
        variant: "underline",
        active: true,
        class: "border-primary text-foreground",
      },
      // Pill
      {
        variant: "pill",
        active: true,
        class: "bg-background text-foreground shadow-sm",
      },
      // Enclosed
      {
        variant: "enclosed",
        orientation: "horizontal",
        class: "rounded-t-md",
      },
      {
        variant: "enclosed",
        orientation: "vertical",
        class: "rounded-t-md sm:rounded-t-none sm:-ms-px sm:rounded-s-md",
      },
      {
        variant: "enclosed",
        orientation: "horizontal",
        active: true,
        class: "border-border border-b-background bg-background text-foreground",
      },
      {
        variant: "enclosed",
        orientation: "vertical",
        active: true,
        class: "border-border border-b-background sm:border-b-border sm:border-s-background bg-background text-foreground",
      },
    ],
    defaultVariants: {
      variant: "underline",
      orientation: "horizontal",
      active: false,
    },
  }
);

type NavTabsBadgeTone = "active" | "inactive";

const badgeToneClasses: Record<NavTabsBadgeTone, string> = {
  active: "bg-primary text-primary-foreground",
  inactive: "bg-primary/10 text-primary",
};

export interface NavTabsItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** Sayac veya kisa etiket rozeti. */
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface NavTabsTabProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof VariantProps<typeof navTabsTabVariants> | "value"
  > {
  value: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

const NavTabsTab = React.forwardRef<HTMLButtonElement, NavTabsTabProps>(
  ({ value, icon, badge, disabled, className, children, onClick, ...props }, ref) => {
    const {
      value: selectedValue,
      setValue,
      variant,
      orientation,
      baseId,
    } = useNavTabsContext("NavTabsTab");
    const isActive = selectedValue === value;
    const innerRef = React.useRef<HTMLButtonElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );
    const mountedRef = React.useRef(false);

    // Yatay kaydırılan listede aktif sekmeyi görünür alana getir (yalnız listeyi
    // kaydırır — sayfayı kaydırmaz; RTL'de de fiziksel delta ile çalışır).
    React.useEffect(() => {
      const tab = innerRef.current;
      const list = tab?.parentElement;
      const first = !mountedRef.current;
      mountedRef.current = true;
      if (!isActive || !tab || !list || orientation !== "horizontal") return;
      if (list.scrollWidth <= list.clientWidth) return;
      const t = tab.getBoundingClientRect();
      const l = list.getBoundingClientRect();
      const pad = 16;
      let delta = 0;
      if (t.left < l.left + pad) delta = t.left - l.left - pad;
      else if (t.right > l.right - pad) delta = t.right - l.right + pad;
      if (delta !== 0) {
        list.scrollBy({ left: delta, behavior: first ? "auto" : "smooth" });
      }
    }, [isActive, orientation]);

    return (
      <button
        ref={setRefs}
        type="button"
        role="tab"
        id={tabId(baseId, value)}
        aria-selected={isActive}
        aria-controls={panelId(baseId, value)}
        data-value={value}
        data-state={isActive ? "active" : "inactive"}
        data-disabled={disabled ? "true" : undefined}
        disabled={disabled}
        tabIndex={isActive && !disabled ? 0 : -1}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented && !disabled) setValue(value);
        }}
        className={cn(
          navTabsTabVariants({ variant, orientation, active: isActive }),
          className
        )}
        {...props}
      >
        {icon ? <span aria-hidden="true">{icon}</span> : null}
        <span>{children}</span>
        {badge !== undefined && badge !== null && badge !== false ? (
          <span
            className={cn(
              "ms-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums leading-none",
              badgeToneClasses[isActive ? "active" : "inactive"]
            )}
          >
            {badge}
          </span>
        ) : null}
      </button>
    );
  }
);
NavTabsTab.displayName = "NavTabsTab";

/* -------------------------------------------------------------------------- */
/* NavTabsPanel                                                                */
/* -------------------------------------------------------------------------- */

export interface NavTabsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  /** Pasifken DOM'da tutup gizler (false ile). Varsayilan: pasif panel unmount. */
  forceMount?: boolean;
}

const NavTabsPanel = React.forwardRef<HTMLDivElement, NavTabsPanelProps>(
  ({ value, forceMount = false, className, children, ...props }, ref) => {
    const { value: selectedValue, baseId } = useNavTabsContext("NavTabsPanel");
    const isActive = selectedValue === value;

    if (!isActive && !forceMount) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId(baseId, value)}
        aria-labelledby={tabId(baseId, value)}
        hidden={!isActive}
        tabIndex={0}
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "min-w-0 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          isActive && "animate-fade-up",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
NavTabsPanel.displayName = "NavTabsPanel";

export {
  NavTabs,
  NavTabsList,
  NavTabsTab,
  NavTabsPanel,
  navTabsListVariants,
  navTabsTabVariants,
};
