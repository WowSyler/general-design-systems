/**
 * ProfilePersonCard — Kisi / profil karti (team-member, satici, danisan).
 * Avatar (opsiyonel durum noktasi) + isim + rol/unvan + dogrulanmis rozeti,
 * kisa bio, konum ve katilim meta bilgisi, opsiyonel uzmanlik etiketleri,
 * opsiyonel istatistik seridi (takipci/proje/puan vb.), Takip / Mesaj / Baglan
 * aksiyon butonlari ve opsiyonel sosyal baglantilar sunar. Kart ailesindeki
 * kisi-karti boslugunu doldurur. Salt sunumsal bir bilesendir: eylemler
 * (onFollow/onMessage/onConnect) prop olarak disaridan baglanir, bilesenin
 * kendi durumu yoktur. align="center" ile takim izgarasi icin ortalanmis
 * dizilim, align="start" ile dizin/liste icin yatay dizilim verir.
 * loading durumunda Skeleton yer tutuculari render eder. Tema-agnostik.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  Link2,
  MapPin,
  MessageCircle,
  UserCheck,
  UserPlus,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const profilePersonCardVariants = cva(
  "rounded-2xl border border-border bg-card bg-sheen text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
  {
    variants: {
      align: {
        start: "p-5 sm:p-6",
        center: "p-6 text-center",
      },
    },
    defaultVariants: {
      align: "start",
    },
  }
);

/** Musaitlik durumu — avatar uzerinde renkli nokta olarak gosterilir. */
export type ProfilePersonCardStatus = "online" | "busy" | "away" | "offline";

const statusConfig: Record<
  ProfilePersonCardStatus,
  { dot: string; label: string }
> = {
  online: { dot: "bg-success", label: "Çevrimiçi" },
  busy: { dot: "bg-destructive", label: "Meşgul" },
  away: { dot: "bg-warning", label: "Uzakta" },
  offline: { dot: "bg-muted-foreground", label: "Çevrimdışı" },
};

/** Istatistik seridindeki tek bir olcum (or. takipci, proje, puan). */
export interface ProfilePersonCardStat {
  /** Benzersiz anahtar. */
  key: string;
  /** Bicimlendirilmis deger (or. "12,4B"). */
  value: React.ReactNode;
  /** Deger altindaki etiket (or. "Takipçi"). */
  label: React.ReactNode;
  /** Ekran okuyucu icin acik deger (or. "4.9 yildiz"); verilirse value gizlenir. */
  srValue?: string;
}

/** Sosyal / harici baglanti (ikon + adres). */
export interface ProfilePersonCardSocial {
  /** Benzersiz anahtar. */
  key: string;
  /** Erisilebilir etiket (or. "LinkedIn profili"). */
  label: string;
  /** Baglanti adresi. */
  href: string;
  /** Gorsel ikon (or. lucide <Linkedin />). */
  icon: React.ReactNode;
}

export interface ProfilePersonCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "role">,
    VariantProps<typeof profilePersonCardVariants> {
  /** Kisinin gorunen adi. */
  name: string;
  /** Rol / unvan (or. "Kidemli Urun Tasarimcisi"). */
  role?: React.ReactNode;
  /** Avatar gorsel adresi (yoksa bas harf fallback gosterilir). */
  avatarSrc?: string;
  /** Avatar gorseli icin alternatif metin. */
  avatarAlt?: string;
  /** Fallback icerigi: bas harfler; verilmezse isimden turetilir. */
  fallback?: React.ReactNode;
  /** Dogrulanmis rozetini goster. */
  verified?: boolean;
  /** Dogrulanmis rozeti erisilebilir metni. */
  verifiedLabel?: string;
  /** Musaitlik durumu (avatar uzerinde renkli nokta). */
  status?: ProfilePersonCardStatus;
  /** Durum icin ozel metin (verilmezse varsayilan kullanilir). */
  statusLabel?: string;
  /** Kisa bio / tanitim metni. */
  bio?: React.ReactNode;
  /** Konum (or. "Istanbul, Turkiye"). */
  location?: React.ReactNode;
  /** Katilim / uyelik metni (or. "2022'den beri ekipte"). */
  joinedLabel?: React.ReactNode;
  /** Uzmanlik / ilgi etiketleri. */
  tags?: string[];
  /** Opsiyonel istatistik seridi. */
  stats?: ProfilePersonCardStat[];
  /** Opsiyonel sosyal baglantilar. */
  socials?: ProfilePersonCardSocial[];
  /** Kullanicinin bu kisiyi takip edip etmedigi. */
  following?: boolean;
  /** Takip butonu tiklamasi (verilmezse buton gizlenir). */
  onFollow?: React.MouseEventHandler<HTMLButtonElement>;
  /** Takip buton metni. */
  followLabel?: string;
  /** Takip ediliyor buton metni. */
  followingLabel?: string;
  /** Mesaj butonu tiklamasi (verilmezse buton gizlenir). */
  onMessage?: React.MouseEventHandler<HTMLButtonElement>;
  /** Mesaj buton metni. */
  messageLabel?: string;
  /** Baglanti kurulmus olup olmadigi. */
  connected?: boolean;
  /** Baglan butonu tiklamasi (verilmezse buton gizlenir). */
  onConnect?: React.MouseEventHandler<HTMLButtonElement>;
  /** Baglan buton metni. */
  connectLabel?: string;
  /** Baglanti kuruldu buton metni. */
  connectedLabel?: string;
  /** Varsayilan aksiyon satirini tumuyle degistiren ozel icerik. */
  actions?: React.ReactNode;
  /** Yukleme durumu (skeleton yer tutucular). */
  loading?: boolean;
}

