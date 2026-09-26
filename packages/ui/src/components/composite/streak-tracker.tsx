/**
 * StreakTracker — Seri/streak takibi karti (GlowScan rutin sadakati, Fisly gunluk giris).
 * Buyuk alev ikonuyla mevcut seriyi (gun sayisi), son gunlerin nokta/kare
 * seridini (tamamlanan dolu, kacirilan bos), en uzun seri rekorunu ve
 * motivasyon metnini gosterir. Tema-agnostik, salt-sunum bir kompozittir.
 */
import * as React from "react";
import { Check, Flame, Trophy } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StreakTrackerShape = "dot" | "square";
type StreakTrackerTone = "primary" | "warning" | "success";

interface StreakTrackerDay {
  /** O gun tamamlandi mi? */
  completed: boolean;
  /** Gun etiketi (or. "Pzt"). */
  label?: React.ReactNode;
  /** Bugunu vurgular (ring). */
  today?: boolean;
}

export interface StreakTrackerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Mevcut aktif seri (gun sayisi). */
  currentStreak: number;
  /** En uzun seri rekoru; verilmezse mevcut seri kullanilir. */
  longestStreak?: number;
  /** Seri gunleri; genelde son 7 gun. Bos birakilirsa serit gizlenir. */
  days?: StreakTrackerDay[];
  /** Kart basligi. */
  title?: React.ReactNode;
  /** Birim etiketi (tekil). Varsayilan "gün". */
  unit?: string;
  /** Motivasyon metni; verilmezse seri uzunluguna gore otomatik uretilir. */
  message?: React.ReactNode;
  /** Gosterge sekli: nokta veya kare. */
  shape?: StreakTrackerShape;
  /** Vurgu tonu. */
  tone?: StreakTrackerTone;
}

const toneAccent: Record<StreakTrackerTone, string> = {
  primary: "text-primary",
  warning: "text-warning",
  success: "text-success",
};

const toneSoftBg: Record<StreakTrackerTone, string> = {
  primary: "bg-primary/10",
  warning: "bg-warning/10",
  success: "bg-success/10",
};

const toneFill: Record<StreakTrackerTone, string> = {
  primary: "border-primary bg-primary text-primary-foreground",
  warning: "border-warning bg-warning text-warning-foreground",
  success: "border-success bg-success text-success-foreground",
};

function defaultMessage(streak: number, unit: string): string {
  if (streak <= 0) return "Bugün başla, ilk gününü tamamla!";
  if (streak < 3) return "Güzel başlangıç, seriyi büyütmeye devam et!";
  if (streak < 7) return `${streak} ${unit} oldu, momentumu koru!`;
  if (streak < 30) return "Alevi söndürme, harika gidiyorsun!";
  return "Efsane seri! Rutinini ustalıkla sürdürüyorsun.";
}

const StreakTracker = React.forwardRef<HTMLDivElement, StreakTrackerProps>(
  (
    {
      currentStreak,
      longestStreak,
      days = [],
      title = "Günlük seri",
      unit = "gün",
      message,
      shape = "dot",
      tone = "primary",
      className,
      ...props
    },
    ref,
  ) => {
    const safeCurrent = Math.max(0, Math.round(currentStreak));
    const safeLongest = Math.max(
      safeCurrent,
      Math.round(longestStreak ?? safeCurrent),
    );
    const completedCount = days.filter((d) => d.completed).length;
    const isSquare = shape === "square";

    const titleText = typeof title === "string" ? title : "Günlük seri";
    const cardAriaLabel = `${titleText}: mevcut seri ${safeCurrent} ${unit}, en uzun seri ${safeLongest} ${unit}`;
    const resolvedMessage = message ?? defaultMessage(safeCurrent, unit);

    return (
      <Card
        ref={ref}
        role="group"
        aria-label={cardAriaLabel}
        className={cn(
          "flex flex-col gap-5 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="truncate text-sm font-semibold text-foreground">
            {title}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Trophy className="size-3.5 text-warning" aria-hidden="true" />
            <span className="tabular-nums">
              En uzun {safeLongest} {unit}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex size-16 shrink-0 items-center justify-center rounded-2xl bg-sheen shadow-inner",
              toneSoftBg[tone],
              toneAccent[tone],
            )}
            aria-hidden="true"
          >
            <Flame className="size-8" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span
                className={cn(
                  "text-5xl font-bold leading-none tabular-nums",
                  toneAccent[tone],
                )}
              >
                {safeCurrent}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {unit} süren seri
              </span>
            </div>
          </div>
        </div>

        {days.length > 0 ? (
          <div>
            <div className="flex items-end justify-between gap-1 sm:gap-1.5">
              {days.map((day, i) => (
                <div
                  key={i}
                  className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
                >
                  <div
                    className={cn(
                      "flex aspect-square w-full max-w-[2rem] items-center justify-center border transition-all duration-200",
                      isSquare ? "rounded-md" : "rounded-full",
                      day.completed
                        ? cn(toneFill[tone], "bg-sheen shadow-sm")
                        : "border-dashed border-border bg-muted/40 text-transparent",
                      day.today &&
                        "ring-2 ring-ring ring-offset-2 ring-offset-background",
                    )}
                    aria-hidden="true"
                  >
                    {day.completed ? <Check className="size-4" /> : null}
                  </div>
                  {day.label ? (
                    <span className="max-w-full truncate text-[0.65rem] font-medium text-muted-foreground">
                      {day.label}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            <span className="sr-only">
              Son {days.length} günün {completedCount} tanesi tamamlandı.
            </span>
          </div>
        ) : null}

        <p className="text-sm text-muted-foreground">{resolvedMessage}</p>
      </Card>
    );
  },
);
StreakTracker.displayName = "StreakTracker";

export { StreakTracker };
export type { StreakTrackerShape, StreakTrackerTone, StreakTrackerDay };
