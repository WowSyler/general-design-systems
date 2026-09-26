/**
 * Timeline — Dikey animasyonlu zaman çizelgesi.
 * Sol dikey çizgi (border-l-2) boyunca her adımda nokta/ikon dairesi ve
 * sağda içerik kartı çizer. Durumlar: done (bg-primary + Check), current
 * (ring + glow-pulse nabzı), upcoming (muted). Her öğe `animate-fade-up`
 * ile sırayla (index*80ms) belirir; yerleşik hâli tam görünürdür.
 * prefers-reduced-motion'da animasyonlar kapanır. Durum yalnızca renkle
 * değil sr-only metinle de bildirilir.
 */
import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type TimelineStatus = "done" | "current" | "upcoming";

export interface TimelineItem {
  /** Adım başlığı. */
  title: React.ReactNode;
  /** Açıklama metni. */
  description?: React.ReactNode;
  /** Zaman/tarih etiketi. */
  time?: React.ReactNode;
  /** Nokta içinde gösterilecek özel ikon (yoksa duruma göre varsayılan). */
  icon?: React.ReactNode;
  /** Adım durumu. Varsayılan "upcoming". */
  status?: TimelineStatus;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  /** Zaman çizelgesi adımları. */
  items: TimelineItem[];
}

const dotClass: Record<TimelineStatus, string> = {
  done: "bg-primary text-primary-foreground",
  current:
    "bg-primary text-primary-foreground ring-4 ring-primary/20 animate-glow-pulse motion-reduce:animate-none",
  upcoming: "bg-muted border text-muted-foreground",
};

const statusLabel: Record<TimelineStatus, string> = {
  done: "Tamamlandı",
  current: "Devam ediyor",
  upcoming: "Bekliyor",
};

const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ items, className, ...props }, ref) => {
    return (
      <ol ref={ref} className={cn("relative", className)} {...props}>
        {items.map((item, index) => {
          const status = item.status ?? "upcoming";
          const isLast = index === items.length - 1;

          return (
            <li
              key={index}
              aria-current={status === "current" ? "step" : undefined}
              className="relative flex gap-4 pb-6 last:pb-0 animate-fade-up motion-reduce:animate-none"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Dikey çizgi: nokta merkezinden geçer, son adımda çizilmez */}
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 start-[17px] top-9 border-s-2 border-border"
                />
              ) : null}

              {/* Nokta / ikon dairesi */}
              <span
                className={cn(
                  "relative z-10 flex h-9 w-9 flex-none items-center justify-center rounded-full [&>svg]:h-4 [&>svg]:w-4",
                  dotClass[status],
                )}
              >
                {item.icon ??
                  (status === "done" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        status === "current"
                          ? "bg-primary-foreground"
                          : "bg-muted-foreground/50",
                      )}
                    />
                  ))}
                <span className="sr-only">{statusLabel[status]}</span>
              </span>

              {/* İçerik kartı */}
              <div className="min-w-0 flex-1 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold leading-snug">
                    {item.title}
                  </p>
                  {item.time ? (
                    <span className="flex-none text-xs tabular-nums text-muted-foreground">
                      {item.time}
                    </span>
                  ) : null}
                </div>
                {item.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    );
  },
);
Timeline.displayName = "Timeline";

export { Timeline };
