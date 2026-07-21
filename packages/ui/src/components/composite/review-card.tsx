/**
 * ReviewCard — Degerlendirme / yorum karti (Dolap / Randevu / GlowScan).
 * Kullanici avatari + isim + yildiz puani (Rating) + tarih + dogrulanmis-alici
 * rozeti; opsiyonel baslik, yorum metni, foto kucukresimleri ve fayda blogu
 * ("N kisi faydali buldu" + Faydali begeni butonu) sunar. Salt sunumsal bir
 * bilesendir: begeni eylemi onHelpful ile disaridan baglanir, kendi durumu
 * yoktur. loading durumunda Skeleton yer tutuculari render eder. Tema-agnostik.
 */
import * as React from "react";
import { BadgeCheck, ThumbsUp } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Rating } from "@/components/commerce/rating";
import { cn } from "@/lib/utils";

/** Yorum galerisindeki tek bir foto kucukresmi. */
export interface ReviewCardPhoto {
  /** Gorsel adresi. */
  src: string;
  /** Erisilebilir alternatif metin. */
  alt?: string;
}

export interface ReviewCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Yorumu yapan kullanicinin gorunen adi. */
  authorName: string;
  /** Opsiyonel kullanici adi/handle (or. "@selin.vintage"). */
  authorHandle?: string;
  /** Avatar gorsel adresi (yoksa bas harf fallback gosterilir). */
  authorAvatarSrc?: string;
  /** Avatar gorseli icin alternatif metin. */
  authorAvatarAlt?: string;
  /** Yildiz puani (0 - maxRating arasi). */
  rating: number;
  /** Maksimum yildiz sayisi. */
  maxRating?: number;
  /** Yorumun yazildigi tarih. */
  date: Date;
  /** Dogrulanmis alici rozetini goster. */
  verifiedBuyer?: boolean;
  /** Dogrulanmis alici rozeti metni. */
  verifiedLabel?: string;
  /** Neyin degerlendirildigi (or. urun/hizmet adi); kucuk ust satirda gosterilir. */
  subject?: React.ReactNode;
  /** Opsiyonel yorum basligi (or. "Beklentimin cok ustunde"). */
  title?: React.ReactNode;
  /** Yorum metni. */
  children?: React.ReactNode;
  /** Opsiyonel foto kucukresimleri. */
  photos?: ReviewCardPhoto[];
  /** "N kisi faydali buldu" sayaci; verilirse fayda satiri gosterilir. */
  helpfulCount?: number;
  /** Kullanici bu yorumu faydali olarak isaretledi mi (buton basili durumu). */
  markedHelpful?: boolean;
  /** Faydali butonu tiklamasi; verilmezse buton gizlenir. */
  onHelpful?: React.MouseEventHandler<HTMLButtonElement>;
  /** Faydali buton metni. */
  helpfulLabel?: string;
  /** Yukleme durumu (skeleton yer tutucular). */
  loading?: boolean;
}

const numberFormatter = new Intl.NumberFormat("tr-TR");

/** "Selin Aydin" -> "SA" bas harflerini uretir. */
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase("tr-TR"))
    .join("");
}

const ReviewCard = React.forwardRef<HTMLDivElement, ReviewCardProps>(
  (
    {
      authorName,
      authorHandle,
      authorAvatarSrc,
      authorAvatarAlt,
      rating,
      maxRating = 5,
      date,
      verifiedBuyer = false,
      verifiedLabel = "Doğrulanmış Alıcı",
      subject,
      title,
      children,
      photos,
      helpfulCount,
      markedHelpful = false,
      onHelpful,
      helpfulLabel = "Faydalı",
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    if (loading) {
      return (
        <Card ref={ref} className={cn("p-5", className)} {...props}>
          <div className="flex items-start gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2 py-0.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3.5 w-24" />
            </div>
            <Skeleton className="h-3.5 w-16" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </Card>
      );
    }

    const formattedDate = date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const showHelpfulRow = helpfulCount != null || onHelpful != null;

    return (
      <Card
        ref={ref}
        className={cn(
          "p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
          className
        )}
        {...props}
      >
        {/* Ust: avatar + kimlik + tarih */}
        <div className="flex items-start gap-3">
          <Avatar className="size-10 shrink-0 ring-1 ring-primary/15">
            {authorAvatarSrc ? (
              <AvatarImage
                src={authorAvatarSrc}
                alt={authorAvatarAlt ?? authorName}
              />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {getInitials(authorName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            {subject ? (
              <div className="mb-0.5 truncate text-xs font-medium text-muted-foreground">
                {subject}
              </div>
            ) : null}
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span className="truncate text-sm font-semibold leading-tight text-foreground">
                {authorName}
              </span>
              {verifiedBuyer ? (
                <Badge
                  variant="success-soft"
                  className="gap-1 px-1.5 py-0 text-[11px] font-medium [&_svg]:size-3"
                >
                  <BadgeCheck aria-hidden="true" />
                  {verifiedLabel}
                </Badge>
              ) : null}
            </div>
            {authorHandle ? (
              <div className="truncate text-xs text-muted-foreground">
                {authorHandle}
              </div>
            ) : null}
          </div>

          <time
            dateTime={date.toISOString()}
            className="shrink-0 whitespace-nowrap pt-0.5 text-xs tabular-nums text-muted-foreground"
          >
            {formattedDate}
          </time>
        </div>

        {/* Puan + opsiyonel baslik */}
        <div className="mt-3 space-y-1.5">
          <Rating value={rating} max={maxRating} size="sm" showValue />
          {title ? (
            <h3 className="text-sm font-semibold leading-snug text-foreground">
              {title}
            </h3>
          ) : null}
        </div>

        {/* Yorum metni */}
        {children ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {children}
          </p>
        ) : null}

        {/* Foto kucukresimleri */}
        {photos && photos.length > 0 ? (
          <ul
            aria-label="Yorum fotoğrafları"
            className="mt-3 flex flex-wrap gap-2"
          >
            {photos.map((photo, index) => (
              <li key={photo.src + index}>
                <img
                  src={photo.src}
                  alt={photo.alt ?? `${authorName} yorum fotoğrafı ${index + 1}`}
                  loading="lazy"
                  className="size-16 rounded-lg object-cover ring-1 ring-border transition-transform duration-200 hover:scale-[1.03]"
                />
              </li>
            ))}
          </ul>
        ) : null}

        {/* Fayda: sayac + begeni butonu */}
        {showHelpfulRow ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
            {helpfulCount != null ? (
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold tabular-nums text-foreground">
                  {numberFormatter.format(helpfulCount)}
                </span>{" "}
                kişi faydalı buldu
              </span>
            ) : (
              <span aria-hidden="true" />
            )}

            {onHelpful ? (
              <Button
                type="button"
                size="sm"
                variant={markedHelpful ? "secondary" : "outline"}
                onClick={onHelpful}
                aria-pressed={markedHelpful}
              >
                <ThumbsUp
                  aria-hidden="true"
                  className={cn(markedHelpful && "fill-current")}
                />
                {helpfulLabel}
              </Button>
            ) : null}
          </div>
        ) : null}
      </Card>
    );
  }
);
ReviewCard.displayName = "ReviewCard";

export { ReviewCard };
