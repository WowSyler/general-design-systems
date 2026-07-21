/**
 * SavingsGoalCard — Tasarruf hedefi karti (Fisly hedefler).
 * Hedef adi + ikon/emoji, biriken/hedef ilerlemesi (ProgressRing veya cubuk
 * + yuzde), kalan tutar ve tahmini tamamlanma tarihi gosterir; altta
 * "Para ekle" CTA slotu (verilmezse varsayilan buton) render eder.
 * Hedefe ulasildiginda basari rozeti ile isaretlenir.
 */
import * as React from "react";
import { CalendarClock, CircleCheck, PiggyBank, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/data/progress-ring";
import { cn } from "@/lib/utils";

type SavingsGoalCardVariant = "ring" | "bar";
type SavingsGoalCardTone = "primary" | "success" | "warning";

export interface SavingsGoalCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Hedef adi. */
  name: React.ReactNode;
  /** Ikon veya emoji; verilmezse kumbara ikonu kullanilir. */
  icon?: React.ReactNode;
  /** Biriken tutar. */
  saved: number;
  /** Hedef tutar. */
  target: number;
  /** Para birimi simgesi. Varsayilan "₺". */
  currency?: string;
  /** Ust satirdaki kisa aciklama. */
  description?: React.ReactNode;
  /** Tahmini tamamlanma tarihi (or. "Eylül 2026"). */
  estimatedDate?: React.ReactNode;
  /** Ilerleme gorunumu: dairesel halka veya yatay cubuk. */
  variant?: SavingsGoalCardVariant;
  /** Vurgu tonu. */
  tone?: SavingsGoalCardTone;
  /** Alt CTA slotu; verilmezse varsayilan "Para ekle" butonu render edilir. */
  action?: React.ReactNode;
  /** Varsayilan CTA metni. */
  ctaLabel?: React.ReactNode;
}

const barFillClasses: Record<SavingsGoalCardTone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
};

function formatAmount(value: number, currency: string): string {
  return `${currency}${Math.max(0, Math.round(value)).toLocaleString("tr-TR")}`;
}

const SavingsGoalCard = React.forwardRef<HTMLDivElement, SavingsGoalCardProps>(
  (
    {
      name,
      icon,
      saved,
      target,
      currency = "₺",
      description,
      estimatedDate,
      variant = "ring",
      tone = "primary",
      action,
      ctaLabel = "Para ekle",
      className,
      ...props
    },
    ref,
  ) => {
    const safeTarget = Math.max(0, target);
    const safeSaved = Math.max(0, saved);
    const percent =
      safeTarget > 0 ? Math.min(100, Math.round((safeSaved / safeTarget) * 100)) : 0;
    const remaining = Math.max(0, safeTarget - safeSaved);
    const completed = safeTarget > 0 && safeSaved >= safeTarget;
    const activeTone: SavingsGoalCardTone = completed ? "success" : tone;

    const savedLabel = formatAmount(safeSaved, currency);
    const targetLabel = formatAmount(safeTarget, currency);
    const remainingLabel = formatAmount(remaining, currency);
    const nameText = typeof name === "string" ? name : "Tasarruf hedefi";
    const cardAriaLabel = completed
      ? `${nameText} hedefine ulasildi: ${savedLabel}`
      : `${nameText}: ${savedLabel} / ${targetLabel}, yuzde ${percent}, kalan ${remainingLabel}`;

    const amounts = (
      <div className="min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold tabular-nums text-foreground">
            {savedLabel}
          </span>
          <span className="text-sm tabular-nums text-muted-foreground">
            / {targetLabel}
          </span>
        </div>
        <div className="mt-0.5 text-xs tabular-nums text-muted-foreground">
          {completed ? "Hedef tamamlandı" : `Kalan ${remainingLabel}`}
        </div>
      </div>
    );

    return (
      <Card
        ref={ref}
        role="group"
        aria-label={cardAriaLabel}
        className={cn(
          "flex flex-col gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
          className,
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl text-primary"
              aria-hidden="true"
            >
              {icon ?? <PiggyBank className="size-5" />}
            </div>
            <div className="min-w-0">
              <div className="truncate font-semibold text-foreground">{name}</div>
              {description ? (
                <div className="truncate text-xs text-muted-foreground">
                  {description}
                </div>
              ) : null}
            </div>
          </div>
          {completed ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
              <CircleCheck className="size-3.5" aria-hidden="true" />
              Ulaşıldı
            </span>
          ) : null}
        </div>

        {variant === "ring" ? (
          <div className="flex items-center gap-4">
            <ProgressRing
              value={percent}
              size={84}
              strokeWidth={8}
              tone={activeTone}
              className="shrink-0"
            />
            {amounts}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              {amounts}
              <span
                className={cn(
                  "shrink-0 text-sm font-bold tabular-nums",
                  completed ? "text-success" : "text-primary",
                )}
              >
                %{percent}
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-label={`${nameText} ilerlemesi`}
              className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
            >
              <div
                className={cn(
                  "h-full rounded-full bg-sheen shadow-sm transition-[width] duration-500 ease-out",
                  barFillClasses[activeTone],
                )}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}

        {estimatedDate ? (
          <div className="flex items-center gap-1.5 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <CalendarClock className="size-3.5 shrink-0" aria-hidden="true" />
            <span>
              Tahmini tamamlanma:{" "}
              <span className="font-medium text-foreground">{estimatedDate}</span>
            </span>
          </div>
        ) : null}

        {action ?? (
          <Button variant="default" size="sm" className="w-full">
            <Plus className="size-4" aria-hidden="true" />
            {ctaLabel}
          </Button>
        )}
      </Card>
    );
  },
);
SavingsGoalCard.displayName = "SavingsGoalCard";

export { SavingsGoalCard };
export type { SavingsGoalCardVariant, SavingsGoalCardTone };
