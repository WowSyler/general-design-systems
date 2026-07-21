/**
 * ProductMatchCard — cilt profiline gore urun eslesme karti (GlowScan onerileri).
 * Urun gorseli/ikonu, adi ve markasi ile birlikte buyuk ve renkli bir eslesme
 * yuzdesi halkasini (cilt profiline gore ton: mukemmel/yuksek/orta/dusuk) sunar.
 * 'Neden onerildi' kisa gerekcesi, endise/uyum etiketleri (tag), fiyat ve
 * 'Rutine ekle' CTA'si ile tamamlanir. Tema-agnostik; halka role=img ile,
 * kart role=group ile etiketlenir.
 */
import * as React from "react";
import { AlertTriangle, Check, Plus, ShieldCheck, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/** Eslesme etiketinin turu: uyum, endise ya da notr bilgi. */
export type ProductMatchTagKind = "fit" | "concern" | "neutral";

export interface ProductMatchTag {
  /** Etiket metni (ornn 'Hassas cilde uygun', 'Alkol icerir'). */
  label: string;
  /** Ton: uyum (fit), endise (concern) ya da notr (neutral). */
  kind?: ProductMatchTagKind;
}

type MatchTone = {
  /** Yuzde/halka rengi (currentColor uzerinden). */
  text: string;
  /** Ton aciklamasi (ornn 'Yuksek uyum'). */
  label: string;
};

/** Yuzdeyi cilt profili uyum tonuna (renk + etiket) eslestirir. */
function resolveMatchTone(percent: number): MatchTone {
  if (percent >= 85) return { text: "text-success", label: "Mükemmel uyum" };
  if (percent >= 70) return { text: "text-info", label: "Yüksek uyum" };
  if (percent >= 50) return { text: "text-warning", label: "Orta uyum" };
  return { text: "text-destructive", label: "Düşük uyum" };
}

const tagVariants: Record<
  ProductMatchTagKind,
  { badge: React.ComponentProps<typeof Badge>["variant"]; icon: React.ReactNode }
> = {
  fit: {
    badge: "success-soft",
    icon: <Check className="size-3" aria-hidden="true" />,
  },
  concern: {
    badge: "warning-soft",
    icon: <AlertTriangle className="size-3" aria-hidden="true" />,
  },
  neutral: { badge: "secondary", icon: null },
};

/** Sayiyi tr-TR bicimiyle para birimi simgesine (onek) baglar. */
function formatPrice(value: number, currency: string): string {
  const formatted = new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 2,
  }).format(value);
  return `${currency}${formatted}`;
}

export interface ProductMatchCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Urun adi. */
  name: React.ReactNode;
  /** Marka adi. */
  brand?: React.ReactNode;
  /** Urun gorseli adresi. */
  image?: string;
  /** Gorsel alternatif metni. */
  imageAlt?: string;
  /** Gorsel yoksa gosterilecek ikon (ornn Droplet, Sparkles). */
  icon?: React.ReactNode;
  /** Cilt profiline gore eslesme yuzdesi (0-100). */
  matchPercent: number;
  /** Hangi profile gore eslestigi (ornn 'Karma cildinize gore'). */
  profileLabel?: React.ReactNode;
  /** Neden onerildigine dair kisa gerekce. */
  reason?: React.ReactNode;
  /** Endise/uyum etiketleri. */
  tags?: ProductMatchTag[];
  /** Guncel (satis) fiyati. */
  price: number;
  /** Indirim oncesi orijinal fiyat; verilirse ustu cizili gosterilir. */
  originalPrice?: number;
  /** Para birimi simgesi (onek). Varsayilan Turk Lirasi. */
  currency?: string;
  /** CTA butonu etiketi. */
  ctaLabel?: React.ReactNode;
  /** 'Rutine ekle' tiklama isleyicisi. */
  onAddToRoutine?: React.MouseEventHandler<HTMLButtonElement>;
  /** Varsayilan CTA yerine gececek aksiyon slotu. */
  action?: React.ReactNode;
}

const RING_SIZE = 72;
const RING_STROKE = 6;

