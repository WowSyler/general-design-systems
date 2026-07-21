"use client";
/**
 * RoutineChecklist — Cilt bakim rutini kontrol listesi (GlowScan rutin takibi).
 * Adimlar AM/PM (Sabah/Aksam) sekmelerine ayrilir; her adim urun ikonu, adi
 * ve "N. adim" sira etiketi ile birlikte bir checkbox tasir. Isaretlenen adim
 * ustu-cizili ve soluk gosterilir. Sekme basliklari ve kart ustu gunluk
 * ilerlemeyi (3/5 gibi) ilerleme cubugu ile ozetler.
 *
 * Kontrollu bilesen: `value` tamamlanan adim id'lerinin dizisidir,
 * `onValueChange` her isaretleme degisiminde guncel diziyi dondurur.
 * `value` verilmezse dahili durum ile kontrolsuz calisir.
 */
import * as React from "react";
import { Check, Sun, Moon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type RoutineChecklistPeriod = "AM" | "PM";

export interface RoutineChecklistStep {
  /** Adim icin benzersiz kimlik (tamamlanma durumu bu id ile izlenir). */
  id: string;
  /** Adim / urun adi. */
  name: React.ReactNode;
  /** Adimin ait oldugu bolum (Sabah/Aksam). Varsayilan "AM". */
  period?: RoutineChecklistPeriod;
  /** Urun ikonu (lucide vb.). */
  icon?: React.ReactNode;
  /** Kisa aciklama / urun notu. */
  note?: React.ReactNode;
}

export interface RoutineChecklistLabels {
  /** Sabah sekmesi basligi. */
  am?: React.ReactNode;
  /** Aksam sekmesi basligi. */
  pm?: React.ReactNode;
}

export interface RoutineChecklistProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onChange"> {
  /** Kart basligi. */
  title?: React.ReactNode;
  /** Baslik altindaki aciklama. */
  description?: React.ReactNode;
  /** Rutin adimlari. */
  steps: RoutineChecklistStep[];
  /** Tamamlanan adim id'leri (kontrollu kullanim). */
  value?: string[];
  /** Kontrolsuz baslangic degeri. */
  defaultValue?: string[];
  /** Isaretleme degistiginde guncel id dizisi ile cagrilir. */
  onValueChange?: (completedIds: string[]) => void;
  /** Sekme basliklari ozellestirmesi. */
  labels?: RoutineChecklistLabels;
}

const periodOrder: RoutineChecklistPeriod[] = ["AM", "PM"];

const periodIcons: Record<RoutineChecklistPeriod, React.ReactNode> = {
  AM: <Sun className="size-4" aria-hidden="true" />,
  PM: <Moon className="size-4" aria-hidden="true" />,
};

/** Ilerleme cubugu (rol=progressbar) yardimci bileseni. */
function RoutineChecklistProgress({
  completed,
  total,
  label,
}: {
  completed: number;
  total: number;
  label: string;
}) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const allDone = total > 0 && completed === total;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={label}
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
  );
}

