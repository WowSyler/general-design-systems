/**
 * PromoBanner — ince kampanya bandi.
 * Sayfanin ustunde marka gradyanli, ortalanmis tek satirlik duyuru gosterir;
 * opsiyonel aksiyon slotu ve kapatma (X) butonu icerir.
 */
import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface PromoBannerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Duyuru mesaji. */
  message: React.ReactNode;
  /** Mesajin yanindaki aksiyon slotu (or. link/buton). */
  action?: React.ReactNode;
  /** Verilirse sag tarafta X kapatma butonu gosterilir. */
  onDismiss?: () => void;
}

export const PromoBanner = React.forwardRef<HTMLDivElement, PromoBannerProps>(
  ({ message, action, onDismiss, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        className={cn(
          "relative flex items-center justify-center gap-3 bg-brand-gradient px-10 py-2.5 text-center text-sm font-medium text-primary-foreground",
          className,
        )}
        {...props}
      >
        <span>{message}</span>
        {action ? <span className="shrink-0">{action}</span> : null}
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Kapat"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 opacity-80 ring-offset-background transition-colors duration-200 hover:bg-white/10 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    );
  },
);
PromoBanner.displayName = "PromoBanner";
