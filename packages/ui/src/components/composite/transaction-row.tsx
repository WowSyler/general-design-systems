/**
 * TransactionRow — Islem satiri (Fisly islem listesi cekirdegi).
 * Sol tonlu daire icinde kategori ikonu, ortada isyeri basligi ile
 * kategori/tarih alt-metni, sagda gelir (+ yesil) / gider (- kirmizi)
 * tutari (tabular-nums) ve opsiyonel durum rozeti gosterir. onClick
 * verildiginde tiklanabilir olur; klavye (Enter/Bosluk) ile calisir.
 * TransactionRowGroup satirlari divide-y ile ayrilmis kart icinde toplar.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export type TransactionRowType = "income" | "expense";

export type TransactionRowTone =
  | "primary"
  | "success"
  | "warning"
  | "info"
  | "destructive"
  | "muted";

export interface TransactionRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Sol tonlu daire icindeki kategori ikonu (lucide onerilir). */
  icon?: React.ReactNode;
  /** Ikon dairesinin ton rengi. */
  tone?: TransactionRowTone;
  /** Ust satir basligi — genellikle isyeri adi. */
  title: React.ReactNode;
  /** Alt-metin: kategori etiketi. */
  category?: React.ReactNode;
  /** Alt-metin: bicimlenmis tarih. */
  date?: React.ReactNode;
  /** Tutar buyuklugu; isaret ve renk `type` (veya negatif deger) ile belirlenir. */
  amount: number;
  /** Gelir/gider ayrimi. Verilmezse `amount` isaretinden cikarilir. */
  type?: TransactionRowType;
  /** Para birimi oneki. */
  currency?: string;
  /** Sagda tutarin altinda gosterilecek opsiyonel durum/rozet. */
  status?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const toneClasses: Record<TransactionRowTone, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/15 text-info",
  destructive: "bg-destructive/15 text-destructive",
  muted: "bg-muted text-muted-foreground",
};

function formatAmount(magnitude: number, currency: string): string {
  const value = magnitude.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currency}${value}`;
}

const TransactionRow = React.forwardRef<HTMLDivElement, TransactionRowProps>(
  (
    {
      icon,
      tone = "primary",
      title,
      category,
      date,
      amount,
      type,
      currency = "₺",
      status,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const clickable = Boolean(onClick);
    const resolvedType: TransactionRowType = type ?? (amount < 0 ? "expense" : "income");
    const magnitude = Math.abs(amount);
    const sign = resolvedType === "income" ? "+" : "-";
    const amountLabel = `${sign}${formatAmount(magnitude, currency)}`;
    const hasSubtitle = Boolean(category) || Boolean(date);

    return (
      <div
        ref={ref}
        role={clickable ? "button" : undefined}
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
          "flex min-h-[56px] items-center gap-3 px-4 py-3 transition-colors",
          clickable &&
            "cursor-pointer hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          className
        )}
        {...props}
      >
        {icon ? (
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full [&_svg]:size-[18px]",
              toneClasses[tone]
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">{title}</div>
          {hasSubtitle ? (
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              {category ? <span className="truncate">{category}</span> : null}
              {category && date ? (
                <span aria-hidden="true" className="text-muted-foreground/60">
                  &middot;
                </span>
              ) : null}
              {date ? <span className="shrink-0 tabular-nums">{date}</span> : null}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1 pl-2">
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              resolvedType === "income" ? "text-success" : "text-destructive"
            )}
          >
            {amountLabel}
            <span className="sr-only">
              {resolvedType === "income" ? " gelir" : " gider"}
            </span>
          </span>
          {status ? <span className="text-xs text-muted-foreground">{status}</span> : null}
        </div>
      </div>
    );
  }
);
TransactionRow.displayName = "TransactionRow";

export type TransactionRowGroupProps = React.HTMLAttributes<HTMLDivElement>;

const TransactionRowGroup = React.forwardRef<HTMLDivElement, TransactionRowGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("divide-y overflow-hidden rounded-xl border bg-card", className)}
      {...props}
    />
  )
);
TransactionRowGroup.displayName = "TransactionRowGroup";

export { TransactionRow, TransactionRowGroup };
