"use client";

/**
 * ResponsiveMenu — Cihaza uyarlanan eylem menusu.
 * Masaustunde (>=768px) Radix DropdownMenu olarak, mobilde ise ekranin
 * altindan acilan Sheet icinde buyuk dokunmatik bir liste olarak render
 * edilir. Her iki modda ayni `items` API kullanilir: ikon + etiket +
 * onSelect geri cagrisi, ayirici (separator), grup basligi (label) ve
 * "destructive" ton destegi. Cihaz secimi useIsMobile ile otomatik yapilir;
 * `variant` ile ("dropdown" | "sheet") elle zorlanabilir (onizleme/test).
 *
 * Mobil listede her satir en az 52px yuksekliginde olup rahat bir dokunma
 * hedefi sunar; opsiyonel `description` ikinci satirda gosterilir. Masaustu
 * modda `shortcut` klavye kisayolu sagda belirir. Secim yapildiginda menu
 * kapanir; `open`/`onOpenChange` ile kontrol edilebilir.
 *
 * DeployLens tablo satir eylemleri, Dolap urun kartlari, Fisly islem
 * satirlari ve Randevu liste ogeleri gibi hem masaustu hem mobil calisan
 * akislarda tek bir menu bileseni olarak kullanilir.
 */
import * as React from "react";
import { MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/** Menudeki tiklanabilir tek bir eylem ogesi. */
export interface ResponsiveMenuActionItem {
  /** Oge tipi. Verilmezse "item" varsayilir. */
  type?: "item";
  /** Benzersiz anahtar. onSelect(key) ile geri doner. */
  key: string;
  /** Satir etiketi (erisilebilir ad). */
  label: string;
  /** Sol taraftaki opsiyonel ikon (lucide onerilir). */
  icon?: React.ReactNode;
  /** Mobil listede etiketin altinda gosterilen aciklama satiri. */
  description?: string;
  /** Masaustu modda sagda gosterilen klavye kisayolu ipucu (or. "⌘C"). */
  shortcut?: string;
  /** Yikici ton (or. Sil). Kirmizi renkte gosterilir. Varsayilan false. */
  destructive?: boolean;
  disabled?: boolean;
  /** Oge secildiginde calisir (menu kapanir). */
  onSelect?: () => void;
}

/** Ogeler arasina yatay ayirici koyar. */
export interface ResponsiveMenuSeparatorItem {
  type: "separator";
  key?: string;
}

/** Grup ust basligi (tiklanamaz). */
export interface ResponsiveMenuLabelItem {
  type: "label";
  key?: string;
  label: string;
}

/** ResponsiveMenu ogeleri: eylem, ayirici veya grup basligi. */
export type ResponsiveMenuItem =
  | ResponsiveMenuActionItem
  | ResponsiveMenuSeparatorItem
  | ResponsiveMenuLabelItem;

/** Menunun render bicimi: otomatik (cihaza gore), zorunlu dropdown veya sheet. */
export type ResponsiveMenuVariant = "auto" | "dropdown" | "sheet";

export interface ResponsiveMenuProps {
  /** Menu ogeleri (eylem + ayirici + baslik). */
  items: ResponsiveMenuItem[];
  /**
   * Ozel tetik ogesi. Verilmezse "..." (MoreHorizontal) ikon butonu kullanilir.
   * Tek, odaklanabilir bir eleman olmalidir (asChild ile sarilir).
   */
  trigger?: React.ReactNode;
  /** Varsayilan ikon tetiginin erisilebilir etiketi. Varsayilan "Menüyü aç". */
  triggerLabel?: string;
  /** Varsayilan tetik butonunun gorunumu. Varsayilan "outline". */
  triggerVariant?: ButtonProps["variant"];
  /** Varsayilan tetik butonunun boyutu. Varsayilan "icon". */
  triggerSize?: ButtonProps["size"];
  /** Mobil Sheet basligi. Varsayilan triggerLabel veya "Menü". */
  title?: string;
  /** Mobil Sheet aciklamasi (opsiyonel). */
  description?: string;
  /** Herhangi bir eylem secildiginde anahtariyla cagrilir. */
  onSelect?: (key: string) => void;
  /** Kontrollu acik durumu. */
  open?: boolean;
  /** Baslangicta acik (kontrolsuz / onizleme). */
  defaultOpen?: boolean;
  /** Acilma/kapanma degistiginde cagrilir. */
  onOpenChange?: (open: boolean) => void;
  /** Render bicimini zorla; varsayilan "auto" (useIsMobile). */
  variant?: ResponsiveMenuVariant;
  /** Masaustu dropdown hizalamasi. Varsayilan "end". */
  align?: "start" | "center" | "end";
  /** Masaustu dropdown yonu. Varsayilan "bottom". */
  side?: "top" | "right" | "bottom" | "left";
  disabled?: boolean;
  /** Tetik ogesine eklenen sinif. */
  className?: string;
  /** Dropdown/Sheet icerik kapsayicisina eklenen sinif. */
  contentClassName?: string;
}

function isActionItem(
  item: ResponsiveMenuItem
): item is ResponsiveMenuActionItem {
  return item.type === undefined || item.type === "item";
}

const ResponsiveMenu = React.forwardRef<HTMLButtonElement, ResponsiveMenuProps>(
  (
    {
      items,
      trigger,
      triggerLabel = "Menüyü aç",
      triggerVariant = "outline",
      triggerSize = "icon",
      title,
      description,
      onSelect,
      open,
      defaultOpen,
      onOpenChange,
      variant = "auto",
      align = "end",
      side = "bottom",
      disabled,
      className,
      contentClassName,
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const isControlled = open !== undefined;
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
    const menuOpen = isControlled ? open : internalOpen;

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange]
    );

    const useSheet =
      variant === "sheet" || (variant === "auto" && isMobile);

    const runItem = (item: ResponsiveMenuActionItem) => {
      if (item.disabled) return;
      item.onSelect?.();
      onSelect?.(item.key);
    };

    const sheetTitle = title ?? triggerLabel ?? "Menü";

    const triggerNode = trigger ?? (
      <Button
        ref={ref}
        type="button"
        variant={triggerVariant}
        size={triggerSize}
        disabled={disabled}
        aria-label={triggerLabel}
        className={className}
      >
        <MoreHorizontal aria-hidden="true" />
      </Button>
    );

    // --- Mobil: alttan acilan Sheet + buyuk dokunmatik liste ---
    if (useSheet) {
      return (
        <Sheet open={menuOpen} onOpenChange={setOpen}>
          <SheetTrigger asChild>{triggerNode}</SheetTrigger>
          <SheetContent
            side="bottom"
            className={cn(
              "flex max-h-[85vh] flex-col gap-0 rounded-t-2xl border-border p-0",
              contentClassName
            )}
          >
            <div
              aria-hidden="true"
              className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-muted"
            />
            <SheetHeader className="px-5 pb-2 pt-3 text-left">
              <SheetTitle className="text-base">{sheetTitle}</SheetTitle>
              <SheetDescription className={cn(!description && "sr-only")}>
                {description ?? `${sheetTitle} için eylemler`}
              </SheetDescription>
            </SheetHeader>

            <div
              role="menu"
              aria-label={sheetTitle}
              className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            >
              {items.map((item, index) => {
                if (item.type === "separator") {
                  return (
                    <div
                      key={item.key ?? `sep-${index}`}
                      role="separator"
                      className="my-1 h-px bg-border"
                    />
                  );
                }
                if (item.type === "label") {
                  return (
                    <div
                      key={item.key ?? `label-${index}`}
                      className="px-3 pb-1 pt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      {item.label}
                    </div>
                  );
                }
                return (
                  <button
                    key={item.key}
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => {
                      runItem(item);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex min-h-[52px] w-full items-center gap-3 rounded-xl px-3 text-left text-base font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99]",
                      "disabled:pointer-events-none disabled:opacity-50",
                      item.destructive
                        ? "text-destructive hover:bg-destructive/10 active:bg-destructive/10"
                        : "text-foreground hover:bg-accent active:bg-accent"
                    )}
                  >
                    {item.icon ? (
                      <span
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center [&_svg]:size-5",
                          item.destructive
                            ? "text-destructive"
                            : "text-muted-foreground"
                        )}
                      >
                        {item.icon}
                      </span>
                    ) : null}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{item.label}</span>
                      {item.description ? (
                        <span className="mt-0.5 block truncate text-sm font-normal text-muted-foreground">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                    {item.shortcut ? (
                      <span className="ml-auto shrink-0 text-xs tracking-widest text-muted-foreground">
                        {item.shortcut}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      );
    }

    // --- Masaustu: Radix DropdownMenu ---
    return (
      <DropdownMenu open={menuOpen} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>{triggerNode}</DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          side={side}
          className={cn("min-w-52", contentClassName)}
        >
          {items.map((item, index) => {
            if (item.type === "separator") {
              return (
                <DropdownMenuSeparator key={item.key ?? `sep-${index}`} />
              );
            }
            if (item.type === "label") {
              return (
                <DropdownMenuLabel
                  key={item.key ?? `label-${index}`}
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {item.label}
                </DropdownMenuLabel>
              );
            }
            return (
              <DropdownMenuItem
                key={item.key}
                disabled={item.disabled}
                onSelect={() => runItem(item)}
                className={cn(
                  "gap-2.5",
                  item.destructive
                    ? "text-destructive focus:bg-destructive/10 focus:text-destructive [&>svg]:text-destructive"
                    : "[&>svg]:text-muted-foreground"
                )}
              >
                {item.icon}
                <span className="flex-1 truncate">{item.label}</span>
                {item.shortcut ? (
                  <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                ) : null}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
ResponsiveMenu.displayName = "ResponsiveMenu";

export { ResponsiveMenu, isActionItem as isResponsiveMenuActionItem };
