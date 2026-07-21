/**
 * ReceiptCard — fis/makbuz karti (Fisly fis, genel makbuz).
 * Isyeri basligi + belge no + tarih/saat, tek tek kalem listesi (ad + tutar),
 * ara toplam / KDV / genel toplam ozeti, odeme yontemi satiri ve opsiyonel
 * indir/paylas aksiyonlarini tema-agnostik sunar. 'zigzag' etkinken kartin
 * ust ve alt kenari yirtik-fis gorunumu (mask ile ucgen tirtik) alir; opsiyonel
 * dekoratif barkod seridi eklenir. Tutarlar tr-TR bicimiyle, tabular-nums ve
 * font-mono ile hizalanir. Etkilesim gerektirmez (server-safe).
 */
import * as React from "react";
import { CreditCard, Download, Share2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Fis uzerindeki tek bir kalem satiri. */
export interface ReceiptCardItem {
  /** Kalem adi (urun/hizmet). */
  name: React.ReactNode;
  /** Kalem tutari (sayisal; para birimiyle bicimlenir). */
  amount: number;
  /** Opsiyonel adet; verilirse ad onune '2 x' olarak eklenir. */
  qty?: number;
  /** Opsiyonel alt not (birim fiyat, aciklama vb.). */
  note?: React.ReactNode;
}

export interface ReceiptCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Isyeri / dukkan adi (fis basligi). */
  merchant: React.ReactNode;
  /** Isyeri alt bilgisi (adres, sube, vergi no vb.). */
  merchantMeta?: React.ReactNode;
  /** Basta ortalanan amblem/ikon slotu. */
  logo?: React.ReactNode;
  /** Belge / fis numarasi. */
  documentNo?: React.ReactNode;
  /** Tarih ve saat metni (or. "14.07.2026 · 13:24"). */
  date?: React.ReactNode;
  /** Kalem listesi. */
  items: ReceiptCardItem[];
  /** Para birimi simgesi (onek). Varsayilan Turk Lirasi. */
  currency?: string;
  /** Ara toplam; verilmezse kalemlerin toplamindan hesaplanir. */
  subtotal?: number;
  /** KDV/vergi tutari. */
  tax?: number;
  /** KDV satiri etiketi (or. "KDV %20"). Varsayilan "KDV". */
  taxLabel?: React.ReactNode;
  /** Genel toplam; verilmezse ara toplam + vergi olarak hesaplanir. */
  total?: number;
  /** Odeme yontemi metni (or. "Kredi Karti · **** 4242"). */
  paymentMethod?: React.ReactNode;
  /** En altta gosterilen tesekkur/not metni. */
  footerNote?: React.ReactNode;
  /** Yirtik-fis kenari (ust/alt zigzag tirtik) gorunumu. */
  zigzag?: boolean;
  /** Dekoratif barkod seridi gosterir. */
  barcode?: boolean;
  /** Indir aksiyonu; verilirse "Indir" butonu gosterilir. */
  onDownload?: () => void;
  /** Paylas aksiyonu; verilirse "Paylas" butonu gosterilir. */
  onShare?: () => void;
}

/** Sayiyi tr-TR bicimiyle 2 ondalikli para birimine (onek) baglar. */
function formatCurrency(value: number, currency: string): string {
  const formatted = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `${currency}${formatted}`;
}

/** Ust/alt kenari ucgen tirtiga donusturen mask deseni (siyah=tut, seffaf=kes). */
const ZIGZAG_SIZE = "22px";
const zigzagMask = [
  `conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) top / ${ZIGZAG_SIZE} 51% repeat-x`,
  `conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / ${ZIGZAG_SIZE} 51% repeat-x`,
].join(", ");

/** Sabit ama duzensiz gorunen barkod cubuk genislikleri (px). */
const BARCODE_BARS = [
  2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 2, 1, 1, 3, 1, 2, 1,
  2, 3, 1, 2, 1, 1, 2, 3, 1, 2, 1, 3, 1, 2,
];

