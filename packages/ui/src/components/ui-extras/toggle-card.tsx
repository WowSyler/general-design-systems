"use client";

/**
 * ToggleCard — Secilebilir kart grubu (radio-card / checkbox-card).
 * Tiklanabilir kartlar ikon + baslik + aciklama tasir; secili durumda ring-primary,
 * arka plan vurgusu ve kose Check rozetiyle isaretlenir. ToggleCardGroup "single"
 * modda tek secim (role=radiogroup, kartlar role=radio, ok tuslariyla gezinme +
 * secim) ya da "multiple" modda coklu secim (role=group, kartlar role=checkbox,
 * Bosluk/Enter ile ac-kapa) yapar. Onboarding tercihi, ayar secimi, plan secimi
 * gibi akislar icin (DeployLens/Randevu/Fisly). value + onValueChange ile
 * kontrollu/kontrolsuz calisir.
 */
import * as React from "react";
import { Check } from "lucide-react";

import { cn, logicalArrowKey } from "@/lib/utils";

type ToggleCardType = "single" | "multiple";

interface ToggleCardContextValue {
  type: ToggleCardType;
  disabled: boolean;
  isSelected: (value: string) => boolean;
  toggle: (value: string) => void;
  getTabIndex: (value: string, itemDisabled: boolean) => number;
  register: (item: { value: string; disabled: boolean }) => void;
  unregister: (value: string) => void;
  groupRef: React.RefObject<HTMLDivElement | null>;
}

const ToggleCardContext = React.createContext<ToggleCardContextValue | null>(
  null
);

function useToggleCardContext(): ToggleCardContextValue {
  const context = React.useContext(ToggleCardContext);
  if (!context) {
    throw new Error("ToggleCard, ToggleCardGroup icinde kullanilmalidir.");
  }
  return context;
}

export interface ToggleCardGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** "single" tek secim (radio), "multiple" coklu secim (checkbox). */
  type?: ToggleCardType;
  /** Kontrollu deger: single icin string, multiple icin string[]. */
  value?: string | string[];
  /** Kontrolsuz baslangic degeri. */
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  /** Tum grubu devre disi birakir. */
  disabled?: boolean;
}

