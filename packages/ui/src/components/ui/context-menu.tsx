"use client";
/**
 * ContextMenu — Sag-tik (baglam) menusu. RADIX YOK; tamamen manuel.
 * Sarmalayici alanda onContextMenu ile imlecin x,y konumunda acilir;
 * disari tiklama, Escape veya sayfa kaydirma ile kapanir. Menu; ikon +
 * etiket + opsiyonel klavye kisayolu, ayrac, alt-baslik, alt-menu ve
 * yikici (destructive) oge destekler. Konum viewport'a sigacak sekilde
 * (fixed) otomatik ayarlanir. role=menu/menuitem ve ok tuslariyla
 * klavye gezinme saglar. DeployLens/Fisly/Dolap satir sag-tik menuleri.
 */
import * as React from "react";
import { ChevronRight } from "lucide-react";

import { cn, logicalArrowKey } from "@/lib/utils";

/** Tiklanabilir menu ogesi. */
export interface ContextMenuAction {
  icon?: React.ReactNode;
  label: string;
  /** Sagda gosterilen klavye kisayolu, or. "Ctrl D". */
  shortcut?: string;
  disabled?: boolean;
  /** Yikici eylem: kirmizi tonlu render edilir. */
  destructive?: boolean;
  onSelect?: () => void;
  /** Alt-menu ogeleri; verilirse ogeye ok isareti eklenir. */
  submenu?: ContextMenuEntry[];
}

/** Ogeleri gruplara ayiran yatay ayrac. */
export interface ContextMenuSeparator {
  type: "separator";
}

/** Grup basligi (tiklanamaz). */
export interface ContextMenuHeading {
  type: "label";
  label: string;
}

export type ContextMenuEntry =
  | ContextMenuAction
  | ContextMenuSeparator
  | ContextMenuHeading;

function isSeparatorEntry(entry: ContextMenuEntry): entry is ContextMenuSeparator {
  return (entry as ContextMenuSeparator).type === "separator";
}

