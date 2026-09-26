/**
 * MakeOfferPanel — C2C pazarlik teklif paneli (Dolap imza akisi).
 * Alicinin satici fiyatina karsi teklif vermesini saglar: mevcut fiyat
 * ozeti, NumberField tarzi teklif girisi (- deger + adim butonlari),
 * hizli indirim onerileri (-%10 / -%20 / -%30) ve "Teklif ver" aksiyonu.
 * status prop'u verildiginde giris yerine teklif durum ozetini ve
 * MakeOfferStatusBadge rozetini (Bekliyor / Kabul / Red / Karsi-teklif)
 * gosterir; karsi teklifte satici tutarini ve aksiyon slotunu sunar.
 * Dolap ikinci el pazaryeri, Randevu paket pazarligi.
 */
"use client";

import * as React from "react";
import {
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  Minus,
  Plus,
  Tag,
  TrendingDown,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/** Teklif yasam dongusu durumu. */
export type MakeOfferStatus = "pending" | "accepted" | "rejected" | "countered";

type StatusMeta = {
  label: string;
  variant: React.ComponentProps<typeof Badge>["variant"];
  icon: React.ReactNode;
};

const statusMeta: Record<MakeOfferStatus, StatusMeta> = {
  pending: {
    label: "Bekliyor",
    variant: "warning-soft",
    icon: <Clock aria-hidden="true" className="size-3.5" />,
  },
  accepted: {
    label: "Kabul edildi",
    variant: "success-soft",
    icon: <CheckCircle2 aria-hidden="true" className="size-3.5" />,
  },
  rejected: {
    label: "Reddedildi",
    variant: "destructive-soft",
    icon: <XCircle aria-hidden="true" className="size-3.5" />,
  },
  countered: {
    label: "Karşı teklif",
    variant: "info-soft",
    icon: <ArrowLeftRight aria-hidden="true" className="size-3.5" />,
  },
};

export interface MakeOfferStatusBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "variant" | "children"> {
  /** Gosterilecek teklif durumu. */
  status: MakeOfferStatus;
}

/** Teklif durumunu ikonlu, tonlu bir rozet olarak gosterir. */
export function MakeOfferStatusBadge({
  status,
  className,
  ...props
}: MakeOfferStatusBadgeProps) {
  const meta = statusMeta[status];
  return (
    <Badge
      variant={meta.variant}
      className={cn("gap-1", className)}
      {...props}
    >
      {meta.icon}
      {meta.label}
    </Badge>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export interface MakeOfferPanelProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "onSubmit" | "defaultValue" | "title"
  > {
  /** Saticinin istedigi guncel fiyat. */
  listPrice: number;
  /** Kontrollu teklif tutari. */
  value?: number;
  /** Kontrolsuz baslangic teklif tutari. */
  defaultValue?: number;
  /** Teklif tutari degistiginde cagrilir. */
  onValueChange?: (value: number) => void;
  /** "Teklif ver" tiklandiginda gecerli tutarla cagrilir. */
  onSubmit?: (value: number) => void;
  /** Minimum kabul edilebilir teklif. */
  min?: number;
  /** Adim (artir/azalt ve input step). */
  step?: number;
  /** Hizli indirim yuzdeleri. */
  quickDiscounts?: number[];
  /** ISO 4217 para birimi kodu. */
  currency?: string;
  /** Bicimleme yereli. */
  locale?: string;
  /** Gonderme butonu metni. */
  submitLabel?: string;
  /** Panel basligi. */
  title?: React.ReactNode;
  /**
   * Verildiginde giris yerine teklif durum ozeti render edilir.
   * pending: Bekliyor, accepted: Kabul, rejected: Red, countered: Karsi-teklif.
   */
  status?: MakeOfferStatus;
  /** Durum ozetinde gosterilecek gonderilmis teklif (yoksa value kullanilir). */
  submittedOffer?: number;
  /** status === "countered" iken saticinin karsi teklif tutari. */
  counterPrice?: number;
  /** Durum ozetinin altina yerlestirilen aksiyon slotu. */
  action?: React.ReactNode;
  /** Gonderme sirasinda butonu devre disi birakir. */
  loading?: boolean;
  /** Tum kontrolleri devre disi birakir. */
  disabled?: boolean;
}

export const MakeOfferPanel = React.forwardRef<
  HTMLDivElement,
  MakeOfferPanelProps
>(
  (
    {
      listPrice,
      value,
      defaultValue,
      onValueChange,
      onSubmit,
      min = 1,
      step = 10,
      quickDiscounts = [10, 20, 30],
      currency = "TRY",
      locale = "tr-TR",
      submitLabel = "Teklif ver",
      title = "Teklif ver",
      status,
      submittedOffer,
      counterPrice,
      action,
      loading = false,
      disabled = false,
      className,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const inputId = `${reactId}-teklif`;
    const noteId = `${reactId}-not`;

    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<number>(defaultValue ?? 0);
    const offer = isControlled ? (value as number) : internal;

    const formatPrice = React.useCallback(
      (amount: number) =>
        amount.toLocaleString(locale, {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }),
      [currency, locale],
    );

    const setOffer = (next: number) => {
      const safe = Number.isFinite(next) ? Math.round(next) : 0;
      if (!isControlled) setInternal(safe);
      onValueChange?.(safe);
    };

    // --- Durum ozeti modu -------------------------------------------------
    if (status) {
      const shown = submittedOffer ?? offer;
      return (
        <div
          ref={ref}
          className={cn(
            "flex flex-col gap-3 rounded-xl border bg-card p-5 text-card-foreground shadow-sm",
            className,
          )}
          {...props}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Teklifin
            </span>
            <MakeOfferStatusBadge status={status} />
          </div>

          <div className="flex items-baseline justify-between gap-3">
            <span className="text-2xl font-bold tabular-nums">
              {formatPrice(shown)}
            </span>
            <span className="text-xs tabular-nums text-muted-foreground line-through">
              {formatPrice(listPrice)}
            </span>
          </div>

          {status === "countered" && counterPrice !== undefined ? (
            <div className="flex items-center justify-between gap-3 rounded-lg bg-info/10 px-3 py-2.5 ring-1 ring-info/20">
              <span className="flex items-center gap-1.5 text-sm font-medium text-info">
                <ArrowLeftRight aria-hidden="true" className="size-4" />
                Satıcının karşı teklifi
              </span>
              <span className="text-base font-semibold tabular-nums text-info">
                {formatPrice(counterPrice)}
              </span>
            </div>
          ) : null}

          {status === "pending" ? (
            <p className="text-xs text-muted-foreground">
              Satıcı teklifini inceliyor. Yanıt gelince bildirim alacaksın.
            </p>
          ) : null}

          {action ? <div className="pt-1">{action}</div> : null}
        </div>
      );
    }

    // --- Teklif girme modu ------------------------------------------------
    const isValid = Number.isFinite(offer) && offer >= min && offer > 0;
    const canDecrement = !disabled && offer - step >= min;
    const canIncrement = !disabled;

    const diffPercent =
      listPrice > 0 && offer > 0
        ? Math.round(((listPrice - offer) / listPrice) * 100)
        : 0;

    let diffNote: React.ReactNode = null;
    if (offer > 0 && listPrice > 0) {
      if (diffPercent > 0) {
        diffNote = (
          <span className="flex items-center gap-1 text-success">
            <TrendingDown aria-hidden="true" className="size-3.5" />
            Liste fiyatının %{diffPercent} altında
          </span>
        );
      } else if (diffPercent < 0) {
        diffNote = (
          <span className="text-warning">
            Liste fiyatının %{Math.abs(diffPercent)} üstünde
          </span>
        );
      } else {
        diffNote = <span>Liste fiyatına eşit</span>;
      }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isValid || disabled || loading) return;
      onSubmit?.(offer);
    };

    return (
      <form
        ref={ref as React.Ref<HTMLFormElement>}
        onSubmit={handleSubmit}
        className={cn(
          "flex flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-sm",
          className,
        )}
        {...(props as React.HTMLAttributes<HTMLFormElement>)}
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Tag aria-hidden="true" className="size-4 text-primary" />
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/60 px-3 py-2.5">
          <span className="text-sm text-muted-foreground">
            Satıcının fiyatı
          </span>
          <span className="text-sm font-semibold tabular-nums">
            {formatPrice(listPrice)}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            Teklifin
          </label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              aria-label="Teklifi azalt"
              disabled={!canDecrement}
              onClick={() => setOffer(clamp(offer - step, min, Number.MAX_SAFE_INTEGER))}
            >
              <Minus aria-hidden="true" />
            </Button>
            <div className="relative flex-1">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground"
              >
                ₺
              </span>
              <input
                id={inputId}
                type="number"
                inputMode="numeric"
                min={min}
                step={step}
                disabled={disabled}
                value={offer > 0 ? offer : ""}
                onChange={(event) => {
                  const raw = event.target.valueAsNumber;
                  setOffer(Number.isNaN(raw) ? 0 : raw);
                }}
                aria-describedby={diffNote ? noteId : undefined}
                placeholder="0"
                className={cn(
                  "h-11 w-full rounded-md border border-input bg-transparent ps-7 pe-3 text-center text-lg font-bold tabular-nums shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-ring/40 placeholder:font-normal placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                )}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              aria-label="Teklifi artır"
              disabled={!canIncrement}
              onClick={() => setOffer(clamp(offer + step, min, Number.MAX_SAFE_INTEGER))}
            >
              <Plus aria-hidden="true" />
            </Button>
          </div>
          {diffNote ? (
            <p id={noteId} className="text-xs font-medium tabular-nums">
              {diffNote}
            </p>
          ) : null}
        </div>

        <div role="group" aria-label="Hızlı teklif önerileri" className="grid grid-cols-3 gap-2">
          {quickDiscounts.map((pct) => {
            const amount = Math.max(Math.round(listPrice * (1 - pct / 100)), min);
            const active = offer === amount;
            return (
              <Button
                key={pct}
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                aria-pressed={active}
                onClick={() => setOffer(amount)}
                className={cn(
                  "h-auto flex-col gap-0.5 py-2",
                  active && "border-primary bg-primary/10 text-primary",
                )}
              >
                <span className="text-sm font-semibold">-%{pct}</span>
                <span className="text-[11px] font-normal tabular-nums text-muted-foreground">
                  {formatPrice(amount)}
                </span>
              </Button>
            );
          })}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || disabled || loading}
        >
          {loading ? "Gönderiliyor..." : submitLabel}
        </Button>
      </form>
    );
  },
);
MakeOfferPanel.displayName = "MakeOfferPanel";
