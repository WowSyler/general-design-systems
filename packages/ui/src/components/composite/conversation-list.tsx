/**
 * ConversationListItem / ConversationList — Konusma (mesajlasma) listesi.
 * ConversationListItem: her satir avatar (AvatarStatus ile mevcudiyet noktasi)
 * + kisi adi + son mesaj onizlemesi (line-clamp) + zaman + okunmamis sayaci
 * rozeti + opsiyonel urun kucukresmi gosterir. Aktif konusma sol vurgu
 * cubugu ve bg-accent ile isaretlenir; her satir bir <button> oldugu icin
 * klavye (Enter/Space) ile dogal olarak tiklanabilir.
 * ConversationList: satirlari divide-y ile ayrilmis bir kartta toplar.
 * Dolap urun-mesajlasmasi ve genel sohbet listeleri icin uygundur.
 */
import * as React from "react";
import { CheckCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  AvatarStatus,
  type AvatarStatusPresence,
} from "@/components/composite/avatar-status";

export type ConversationListPresence = AvatarStatusPresence;

export interface ConversationListItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "name" | "title"> {
  /** Konusulan kisi/satici adi. */
  name: React.ReactNode;
  /** Avatar gorseli (yoksa bas harf fallback gosterilir). */
  avatarSrc?: string;
  /** Avatar fallback icerigi (bas harfler veya ikon). */
  avatarFallback: React.ReactNode;
  /** Kisinin mevcudiyet durumu; avatarda nokta olarak gorunur. */
  status?: ConversationListPresence;
  /** Son mesaj onizlemesi (tek satira kirpilir). */
  preview: React.ReactNode;
  /** Son mesaj zamani (or. "14:32", "Dün"). */
  time: React.ReactNode;
  /** Okunmamis mesaj sayisi; 0/verilmezse rozet gizlenir. */
  unreadCount?: number;
  /** Aktif/secili konusma vurgusu. */
  active?: boolean;
  /** Son mesaj bize aitse okundu-bilgisi (cift tik) ikonu gosterir. */
  outgoing?: boolean;
  /** Konusmanin iliskili oldugu urun kucukresmi (Dolap). */
  productImageSrc?: string;
  /** Urun kucukresmi icin alternatif metin. */
  productImageAlt?: string;
}

const ConversationListItem = React.forwardRef<
  HTMLButtonElement,
  ConversationListItemProps
>(
  (
    {
      name,
      avatarSrc,
      avatarFallback,
      status,
      preview,
      time,
      unreadCount = 0,
      active = false,
      outgoing = false,
      productImageSrc,
      productImageAlt,
      className,
      ...props
    },
    ref
  ) => {
    const hasUnread = unreadCount > 0;
    const unreadLabel = unreadCount > 99 ? "99+" : String(unreadCount);

    return (
      <button
        ref={ref}
        type="button"
        aria-current={active ? "true" : undefined}
        className={cn(
          "group relative flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
          active ? "bg-accent" : "hover:bg-muted/50",
          className
        )}
        {...props}
      >
        {/* Aktif konusma icin sol kenar vurgu cubugu */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary transition-opacity duration-200",
            active ? "opacity-100" : "opacity-0"
          )}
        />

        <AvatarStatus
          size="md"
          src={avatarSrc}
          alt={typeof name === "string" ? name : undefined}
          fallback={avatarFallback}
          status={status}
        />

        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span
              className={cn(
                "truncate text-sm text-foreground",
                hasUnread ? "font-semibold" : "font-medium"
              )}
            >
              {name}
            </span>
            <span
              className={cn(
                "shrink-0 text-xs tabular-nums",
                hasUnread ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {time}
            </span>
          </span>

          <span className="mt-0.5 flex items-center justify-between gap-2">
            <span
              className={cn(
                "flex min-w-0 items-center gap-1 text-sm",
                hasUnread ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {outgoing ? (
                <CheckCheck
                  className="size-3.5 shrink-0 text-info"
                  aria-hidden="true"
                />
              ) : null}
              <span className="line-clamp-1">{preview}</span>
            </span>

            {hasUnread ? (
              <span className="flex h-5 min-w-[1.25rem] shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold tabular-nums text-primary-foreground shadow-sm">
                {unreadLabel}
                <span className="sr-only"> okunmamis mesaj</span>
              </span>
            ) : null}
          </span>
        </span>

        {productImageSrc ? (
          <img
            src={productImageSrc}
            alt={productImageAlt ?? ""}
            loading="lazy"
            className="size-11 shrink-0 rounded-md object-cover ring-1 ring-border"
          />
        ) : null}
      </button>
    );
  }
);
ConversationListItem.displayName = "ConversationListItem";

export type ConversationListProps = React.HTMLAttributes<HTMLDivElement>;

const ConversationList = React.forwardRef<HTMLDivElement, ConversationListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "divide-y overflow-hidden rounded-xl border bg-card shadow-sm",
        className
      )}
      {...props}
    />
  )
);
ConversationList.displayName = "ConversationList";

export { ConversationList, ConversationListItem };
