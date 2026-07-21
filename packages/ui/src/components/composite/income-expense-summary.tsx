/**
 * IncomeExpenseSummary — Gelir-gider ozet karti (Fisly ozet/dashboard).
 * Gelir (yesil) ve gider (kirmizi) toplamlarini yan yana veya ust uste
 * gosterir; altinda net bakiyeyi (fark, semantik renk) ve gelir/gider
 * oranini yansitan mini bir cubuk sunar. Opsiyonel donem etiketi ve
 * loading durumunda Skeleton yer tutuculari icerir. Tema-agnostik.
 */
import * as React from "react";
import { CalendarRange, TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type IncomeExpenseSummaryOrientation = "horizontal" | "vertical";

export interface IncomeExpenseSummaryProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Toplam gelir tutari. */
  income: number;
  /** Toplam gider tutari. */
  expense: number;
  /** Kart basligi. Varsayilan "Gelir-Gider Ozeti". */
  heading?: React.ReactNode;
  /** Opsiyonel donem etiketi (or. "Temmuz 2026"). */
  period?: React.ReactNode;
  /** Gelir blogu etiketi. */
  incomeLabel?: React.ReactNode;
  /** Gider blogu etiketi. */
  expenseLabel?: React.ReactNode;
  /** Net bakiye etiketi. */
  netLabel?: React.ReactNode;
  /** Gelir/gider bloklarinin dizilimi: yan yana veya ust uste. */
  orientation?: IncomeExpenseSummaryOrientation;
  /** Mini oran cubugunu gizle. */
  hideRatioBar?: boolean;
  /** Tutar bicimlendirici; varsayilan TRY (or. "₺4.243"). */
  formatValue?: (value: number) => string;
  /** Iskelet yer tutucu goster. */
  loading?: boolean;
}

function formatTRY(value: number): string {
  return value.toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  });
}

function FlowBlock({
  tone,
  icon,
  label,
  value,
}: {
  tone: "income" | "expense";
  icon: React.ReactNode;
  label: React.ReactNode;
  value: string;
}) {
  const isIncome = tone === "income";
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3 transition-colors",
        isIncome
          ? "border-success/20 bg-success/5"
          : "border-destructive/20 bg-destructive/5"
      )}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4",
          isIncome ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
        )}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="truncate text-xs font-medium text-muted-foreground">{label}</div>
        <div
          className={cn(
            "truncate text-lg font-bold tabular-nums",
            isIncome ? "text-success" : "text-destructive"
          )}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

const IncomeExpenseSummary = React.forwardRef<HTMLDivElement, IncomeExpenseSummaryProps>(
  (
    {
      income,
      expense,
      heading = "Gelir-Gider Özeti",
      period,
      incomeLabel = "Gelir",
      expenseLabel = "Gider",
      netLabel = "Net bakiye",
      orientation = "horizontal",
      hideRatioBar = false,
      formatValue = formatTRY,
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    if (loading) {
      return (
        <Card ref={ref} className={cn("flex flex-col gap-4 p-5", className)} {...props}>
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-[68px] rounded-xl" />
            <Skeleton className="h-[68px] rounded-xl" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-14 rounded-xl" />
        </Card>
      );
    }

    const safeIncome = Math.max(0, income);
    const safeExpense = Math.max(0, expense);
    const net = safeIncome - safeExpense;
    const isPositive = net >= 0;
    const total = safeIncome + safeExpense;
    const incomePercent = total > 0 ? (safeIncome / total) * 100 : 0;
    const expensePercent = total > 0 ? (safeExpense / total) * 100 : 0;

    const netText = `${isPositive ? "+" : "-"}${formatValue(Math.abs(net))}`;
    const headingText = typeof heading === "string" ? heading : undefined;
    const ratioAriaLabel = `Gelir yuzde ${Math.round(
      incomePercent
    )}, gider yuzde ${Math.round(expensePercent)}`;

    return (
      <Card
        ref={ref}
        role="group"
        aria-label={headingText}
        className={cn(
          "flex flex-col gap-4 p-5 transition-all duration-300 hover:shadow-md",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-foreground">
            <Wallet className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="truncate">{heading}</span>
          </div>
          {period ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
              <CalendarRange className="size-3" aria-hidden="true" />
              {period}
            </span>
          ) : null}
        </div>

        <div
          className={cn(
            "grid gap-3",
            orientation === "horizontal" ? "sm:grid-cols-2" : "grid-cols-1"
          )}
        >
          <FlowBlock
            tone="income"
            icon={<TrendingUp />}
            label={incomeLabel}
            value={formatValue(safeIncome)}
          />
          <FlowBlock
            tone="expense"
            icon={<TrendingDown />}
            label={expenseLabel}
            value={formatValue(safeExpense)}
          />
        </div>

        {!hideRatioBar && total > 0 ? (
          <div
            role="img"
            aria-label={ratioAriaLabel}
            className="flex h-2 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full bg-success transition-[width] duration-500 ease-out"
              style={{ width: `${incomePercent}%` }}
            />
            <div
              className="h-full bg-destructive transition-[width] duration-500 ease-out"
              style={{ width: `${expensePercent}%` }}
            />
          </div>
        ) : null}

        <div
          className={cn(
            "flex items-center justify-between gap-2 rounded-xl border px-4 py-3",
            isPositive
              ? "border-success/25 bg-success/10"
              : "border-destructive/25 bg-destructive/10"
          )}
        >
          <span className="text-sm font-medium text-foreground">{netLabel}</span>
          <span
            className={cn(
              "text-xl font-bold tabular-nums",
              isPositive ? "text-success" : "text-destructive"
            )}
          >
            {netText}
          </span>
        </div>
      </Card>
    );
  }
);
IncomeExpenseSummary.displayName = "IncomeExpenseSummary";

export { IncomeExpenseSummary };
export type { IncomeExpenseSummaryOrientation };
