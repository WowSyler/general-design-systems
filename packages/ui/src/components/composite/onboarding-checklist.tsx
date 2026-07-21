/**
 * OnboardingChecklist — Kurulum gorev listesi + ilerleme.
 * Baslik, toplam ilerleme (X/Y tamamlandi + ilerleme cubugu) ve sirali
 * adimlar gosterir. Her adim ikon/numara, baslik ve aciklama tasir;
 * tamamlanan adim ustu-cizili ve soluk, bekleyen adim "Basla" aksiyon
 * butonu ile sunulur. DeployLens ilk-deploy, Fisly hesap-baglama ve
 * Dolap satici kurulum akislari icin uygundur.
 */
import * as React from "react";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface OnboardingChecklistStep {
  /** Adim basligi. */
  title: React.ReactNode;
  /** Adimin kisa aciklamasi. */
  description?: React.ReactNode;
  /** Adim tamamlandi mi. */
  done?: boolean;
  /** Bekleyen adim icin aksiyon butonu (varsayilan etiket "Basla"). */
  action?: {
    label?: React.ReactNode;
    href?: string;
    onClick?: () => void;
  };
}

export interface OnboardingChecklistProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Liste basligi. */
  title: React.ReactNode;
  /** Baslik altindaki aciklama. */
  description?: React.ReactNode;
  /** Kurulum adimlari. */
  steps: OnboardingChecklistStep[];
  /** Verildiginde sag ustte kapat butonu gosterilir. */
  onClose?: () => void;
}

const OnboardingChecklist = React.forwardRef<
  HTMLDivElement,
  OnboardingChecklistProps
>(({ title, description, steps, onClose, className, ...props }, ref) => {
  const total = steps.length;
  const completed = steps.filter((step) => step.done).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const allDone = total > 0 && completed === total;

  return (
    <Card
      ref={ref}
      className={cn("overflow-hidden", className)}
      {...props}
    >
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-semibold leading-none tracking-tight text-foreground">
              {title}
            </h3>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {onClose ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="-mr-2 -mt-1 size-8 shrink-0 text-muted-foreground"
              onClick={onClose}
            >
              <X className="size-4" aria-hidden="true" />
              <span className="sr-only">Kapat</span>
            </Button>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-medium text-foreground">
              {completed}/{total} tamamlandı
            </span>
            <span className="font-medium tabular-nums text-muted-foreground">
              %{percent}
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label="Kurulum ilerlemesi"
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-500",
                allDone ? "bg-success" : "bg-brand-gradient",
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ol className="divide-y divide-border">
          {steps.map((step, index) => {
            const isDone = Boolean(step.done);
            const actionLabel = step.action?.label ?? "Başla";
            return (
              <li
                key={index}
                className={cn(
                  "flex items-center gap-4 py-3 transition-colors duration-200",
                  !isDone && "hover:bg-muted/40",
                  "-mx-2 rounded-lg px-2",
                )}
              >
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums transition-colors duration-300",
                    isDone
                      ? "border-success bg-success text-success-foreground shadow-sm"
                      : "border-border bg-background text-muted-foreground",
                  )}
                  aria-hidden="true"
                >
                  {isDone ? <Check className="size-4" /> : index + 1}
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div
                    className={cn(
                      "truncate text-sm font-medium",
                      isDone
                        ? "text-muted-foreground line-through"
                        : "text-foreground",
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description ? (
                    <div
                      className={cn(
                        "truncate text-xs",
                        isDone
                          ? "text-muted-foreground/70"
                          : "text-muted-foreground",
                      )}
                    >
                      {step.description}
                    </div>
                  ) : null}
                </div>

                {isDone ? (
                  <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-success">
                    <Check className="size-3.5" aria-hidden="true" />
                    Tamamlandı
                  </span>
                ) : step.action ? (
                  step.action.href ? (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                    >
                      <a href={step.action.href}>{actionLabel}</a>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={step.action.onClick}
                    >
                      {actionLabel}
                    </Button>
                  )
                ) : null}
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
});
OnboardingChecklist.displayName = "OnboardingChecklist";

export { OnboardingChecklist };
