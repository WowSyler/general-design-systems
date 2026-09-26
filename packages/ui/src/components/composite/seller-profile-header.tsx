/**
 * SellerProfileHeader — Satici profil ust blogu (Dolap guven sinyali).
 * Buyuk avatar + isim + dogrulanmis rozeti (BadgeCheck) + istatistikler
 * (takipci / puan yildizi / satilan urun, tabular-nums) + Takip Et / Mesaj
 * butonlari ve opsiyonel katilim tarihi gosterir. Buton eylemleri prop olarak
 * verilir; bilesenin kendi durumu yoktur (salt sunum). Tema-agnostik.
 */
import * as React from "react";
import { BadgeCheck, MessageCircle, Star, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export interface SellerProfileHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Satici gorunen adi. */
  name: string;
  /** Opsiyonel kullanici adi/handle (or. "@selin.vintage"). */
  handle?: string;
  /** Avatar gorsel adresi (yoksa initials fallback gosterilir). */
  avatarSrc?: string;
  /** Avatar gorseli icin alternatif metin. */
  avatarAlt?: string;
  /** Fallback icerigi: bas harfler (or. "SA"). */
  fallback: React.ReactNode;
  /** Dogrulanmis satici rozetini goster. */
  verified?: boolean;
  /** Takipci sayisi. */
  followers: number;
  /** Ortalama puan (0-5, or. 4.9). */
  rating: number;
  /** Puan/degerlendirme adedi (yildiz altinda gosterilir). */
  ratingCount?: number;
  /** Satilan urun sayisi. */
  sold: number;
  /** Katilim tarihi metni (or. "2021'den beri uye"). */
  joinedLabel?: string;
  /** Kullanicinin bu saticiyi takip edip etmedigi. */
  following?: boolean;
  /** Takip Et butonu tiklamasi (verilmezse buton gizlenir). */
  onFollow?: React.MouseEventHandler<HTMLButtonElement>;
  /** Mesaj butonu tiklamasi (verilmezse buton gizlenir). */
  onMessage?: React.MouseEventHandler<HTMLButtonElement>;
}

const numberFormatter = new Intl.NumberFormat("tr-TR");

interface SellerProfileHeaderStat {
  key: string;
  value: React.ReactNode;
  label: string;
  icon?: React.ReactNode;
  srValue?: string;
}

const SellerProfileHeader = React.forwardRef<
  HTMLDivElement,
  SellerProfileHeaderProps
>(
  (
    {
      name,
      handle,
      avatarSrc,
      avatarAlt,
      fallback,
      verified = false,
      followers,
      rating,
      ratingCount,
      sold,
      joinedLabel,
      following = false,
      onFollow,
      onMessage,
      className,
      ...props
    },
    ref
  ) => {
    const stats: SellerProfileHeaderStat[] = [
      {
        key: "followers",
        value: numberFormatter.format(followers),
        label: "Takipci",
      },
      {
        key: "rating",
        value: rating.toFixed(1),
        label: ratingCount != null ? `${numberFormatter.format(ratingCount)} puan` : "Puan",
        icon: (
          <Star
            className="size-3.5 fill-warning text-warning"
            aria-hidden="true"
          />
        ),
        srValue: `${rating.toFixed(1)} yildiz`,
      },
      {
        key: "sold",
        value: numberFormatter.format(sold),
        label: "Satilan urun",
      },
    ];

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-border bg-card bg-sheen p-5 text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md sm:p-6",
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4">
            <Avatar className="size-16 shadow-md ring-2 ring-primary/15 sm:size-20">
              {avatarSrc ? (
                <AvatarImage src={avatarSrc} alt={avatarAlt ?? name} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary sm:text-xl">
                {fallback}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 space-y-1 sm:hidden">
              <SellerProfileHeaderIdentity
                name={name}
                handle={handle}
                verified={verified}
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="hidden sm:block">
              <SellerProfileHeaderIdentity
                name={name}
                handle={handle}
                verified={verified}
              />
            </div>

            {joinedLabel ? (
              <p className="mt-1.5 text-xs text-muted-foreground">
                {joinedLabel}
              </p>
            ) : null}

            {onFollow || onMessage ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {onFollow ? (
                  <Button
                    type="button"
                    size="sm"
                    variant={following ? "secondary" : "default"}
                    onClick={onFollow}
                    aria-pressed={following}
                  >
                    <UserPlus aria-hidden="true" />
                    {following ? "Takip Ediliyor" : "Takip Et"}
                  </Button>
                ) : null}
                {onMessage ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={onMessage}
                  >
                    <MessageCircle aria-hidden="true" />
                    Mesaj
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-background/40 rtl:divide-x-reverse">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="flex flex-col items-center justify-center gap-0.5 px-2 py-3 text-center"
            >
              <dd className="flex items-center gap-1 text-lg font-bold tabular-nums text-foreground">
                {stat.icon}
                <span aria-hidden={stat.srValue ? "true" : undefined}>
                  {stat.value}
                </span>
                {stat.srValue ? (
                  <span className="sr-only">{stat.srValue}</span>
                ) : null}
              </dd>
              <dt className="text-xs text-muted-foreground">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    );
  }
);
SellerProfileHeader.displayName = "SellerProfileHeader";

interface SellerProfileHeaderIdentityProps {
  name: string;
  handle?: string;
  verified?: boolean;
}

function SellerProfileHeaderIdentity({
  name,
  handle,
  verified,
}: SellerProfileHeaderIdentityProps) {
  return (
    <>
      <div className="flex items-center gap-1.5">
        <h2 className="truncate text-lg font-bold leading-tight text-foreground sm:text-xl">
          {name}
        </h2>
        {verified ? (
          <BadgeCheck
            className="size-5 shrink-0 fill-info text-info-foreground"
            aria-label="Dogrulanmis satici"
          />
        ) : null}
      </div>
      {handle ? (
        <p className="truncate text-sm text-muted-foreground">{handle}</p>
      ) : null}
    </>
  );
}

export { SellerProfileHeader };