const ToggleCardGroup = React.forwardRef<HTMLDivElement, ToggleCardGroupProps>(
  (
    {
      type = "single",
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const groupRef = React.useRef<HTMLDivElement>(null);
    const itemsRef = React.useRef<{ value: string; disabled: boolean }[]>([]);
    const [, forceUpdate] = React.useReducer((count: number) => count + 1, 0);

    const isControlled = value !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState<string | string[]>(
      () => defaultValue ?? (type === "multiple" ? [] : "")
    );
    const current = isControlled ? value : uncontrolled;

    const commit = (next: string | string[]) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    };

    const isSelected = (candidate: string) =>
      type === "multiple"
        ? Array.isArray(current) && current.includes(candidate)
        : current === candidate;

    const toggle = (candidate: string) => {
      if (disabled) return;
      if (type === "multiple") {
        const list = Array.isArray(current) ? current : [];
        commit(
          list.includes(candidate)
            ? list.filter((item) => item !== candidate)
            : [...list, candidate]
        );
      } else {
        commit(candidate);
      }
    };

    const register = React.useCallback(
      (item: { value: string; disabled: boolean }) => {
        itemsRef.current = [
          ...itemsRef.current.filter((existing) => existing.value !== item.value),
          item,
        ];
        forceUpdate();
      },
      []
    );

    const unregister = React.useCallback((candidate: string) => {
      itemsRef.current = itemsRef.current.filter(
        (existing) => existing.value !== candidate
      );
      forceUpdate();
    }, []);

    const getTabIndex = (candidate: string, itemDisabled: boolean) => {
      if (disabled || itemDisabled) return -1;
      // Checkbox kartlarinin her biri normal bir sekmelenebilir hedeftir.
      if (type === "multiple") return 0;
      // Radio grubunda tek sekme durak (roving tabindex): secili olan,
      // yoksa ilk etkin kart odaklanabilir.
      if (isSelected(candidate)) return 0;
      const anySelected = typeof current === "string" && current !== "";
      if (anySelected) return -1;
      const firstEnabled = itemsRef.current.find((item) => !item.disabled);
      return firstEnabled?.value === candidate ? 0 : -1;
    };

    const setRefs = (node: HTMLDivElement | null) => {
      groupRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    const contextValue: ToggleCardContextValue = {
      type,
      disabled,
      isSelected,
      toggle,
      getTabIndex,
      register,
      unregister,
      groupRef,
    };

    return (
      <ToggleCardContext.Provider value={contextValue}>
        <div
          ref={setRefs}
          role={type === "single" ? "radiogroup" : "group"}
          aria-disabled={disabled || undefined}
          className={cn("grid gap-3", className)}
          {...props}
        >
          {children}
        </div>
      </ToggleCardContext.Provider>
    );
  }
);
ToggleCardGroup.displayName = "ToggleCardGroup";

export interface ToggleCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onClick"> {
  /** Grup icinde bu karti tanimlayan benzersiz deger. */
  value: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const ToggleCard = React.forwardRef<HTMLDivElement, ToggleCardProps>(
  (
    {
      value,
      title,
      description,
      icon,
      disabled = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const context = useToggleCardContext();
    const { type, groupRef, register, unregister } = context;
    const selected = context.isSelected(value);
    const isDisabled = context.disabled || disabled;

    React.useEffect(() => {
      register({ value, disabled });
      return () => unregister(value);
    }, [register, unregister, value, disabled]);

    const focusSibling = (target: "next" | "prev" | "first" | "last") => {
      const root = groupRef.current;
      if (!root) return;
      const cards = Array.from(
        root.querySelectorAll<HTMLDivElement>(
          '[data-toggle-card="item"]:not([data-disabled="true"])'
        )
      );
      if (cards.length === 0) return;
      const currentIndex = cards.findIndex(
        (card) => card.dataset.toggleCardValue === value
      );
      let nextIndex = currentIndex;
      if (target === "next") nextIndex = (currentIndex + 1) % cards.length;
      else if (target === "prev")
        nextIndex = (currentIndex - 1 + cards.length) % cards.length;
      else if (target === "first") nextIndex = 0;
      else if (target === "last") nextIndex = cards.length - 1;
      const nextCard = cards[nextIndex];
      if (!nextCard) return;
      nextCard.focus();
      // Radio deseni: odak degisimi ayni zamanda secim yapar.
      const nextValue = nextCard.dataset.toggleCardValue;
      if (nextValue) context.toggle(nextValue);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isDisabled) return;
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        context.toggle(value);
        return;
      }
      if (type !== "single") return;
      switch (logicalArrowKey(event.key, event.currentTarget)) {
        case "ArrowDown":
        case "ArrowRight":
          event.preventDefault();
          focusSibling("next");
          break;
        case "ArrowUp":
        case "ArrowLeft":
          event.preventDefault();
          focusSibling("prev");
          break;
        case "Home":
          event.preventDefault();
          focusSibling("first");
          break;
        case "End":
          event.preventDefault();
          focusSibling("last");
          break;
        default:
          break;
      }
    };

    return (
      <div
        ref={ref}
        role={type === "single" ? "radio" : "checkbox"}
        aria-checked={selected}
        aria-disabled={isDisabled || undefined}
        data-toggle-card="item"
        data-toggle-card-value={value}
        data-state={selected ? "checked" : "unchecked"}
        data-disabled={isDisabled || undefined}
        tabIndex={context.getTabIndex(value, disabled)}
        onClick={isDisabled ? undefined : () => context.toggle(value)}
        onKeyDown={handleKeyDown}
        className={cn(
          "group relative flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-4 text-start text-card-foreground shadow-sm ring-offset-background transition-all duration-200",
          "hover:-translate-y-0.5 hover:border-ring/60 hover:shadow-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "active:scale-[0.99]",
          selected
            ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary"
            : "border-border",
          isDisabled &&
            "pointer-events-none cursor-not-allowed opacity-50 hover:translate-y-0 hover:shadow-sm",
          className
        )}
        {...props}
      >
        {icon ? (
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 [&_svg]:size-5",
              selected
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground group-hover:text-foreground"
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}
        <div className="min-w-0 flex-1 pe-7">
          <div className="text-sm font-semibold leading-tight text-foreground">
            {title}
          </div>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
          {children ? <div className="mt-2">{children}</div> : null}
        </div>
        <span
          className={cn(
            "absolute end-3 top-3 flex size-5 shrink-0 items-center justify-center border-2 transition-all duration-200",
            type === "single" ? "rounded-full" : "rounded-md",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/30 bg-transparent"
          )}
          aria-hidden="true"
        >
          <Check
            className={cn(
              "size-3.5 transition-transform duration-200",
              selected ? "scale-100" : "scale-0"
            )}
          />
        </span>
      </div>
    );
  }
);
ToggleCard.displayName = "ToggleCard";

export { ToggleCard, ToggleCardGroup };