function isHeadingEntry(entry: ContextMenuEntry): entry is ContextMenuHeading {
  return (entry as ContextMenuHeading).type === "label";
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

/** Tek bir menu paneli (ana veya alt-menu). Kendi klavye gezinmesini yonetir. */
function ContextMenuPanel({
  entries,
  closeAll,
  closeSelf,
}: {
  entries: ContextMenuEntry[];
  /** Tum menuyu kapatir (secim veya Escape sonrasi). */
  closeAll: () => void;
  /** Yalnizca bu alt-menuyu kapatip ust ogeye odagi dondurur (SolOk). */
  closeSelf?: () => void;
}) {
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const subWrapRef = React.useRef<HTMLDivElement>(null);
  const [openSub, setOpenSub] = React.useState<number | null>(null);
  const [flip, setFlip] = React.useState(false);

  const actionableIndexes = React.useMemo(
    () =>
      entries
        .map((entry, index) =>
          !isSeparatorEntry(entry) && !isHeadingEntry(entry) && !entry.disabled
            ? index
            : -1
        )
        .filter((index) => index >= 0),
    [entries]
  );

  const focusAt = React.useCallback((index: number | undefined) => {
    if (index === undefined) return;
    itemRefs.current[index]?.focus({ preventScroll: true });
  }, []);

  // Panel acilir acilmaz ilk tiklanabilir ogeye odaklan.
  React.useEffect(() => {
    if (actionableIndexes.length === 0) return;
    const raf = window.requestAnimationFrame(() => focusAt(actionableIndexes[0]));
    return () => window.cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Alt-menu viewport tasarsa sag yerine sola ac.
  React.useLayoutEffect(() => {
    if (openSub === null) {
      setFlip(false);
      return;
    }
    const el = subWrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setFlip(rect.right > window.innerWidth - 8);
  }, [openSub]);

  const currentPointer = () =>
    actionableIndexes.indexOf(
      itemRefs.current.findIndex((el) => el === document.activeElement)
    );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const count = actionableIndexes.length;
    if (count === 0) return;
    const pointer = currentPointer();
    switch (logicalArrowKey(event.key, event.currentTarget)) {
      case "ArrowDown": {
        event.preventDefault();
        const next = pointer < 0 ? 0 : (pointer + 1) % count;
        focusAt(actionableIndexes[next]);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const prev = pointer <= 0 ? count - 1 : pointer - 1;
        focusAt(actionableIndexes[prev]);
        break;
      }
      case "Home": {
        event.preventDefault();
        focusAt(actionableIndexes[0]);
        break;
      }
      case "End": {
        event.preventDefault();
        focusAt(actionableIndexes[count - 1]);
        break;
      }
      case "Escape": {
        event.preventDefault();
        event.stopPropagation();
        closeAll();
        break;
      }
      case "ArrowLeft": {
        if (closeSelf) {
          event.preventDefault();
          event.stopPropagation();
          closeSelf();
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <div
      role="menu"
      aria-orientation="vertical"
      onKeyDown={handleKeyDown}
      className="font-sans min-w-[12rem] rounded-md border border-border/60 bg-popover p-1 text-popover-foreground shadow-lg"
    >
      {entries.map((entry, index) => {
        if (isSeparatorEntry(entry)) {
          return (
            <div
              key={index}
              role="separator"
              className="-mx-1 my-1 h-px bg-border/70"
            />
          );
        }
        if (isHeadingEntry(entry)) {
          return (
            <div
              key={index}
              role="presentation"
              className="px-2 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground"
            >
              {entry.label}
            </div>
          );
        }

        const hasSub = Boolean(entry.submenu && entry.submenu.length > 0);
        const subOpen = openSub === index;

        return (
          <div key={index} className="relative">
            <button
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              type="button"
              role="menuitem"
              tabIndex={-1}
              disabled={entry.disabled}
              aria-haspopup={hasSub ? "menu" : undefined}
              aria-expanded={hasSub ? subOpen : undefined}
              aria-disabled={entry.disabled || undefined}
              onMouseEnter={() => {
                if (!entry.disabled) focusAt(index);
                setOpenSub(hasSub ? index : null);
              }}
              onClick={() => {
                if (entry.disabled) return;
                if (hasSub) {
                  setOpenSub(index);
                  return;
                }
                entry.onSelect?.();
                closeAll();
              }}
              onKeyDown={(event) => {
                if (
                  hasSub &&
                  (logicalArrowKey(event.key, event.currentTarget) === "ArrowRight" ||
                    event.key === "Enter" ||
                    event.key === " ")
                ) {
                  event.preventDefault();
                  setOpenSub(index);
                } else if (
                  !hasSub &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();
                  entry.onSelect?.();
                  closeAll();
                }
              }}
              className={cn(
                "relative flex w-full cursor-default select-none items-center gap-2.5 rounded-sm px-2 py-1.5 text-sm pointer-coarse:min-h-11 outline-none transition-colors",
                "focus:bg-accent focus:text-accent-foreground",
                "disabled:pointer-events-none disabled:opacity-50",
                "[&_svg]:size-4 [&_svg]:shrink-0",
                entry.destructive &&
                  "text-destructive focus:bg-destructive/10 focus:text-destructive"
              )}
            >
              {entry.icon ? (
                <span className="flex shrink-0 items-center" aria-hidden="true">
                  {entry.icon}
                </span>
              ) : null}
              <span className="flex-1 truncate text-start">{entry.label}</span>
              {hasSub ? (
                <ChevronRight
                  className="ms-auto size-4 opacity-60 rtl:-scale-x-100"
                  aria-hidden="true"
                />
              ) : entry.shortcut ? (
                <span className="ms-auto ps-4 text-xs tracking-widest text-muted-foreground tabular-nums">
                  {entry.shortcut}
                </span>
              ) : null}
            </button>

            {hasSub && subOpen ? (
              <div
                ref={subWrapRef}
                className={cn(
                  "absolute top-0 z-10",
                  flip ? "end-full me-1" : "start-full ms-1"
                )}
              >
                <ContextMenuPanel
                  entries={entry.submenu ?? []}
                  closeAll={closeAll}
                  closeSelf={() => {
                    setOpenSub(null);
                    focusAt(index);
                  }}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** Konumlandirilmis (fixed) menu balonu: viewport'a kirpar, disari tiklama/Escape/scroll ile kapanir. */
function ContextMenuPopup({
  x,
  y,
  entries,
  onClose,
}: {
  x: number;
  y: number;
  entries: ContextMenuEntry[];
  onClose: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ left: x, top: y });

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const margin = 8;
    let left = x;
    let top = y;
    if (left + rect.width > window.innerWidth - margin) {
      left = Math.max(margin, window.innerWidth - rect.width - margin);
    }
    if (top + rect.height > window.innerHeight - margin) {
      top = Math.max(margin, window.innerHeight - rect.height - margin);
    }
    setPos({ left, top });
  }, [x, y]);

  React.useEffect(() => {
    const handlePointer = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleScroll = () => onClose();
    document.addEventListener("mousedown", handlePointer);
    window.addEventListener("resize", onClose);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      window.removeEventListener("resize", onClose);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{ position: "fixed", left: pos.left, top: pos.top, zIndex: 50 }}
      className="animate-in fade-in-0 zoom-in-95 duration-150"
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <ContextMenuPanel entries={entries} closeAll={onClose} />
    </div>
  );
}

export interface ContextMenuProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Menu ogeleri (eylem, ayrac, baslik ve alt-menu). */
  items: ContextMenuEntry[];
  /** Sag-tiklanacak tetik alani. */
  children: React.ReactNode;
  /** Statik onizleme icin menuyu tetik alaninin yaninda acik baslatir. */
  defaultOpen?: boolean;
}

/**
 * ContextMenu — icerdigi alana sag-tiklandiginda imlec konumunda menu acar.
 * Veri odaklidir: `items` ile menu tanimlanir, `children` tetik alanidir.
 */
const ContextMenu = React.forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ items, children, defaultOpen = false, className, ...props }, ref) => {
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const [state, setState] = React.useState<{
      open: boolean;
      x: number;
      y: number;
    }>({ open: false, x: 0, y: 0 });

    const close = React.useCallback(
      () => setState((prev) => ({ ...prev, open: false })),
      []
    );

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setState({ open: true, x: event.clientX, y: event.clientY });
    };

    // Statik onizleme: tetik alaninin sol-ust kosesinden hafif iceride ac.
    React.useEffect(() => {
      if (!defaultOpen) return;
      const el = triggerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setState({ open: true, x: rect.left + 24, y: rect.top + 24 });
    }, [defaultOpen]);

    return (
      <div
        ref={(node) => {
          triggerRef.current = node;
          assignRef(ref, node);
        }}
        onContextMenu={handleContextMenu}
        className={cn("relative", className)}
        {...props}
      >
        {children}
        {state.open ? (
          <ContextMenuPopup
            x={state.x}
            y={state.y}
            entries={items}
            onClose={close}
          />
        ) : null}
      </div>
    );
  }
);
ContextMenu.displayName = "ContextMenu";

export { ContextMenu };
