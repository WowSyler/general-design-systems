"use client";

/**
 * FormWizard — Cok adimli form sihirbazi kabi.
 * Ustte numarali Stepper gostergesi (tamamlanan/aktif/bekleyen), altinda
 * aktif adimin icerigi ve Geri / Ileri / Tamamla butonlari yer alir.
 * Her adim "canProceed" gecidi ile dogrulanir: kosul saglanmadan Ileri
 * butonu kilitli kalir. Kontrollu (step) veya kontrolsuz (defaultStep)
 * calisabilir; ilerleme cubugu ile toplam durumu ozetler.
 * Randevu rezervasyon sihirbazi, DeployLens proje kurulumu ve GlowScan
 * cilt profili akislari icin.
 */

import * as React from "react";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FormWizardStep {
  /** Adim basligi; Stepper etiketi ve icerik basligi olarak kullanilir. */
  title: React.ReactNode;
  /** Stepper altinda gorunen kisa aciklama. */
  description?: React.ReactNode;
  /** Bu adimin form icerigi. */
  content: React.ReactNode;
  /**
   * Ileri/Tamamla butonunun aktif olmasi icin kosul.
   * false verilirse gecis engellenir; verilmezse gecis serbesttir.
   */
  canProceed?: boolean;
  /** Adimin istege bagli oldugunu belirtir (etiket yaninda rozet). */
  optional?: boolean;
}

export interface FormWizardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  /** Adim listesi (baslik + icerik + dogrulama gecidi). */
  steps: FormWizardStep[];
  /** Kontrollu aktif adim (0 tabanli). Verilirse onStepChange ile yonetin. */
  step?: number;
  /** Kontrolsuz modda baslangic adimi (0 tabanli). */
  defaultStep?: number;
  /** Aktif adim degistiginde tetiklenir (Geri/Ileri). */
  onStepChange?: (step: number) => void;
  /** Son adimda Tamamla tiklaninca tetiklenir. */
  onComplete?: () => void;
  /** Geri buton etiketi. */
  backLabel?: React.ReactNode;
  /** Ileri buton etiketi. */
  nextLabel?: React.ReactNode;
  /** Son adimdaki tamamla buton etiketi. */
  completeLabel?: React.ReactNode;
  /** Ilerleme cubugunu goster. */
  showProgress?: boolean;
  /** Tamamlama sirasinda butonu yukleniyor durumuna al. */
  loading?: boolean;
}

type FormWizardState = "done" | "current" | "upcoming";

const circleClasses: Record<FormWizardState, string> = {
  done: "border-primary bg-primary text-primary-foreground shadow-sm",
  current: "border-primary text-primary ring-4 ring-primary/15",
  upcoming: "border-border text-muted-foreground",
};

const labelClasses: Record<FormWizardState, string> = {
  done: "text-foreground",
  current: "text-foreground",
  upcoming: "text-muted-foreground",
};

function getState(index: number, current: number): FormWizardState {
  if (index < current) return "done";
  if (index === current) return "current";
  return "upcoming";
}

const FormWizard = React.forwardRef<HTMLDivElement, FormWizardProps>(
  (
    {
      steps,
      step,
      defaultStep = 0,
      onStepChange,
      onComplete,
      backLabel = "Geri",
      nextLabel = "İleri",
      completeLabel = "Tamamla",
      showProgress = true,
      loading = false,
      className,
      ...props
    },
    ref,
  ) => {
    const total = steps.length;
    const isControlled = step !== undefined;
    const [internalStep, setInternalStep] = React.useState(() =>
      Math.max(0, Math.min(defaultStep, Math.max(0, total - 1))),
    );

    const rawCurrent = isControlled ? (step as number) : internalStep;
    const current = Math.max(0, Math.min(rawCurrent, Math.max(0, total - 1)));

    const activeStep = steps[current];
    const isFirst = current === 0;
    const isLast = current === total - 1;
    const canProceed = activeStep?.canProceed ?? true;

    const pct = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;
    const headingId = React.useId();

    const goTo = React.useCallback(
      (next: number) => {
        const clamped = Math.max(0, Math.min(next, total - 1));
        if (!isControlled) setInternalStep(clamped);
        onStepChange?.(clamped);
      },
      [isControlled, onStepChange, total],
    );

    const handleBack = () => {
      if (isFirst) return;
      goTo(current - 1);
    };

    const handleNext = () => {
      if (!canProceed || loading) return;
      if (isLast) {
        onComplete?.();
        return;
      }
      goTo(current + 1);
    };

    if (total === 0 || !activeStep) return null;

    return (
      <div
        ref={ref}
        role="group"
        aria-label="Form sihirbazı"
        className={cn(
          "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
          className,
        )}
        {...props}
      >
        {/* Stepper gostergesi */}
        <div className="border-b border-border p-5">
          <ol className="flex w-full">
            {steps.map((s, index) => {
              const state = getState(index, current);
              const last = index === total - 1;
              return (
                <li
                  key={index}
                  aria-current={state === "current" ? "step" : undefined}
                  className={cn("flex flex-col", !last && "flex-1")}
                >
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold tabular-nums transition-all duration-200",
                        circleClasses[state],
                      )}
                    >
                      {state === "done" ? (
                        <Check className="size-4" aria-hidden="true" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {!last ? (
                      <div
                        className={cn(
                          "mx-2 h-0.5 flex-1 rounded-full transition-colors duration-300",
                          index < current ? "bg-primary" : "bg-border",
                        )}
                      />
                    ) : null}
                  </div>
                  <div className="mt-2 pe-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          labelClasses[state],
                        )}
                      >
                        {s.title}
                      </span>
                      {s.optional ? (
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          İsteğe bağlı
                        </span>
                      ) : null}
                    </div>
                    {s.description ? (
                      <div className="text-xs text-muted-foreground">
                        {s.description}
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>

          {showProgress ? (
            <div className="mt-4 flex items-center gap-3">
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
                aria-label={`Adım ${current + 1} / ${total}`}
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full bg-primary bg-sheen transition-[width] duration-500 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-medium tabular-nums text-muted-foreground">
                Adım {current + 1}/{total}
              </span>
            </div>
          ) : null}
        </div>

        {/* Aktif adim icerigi */}
        <div
          role="region"
          aria-labelledby={headingId}
          className="animate-fade-up p-5"
        >
          <h3
            id={headingId}
            className="text-base font-semibold text-foreground"
          >
            {activeStep.title}
          </h3>
          {activeStep.description ? (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {activeStep.description}
            </p>
          ) : null}
          <div className="mt-4">{activeStep.content}</div>
        </div>

        {/* Gezinme butonlari */}
        <div className="flex items-center justify-between gap-3 border-t border-border p-5">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={isFirst || loading}
          >
            <ChevronLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            {backLabel}
          </Button>

          <div className="text-xs text-muted-foreground tabular-nums">
            {current + 1} / {total}
          </div>

          <Button
            type="button"
            onClick={handleNext}
            disabled={!canProceed || loading}
            aria-disabled={!canProceed || loading}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Gönderiliyor
              </>
            ) : isLast ? (
              <>
                <Check className="size-4" aria-hidden="true" />
                {completeLabel}
              </>
            ) : (
              <>
                {nextLabel}
                <ChevronRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  },
);
FormWizard.displayName = "FormWizard";

export { FormWizard };
