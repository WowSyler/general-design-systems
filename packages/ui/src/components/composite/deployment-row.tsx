/**
 * DeploymentRow — Dagitim (deploy) satiri (DeployLens dagitim listesi cekirdegi).
 * Solda durum noktasi (basarili/basarisiz/calisiyor/sirada/iptal) — "calisiyor"
 * durumunda animate-ping halkasiyla nabiz atar. Ardindan ortam rozeti
 * (prod/staging/preview/dev), commit mesaji ve alt-metinde GitRef (branch + kisa
 * hash, mono), yazar avatari + adi, goreli zaman ve sure gosterilir. Sagda
 * "Loglar" ve "Geri al" eylem butonlari opsiyonel handler verildiginde render
 * edilir. DeploymentRowGroup satirlari divide-y ile ayrilmis kart icinde toplar.
 * Tema-agnostiktir (hardcoded renk yok); tum durum/ortam bilgisi semantik
 * tokenlarla ve sr-only etiketlerle erisilebilir sunulur.
 */
import * as React from "react";
import { GitBranch, GitCommitHorizontal, ScrollText, Timer, Undo2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DeploymentRowStatus =
  | "success"
  | "failed"
  | "running"
  | "queued"
  | "canceled";

export type DeploymentRowEnvironment =
  | "production"
  | "staging"
  | "preview"
  | "development";

type StatusMeta = {
  label: string;
  /** Nokta dolgu rengi (semantik token). */
  dot: string;
  /** Nabiz atan animate-ping halkasi gosterilsin mi? */
  pulse: boolean;
};

const statusMeta: Record<DeploymentRowStatus, StatusMeta> = {
  success: { label: "Başarılı", dot: "bg-success", pulse: false },
  failed: { label: "Başarısız", dot: "bg-destructive", pulse: false },
  running: { label: "Çalışıyor", dot: "bg-info", pulse: true },
  queued: { label: "Sırada", dot: "bg-muted-foreground", pulse: false },
  canceled: { label: "İptal edildi", dot: "bg-muted-foreground/70", pulse: false },
};

type EnvMeta = {
  label: string;
  className: string;
};

const envMeta: Record<DeploymentRowEnvironment, EnvMeta> = {
  production: {
    label: "prod",
    className: "bg-primary/10 text-primary ring-1 ring-inset ring-primary/25",
  },
  staging: {
    label: "staging",
    className: "bg-warning/15 text-warning ring-1 ring-inset ring-warning/25",
  },
  preview: {
    label: "preview",
    className: "bg-info/15 text-info ring-1 ring-inset ring-info/25",
  },
  development: {
    label: "dev",
    className: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
  },
};

function toInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("tr-TR") ?? "")
    .join("");
}

/** Durum noktasi — "calisiyor" durumunda animate-ping ile nabiz atar. */
function DeploymentRowStatusDot({ status }: { status: DeploymentRowStatus }) {
  const meta = statusMeta[status];
  return (
    <span className="relative flex size-2.5 shrink-0 items-center justify-center">
      {meta.pulse ? (
        <span
          className={cn(
            "absolute inline-flex size-full animate-ping rounded-full opacity-75",
            meta.dot
          )}
          aria-hidden="true"
        />
      ) : null}
      <span
        className={cn("relative inline-flex size-2.5 rounded-full", meta.dot)}
        aria-hidden="true"
      />
      <span className="sr-only">{meta.label}</span>
    </span>
  );
}

export interface DeploymentRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Dagitim durumu: basarili / basarisiz / calisiyor / sirada / iptal. */
  status: DeploymentRowStatus;
  /** Hedef ortam: production / staging / preview / development. */
  environment: DeploymentRowEnvironment;
  /** Commit / dagitim mesaji (ust satir basligi). */
  message: React.ReactNode;
  /** Git dal adi (or. "main"). */
  branch?: string;
  /** Kisa commit hash (or. "a1b2c3d"). */
  commit?: string;
  /** Dagitimi tetikleyen yazarin adi. */
  authorName: string;
  /** Yazar avatar gorsel adresi (opsiyonel). */
  authorAvatarUrl?: string;
  /** Goreli zaman (or. "3 dk önce"). */
  time?: React.ReactNode;
  /** Dagitim suresi (or. "1dk 24sn"). */
  duration?: React.ReactNode;
  /** "Loglar" eylemi. Verilirse buton render edilir. */
  onViewLogs?: React.MouseEventHandler<HTMLButtonElement>;
  /** "Geri al" eylemi. Verilirse buton render edilir. */
  onRollback?: React.MouseEventHandler<HTMLButtonElement>;
}

