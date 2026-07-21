/**
 * ServiceCard — hizmet listesi karti (Randevu hizmet secimi).
 * Hizmet adi, aciklama, sure (Clock) ve fiyat ('X TL'dan baslayan' veya
 * sabit) bilgisini; opsiyonel gorsel ya da ikon ve 'Rezervasyon' CTA'si ile
 * yatay bir kartta sunar. ProductCard'in aksine sepet degil, sure/rezervasyon
 * semantigini tasir; tema-agnostik ve erisilebilir.
 */
import * as React from "react";
import { Calendar, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/** Dakikayi tr okunusuna cevirir: 45 -> '45 dk', 90 -> '1 sa 30 dk'. */
function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} dk`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest > 0 ? `${hours} sa ${rest} dk` : `${hours} sa`;
}

/** Sayiyi tr-TR bicimiyle para birimi simgesine (onek) baglar. */
function formatPrice(value: number, currency: string): string {
  const formatted = new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 2,
  }).format(value);
  return `${currency}${formatted}`;
}

export interface ServiceCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Hizmet adi. */
  title: React.ReactNode;
  /** Kisa hizmet aciklamasi. */
  description?: React.ReactNode;
  /** Hizmet suresi (dakika). Verilirse Clock ikonuyla gosterilir. */
  durationMinutes?: number;
  /** Fiyat (sayi). */
  price: number;
  /** Para birimi simgesi (onek). Varsayilan Turk Lirasi. */
  currency?: string;
  /** true ise fiyat 'baslangic' etiketiyle 'X'dan baslayan' anlamini tasir. */
  priceFrom?: boolean;
  /** Hizmet gorseli adresi. */
  image?: string;
  /** Gorsel alternatif metni. */
  imageAlt?: string;
  /** Gorsel yoksa gosterilecek ikon (ornn Scissors, Sparkles). */
  icon?: React.ReactNode;
  /** Kart kosesindeki rozet metni (ornn 'Populer', 'Kampanya'). */
  badge?: React.ReactNode;
  /** Rezervasyon butonu etiketi. */
  reserveLabel?: React.ReactNode;
  /** Rezervasyon butonu tiklama isleyicisi. */
  onReserve?: React.MouseEventHandler<HTMLButtonElement>;
  /** Varsayilan Rezervasyon butonunun yerine gececek aksiyon slotu. */
  action?: React.ReactNode;
}

const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  (
    {
      title,
      description,
      durationMinutes,
      price,
      currency = "₺",
      priceFrom = false,
      image,
      imageAlt,
      icon,
      badge,
      reserveLabel = "Rezervasyon",
      onReserve,
      action,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const formattedPrice = formatPrice(price, currency);
    const hasMedia = Boolean(image) || Boolean(icon);

    const ariaParts: string[] = [];
    if (typeof title === "string") ariaParts.push(title);
    if (typeof durationMinutes === "number") {
      ariaParts.push(`sure ${formatDuration(durationMinutes)}`);
    }
    ariaParts.push(
      `${priceFrom ? "baslangic fiyati " : ""}${formattedPrice}`,
    );
    const ariaLabel = ariaParts.join(", ");

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        className={cn(
          "group flex flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center",
          className,
        )}
        {...props}
      >
        {hasMedia ? (
          <div className="relative shrink-0 overflow-hidden rounded-lg">
            {image ? (
              <img
                src={image}
                alt={typeof imageAlt === "string" ? imageAlt : ""}
                className="size-16 object-cover transition-transform duration-300 group-hover:scale-105 sm:size-20"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex size-16 items-center justify-center bg-primary/10 text-primary [&_svg]:size-7 sm:size-20"
              >
                {icon}
              </div>
            )}
          </div>
        ) : null}

        <div className="min-w-0 flex-1 space-y-1.5">
          {badge ? (
            <Badge variant="secondary" className="mb-0.5">
              {badge}
            </Badge>
          ) : null}
          <h3 className="text-sm font-semibold leading-tight text-foreground">
            {title}
          </h3>
          {description ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
          {typeof durationMinutes === "number" ? (
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="tabular-nums">
                {formatDuration(durationMinutes)}
              </span>
            </div>
          ) : null}
          {children}
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <div className="flex flex-col sm:items-end">
            {priceFrom ? (
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                başlangıç
              </span>
            ) : null}
            <span className="text-lg font-bold tabular-nums text-foreground">
              {formattedPrice}
            </span>
          </div>
          {action ?? (
            <Button
              size="sm"
              onClick={onReserve}
              className="w-full sm:w-auto"
            >
              <Calendar aria-hidden="true" />
              {reserveLabel}
            </Button>
          )}
        </div>
      </div>
    );
  },
);
ServiceCard.displayName = "ServiceCard";

export { ServiceCard };
