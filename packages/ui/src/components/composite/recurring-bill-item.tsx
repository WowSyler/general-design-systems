/**
 * RecurringBillItem — Yinelenen fatura / abonelik satiri (Fisly duzenli odemeler).
 * Sol tonlu kare icinde marka ikonu/logosu, ortada abonelik adi + periyot
 * rozeti (aylik/yillik) ve "Sonraki odeme" tarihi, sagda periyot tutari
 * (tabular-nums) ile durum/geri sayim rozeti gosterir. `daysLeft` verildiginde
 * "X gun kaldi" rozeti render edilir; esik altina inince (yaklasan odeme) sari
 * uyari tonuna, negatifse (geciken odeme) kirmizi tona doner ve kart ince bir
 * halka ile vurgulanir. `status="paused"` satiri soluklastirip "Duraklatildi"
 * rozeti gosterir. onClick verildiginde satir tiklanabilir olur; klavye
 * (Enter/Bosluk) ile calisir. RecurringBillItemGroup satirlari dikey listeler.
 * Tema-agnostiktir (hardcoded renk yok).
 */
import * as React from "react";
import { AlertTriangle, CalendarClock, PauseCircle, Repeat } from "lucide-react";

import { cn } from "@/lib/utils";

export type RecurringBillItemPeriod = "monthly" | "yearly";

export type RecurringBillItemStatus = "active" | "paused";

export type RecurringBillItemTone =
  | "primary"
  | "success"
  | "warning"
  | "info"
  | "destructive"
  | "muted";

const toneClasses: Record<RecurringBillItemTone, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/15 text-info",
  destructive: "bg-destructive/15 text-destructive",
  muted: "bg-muted text-muted-foreground",
};

const periodText: Record<RecurringBillItemPeriod, string> = {
  monthly: "Aylık",
  yearly: "Yıllık",
};

const periodSuffix: Record<RecurringBillItemPeriod, string> = {
  monthly: "/ay",
  yearly: "/yıl",
};

export interface RecurringBillItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Sol tonlu kare icindeki marka ikonu / logosu (lucide veya emoji onerilir). */
  icon?: React.ReactNode;
  /** Ikon karesinin ton rengi. */
  tone?: RecurringBillItemTone;
  /** Abonelik / fatura adi (or. "Netflix", "GlowScan Pro"). */
  name: React.ReactNode;
  /** Periyot basina tutar (sayi). */
  amount: number;
  /** Para birimi oneki. Varsayilan "₺". */
  currency?: string;
  /** Odeme periyodu: aylik / yillik. */
  period?: RecurringBillItemPeriod;
  /** Bicimlenmis sonraki odeme tarihi (or. "24 Tem"). */
  nextPaymentDate?: React.ReactNode;
  /** Sonraki odemeye kalan gun. Negatif deger geciken odemeyi belirtir. */
  daysLeft?: number;
  /** Abonelik durumu: aktif / duraklatildi. */
  status?: RecurringBillItemStatus;
  /** "Yaklasan" uyarisinin (sari ton) tetiklenecegi gun esigi. Varsayilan 3. */
  warningThreshold?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

type BillBadge = {
  label: string;
  className: string;
  ring: string;
  icon: React.ReactNode;
};

function formatAmount(value: number, currency: string): string {
  const magnitude = value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currency}${magnitude}`;
}

function resolveBadge(
  status: RecurringBillItemStatus,
  daysLeft: number | undefined,
  threshold: number
): BillBadge | null {
  if (status === "paused") {
    return {
      label: "Duraklatıldı",
      className: "bg-muted text-muted-foreground",
      ring: "",
      icon: <PauseCircle className="size-3.5" aria-hidden="true" />,
    };
  }

  if (daysLeft === undefined) return null;

  if (daysLeft < 0) {
    return {
      label: `${Math.abs(daysLeft)} gün gecikti`,
      className: "bg-destructive/15 text-destructive",
      ring: "ring-1 ring-destructive/40",
      icon: <AlertTriangle className="size-3.5" aria-hidden="true" />,
    };
  }

  if (daysLeft === 0) {
    return {
      label: "Bugün ödenecek",
      className: "bg-warning/15 text-warning",
      ring: "ring-1 ring-warning/40",
      icon: <CalendarClock className="size-3.5" aria-hidden="true" />,
    };
  }

  if (daysLeft <= threshold) {
    return {
      label: `${daysLeft} gün kaldı`,
      className: "bg-warning/15 text-warning",
      ring: "ring-1 ring-warning/40",
      icon: <CalendarClock className="size-3.5" aria-hidden="true" />,
    };
  }

  return {
    label: `${daysLeft} gün kaldı`,
    className: "bg-info/15 text-info",
    ring: "",
    icon: <CalendarClock className="size-3.5" aria-hidden="true" />,
  };
}

const RecurringBillItem = React.forwardRef<HTMLDivElement, RecurringBillItemProps>(
  (
    {
      icon,
      tone = "primary",
      name,
      amount,
      currency = "₺",
      period = "monthly",
      nextPaymentDate,
      daysLeft,
      status = "active",
      warningThreshold = 3,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const clickable = Boolean(onClick);
    const paused = status === "paused";
    const badge = resolveBadge(status, daysLeft, warningThreshold);
    const amountLabel = formatAmount(amount, currency);

    const nameText = typeof name === "string" ? name : "Abonelik";
    const ariaLabel = [
      nameText,
      `${periodText[period]} ${amountLabel}`,
      badge ? badge.label : null,
    ]
      .filter(Boolean)
      .join(", ");

    return (
      <div
        ref={ref}
        role={clickable ? "button" : "group"}
        aria-label={clickable ? ariaLabel : undefined}
        tabIndex={clickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          clickable
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.currentTarget.click();
                }
              }
            : undefined
        }
        className={cn(
          "flex items-center gap-3 rounded-xl border bg-card p-4 transition-all duration-300",
          badge?.ring,
          clickable &&
            "cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          paused && "opacity-70",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl text-lg [&_svg]:size-5",
            paused ? "bg-muted text-muted-foreground" : toneClasses[tone]
          )}
          aria-hidden="true"
        >
          {icon ?? <Repeat />}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-foreground">{name}</span>
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {periodText[period]}
            </span>
          </div>
          {nextPaymentDate ? (
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarClock className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">
                Sonraki ödeme:{" "}
                <span className="font-medium tabular-nums text-foreground">
                  {nextPaymentDate}
                </span>
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5 ps-2">
          <div className="text-sm font-semibold tabular-nums text-foreground">
            {amountLabel}
            <span className="ms-0.5 text-xs font-normal text-muted-foreground">
              {periodSuffix[period]}
            </span>
          </div>
          {badge ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                badge.className
              )}
            >
              {badge.icon}
              {badge.label}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
);
RecurringBillItem.displayName = "RecurringBillItem";

export type RecurringBillItemGroupProps = React.HTMLAttributes<HTMLDivElement>;

const RecurringBillItemGroup = React.forwardRef<
  HTMLDivElement,
  RecurringBillItemGroupProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-3", className)} {...props} />
));
RecurringBillItemGroup.displayName = "RecurringBillItemGroup";

export { RecurringBillItem, RecurringBillItemGroup };