const DeploymentRow = React.forwardRef<HTMLDivElement, DeploymentRowProps>(
  (
    {
      status,
      environment,
      message,
      branch,
      commit,
      authorName,
      authorAvatarUrl,
      time,
      duration,
      onViewLogs,
      onRollback,
      className,
      ...props
    },
    ref
  ) => {
    const env = envMeta[environment];
    const statusLabel = statusMeta[status].label;
    const messageText = typeof message === "string" ? message : "Dağıtım";
    const ariaLabel = `${env.label} ${statusLabel.toLocaleLowerCase("tr-TR")} dağıtım: ${messageText}`;
    const hasGitRef = Boolean(branch) || Boolean(commit);
    const hasActions = Boolean(onViewLogs) || Boolean(onRollback);

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        className={cn(
          "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40",
          className
        )}
        {...props}
      >
        <div className="mt-1.5">
          <DeploymentRowStatusDot status={status} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                env.className
              )}
            >
              {env.label}
            </span>
            <span className="truncate text-sm font-medium text-foreground">
              {message}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
            {hasGitRef ? (
              <span className="inline-flex items-center gap-1.5 font-mono">
                {branch ? (
                  <span className="inline-flex items-center gap-1">
                    <GitBranch className="size-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{branch}</span>
                  </span>
                ) : null}
                {branch && commit ? (
                  <span aria-hidden="true" className="text-muted-foreground/50">
                    ·
                  </span>
                ) : null}
                {commit ? (
                  <span className="inline-flex items-center gap-1">
                    <GitCommitHorizontal
                      className="size-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{commit}</span>
                  </span>
                ) : null}
              </span>
            ) : null}

            <span className="inline-flex items-center gap-1.5">
              <Avatar className="size-5 ring-0">
                {authorAvatarUrl ? (
                  <AvatarImage src={authorAvatarUrl} alt="" />
                ) : null}
                <AvatarFallback className="text-[9px] font-semibold">
                  {toInitials(authorName)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate font-medium text-foreground/80">
                {authorName}
              </span>
            </span>

            {time ? (
              <>
                <span aria-hidden="true" className="text-muted-foreground/50">
                  ·
                </span>
                <span className="shrink-0 tabular-nums">{time}</span>
              </>
            ) : null}

            {duration ? (
              <>
                <span aria-hidden="true" className="text-muted-foreground/50">
                  ·
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 tabular-nums">
                  <Timer className="size-3.5" aria-hidden="true" />
                  {duration}
                  <span className="sr-only"> süre</span>
                </span>
              </>
            ) : null}
          </div>
        </div>

        {hasActions ? (
          <div className="flex shrink-0 items-center gap-1 pl-1">
            {onViewLogs ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onViewLogs}
                className="text-muted-foreground hover:text-foreground"
              >
                <ScrollText aria-hidden="true" />
                <span className="hidden sm:inline">Loglar</span>
                <span className="sr-only">Logları görüntüle</span>
              </Button>
            ) : null}
            {onRollback ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRollback}
                className="text-muted-foreground hover:text-destructive"
              >
                <Undo2 aria-hidden="true" />
                <span className="hidden sm:inline">Geri al</span>
                <span className="sr-only">Bu dağıtımı geri al</span>
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
);
DeploymentRow.displayName = "DeploymentRow";

export type DeploymentRowGroupProps = React.HTMLAttributes<HTMLDivElement>;

const DeploymentRowGroup = React.forwardRef<HTMLDivElement, DeploymentRowGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("divide-y overflow-hidden rounded-xl border bg-card", className)}
      {...props}
    />
  )
);
DeploymentRowGroup.displayName = "DeploymentRowGroup";

export { DeploymentRow, DeploymentRowGroup };
