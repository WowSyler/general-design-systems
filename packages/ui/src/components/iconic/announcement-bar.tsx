/**
 * AnnouncementBar — üst duyuru bandı (imza atmosfer bileşeni).
 * Marka gradyanı üzerinde ortalanmış duyuru; opsiyonel ikon, altı çizili
 * aksiyon linki, kapatma butonu ve üzerinden geçen parıltı (shine) katmanı.
 * Yakalamada parıltı ekranın dışında durur; bandın metni tam görünür kalır.
 */
import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AnnouncementBarAction {
  /** Link metni. */
  label: React.ReactNode;
  /** Bağlantı adresi (verilirse <a>, yoksa <button> render edilir). */
  href?: string;
  /** Tıklama olayı (href yoksa). */
  onClick?: () => void;
}

export interface AnnouncementBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Sol tarafta gösterilecek ikon. */
  icon?: React.ReactNode;
  /** Altı çizili aksiyon linki. */
  action?: AnnouncementBarAction;
  /** Verilirse sağda X kapatma butonu gösterilir. */
  onDismiss?: () => void;
  /** Üzerinden geçen parıltı katmanı (varsayılan true). */
  shine?: boolean;
  /** Duyuru metni. */
  children: React.ReactNode;
}

const actionClassName =
  "shrink-0 rounded-sm font-semibold underline underline-offset-2 ring-offset-transparent transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2";

export const AnnouncementBar = React.forwardRef<
  HTMLDivElement,
  AnnouncementBarProps
>(({ icon, action, onDismiss, shine = true, children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="region"
      aria-label="Duyuru"
      className={cn(
        "relative overflow-hidden bg-brand-gradient px-10 py-2.5 text-primary-foreground",
        className,
      )}
      {...props}
    >
      {shine ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[130%] -skew-x-12 bg-white/25 animate-shine-sweep motion-reduce:animate-none"
        />
      ) : null}
      <div className="relative z-10 flex items-center justify-center gap-2 text-center text-sm font-medium">
        {icon ? (
          <span aria-hidden="true" className="flex shrink-0 items-center">
            {icon}
          </span>
        ) : null}
        <span>{children}</span>
        {action ? (
          action.href ? (
            <a href={action.href} className={actionClassName}>
              {action.label}
            </a>
          ) : (
            <button type="button" onClick={action.onClick} className={actionClassName}>
              {action.label}
            </button>
          )
        ) : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Kapat"
          className="absolute right-1.5 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-md opacity-80 ring-offset-transparent transition-colors duration-200 hover:bg-white/15 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
});
AnnouncementBar.displayName = "AnnouncementBar";
