/**
 * IntegrationCard — Entegrasyon karti (DeployLens/genel entegrasyonlar).
 * Servis logo/ikonu, adi, kisa aciklamasi ve bagli / bagli-degil durumunu
 * (StatusDot + yumusak rozet) gosterir; sag altta "Bagla" (bagli degil) ya da
 * "Yonet" (bagli) aksiyon butonu bulunur. Bir "Entegrasyonlar" grid'i icinde
 * kullanilmak uzere tasarlanmistir (GitHub, Slack, Sentry vb.).
 * Loading durumunda Skeleton yer tutuculari render eder. Tema-agnostiktir.
 */
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusDot } from "@/components/ui-extras/status-dot";
import { cn } from "@/lib/utils";

export interface IntegrationCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Servis adi (or. "GitHub", "Slack"). */
  name: React.ReactNode;
  /** Servis logo/ikonu (lucide ikon ya da SVG). Notr bir kutu icinde gosterilir. */
  icon?: React.ReactNode;
  /** Kisa aciklama (2 satira kadar). */
  description?: React.ReactNode;
  /** Bagli mi? Durum noktasi, rozet ve buton etiketini belirler. */
  connected?: boolean;
  /** Ad ustunde gosterilen opsiyonel kategori/etiket (or. "Kod deposu"). */
  category?: React.ReactNode;
  /** Bagli durum rozeti metni. */
  connectedLabel?: React.ReactNode;
  /** Bagli-degil durum rozeti metni. */
  disconnectedLabel?: React.ReactNode;
  /** Bagli degilken varsayilan buton etiketi. */
  connectLabel?: React.ReactNode;
  /** Bagliyken varsayilan buton etiketi. */
  manageLabel?: React.ReactNode;
  /** Varsayilan aksiyon butonunu tamamen gecersiz kilan slot. */
  action?: React.ReactNode;
  /** Skeleton yer tutucu goster. */
  loading?: boolean;
}

const IntegrationCard = React.forwardRef<HTMLDivElement, IntegrationCardProps>(
  (
    {
      name,
      icon,
      description,
      connected = false,
      category,
      connectedLabel = "Bağlı",
      disconnectedLabel = "Bağlı değil",
      connectLabel = "Bağla",
      manageLabel = "Yönet",
      action,
      loading = false,
      className,
      ...props
    },
    ref,
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex h-full flex-col gap-4 rounded-xl border bg-card p-5 shadow",
            className,
          )}
          {...props}
        >
          <div className="flex items-start gap-3">
            <Skeleton className="size-11 rounded-lg" />
            <div className="flex-1 space-y-2 pt-0.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          <div className="mt-auto flex items-center justify-between pt-1">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "group flex h-full flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow transition-all duration-300 hover:-translate-y-0.5 hover:border-ring/50 hover:shadow-md",
          className,
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          {icon ? (
            <div
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-foreground [&_svg]:size-6"
            >
              {icon}
            </div>
          ) : null}
          <div className="min-w-0 flex-1 space-y-0.5">
            {category ? (
              <div className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {category}
              </div>
            ) : null}
            <div className="truncate text-sm font-semibold leading-tight">
              {name}
            </div>
          </div>
        </div>

        {description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <StatusDot variant={connected ? "online" : "offline"} size="sm" />
            <Badge variant={connected ? "success-soft" : "outline"}>
              {connected ? connectedLabel : disconnectedLabel}
            </Badge>
          </div>
          {action ?? (
            <Button
              variant={connected ? "outline" : "default"}
              size="sm"
              className={cn(!connected && "group-hover:brightness-[1.06]")}
            >
              {connected ? manageLabel : connectLabel}
            </Button>
          )}
        </div>
      </div>
    );
  },
);
IntegrationCard.displayName = "IntegrationCard";

export { IntegrationCard };
