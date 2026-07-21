/**
 * OrderShipmentTracker — Kargo durum takibi (Dolap siparisi).
 * Yatay veya dikey adimlar (Siparis alindi -> Hazirlaniyor -> Kargoda ->
 * Dagitimda -> Teslim edildi); tamamlananlar Check, aktif adim vurgulu (ring
 * + darbe). Ust bilgide kargo firmasi, kopyalanabilir takip numarasi (select-all)
 * ve tahmini teslim tarihi bulunur. Iptal/iade durumu destructive varyantla
 * gosterilir: durdurulan adim X/geri ikonu + uyari serisi, tahmini teslim gizli.
 * Etkilesimsiz (sunum) bilesen; takip no tek tikla secilerek kopyalanir.
 */
import * as React from "react";
import {
  Check,
  Copy,
  PackageX,
  RotateCcw,
  Truck,
  CalendarClock,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface OrderShipmentTrackerStep {
  /** Adim basligi (orn. "Kargoda"). */
  label: React.ReactNode;
  /** Alt bilgi: zaman damgasi, konum veya not. */
  description?: React.ReactNode;
}

type OrderShipmentTrackerStepInput = string | OrderShipmentTrackerStep;
type OrderShipmentTrackerStatus = "active" | "cancelled" | "returned";
type OrderShipmentTrackerOrientation = "horizontal" | "vertical";
type OrderShipmentTrackerState = "done" | "current" | "upcoming" | "stopped";

export interface OrderShipmentTrackerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Adim listesi; metin veya { label, description }. Verilmezse varsayilan 5 asama. */
  steps?: OrderShipmentTrackerStepInput[];
  /** Aktif adim (0 tabanli); oncekiler tamam sayilir. Adim sayisina esitse tumu tamamdir. */
  currentStep: number;
  /** Yerlesim yonu. Varsayilan dikey (zaman damgalari icin ideal). */
  orientation?: OrderShipmentTrackerOrientation;
  /** Genel durum. cancelled/returned destructive seriyi tetikler. */
  status?: OrderShipmentTrackerStatus;
  /** Ust satirdaki baslik (orn. siparis basligi). */
  title?: React.ReactNode;
  /** Siparis numarasi rozeti. */
  orderNumber?: React.ReactNode;
  /** Kargo firmasi adi. */
  carrier?: React.ReactNode;
  /** Kopyalanabilir takip numarasi. */
  trackingNumber?: string;
  /** Tahmini teslim tarihi (aktif durumda gosterilir). */
  estimatedDelivery?: React.ReactNode;
  /** Iptal/iade durumunda gosterilecek ozel aciklama. */
  statusMessage?: React.ReactNode;
}

const DEFAULT_STEPS: OrderShipmentTrackerStep[] = [
  { label: "Sipariş alındı" },
  { label: "Hazırlanıyor" },
  { label: "Kargoda" },
  { label: "Dağıtımda" },
  { label: "Teslim edildi" },
];

const circleClasses: Record<OrderShipmentTrackerState, string> = {
  done: "border-primary bg-primary text-primary-foreground shadow-sm",
  current:
    "border-primary bg-background text-primary ring-4 ring-primary/15 shadow-sm",
  upcoming: "border-border bg-background text-muted-foreground",
  stopped:
    "border-destructive bg-destructive text-destructive-foreground ring-4 ring-destructive/15 shadow-sm",
};

const labelClasses: Record<OrderShipmentTrackerState, string> = {
  done: "text-foreground",
  current: "text-foreground font-semibold",
  upcoming: "text-muted-foreground",
  stopped: "text-destructive font-semibold",
};

const lineClasses: Record<"done" | "pending", string> = {
  done: "bg-primary",
  pending: "bg-border",
};

const statusMeta: Record<
  Exclude<OrderShipmentTrackerStatus, "active">,
  { label: string; message: string; icon: React.ReactNode }
> = {
  cancelled: {
    label: "İptal edildi",
    message: "Siparişiniz iptal edildi. Ödemeniz kartınıza iade edilecektir.",
    icon: <PackageX className="size-4" aria-hidden="true" />,
  },
  returned: {
    label: "İade sürecinde",
    message: "Ürün iade için kargoya verildi. İade onayı sonrası bilgilendirileceksiniz.",
    icon: <RotateCcw className="size-4" aria-hidden="true" />,
  },
};

function normalizeStep(
  step: OrderShipmentTrackerStepInput
): OrderShipmentTrackerStep {
  return typeof step === "string" ? { label: step } : step;
}

function getStepState(
  index: number,
  current: number,
  status: OrderShipmentTrackerStatus
): OrderShipmentTrackerState {
  if (index < current) return "done";
  if (index === current) return status === "active" ? "current" : "stopped";
  return "upcoming";
}

function renderCircleContent(
  state: OrderShipmentTrackerState,
  index: number,
  status: OrderShipmentTrackerStatus
): React.ReactNode {
  if (state === "done") return <Check className="size-4" aria-hidden="true" />;
  if (state === "stopped") {
    return status === "returned" ? (
      <RotateCcw className="size-4" aria-hidden="true" />
    ) : (
      <PackageX className="size-4" aria-hidden="true" />
    );
  }
  if (state === "current") {
    return (
      <span
        className="size-2.5 rounded-full bg-primary animate-glow-pulse"
        aria-hidden="true"
      />
    );
  }
  return <span className="text-xs font-semibold tabular-nums">{index + 1}</span>;
}