const RoutineChecklist = React.forwardRef<HTMLDivElement, RoutineChecklistProps>(
  (
    {
      title = "Cilt Bakım Rutini",
      description,
      steps,
      value,
      defaultValue,
      onValueChange,
      labels,
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<string[]>(
      defaultValue ?? [],
    );
    const completedIds = isControlled ? value : internal;
    const completedSet = React.useMemo(
      () => new Set(completedIds),
      [completedIds],
    );

    const toggle = React.useCallback(
      (id: string) => {
        const next = new Set(completedSet);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        const nextArr = steps
          .map((step) => step.id)
          .filter((stepId) => next.has(stepId));
        if (!isControlled) setInternal(nextArr);
        onValueChange?.(nextArr);
      },
      [completedSet, steps, isControlled, onValueChange],
    );

    // Bolumlere gore grupla; yalnizca adimi olan bolumleri goster.
    const grouped = React.useMemo(() => {
      const map = new Map<RoutineChecklistPeriod, RoutineChecklistStep[]>();
      for (const step of steps) {
        const p = step.period ?? "AM";
        const list = map.get(p) ?? [];
        list.push(step);
        map.set(p, list);
      }
      return periodOrder
        .filter((p) => map.has(p))
        .map((p) => ({ period: p, items: map.get(p) as RoutineChecklistStep[] }));
    }, [steps]);

    const totalDone = steps.filter((s) => completedSet.has(s.id)).length;
    const totalCount = steps.length;

    const periodLabel = (p: RoutineChecklistPeriod): React.ReactNode => {
      if (p === "AM") return labels?.am ?? "Sabah";
      return labels?.pm ?? "Akşam";
    };

    const defaultPeriod = grouped[0]?.period ?? "AM";

    return (
      <Card ref={ref} className={cn("overflow-hidden", className)} {...props}>
        <CardHeader className="space-y-3 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base font-semibold leading-none tracking-tight text-foreground">
                {title}
              </h3>
              {description ? (
                <p className="text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
            <div className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-semibold tabular-nums text-primary">
              {totalDone}/{totalCount}
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Günlük ilerleme</span>
              <span className="tabular-nums">
                {totalCount > 0
                  ? Math.round((totalDone / totalCount) * 100)
                  : 0}
                %
              </span>
            </div>
            <RoutineChecklistProgress
              completed={totalDone}
              total={totalCount}
              label="Günlük rutin ilerlemesi"
            />
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Tabs defaultValue={defaultPeriod}>
            {grouped.length > 1 ? (
              <TabsList className="grid w-full grid-cols-2">
                {grouped.map(({ period, items }) => {
                  const done = items.filter((s) =>
                    completedSet.has(s.id),
                  ).length;
                  return (
                    <TabsTrigger
                      key={period}
                      value={period}
                      className="gap-1.5"
                    >
                      {periodIcons[period]}
                      <span>{periodLabel(period)}</span>
                      <span className="tabular-nums text-xs opacity-70">
                        {done}/{items.length}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            ) : null}

            {grouped.map(({ period, items }) => (
              <TabsContent key={period} value={period}>
                <ol className="divide-y divide-border">
                  {items.map((step, index) => {
                    const isDone = completedSet.has(step.id);
                    return (
                      <li
                        key={step.id}
                        className={cn(
                          "-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors duration-200",
                          !isDone && "hover:bg-muted/40",
                        )}
                      >
                        <Checkbox
                          id={`routine-${step.id}`}
                          checked={isDone}
                          onCheckedChange={() => toggle(step.id)}
                          aria-label={
                            typeof step.name === "string"
                              ? step.name
                              : `${index + 1}. adım`
                          }
                        />
                        {step.icon ? (
                          <div
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 [&_svg]:size-4",
                              isDone
                                ? "bg-muted text-muted-foreground"
                                : "bg-primary/10 text-primary",
                            )}
                            aria-hidden="true"
                          >
                            {step.icon}
                          </div>
                        ) : null}
                        <label
                          htmlFor={`routine-${step.id}`}
                          className="min-w-0 flex-1 cursor-pointer space-y-0.5"
                        >
                          <div
                            className={cn(
                              "truncate text-sm font-medium transition-colors duration-200",
                              isDone
                                ? "text-muted-foreground line-through"
                                : "text-foreground",
                            )}
                          >
                            {step.name}
                          </div>
                          <div
                            className={cn(
                              "flex items-center gap-1.5 text-xs",
                              isDone
                                ? "text-muted-foreground/60"
                                : "text-muted-foreground",
                            )}
                          >
                            <span className="tabular-nums font-medium">
                              {index + 1}. adım
                            </span>
                            {step.note ? (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="truncate">{step.note}</span>
                              </>
                            ) : null}
                          </div>
                        </label>
                        {isDone ? (
                          <Check
                            className="size-4 shrink-0 text-success"
                            aria-hidden="true"
                          />
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    );
  },
);
RoutineChecklist.displayName = "RoutineChecklist";

export { RoutineChecklist };