const ReceiptCard = React.forwardRef<HTMLDivElement, ReceiptCardProps>(
  (
    {
      merchant,
      merchantMeta,
      logo,
      documentNo,
      date,
      items,
      currency = "₺",
      subtotal,
      tax,
      taxLabel = "KDV",
      total,
      paymentMethod,
      footerNote,
      zigzag = false,
      barcode = false,
      onDownload,
      onShare,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const computedSubtotal =
      typeof subtotal === "number"
        ? subtotal
        : items.reduce((sum, item) => sum + item.amount, 0);
    const computedTotal =
      typeof total === "number"
        ? total
        : computedSubtotal + (typeof tax === "number" ? tax : 0);

    const merchantText =
      typeof merchant === "string" ? merchant : "Makbuz";
    const ariaLabel = `${merchantText} fisi, toplam ${formatCurrency(
      computedTotal,
      currency,
    )}`;

    const showActions = Boolean(onDownload || onShare);

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        style={
          zigzag
            ? {
                ...style,
                WebkitMask: zigzagMask,
                mask: zigzagMask,
              }
            : style
        }
        className={cn(
          "flex max-w-sm flex-col bg-card text-card-foreground",
          zigzag
            ? "px-6 py-8"
            : "rounded-xl border shadow-md transition-all duration-300 hover:shadow-lg p-6",
          className,
        )}
        {...props}
      >
        {/* Baslik: amblem + isyeri + belge no/tarih */}
        <div className="flex flex-col items-center gap-1 text-center">
          {logo ? (
            <div
              className="mb-1 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary"
              aria-hidden="true"
            >
              {logo}
            </div>
          ) : null}
          <div className="font-display text-lg font-semibold tracking-tight text-foreground">
            {merchant}
          </div>
          {merchantMeta ? (
            <div className="text-xs text-muted-foreground">{merchantMeta}</div>
          ) : null}
          {documentNo || date ? (
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 font-mono text-[11px] text-muted-foreground">
              {documentNo ? <span>No: {documentNo}</span> : null}
              {documentNo && date ? (
                <span aria-hidden="true">·</span>
              ) : null}
              {date ? <span className="tabular-nums">{date}</span> : null}
            </div>
          ) : null}
        </div>

        <div
          className="my-4 border-t border-dashed border-border"
          aria-hidden="true"
        />

        {/* Kalem listesi */}
        <ul className="flex flex-col gap-2.5 font-mono text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-foreground">
                  {typeof item.qty === "number" && item.qty > 1 ? (
                    <span className="text-muted-foreground tabular-nums">
                      {item.qty} ×{" "}
                    </span>
                  ) : null}
                  {item.name}
                </span>
                {item.note ? (
                  <span className="mt-0.5 block text-[11px] font-sans text-muted-foreground">
                    {item.note}
                  </span>
                ) : null}
              </div>
              <span className="shrink-0 tabular-nums text-foreground">
                {formatCurrency(item.amount, currency)}
              </span>
            </li>
          ))}
        </ul>

        <div
          className="my-4 border-t border-dashed border-border"
          aria-hidden="true"
        />

        {/* Ozet: ara toplam / KDV / toplam */}
        <dl className="flex flex-col gap-1.5 font-mono text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <dt>Ara Toplam</dt>
            <dd className="tabular-nums">
              {formatCurrency(computedSubtotal, currency)}
            </dd>
          </div>
          {typeof tax === "number" ? (
            <div className="flex items-center justify-between text-muted-foreground">
              <dt>{taxLabel}</dt>
              <dd className="tabular-nums">{formatCurrency(tax, currency)}</dd>
            </div>
          ) : null}
          <div className="mt-1.5 flex items-baseline justify-between border-t border-border pt-2.5 text-foreground">
            <dt className="text-sm font-semibold">Toplam</dt>
            <dd className="text-lg font-bold tabular-nums">
              {formatCurrency(computedTotal, currency)}
            </dd>
          </div>
        </dl>

        {/* Odeme yontemi */}
        {paymentMethod ? (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground">
            <CreditCard className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="min-w-0 truncate">{paymentMethod}</span>
          </div>
        ) : null}

        {children}

        {/* Barkod seridi */}
        {barcode ? (
          <div className="mt-5 flex flex-col items-center gap-1.5">
            <div
              className="flex h-9 items-end gap-px"
              aria-hidden="true"
            >
              {BARCODE_BARS.map((width, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-full bg-foreground",
                    index % 3 === 0 ? "opacity-90" : "opacity-70",
                  )}
                  style={{ width }}
                />
              ))}
            </div>
            {documentNo ? (
              <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
                {documentNo}
              </span>
            ) : null}
          </div>
        ) : null}

        {/* Tesekkur / not */}
        {footerNote ? (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {footerNote}
          </p>
        ) : null}

        {/* Indir / Paylas */}
        {showActions ? (
          <div className="mt-5 flex items-center gap-2">
            {onDownload ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onDownload}
              >
                <Download aria-hidden="true" />
                İndir
              </Button>
            ) : null}
            {onShare ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onShare}
              >
                <Share2 aria-hidden="true" />
                Paylaş
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);
ReceiptCard.displayName = "ReceiptCard";

export { ReceiptCard };
