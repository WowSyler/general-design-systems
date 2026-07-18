/**
 * EmptyState — Bos durum gosterimi.
 * Icerik bulunmadiginda ikon, baslik, aciklama ve opsiyonel aksiyon
 * butonu ile ortalanmis bir yer tutucu sunar.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-12 text-center",
        className
      )}
      {...props}
    >
      {icon ? (
        <div
          className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-muted to-muted/40 text-muted-foreground shadow-inner"
          aria-hidden="true"
        >
          {icon}
        </div>
      ) : null}
      <div className="text-base font-semibold text-foreground">{title}</div>
      {description ? (
        <div className="max-w-sm text-sm text-muted-foreground">{description}</div>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