const OrderShipmentTracker = React.forwardRef<
  HTMLDivElement,
  OrderShipmentTrackerProps
>(
  (
    {
      steps = DEFAULT_STEPS,
      currentStep,
      orientation = "vertical",
      status = "active",
      title,
      orderNumber,
      carrier,
      trackingNumber,
      estimatedDelivery,
      statusMessage,
      className,
      ...props
    },
    ref
  ) => {
    const normalized = steps.map(normalizeStep);
    const total = normalized.length;
    const current = Math.max(0, Math.min(currentStep, total));
    const isDelivered = status === "active" && current >= total && total > 0;
    const isDisrupted = status !== "active";
    const activeLabel = normalized[Math.min(current, total - 1)]?.label;

    const summary = isDisrupted
      ? statusMeta[status].label
      : isDelivered
        ? "Teslim edildi"
        : `Kargo durumu: ${
            typeof activeLabel === "string" ? activeLabel : "işlemde"
          }`;

    const trackingHint = trackingNumber
      ? "Takip numarası, kopyalamak için üzerine tıklayıp seçin"
      : undefined;

    return (
      <div
        ref={ref}
        role="group"
        aria-label={typeof title === "string" ? title : "Kargo takibi"}
        className={cn(
          "rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm",
          className
        )}
        {...props}
      >
        {/* Ust bilgi: firma, takip no, tahmini teslim */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-1.5">
            {title ? (
              <div className="text-sm font-semibold text-foreground">{title}</div>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <span
                  className="rounded-md bg-primary/10 p-1 text-primary"
                  aria-hidden="true"
                >
                  <Truck className="size-3.5" />
                </span>
                {carrier ?? "Kargo firması"}
              </span>
              {orderNumber ? (
                <Badge variant="outline" className="font-mono text-[11px]">
                  {orderNumber}
                </Badge>
              ) : null}
            </div>
            {trackingNumber ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Takip No:</span>
                <code
                  title={trackingHint}
                  className="select-all rounded-md border border-input bg-muted/50 px-2 py-0.5 font-mono text-xs font-medium text-foreground tabular-nums"
                >
                  {trackingNumber}
                </code>
                <Copy
                  className="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="sr-only">{trackingHint}</span>
              </div>
            ) : null}
          </div>

          <div className="shrink-0 text-right">
            {isDisrupted ? (
              <Badge variant="destructive" className="gap-1">
                {statusMeta[status].icon}
                {statusMeta[status].label}
              </Badge>
            ) : isDelivered ? (
              <Badge variant="success" className="gap-1">
                <Check className="size-3.5" aria-hidden="true" />
                Teslim edildi
              </Badge>
            ) : (
              <Badge variant="info-soft">{summary}</Badge>
            )}
            {!isDisrupted && estimatedDelivery ? (
              <div className="mt-1.5 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                <CalendarClock className="size-3.5" aria-hidden="true" />
                <span className="tabular-nums">
                  Tahmini teslim: {estimatedDelivery}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Iptal/iade uyari serisi */}
        {isDisrupted ? (
          <div
            role="status"
            className="mt-4 flex items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
          >
            <span className="mt-0.5 shrink-0" aria-hidden="true">
              {statusMeta[status].icon}
            </span>
            <p className="min-w-0">{statusMessage ?? statusMeta[status].message}</p>
          </div>
        ) : null}

        {/* Adimlar */}
        {orientation === "vertical" ? (
          <ol className="mt-5 flex flex-col" aria-label={summary}>
            {normalized.map((step, index) => {
              const state = getStepState(index, current, status);
              const isLast = index === total - 1;
              return (
                <li
                  key={index}
                  aria-current={state === "current" ? "step" : undefined}
                  className={cn("flex gap-3", !isLast && "pb-6")}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                        circleClasses[state]
                      )}
                    >
                      {renderCircleContent(state, index, status)}
                    </div>
                    {!isLast ? (
                      <div
                        className={cn(
                          "mt-1 w-0.5 flex-1 rounded-full transition-colors duration-300",
                          index < current ? lineClasses.done : lineClasses.pending
                        )}
                      />
                    ) : null}
                  </div>
                  <div className="pt-1.5 pb-1">
                    <div className={cn("text-sm", labelClasses[state])}>
                      {step.label}
                    </div>
                    {step.description ? (
                      <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                        {step.description}
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <ol className="mt-6 flex w-full" aria-label={summary}>
            {normalized.map((step, index) => {
              const state = getStepState(index, current, status);
              const isLast = index === total - 1;
              return (
                <li
                  key={index}
                  aria-current={state === "current" ? "step" : undefined}
                  className={cn("flex min-w-0 flex-col", !isLast && "flex-1")}
                >
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                        circleClasses[state]
                      )}
                    >
                      {renderCircleContent(state, index, status)}
                    </div>
                    {!isLast ? (
                      <div
                        className={cn(
                          "mx-2 h-0.5 flex-1 rounded-full transition-colors duration-300",
                          index < current ? lineClasses.done : lineClasses.pending
                        )}
                      />
                    ) : null}
                  </div>
                  <div className="mt-2 min-w-0 break-words pr-4">
                    <div className={cn("text-sm", labelClasses[state])}>
                      {step.label}
                    </div>
                    {step.description ? (
                      <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
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
  }
);
OrderShipmentTracker.displayName = "OrderShipmentTracker";

export { OrderShipmentTracker };
