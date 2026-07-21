/**
 * AccountCard — Hesap / cuzdan karti (Fisly hesaplar ekrani).
 * Banka/hesap adini, tur ikonunu (banka/nakit/kredi karti), buyuk bakiye
 * tutarini ve maskeli hesap numarasini (son 4 hane / IBAN parcasi) gosterir.
 * "gradient" varyanti gercek bir odeme karti gibi tonlu gradyan, cip ve
 * atmosferik parlaklikla gorunur. Bakiye tr-TR para birimi bicimiyle
 * otomatik bicimlenir; negatif bakiye (kredi karti borcu) vurgulanir.
 * Loading durumunda Skeleton yer tutuculari render eder. Tema-agnostiktir.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CreditCard, Landmark, Wallet } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type AccountCardType = "bank" | "cash" | "credit";

const accountCardVariants = cva(
  "relative flex flex-col overflow-hidden p-5 transition-all duration-300",
  {
    variants: {
      variant: {
        card: "rounded-xl border bg-card text-card-foreground shadow hover:-translate-y-0.5 hover:shadow-md",
        gradient:
          "rounded-2xl bg-brand-gradient bg-sheen text-primary-foreground shadow-lg hover:-translate-y-0.5 hover:shadow-xl",
      },
    },
    defaultVariants: {
      variant: "card",
    },
  }
);

const typeIcons: Record<AccountCardType, React.ComponentType<{ className?: string }>> = {
  bank: Landmark,
  cash: Wallet,
  credit: CreditCard,
};

const typeText: Record<AccountCardType, string> = {
  bank: "Banka hesabı",
  cash: "Nakit",
  credit: "Kredi kartı",
};

function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
}

export interface AccountCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accountCardVariants> {
  /** Banka / hesap / cuzdan adi. */
  name: React.ReactNode;
  /** Bakiye tutari (sayi). Negatif deger borc olarak vurgulanir. */
  balance: number;
  /** ISO para birimi kodu. Varsayilan "TRY" -> ₺. */
  currency?: string;
  /** Hesap turu: ikon ve tur etiketini belirler. */
  type?: AccountCardType;
  /** Ad altindaki ikinci satir (or. "Vadesiz TL", "Sanal Kart"). */
  label?: React.ReactNode;
  /** Maskeli hesap numarasi / IBAN parcasi (or. "TR•• 4821"). last4'e gore onceliklidir. */
  accountNumber?: React.ReactNode;
  /** Kart numarasinin son 4 hanesi; accountNumber verilmezse "•••• 4821" olarak gosterilir. */
  last4?: string;
  /** Bakiye ustundeki kucuk etiket. Varsayilan "Bakiye". */
  balanceLabel?: React.ReactNode;
  /** Sag altta gosterilen tur etiketini gecersiz kilar. */
  typeLabel?: React.ReactNode;
  /** Skeleton yer tutucu goster. */
  loading?: boolean;
}

const AccountCard = React.forwardRef<HTMLDivElement, AccountCardProps>(
  (
    {
      name,
      balance,
      currency = "TRY",
      type = "bank",
      variant = "card",
      label,
      accountNumber,
      last4,
      balanceLabel = "Bakiye",
      typeLabel,
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(accountCardVariants({ variant: "card" }), "gap-4", className)}
          {...props}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="size-9 rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="mt-auto flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      );
    }

    const isGradient = variant === "gradient";
    const isNegative = balance < 0;
    const Icon = typeIcons[type];

    const mutedClass = isGradient ? "text-primary-foreground/70" : "text-muted-foreground";
    const iconContainerClass = isGradient
      ? "bg-primary-foreground/15 text-primary-foreground ring-1 ring-primary-foreground/20"
      : "bg-primary/10 text-primary";
    const amountClass = isGradient
      ? "text-primary-foreground"
      : isNegative
        ? "text-destructive"
        : "text-foreground";

    const numberNode =
      accountNumber ?? (last4 ? `•••• ${last4}` : null);

    return (
      <div
        ref={ref}
        role="group"
        className={cn(accountCardVariants({ variant }), className)}
        {...props}
      >
        {isGradient ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-12 size-36 rounded-full bg-primary-foreground/10 blur-2xl"
          />
        ) : null}

        <div className="relative z-10 flex flex-1 flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <div className="truncate text-sm font-semibold">{name}</div>
              {label ? (
                <div className={cn("truncate text-xs", mutedClass)}>{label}</div>
              ) : null}
            </div>
            <div
              className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", iconContainerClass)}
              aria-hidden="true"
            >
              <Icon className="size-5" />
            </div>
          </div>

          {isGradient ? (
            <div
              aria-hidden="true"
              className="h-7 w-10 rounded-md bg-primary-foreground/25 shadow-inner ring-1 ring-primary-foreground/20"
            />
          ) : null}

          <div className="space-y-1">
            <div className={cn("text-xs font-medium uppercase tracking-wide", mutedClass)}>
              {balanceLabel}
            </div>
            <div className={cn("text-3xl font-bold tabular-nums tracking-tight", amountClass)}>
              {formatMoney(balance, currency)}
            </div>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 pt-1">
            {numberNode ? (
              <span className={cn("font-mono text-sm tracking-wider", mutedClass)}>
                {numberNode}
              </span>
            ) : (
              <span />
            )}
            <span className={cn("text-xs font-medium", mutedClass)}>
              {typeLabel ?? typeText[type]}
            </span>
          </div>
        </div>
      </div>
    );
  }
);
AccountCard.displayName = "AccountCard";

export { AccountCard, accountCardVariants };
export type { AccountCardType };
