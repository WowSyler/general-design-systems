/**
 * ProviderCard — saglayici/isletme karti (Randevu saglayici listesi).
 * Logo/avatar, isim + dogrulanmis rozeti, kategori, yildizli puan + yorum
 * sayisi, konum ve mesafe, en-yakin musait randevu slotu ve 'Randevu al'
 * CTA'sini tema-agnostik olarak bir arada sunar. Liste/izgara icinde
 * hover kaldirma efektiyle tutarli gorunur; loading durumunda Skeleton
 * yer tutuculari render eder.
 */
import * as React from "react";
import { BadgeCheck, CalendarClock, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Rating } from "@/components/commerce/rating";

/** Isimden en fazla iki harfli bas harf uretir (avatar yedegi icin). */
function initialsFrom(name: React.ReactNode): string {
  if (typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return letters.join("");
}

export interface ProviderCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Saglayici/isletme adi. */
  name: React.ReactNode;
  /** Hizmet kategorisi (or. "Kuafor & Berber"). */
  category: React.ReactNode;
  /** Logo/avatar gorsel adresi. */
  avatar?: string;
  /** Avatar alternatif metni. */
  avatarAlt?: string;
  /** Puan degeri (0-5). */
  rating?: number;
  /** Yorum/degerlendirme sayisi. */
  reviewCount?: number;
  /** Kullaniciya uzaklik (or. "1,2 km"). */
  distance?: string;
  /** Konum/semt (or. "Kadikoy, Istanbul"). */
  location?: string;
  /** En yakin musait randevu slotu (or. "Bugun 15:30"). */
  nextSlot?: string;
  /** Dogrulanmis isletme rozetini gosterir. */
  verified?: boolean;
  /** CTA butonu metni. */
  ctaLabel?: React.ReactNode;
  /** 'Randevu al' tiklama isleyicisi. */
  onBook?: React.MouseEventHandler<HTMLButtonElement>;
  /** Varsayilan CTA yerine ozel aksiyon slotu. */
  action?: React.ReactNode;
  /** Iskelet yer tutuculari goster. */
  loading?: boolean;
}

const ProviderCard = React.forwardRef<HTMLDivElement, ProviderCardProps>(
  (
    {
      name,
      category,
      avatar,
      avatarAlt,
      rating,
      reviewCount,
      distance,
      location,
      nextSlot,
      verified = false,
      ctaLabel = "Randevu al",
      onBook,
      action,
      loading = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground shadow-sm",
            className,
          )}
          {...props}
        >
          <div className="flex items-center gap-3">
            <Skeleton className="size-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "group flex flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-ring/40",
          className,
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <Avatar className="size-14 ring-2 ring-border">
            {avatar ? (
              <AvatarImage
                src={avatar}
                alt={typeof avatarAlt === "string" ? avatarAlt : ""}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {initialsFrom(name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-base font-semibold leading-tight text-foreground">
                {name}
              </h3>
              {verified ? (
                <>
                  <BadgeCheck
                    className="size-4 shrink-0 text-info"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Doğrulanmış işletme</span>
                </>
              ) : null}
            </div>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {category}
            </p>
            {typeof rating === "number" ? (
              <div className="mt-1.5 flex items-center gap-1.5">
                <Rating value={rating} size="sm" showValue />
                {typeof reviewCount === "number" ? (
                  <span className="text-xs tabular-nums text-muted-foreground">
                    ({reviewCount.toLocaleString("tr-TR")})
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {location || distance ? (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="min-w-0 truncate">{location}</span>
            {distance ? (
              <span className="shrink-0 tabular-nums text-foreground/70">
                &middot; {distance}
              </span>
            ) : null}
          </div>
        ) : null}

        {nextSlot ? (
          <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success">
            <CalendarClock className="size-4 shrink-0" aria-hidden="true" />
            <span className="text-muted-foreground">En yakın müsait:</span>
            <span className="tabular-nums text-success">{nextSlot}</span>
          </div>
        ) : null}

        {children}

        {action !== undefined ? (
          action
        ) : (
          <Button className="w-full" onClick={onBook}>
            {ctaLabel}
          </Button>
        )}
      </div>
    );
  },
);
ProviderCard.displayName = "ProviderCard";

export { ProviderCard };