/** "Deniz Yilmaz" -> "DY" bas harflerini uretir. */
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase("tr-TR"))
    .join("");
}

interface PersonAvatarProps {
  name: string;
  avatarSrc?: string;
  avatarAlt?: string;
  fallback?: React.ReactNode;
  status?: ProfilePersonCardStatus;
  statusLabel?: string;
  className?: string;
}

function PersonAvatar({
  name,
  avatarSrc,
  avatarAlt,
  fallback,
  status,
  statusLabel,
  className,
}: PersonAvatarProps) {
  const statusMeta = status ? statusConfig[status] : null;
  return (
    <div className="relative shrink-0">
      <Avatar className={cn("shadow-md ring-2 ring-primary/15", className)}>
        {avatarSrc ? <AvatarImage src={avatarSrc} alt={avatarAlt ?? name} /> : null}
        <AvatarFallback className="bg-primary/10 font-semibold text-primary">
          {fallback ?? getInitials(name)}
        </AvatarFallback>
      </Avatar>
      {statusMeta ? (
        <span
          className={cn(
            "absolute bottom-0 end-0 size-3.5 rounded-full ring-2 ring-card",
            statusMeta.dot
          )}
          role="img"
          aria-label={statusLabel ?? statusMeta.label}
        />
      ) : null}
    </div>
  );
}

const ProfilePersonCard = React.forwardRef<
  HTMLDivElement,
  ProfilePersonCardProps
