/**
 * ResultState — İşlem sonucu ekranı.
 * Ödeme, kayıt veya doğrulama akışlarının sonunda büyük tonlu ikon
 * dairesi, başlık, açıklama ve aksiyonlarla ortalanmış sonuç gösterir.
 */
import * as React from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export type ResultStateTone = "success" | "error" | "warning" | "info";

export interface ResultStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tone: ResultStateTone;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

const toneCircleClasses: Record<ResultStateTone, string> = {
  success: "bg-success/15 text-success",
  error: "bg-destructive/15 text-destructive",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/15 text-info",
};

const toneIcons: Record<ResultStateTone, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const toneLabels: Record<ResultStateTone, string> = {
  success: "Başarılı",
  error: "Hata",
  warning: "Uyarı",
  info: "Bilgi",
};

const ResultState = React.forwardRef<HTMLDivElement, ResultStateProps>(
  ({ tone, title, description, actions, className, ...props }, ref) => {
    const Icon = toneIcons[tone];

    return (
      <div
        ref={ref}
        role={tone === "error" ? "alert" : "status"}
        className={cn(
          "flex w-full animate-fade-up flex-col items-center justify-center gap-4 px-6 py-12 text-center",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "flex size-16 items-center justify-center rounded-full",
            toneCircleClasses[tone]
          )}
        >
          <Icon className="size-8" aria-hidden="true" />
          <span className="sr-only">{toneLabels[tone]}</span>
        </div>
        <div className="text-xl font-semibold text-foreground">{title}</div>
        {description ? (
          <div className="max-w-md text-sm text-muted-foreground">
            {description}
          </div>
        ) : null}
        {actions ? (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            {actions}
          </div>
        ) : null}
      </div>
    );
  }
);
ResultState.displayName = "ResultState";

export { ResultState };
