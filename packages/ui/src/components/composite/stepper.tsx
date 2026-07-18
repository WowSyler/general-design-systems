/**
 * Steps — adim gostergesi.
 * Cok adimli akislarda (onboarding, sihirbaz) tamamlanan, aktif ve
 * bekleyen adimlari daire + baglanti cizgisi ile gosterir.
 */
import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StepItem {
  label: React.ReactNode;
  description?: React.ReactNode;
}

export interface StepsProps extends React.HTMLAttributes<HTMLOListElement> {
  /** Adim listesi. */
  steps: StepItem[];
  /** Aktif adim (0 tabanli). */
  current: number;
  /** Yerlesim yonu. */
  orientation?: "horizontal" | "vertical";
}

type StepState = "done" | "current" | "upcoming";

const circleClasses: Record<StepState, string> = {
  done: "border-primary bg-primary text-primary-foreground shadow-sm",
  current: "border-primary text-primary",
  upcoming: "border-border text-muted-foreground",
};

const labelClasses: Record<StepState, string> = {
  done: "text-foreground",
  current: "text-foreground",
  upcoming: "text-muted-foreground",
};

function getStepState(index: number, current: number): StepState {
  if (index < current) return "done";
  if (index === current) return "current";
  return "upcoming";
}

export const Steps = React.forwardRef<HTMLOListElement, StepsProps>(
  ({ steps, current, orientation = "horizontal", className, ...props }, ref) => {
    if (orientation === "vertical") {
      return (
        <ol ref={ref} className={cn("flex flex-col", className)} {...props}>
          {steps.map((step, index) => {
            const state = getStepState(index, current);
            const isLast = index === steps.length - 1;
            return (
              <li
                key={index}
                aria-current={state === "current" ? "step" : undefined}
                className={cn("flex gap-3", !isLast && "pb-8")}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium",
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
                        "mt-1 w-0.5 flex-1 rounded-full",
                        state === "done" ? "bg-primary" : "bg-border",
                      )}
                    />
                  ) : null}
                </div>
                <div className="pt-1.5">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      labelClasses[state],
                    )}
                  >
                    {step.label}
                  </div>
                  {step.description ? (
                    <div className="text-sm text-muted-foreground">
                      {step.description}
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      );
    }

    return (
      <ol ref={ref} className={cn("flex w-full", className)} {...props}>
        {steps.map((step, index) => {
          const state = getStepState(index, current);
          const isLast = index === steps.length - 1;
          return (
            <li
              key={index}
              aria-current={state === "current" ? "step" : undefined}
              className={cn("flex flex-col", !isLast && "flex-1")}
            >
              <div className="flex items-center">
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium",
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
                      "mx-2 h-0.5 flex-1 rounded-full",
                      state === "done" ? "bg-primary" : "bg-border",
                    )}
                  />
                ) : null}
              </div>
              <div className="mt-2 pr-4">
                <div
                  className={cn("text-sm font-medium", labelClasses[state])}
                >
                  {step.label}
                </div>
                {step.description ? (
                  <div className="text-sm text-muted-foreground">
                    {step.description}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    );
  },
);
Steps.displayName = "Steps";