const ProductMatchCard = React.forwardRef<HTMLDivElement, ProductMatchCardProps>(
  (
    {
      name,
      brand,
      image,
      imageAlt,
      icon,
      matchPercent,
      profileLabel,
      reason,
      tags,
      price,
      originalPrice,
      currency = "₺",
      ctaLabel = "Rutine ekle",
      onAddToRoutine,
      action,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const percent = Math.max(0, Math.min(100, Math.round(matchPercent)));
    const tone = resolveMatchTone(percent);

    const radius = (RING_SIZE - RING_STROKE) / 2;
    const circumference = 2 * Math.PI * radius;
    const dash = (percent / 100) * circumference;

    const hasOriginal =
      typeof originalPrice === "number" && originalPrice > price;

    const ariaParts: string[] = [];
    if (typeof name === "string") ariaParts.push(name);
    if (typeof brand === "string") ariaParts.push(brand);
    ariaParts.push(`eşleşme yüzde ${percent}, ${tone.label}`);
    ariaParts.push(formatPrice(price, currency));
    const ariaLabel = ariaParts.join(", ");

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        className={cn(
          "group flex flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
          className,
        )}
        {...props}
      >
        {/* Baslik: gorsel/ikon + ad/marka + eslesme halkasi */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0 overflow-hidden rounded-lg">
            {image ? (
              <img
                src={image}
                alt={typeof imageAlt === "string" ? imageAlt : ""}
                className="size-16 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex size-16 items-center justify-center bg-primary/10 text-primary [&_svg]:size-7"
              >
                {icon ?? <Sparkles aria-hidden="true" />}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            {brand ? (
              <div className="truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {brand}
              </div>
            ) : null}
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground">
              {name}
            </h3>
            {profileLabel ? (
              <div className="flex items-center gap-1 pt-0.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{profileLabel}</span>
              </div>
            ) : null}
          </div>

          {/* Eslesme yuzdesi halkasi */}
          <div
            role="img"
            aria-label={`Cilt profili uyumu yüzde ${percent}, ${tone.label}`}
            className="relative shrink-0"
            style={{ width: RING_SIZE, height: RING_SIZE }}
          >
            <svg
              width={RING_SIZE}
              height={RING_SIZE}
              viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
              className="-rotate-90"
              aria-hidden="true"
            >
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={RING_STROKE}
                className="text-muted-foreground/15"
              />
              <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={RING_STROKE}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
                className={cn(
                  "transition-[stroke-dasharray] duration-500",
                  tone.text,
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
              <span
                className={cn("text-lg font-bold tabular-nums", tone.text)}
              >
                %{percent}
              </span>
            </div>
          </div>
        </div>

        {tone.label ? (
          <div className={cn("-mt-1 text-right text-[11px] font-semibold", tone.text)}>
            {tone.label}
          </div>
        ) : null}

        {/* Neden onerildi */}
        {reason ? (
          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
            <Sparkles
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              {reason}
            </p>
          </div>
        ) : null}

        {/* Endise/uyum etiketleri */}
        {tags && tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, index) => {
              const kind = tag.kind ?? "neutral";
              const v = tagVariants[kind];
              return (
                <Badge
                  key={index}
                  variant={v.badge}
                  className="gap-1 font-medium"
                >
                  {v.icon}
                  {tag.label}
                </Badge>
              );
            })}
          </div>
        ) : null}

        {children}

        {/* Fiyat + CTA */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold tabular-nums text-foreground">
              {formatPrice(price, currency)}
            </span>
            {hasOriginal ? (
              <span className="text-sm tabular-nums text-muted-foreground line-through">
                {formatPrice(originalPrice as number, currency)}
              </span>
            ) : null}
          </div>
          {action ?? (
            <Button size="sm" onClick={onAddToRoutine}>
              <Plus aria-hidden="true" />
              {ctaLabel}
            </Button>
          )}
        </div>
      </div>
    );
  },
);
ProductMatchCard.displayName = "ProductMatchCard";

export { ProductMatchCard };
