/**
 * SetupProgress — Kurulum ilerleme gostergesi (yuzde odakli).
 * Onboarding ust seridi icin: asama etiketleri + tamam/aktif/bekleyen
 * durumu, ustte yuzde cubugu; "steps" (numarali baglantili daireler) veya
 * "bar" (etiket cipleri) varyanti ile. DeployLens/GlowScan/Fisly kurulum
 * akislari icin. Stepper'dan farki: kurulum baglami ve yuzde vurgusu.
 */
import * as React from "react";
import { Check, Circle, CircleCheck, CircleDot } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SetupProgressStep {
  label: React.ReactNode;
  description?: React.ReactNode;
}

type SetupProgressStepInput = string | SetupProgressStep;
type SetupProgressVariant = "steps" | "bar";
type SetupProgressState = "done" | "current" | "upcoming";

export interface SetupProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Asama listesi; metin veya { label, description } nesnesi. */
  steps: SetupProgressStepInput[];
  /** Aktif adim (0 tabanli); bundan onceki adimlar tamam sayilir. */
  currentStep: number;
  /** Yuzde degerini elle ayarla; verilmezse adimlardan hesaplanir. */
  percent?: number;
  /** Gorunum: baglantili daireler veya etiket cipleri. */
  variant?: SetupProgressVariant;
  /** Ust satirdaki baslik. */
  title?: React.ReactNode;
  /** Yuzde rozetini goster. */
  showPercent?: boolean;
}

const circleClasses: Record<SetupProgressState, string> = {
  done: "border-primary bg-primary text-primary-foreground shadow-sm",
  current: "border-primary text-primary ring-4 ring-primary/15",
  upcoming: "border-border text-muted-foreground",
};

const labelClasses: Record<SetupProgressState, string> = {
  done: "text-foreground",
  current: "text-foreground",
  upcoming: "text-muted-foreground",
};

const chipClasses: Record<SetupProgressState, string> = {
  done: "border-primary/40 bg-primary/10 text-foreground",
  current: "border-primary bg-primary/5 text-foreground ring-2 ring-primary/15",
  upcoming: "border-border bg-muted/40 text-muted-foreground",
};

const chipIcons: Record<SetupProgressState, React.ReactNode> = {
  done: <CircleCheck className="size-3.5 text-primary" aria-hidden="true" />,
  current: <CircleDot className="size-3.5 text-primary" aria-hidden="true" />,
  upcoming: <Circle className="size-3.5" aria-hidden="true" />,
};

function normalizeStep(step: SetupProgressStepInput): SetupProgressStep {
  return typeof step === "string" ? { label: step } : step;
}

function getState(index: number, current: number): SetupProgressState {
  if (index < current) return "done";
  if (index === current) return "current";
  return "upcoming";
}

const SetupProgress = React.forwardRef<HTMLDivElement, SetupProgressProps>(
  (
    {
      steps,
      currentStep,
      percent,
      variant = "steps",
      title,
      showPercent = true,
      className,
      ...props
    },
    ref,
  ) => {
    const normalized = steps.map(normalizeStep);
    const total = normalized.length;
    const current = Math.max(0, Math.min(currentStep, total));
    const computed = total > 0 ? Math.round((current / total) * 100) : 0;
    const pct = Math.min(100, Math.max(0, percent ?? computed));
    const isComplete = current >= total && total > 0;
    const statusText = isComplete
      ? "Kurulum tamamlandı"
      : `${total} adımdan ${current} tanesi tamam`;

    return (
      <div
        ref={ref}
        role="group"
        aria-label={typeof title === "string" ? title : "Kurulum ilerlemesi"}
        className={cn("space-y-3", className)}
        {...props}
      >
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-0.5">
            {title ? (
              <div className="text-sm font-semibold text-foreground">{title}</div>
            ) : null}
            <div className="text-xs text-muted-foreground tabular-nums">
              {statusText}
            </div>
          </div>
          {showPercent ? (
            <span className="text-sm font-bold tabular-nums text-primary">
              %{pct}
            </span>
          ) : null}
        </div>

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label={statusText}
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-primary bg-sheen shadow-sm transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        {variant === "bar" ? (
          <ol className="flex flex-wrap gap-2">
            {normalized.map((step, index) => {
              const state = getState(index, current);
              return (
                <li
                  key={index}
                  aria-current={state === "current" ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors duration-200",
                    chipClasses[state],
                  )}
                >
                  {chipIcons[state]}
                  <span>{step.label}</span>
                </li>
              );
            })}
          </ol>
        ) : (
          <ol className="flex w-full">
            {normalized.map((step, index) => {
              const state = getState(index, current);
              const isLast = index === total - 1;
              return (
                <li
                  key={index}
                  aria-current={state === "current" ? "step" : undefined}
                  className={cn("flex flex-col", !isLast && "flex-1")}
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
                    {!isLast ? (
                      <div
                        className={cn(
                          "mx-2 h-0.5 flex-1 rounded-full transition-colors duration-300",
                          index < current ? "bg-primary" : "bg-border",
                        )}
                      />
                    ) : null}
                  </div>
                  <div className="mt-2 pr-4">
                    <div className={cn("text-sm font-medium", labelClasses[state])}>
                      {step.label}
                    </div>
                    {step.description ? (
                      <div className="text-xs text-muted-foreground">
                        {step.description}
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    );
  },
);
SetupProgress.displayName = "SetupProgress";

export { SetupProgress };