>(
  (
    {
      align = "start",
      name,
      role,
      avatarSrc,
      avatarAlt,
      fallback,
      verified = false,
      verifiedLabel = "Doğrulanmış hesap",
      status,
      statusLabel,
      bio,
      location,
      joinedLabel,
      tags,
      stats,
      socials,
      following = false,
      onFollow,
      followLabel = "Takip Et",
      followingLabel = "Takip Ediliyor",
      onMessage,
      messageLabel = "Mesaj",
      connected = false,
      onConnect,
      connectLabel = "Bağlan",
      connectedLabel = "Bağlantı Kuruldu",
      actions,
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    const isCenter = align === "center";

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(profilePersonCardVariants({ align }), className)}
          {...props}
        >
          <div
            className={cn(
              "flex gap-4",
              isCenter ? "flex-col items-center" : "items-start"
            )}
          >
            <Skeleton
              className={cn("rounded-full", isCenter ? "size-20" : "size-16")}
            />
            <div
              className={cn(
                "flex-1 space-y-2 py-1",
                isCenter && "flex flex-col items-center"
              )}
            >
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3.5 w-44" />
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <Skeleton className="h-8 flex-1 rounded-md" />
            <Skeleton className="h-8 flex-1 rounded-md" />
          </div>
        </div>
      );
    }

    const hasDefaultActions = Boolean(onFollow || onMessage || onConnect);
    const showActions = actions != null || hasDefaultActions;
    const actionBtnClass = isCenter ? "flex-1" : undefined;

    const identity = (
      <div className="min-w-0">
        <div
          className={cn(
            "flex items-center gap-1.5",
            isCenter && "justify-center"
          )}
        >
          <h3 className="truncate text-base font-bold leading-tight text-foreground sm:text-lg">
            {name}
          </h3>
          {verified ? (
            <BadgeCheck
              className="size-5 shrink-0 fill-info text-info-foreground"
              aria-label={verifiedLabel}
            />
          ) : null}
        </div>
        {role ? (
          <p className="mt-0.5 truncate text-sm font-medium text-primary">
            {role}
          </p>
        ) : null}
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn(profilePersonCardVariants({ align }), className)}
        {...props}
      >
        {/* Ust: avatar + kimlik */}
        <div
          className={cn(
            "flex gap-4",
            isCenter ? "flex-col items-center" : "items-start"
          )}
        >
          <PersonAvatar
            name={name}
            avatarSrc={avatarSrc}
            avatarAlt={avatarAlt}
            fallback={fallback}
            status={status}
            statusLabel={statusLabel}
            className={cn(
              "text-lg",
              isCenter ? "size-20 sm:size-24" : "size-16"
            )}
          />
          <div className={cn("min-w-0", !isCenter && "flex-1 pt-0.5")}>
            {identity}
          </div>
        </div>

        {/* Bio */}
        {bio ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {bio}
          </p>
        ) : null}

        {/* Meta: konum + katilim */}
        {location || joinedLabel ? (
          <div
            className={cn(
              "mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground",
              isCenter && "justify-center"
            )}
          >
            {location ? (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{location}</span>
              </span>
            ) : null}
            {joinedLabel ? (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{joinedLabel}</span>
              </span>
            ) : null}
          </div>
        ) : null}

        {/* Uzmanlik etiketleri */}
        {tags && tags.length > 0 ? (
          <div
            className={cn(
              "mt-3 flex flex-wrap gap-1.5",
              isCenter && "justify-center"
            )}
          >
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-2 py-0 text-[11px] font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        {/* Istatistik seridi */}
        {stats && stats.length > 0 ? (
          <dl
            className="mt-5 grid divide-x divide-border rounded-xl border border-border bg-background/40 rtl:divide-x-reverse"
            style={{
              gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
            }}
          >
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="flex flex-col items-center justify-center gap-0.5 px-2 py-3 text-center"
              >
                <dd className="text-base font-bold tabular-nums text-foreground">
                  <span aria-hidden={stat.srValue ? "true" : undefined}>
                    {stat.value}
                  </span>
                  {stat.srValue ? (
                    <span className="sr-only">{stat.srValue}</span>
                  ) : null}
                </dd>
                <dt className="text-[11px] text-muted-foreground">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        ) : null}

        {/* Aksiyon butonlari */}
        {showActions ? (
          <div
            className={cn(
              "mt-5 flex flex-wrap gap-2",
              isCenter && "justify-center"
            )}
          >
            {actions != null ? (
              actions
            ) : (
              <>
                {onFollow ? (
                  <Button
                    type="button"
                    size="sm"
                    variant={following ? "secondary" : "default"}
                    onClick={onFollow}
                    aria-pressed={following}
                    className={actionBtnClass}
                  >
                    {following ? (
                      <UserCheck aria-hidden="true" />
                    ) : (
                      <UserPlus aria-hidden="true" />
                    )}
                    {following ? followingLabel : followLabel}
                  </Button>
                ) : null}
                {onMessage ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={onMessage}
                    className={actionBtnClass}
                  >
                    <MessageCircle aria-hidden="true" />
                    {messageLabel}
                  </Button>
                ) : null}
                {onConnect ? (
                  <Button
                    type="button"
                    size="sm"
                    variant={connected ? "secondary" : "outline"}
                    onClick={onConnect}
                    aria-pressed={connected}
                    className={actionBtnClass}
                  >
                    {connected ? (
                      <Check aria-hidden="true" />
                    ) : (
                      <Link2 aria-hidden="true" />
                    )}
                    {connected ? connectedLabel : connectLabel}
                  </Button>
                ) : null}
              </>
            )}
          </div>
        ) : null}

        {/* Sosyal baglantilar */}
        {socials && socials.length > 0 ? (
          <div
            className={cn(
              "mt-4 flex flex-wrap items-center gap-1.5 border-t border-border pt-4",
              isCenter && "justify-center"
            )}
          >
            {socials.map((social) => (
              <a
                key={social.key}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="inline-flex size-8 items-center justify-center rounded-full pointer-coarse:min-h-11 pointer-coarse:min-w-11 text-muted-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:size-4"
              >
                {social.icon}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);
ProfilePersonCard.displayName = "ProfilePersonCard";

export { ProfilePersonCard, profilePersonCardVariants };
