"use client";

/**
 * NotificationBell — Header zil ikonu + okunmamis sayaci.
 * Zil ikonuna tiklayinca Popover icinde ozet bildirim listesi acilir;
 * liste bosken 'Yeni bildirim yok' durumu gosterilir. Sayac rozeti
 * "count" (1-99+) veya "dot" (yalniz nokta) olarak render edilir.
 * Erisilebilir: aria-label='Bildirimler (N okunmamis)', klavye ile acilir.
 */
import * as React from "react";
import { Bell, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface NotificationBellItem {
  /** Benzersiz oge kimligi. */
  id: string;
  /** Kisa baslik. */
  title: React.ReactNode;
  /** Opsiyonel aciklama (line-clamp ile kirpilir). */
  description?: React.ReactNode;
  /** Goreli zaman etiketi ( or. "5 dk", "2 sa"). */
  time?: React.ReactNode;
  /** Solda gosterilecek opsiyonel ikon. */
  icon?: React.ReactNode;
  /** true ise okunmamis stilini uygular. */
  unread?: boolean;
}

export interface NotificationBellProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, "onSelect"> {
  /** Okunmamis bildirim sayisi; rozeti bu deger yonetir. */
  unreadCount?: number;
  /** Popover icinde listelenecek bildirimler. */
  items?: NotificationBellItem[];
  /** Rozet bicimi: sayi ("count") veya yalniz nokta ("dot"). */
  badgeVariant?: "count" | "dot";
  /** Popover baslik metni. */
  heading?: React.ReactNode;
  /** Liste bosken gosterilecek metin. */
  emptyLabel?: React.ReactNode;
  /** Basliktaki aksiyon dugmesi etiketi (or. "Tumunu okundu isaretle"). */
  actionLabel?: React.ReactNode;
  /** Aksiyon dugmesine tiklaninca calisir. */
  onAction?: () => void;
  /** Bir bildirime tiklaninca ilgili oge ile calisir. */
  onItemSelect?: (item: NotificationBellItem) => void;
  /** Popover hizalamasi. */
  align?: "start" | "center" | "end";
  /** Listede gosterilecek azami oge sayisi. */
  maxItems?: number;
}

/** unreadCount degerini rozet metnine cevirir (99 ustu "99+"). */
function formatBadgeCount(count: number): string {
  return count > 99 ? "99+" : String(count);
}

const NotificationBell = React.forwardRef<
  HTMLButtonElement,
  NotificationBellProps
>(
  (
    {
      unreadCount = 0,
      items = [],
      badgeVariant = "count",
      heading = "Bildirimler",
      emptyLabel = "Yeni bildirim yok",
      actionLabel,
      onAction,
      onItemSelect,
      align = "end",
      maxItems,
      className,
      ...props
    },
    ref
  ) => {
    const hasUnread = unreadCount > 0;
    const visibleItems =
      typeof maxItems === "number" ? items.slice(0, maxItems) : items;
    const isEmpty = visibleItems.length === 0;

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="ghost"
            size="icon"
            aria-label={`Bildirimler (${unreadCount} okunmamis)`}
            className={cn("relative", className)}
            {...props}
          >
            <Bell className="size-4" aria-hidden="true" />
            {hasUnread && badgeVariant === "count" ? (
              <span
                aria-hidden="true"
                className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none tabular-nums text-destructive-foreground shadow-sm ring-2 ring-background"
              >
                {formatBadgeCount(unreadCount)}
              </span>
            ) : null}
            {hasUnread && badgeVariant === "dot" ? (
              <span
                aria-hidden="true"
                className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive shadow-sm ring-2 ring-background"
              />
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align={align}
          className="w-80 p-0"
          aria-label="Bildirim ozeti"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
            <div className="text-sm font-semibold text-foreground">
              {heading}
              {hasUnread ? (
                <span className="ml-2 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium tabular-nums text-primary">
                  {formatBadgeCount(unreadCount)}
                </span>
              ) : null}
            </div>
            {actionLabel && hasUnread ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={onAction}
              >
                <CheckCheck className="size-3.5" aria-hidden="true" />
                {actionLabel}
              </Button>
            ) : null}
          </div>

          {isEmpty ? (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
              <span
                className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground"
                aria-hidden="true"
              >
                <Bell className="size-5" />
              </span>
              <p className="text-sm text-muted-foreground">{emptyLabel}</p>
            </div>
          ) : (
            <ul className="max-h-80 divide-y divide-border/60 overflow-y-auto">
              {visibleItems.map((item) => {
                const interactive = typeof onItemSelect === "function";
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={!interactive}
                      onClick={
                        interactive ? () => onItemSelect?.(item) : undefined
                      }
                      className={cn(
                        "relative flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                        interactive &&
                          "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                        !interactive && "cursor-default",
                        item.unread && "bg-primary/5"
                      )}
                    >
                      {item.unread ? (
                        <span
                          className="absolute left-1.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                      ) : null}
                      {item.icon ? (
                        <span
                          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>
                      ) : null}
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-3">
                          <span
                            className={cn(
                              "truncate text-sm text-foreground",
                              item.unread ? "font-semibold" : "font-medium"
                            )}
                          >
                            {item.title}
                          </span>
                          {item.time ? (
                            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                              {item.time}
                            </span>
                          ) : null}
                        </span>
                        {item.description ? (
                          <span className="mt-0.5 line-clamp-2 block text-sm text-muted-foreground">
                            {item.description}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </PopoverContent>
      </Popover>
    );
  }
);
NotificationBell.displayName = "NotificationBell";

export { NotificationBell };
