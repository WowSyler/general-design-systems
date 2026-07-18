/**
 * NotificationItem / NotificationList — Bildirim listesi.
 * NotificationItem: ikon, baslik, aciklama ve zaman; okunmamis
 * durumda bg-primary/5 zemin ve solda bg-primary nokta gosterir.
 * NotificationList: ogeleri divide-y ile ayrilmis kartta toplar.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface NotificationItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  time: React.ReactNode;
  unread?: boolean;
}

const NotificationItem = React.forwardRef<HTMLDivElement, NotificationItemProps>(
  ({ icon, title, description, time, unread = false, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
        unread && "bg-primary/5",
        className
      )}
      {...props}
    >
      {unread ? (
        <span
          className="absolute left-1.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary"
          aria-hidden="true"
        />
      ) : null}
      {icon ? (
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <div
            className={cn(
              "truncate text-sm text-foreground",
              unread ? "font-semibold" : "font-medium"
            )}
          >
            {title}
          </div>
          <div className="shrink-0 text-xs text-muted-foreground">{time}</div>
        </div>
        {description ? (
          <div className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </div>
        ) : null}
      </div>
    </div>
  )
);
NotificationItem.displayName = "NotificationItem";

export type NotificationListProps = React.HTMLAttributes<HTMLDivElement>;

const NotificationList = React.forwardRef<HTMLDivElement, NotificationListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("divide-y overflow-hidden rounded-xl border bg-card", className)}
      {...props}
    />
  )
);
NotificationList.displayName = "NotificationList";

export { NotificationItem, NotificationList };
