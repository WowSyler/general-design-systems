/**
 * CiPipeline — CI/CD asama akisi (DeployLens pipeline).
 * Yatay bagli asamalari (Kur -> Derle -> Test -> Dagit) durum ikonuyla gosterir:
 * bekliyor (Clock), calisiyor (Loader2 spin), basarili (Check), hata (X),
 * atlandi (Minus). Asamalar arasi baglayici cizgi tamamlanan adimda yesile
 * (success) donuser, hatada destructive olur. Ust bilgide dal/commit rozetleri
 * ve genel durum ozeti bulunur. Asamalar onStageSelect ile tiklanabilir; secili
 * asama (activeStageId) vurgulanir ve altta detay paneli acilir.
 * Etkilesimsiz (kontrollu) bilesen — kendi durumunu tutmaz.
 */
import * as React from "react";
import {
  Check,
  Clock,
  GitBranch,
  GitCommitHorizontal,
  Loader2,
  Minus,
  Workflow,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type CiPipelineStageStatus =
  | "pending"
  | "running"
  | "success"
  | "failed"
  | "skipped";

export interface CiPipelineStage {
  /** Detay panelini ve secimi eslemek icin benzersiz kimlik. */
  id?: string;
  /** Asama basligi (orn. "Test"). */
  label: React.ReactNode;
  /** Asamanin durumu. */
  status: CiPipelineStageStatus;
  /** Asamanin suresi (orn. "1dk 12sn"). */
  duration?: React.ReactNode;
  /** Tiklaninca acilan detay metni (log ozeti, adim aciklamasi). */
  description?: React.ReactNode;
}

export interface CiPipelineProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onSelect"> {
  /** Sirali asama listesi. */
  stages: CiPipelineStage[];
  /** Ust satirdaki baslik (orn. is akisi adi). */
  title?: React.ReactNode;
  /** Baslik altindaki aciklama. */
  subtitle?: React.ReactNode;
  /** Kaynak dal adi (rozet). */
  branch?: React.ReactNode;
  /** Kisa commit hash (mono rozet). */
  commit?: React.ReactNode;
  /** Toplam calisma suresi (ust bilgide gosterilir). */
  totalDuration?: React.ReactNode;
  /** Secili asamanin kimligi; vurgulanir ve altta detay acilir. */
  activeStageId?: string;
  /** Asamaya tiklandiginda cagirilir; verilirse asamalar buton olur. */
  onStageSelect?: (stage: CiPipelineStage, index: number) => void;
}

type OverallStatus = "success" | "failed" | "running" | "pending";

const statusMeta: Record<
  CiPipelineStageStatus,
  { circle: string; label: string; icon: React.ReactNode; text: string }
> = {
  pending: {
    circle: "border-border bg-background text-muted-foreground",
    label: "text-muted-foreground",
    icon: <Clock className="size-4" aria-hidden="true" />,
    text: "bekliyor",
  },
  running: {
    circle:
      "border-info bg-info/10 text-info ring-4 ring-info/15 shadow-sm",
    label: "text-foreground font-semibold",
    icon: <Loader2 className="size-4 animate-spin" aria-hidden="true" />,
    text: "calisiyor",
  },
  success: {
    circle: "border-success bg-success text-success-foreground shadow-sm",
    label: "text-foreground",
    icon: <Check className="size-4" aria-hidden="true" />,
    text: "basarili",
  },
  failed: {
    circle:
      "border-destructive bg-destructive text-destructive-foreground ring-4 ring-destructive/15 shadow-sm",
    label: "text-destructive font-semibold",
    icon: <X className="size-4" aria-hidden="true" />,
    text: "hata",
  },
  skipped: {
    circle: "border-dashed border-border bg-muted text-muted-foreground",
    label: "text-muted-foreground line-through",
    icon: <Minus className="size-4" aria-hidden="true" />,
    text: "atlandi",
  },
};

function connectorClass(status: CiPipelineStageStatus): string {
  if (status === "success") return "bg-success";
  if (status === "failed") return "bg-destructive";
  if (status === "running") return "bg-info/40";
  return "bg-border";
}

function getOverallStatus(stages: CiPipelineStage[]): OverallStatus {
  if (stages.some((s) => s.status === "failed")) return "failed";
  if (stages.some((s) => s.status === "running")) return "running";
  if (stages.length > 0 && stages.every((s) => s.status === "success"))
    return "success";
  return "pending";
}

const overallMeta: Record<
  OverallStatus,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  success: { label: "Başarılı", variant: "success" },
  failed: { label: "Başarısız", variant: "destructive" },
  running: { label: "Çalışıyor", variant: "info-soft" },
  pending: { label: "Sırada", variant: "outline" },
};

