/**
 * ActivityFeed — Zaman cizelgeli etkinlik akisi.
 * Sol dikey cizgi (border-l) uzerinde tona gore renkli noktalar;
 * her ogede baslik, opsiyonel aciklama ve zaman etiketi bulunur.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type ActivityTone = "default" | "success" | "warning" | "destructive";

export interface ActivityFeedItem {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  time: React.ReactNode;
  tone?: ActivityTone;
}

export interface ActivityFeedProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  items: ActivityFeedItem[];
}

const dotToneClasses: Record<ActivityTone, string> = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

const ActivityFeed = React.forwardRef<HTMLDivElement, ActivityFeedProps>(
  ({ items, className, ...props }, ref) => (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      <ol className="space-y-6 border-s border-border ps-6">
        {items.map((item, index) => (
          <li key={index} className="relative">
            <span
              className={cn(
                "absolute -start-[30px] top-1.5 size-2.5 rounded-full ring-4 ring-background",
                dotToneClasses[item.tone ?? "default"]
              )}
              aria-hidden="true"
            />
            <div className="flex items-start gap-3">
              {item.icon ? (
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
              ) : null}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-sm font-medium text-foreground">{item.title}</div>
                  <div className="shrink-0 text-xs text-muted-foreground">{item.time}</div>
                </div>
                {item.description ? (
                  <div className="mt-0.5 text-sm text-muted-foreground">
                    {item.description}
                  </div>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
);
ActivityFeed.displayName = "ActivityFeed";

export { ActivityFeed };
