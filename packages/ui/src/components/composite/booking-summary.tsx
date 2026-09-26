/**
 * BookingSummary — Rezervasyon ozet karti (yapiskan sihirbaz yani paneli).
 * Randevu cok adimli akisinin son onay adiminda: secilen hizmet + uzman +
 * tarih/saat + sure gibi detaylari, her satirda "Duzenle" baglantisiyla; altta
 * fiyat dokumu (ara toplam, indirim, toplam) ve "Onayla ve Ode" CTA'sini gosterir.
 * Salt sunum bilesenidir (edit ve CTA baglantilari <a> olarak render edilir; olay
 * isleyicisi tutmaz) — bu yuzden "use client" gerektirmez. sticky ile sagda
 * yapiskan ozet kolonu olarak kullanilir. Randevu icin tasarlandi, tema-agnostik.
 */
import * as React from "react";
import { Pencil, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Ozetteki tek bir detay satiri (hizmet, uzman, tarih/saat, sure...). */
export interface BookingSummaryDetail {
  /** Sol taraftaki opsiyonel lucide ikon (size-4). */
  icon?: React.ReactNode;
  /** Ust kucuk etiket (or. "Hizmet"). */
  label: React.ReactNode;
  /** Ana deger (or. "Sac Kesimi + Sakal Tirasi"). */
  value: React.ReactNode;
  /** Deger altindaki ikincil bilgi (or. sure/adres notu). */
  hint?: React.ReactNode;
  /** Verilirse sagda "Duzenle" baglantisi (<a>) gosterilir. */
  editHref?: string;
  /** Duzenle baglantisi metni (varsayilan "Duzenle"). */
  editLabel?: string;
}

/** Fiyat dokumundeki bir satir (ara toplam, indirim, ek ucret...). */
export interface BookingSummaryPriceRow {
  /** Satir etiketi (or. "Ara toplam"). */
  label: React.ReactNode;
  /** Bicimlendirilmis tutar (or. "₺450"). */
  value: React.ReactNode;
  /** Ton: default | muted (soluk) | discount (indirim, basari rengi). */
  tone?: "default" | "muted" | "discount";
}

export interface BookingSummaryProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Kart basligi (varsayilan "Rezervasyon Ozeti"). */
  title?: React.ReactNode;
  /** Basligin yanindaki opsiyonel adim rozeti (or. "3. Adim"). */
  step?: React.ReactNode;
  /** Detay satirlari (hizmet, uzman, tarih/saat, sure...). */
  details: BookingSummaryDetail[];
  /** Fiyat dokumu satirlari (ara toplam, indirim...). Toplam ayri verilir. */
  priceRows?: BookingSummaryPriceRow[];
  /** Bicimlendirilmis toplam tutar (or. "₺405"). */
  total: React.ReactNode;
  /** Toplam satiri etiketi (varsayilan "Toplam"). */
  totalLabel?: React.ReactNode;
  /** Toplam altindaki kucuk not (or. "KDV dahil"). */
  totalHint?: React.ReactNode;
  /** CTA altindaki guven notu (or. iptal/guvenli odeme aciklamasi). */
  note?: React.ReactNode;
  /** Ozel CTA slotu; verilirse varsayilan buton yerine bu render edilir. */
  action?: React.ReactNode;
  /** Varsayilan CTA metni (varsayilan "Onayla ve Ode"). */
  ctaLabel?: React.ReactNode;
  /** Varsayilan CTA baglantisi (varsayilan "#"). */
  ctaHref?: string;
  /** Sagda yapiskan ozet kolonu olarak konumlandir (sticky top). */
  sticky?: boolean;
  /** Iskelet yer tutucu durumu. */
  loading?: boolean;
}

const priceToneClasses: Record<
  NonNullable<BookingSummaryPriceRow["tone"]>,
  string
> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  discount: "text-success",
};

/** Detay satirindaki kucuk "Duzenle" baglantisi. */
function BookingSummaryEditLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 touch-hitbox py-0.5 text-xs font-medium text-primary transition-colors duration-200 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background"
    >
      <Pencil className="size-3.5" aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}

const BookingSummary = React.forwardRef<HTMLDivElement, BookingSummaryProps>(
  (
    {
      title = "Rezervasyon Özeti",
      step,
      details,
      priceRows,
      total,
      totalLabel = "Toplam",
      totalHint,
      note,
      action,
      ctaLabel = "Onayla ve Öde",
      ctaHref = "#",
      sticky = false,
      loading = false,
      className,
      ...props
    },
    ref,
  ) => {
    const baseClass = cn(
      "flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow",
      sticky && "sticky top-6",
      className,
    );

    if (loading) {
      return (
        <section
          ref={ref}
          aria-label="Rezervasyon ozeti yukleniyor"
          aria-busy="true"
          className={baseClass}
          {...props}
        >
          <div className="flex items-center justify-between gap-2 p-5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Separator />
          <div className="space-y-4 p-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-36" />
                </div>
                <Skeleton className="h-5 w-14 rounded-md" />
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-3 p-5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        </section>
      );
    }

    return (
      <section
        ref={ref}
        aria-label={typeof title === "string" ? title : "Rezervasyon ozeti"}
        className={baseClass}
        {...props}
      >
        <header className="flex items-center justify-between gap-3 p-5 pb-4">
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {step ? (
            <span className="inline-flex shrink-0 items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {step}
            </span>
          ) : null}
        </header>

        <Separator />

        <div className="divide-y divide-border">
          {details.map((detail, index) => (
            <div
              key={index}
              className="flex items-start justify-between gap-3 px-5 py-3.5"
            >
              <div className="flex min-w-0 items-start gap-3">
                {detail.icon ? (
                  <span
                    className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-4"
                    aria-hidden="true"
                  >
                    {detail.icon}
                  </span>
                ) : null}
                <dl className="min-w-0 space-y-0.5">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {detail.label}
                  </dt>
                  <dd className="truncate text-sm font-semibold text-foreground">
                    {detail.value}
                  </dd>
                  {detail.hint ? (
                    <dd className="text-xs text-muted-foreground">{detail.hint}</dd>
                  ) : null}
                </dl>
              </div>
              {detail.editHref ? (
                <BookingSummaryEditLink
                  href={detail.editHref}
                  label={detail.editLabel ?? "Düzenle"}
                />
              ) : null}
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2.5 p-5">
          {priceRows && priceRows.length > 0 ? (
            <dl className="space-y-2">
              {priceRows.map((row, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <dt className={cn(priceToneClasses[row.tone ?? "muted"])}>
                    {row.label}
                  </dt>
                  <dd
                    className={cn(
                      "font-medium tabular-nums",
                      priceToneClasses[row.tone ?? "default"],
                    )}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="flex items-baseline justify-between gap-3 pt-1">
            <span className="text-sm font-medium text-foreground">
              {totalLabel}
            </span>
            <span className="flex items-baseline gap-1.5">
              {totalHint ? (
                <span className="text-xs font-normal text-muted-foreground">
                  {totalHint}
                </span>
              ) : null}
              <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
                {total}
              </span>
            </span>
          </div>
        </div>

        <div className="space-y-3 px-5 pb-5">
          {action ?? (
            <Button asChild size="lg" className="w-full">
              <a href={ctaHref}>{ctaLabel}</a>
            </Button>
          )}
          {note ? (
            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />
              <span>{note}</span>
            </p>
          ) : null}
        </div>
      </section>
    );
  },
);
BookingSummary.displayName = "BookingSummary";

export { BookingSummary };