const CiPipeline = React.forwardRef<HTMLDivElement, CiPipelineProps>(
  (
    {
      stages,
      title = "Dağıtım hattı",
      subtitle,
      branch,
      commit,
      totalDuration,
      activeStageId,
      onStageSelect,
      className,
      ...props
    },
    ref
  ) => {
    const overall = getOverallStatus(stages);
    const overallInfo = overallMeta[overall];
    const activeStage =
      activeStageId != null
        ? stages.find((s) => s.id === activeStageId)
        : undefined;

    const summary = `Dağıtım hattı durumu: ${overallInfo.label}. ${stages
      .map(
        (s) =>
          `${typeof s.label === "string" ? s.label : "asama"} ${
            statusMeta[s.status].text
          }`
      )
      .join(", ")}`;

    return (
      <div
        ref={ref}
        role="group"
        aria-label={typeof title === "string" ? title : "Dağıtım hattı"}
        className={cn(
          "rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm",
          className
        )}
        {...props}
      >
        {/* Ust bilgi: baslik, dal/commit, genel durum */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <div className="flex items-center gap-2">
              <span
                className="rounded-md bg-primary/10 p-1.5 text-primary"
                aria-hidden="true"
              >
                <Workflow className="size-4" />
              </span>
              <span className="text-sm font-semibold text-foreground">
                {title}
              </span>
            </div>
            {(branch || commit) && (
              <div className="flex flex-wrap items-center gap-1.5">
                {branch ? (
                  <Badge variant="secondary" className="gap-1 font-medium">
                    <GitBranch className="size-3" aria-hidden="true" />
                    {branch}
                  </Badge>
                ) : null}
                {commit ? (
                  <Badge
                    variant="outline"
                    className="gap-1 font-mono text-[11px]"
                  >
                    <GitCommitHorizontal className="size-3" aria-hidden="true" />
                    {commit}
                  </Badge>
                ) : null}
              </div>
            )}
            {subtitle ? (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>

          <div className="shrink-0 text-end">
            <Badge variant={overallInfo.variant} className="gap-1">
              {overall === "running" ? (
                <Loader2 className="size-3 animate-spin" aria-hidden="true" />
              ) : overall === "success" ? (
                <Check className="size-3" aria-hidden="true" />
              ) : overall === "failed" ? (
                <X className="size-3" aria-hidden="true" />
              ) : null}
              {overallInfo.label}
            </Badge>
            {totalDuration ? (
              <div className="mt-1.5 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" aria-hidden="true" />
                <span className="tabular-nums">{totalDuration}</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Asama akisi */}
        <div className="relative mt-6 overflow-x-auto">
        <ol
          className="flex w-full min-w-full items-start"
          aria-label={summary}
        >
          {stages.map((stage, index) => {
            const meta = statusMeta[stage.status];
            const isLast = index === stages.length - 1;
            const isActive =
              stage.id != null && stage.id === activeStageId;
            const clickable = Boolean(onStageSelect);

            const cellContent = (
              <>
                <span
                  className={cn(
                    "relative z-20 flex size-9 shrink-0 items-center justify-center rounded-full border-2 bg-card transition-all duration-300",
                    meta.circle
                  )}
                >
                  {meta.icon}
                </span>
                <span
                  className={cn(
                    "mt-2 text-center text-sm leading-tight",
                    meta.label
                  )}
                >
                  {stage.label}
                </span>
                {stage.duration ? (
                  <span className="mt-0.5 text-center text-xs tabular-nums text-muted-foreground">
                    {stage.duration}
                  </span>
                ) : (
                  <span className="mt-0.5 text-xs text-muted-foreground">
                    <span className="sr-only">{meta.text}</span>
                  </span>
                )}
              </>
            );

            return (
              <li
                key={stage.id ?? index}
                aria-current={stage.status === "running" ? "step" : undefined}
                className="relative flex min-w-[4.5rem] flex-1 flex-col items-center"
              >
                {/* Baglayici cizgi: bu asamanin merkezinden sonrakine */}
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-1/2 top-[26px] z-10 h-0.5 w-full -translate-y-1/2 rounded-full transition-colors duration-300",
                      connectorClass(stage.status)
                    )}
                  />
                ) : null}

                {clickable ? (
                  <button
                    type="button"
                    onClick={() => onStageSelect?.(stage, index)}
                    aria-pressed={isActive}
                    aria-label={`${
                      typeof stage.label === "string" ? stage.label : "Asama"
                    } — ${meta.text}`}
                    className={cn(
                      "relative flex w-full flex-col items-center rounded-lg px-1 py-2 transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                      "hover:bg-accent/50 active:scale-[0.98]",
                      isActive && "bg-accent"
                    )}
                  >
                    {cellContent}
                  </button>
                ) : (
                  <div
                    className={cn(
                      "relative flex w-full flex-col items-center rounded-lg px-1 py-2",
                      isActive && "bg-accent"
                    )}
                  >
                    {cellContent}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        </div>

        {/* Secili asama detayi */}
        {activeStage ? (
          <div
            role="region"
            aria-label="Aşama detayı"
            className="mt-4 rounded-lg border border-border bg-muted/40 p-4 animate-fade-up"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full border-2",
                    statusMeta[activeStage.status].circle
                  )}
                >
                  {statusMeta[activeStage.status].icon}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {activeStage.label}
                </span>
                <Badge
                  variant={
                    activeStage.status === "failed"
                      ? "destructive"
                      : activeStage.status === "success"
                        ? "success"
                        : activeStage.status === "running"
                          ? "info-soft"
                          : "outline"
                  }
                >
                  {statusMeta[activeStage.status].text}
                </Badge>
              </div>
              {activeStage.duration ? (
                <span className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
                  <Clock className="size-3" aria-hidden="true" />
                  {activeStage.duration}
                </span>
              ) : null}
            </div>
            {activeStage.description ? (
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {activeStage.description}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
);
CiPipeline.displayName = "CiPipeline";

export { CiPipeline };
