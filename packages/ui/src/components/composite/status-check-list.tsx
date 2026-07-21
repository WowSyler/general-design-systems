/**
 * StatusCheckList — Durum kontrol listesi (PR/build kontrolleri tarzi).
 * Her kontrol satiri bir durum ikonu (basarili/basarisiz/bekliyor/calisiyor/
 * atlandi), ad, kisa aciklama, calisma suresi ve opsiyonel "Detay" baglantisi
 * tasir. Kart ustunde genel bir ozet (ornegin "3 basarili, 1 basarisiz") ve
 * gecti/toplam rozeti gosterilir. DeployLens PR ve derleme kontrolleri icin
 * uygundur.
 *
 * Sunumsal bir bilesendir (durum tutmaz); "Detay" icin href veya onClick alir.
 * loading=true iken iskelet (skeleton) satirlar render eder.
 */
import * as React from "react";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  MinusCircle,
  Timer,
  XCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type StatusCheckListStatus =
  | "success"
  | "failed"
  | "pending"
  | "running"
  | "skipped";

export interface StatusCheckListItem {
  /** Kontrol icin benzersiz kimlik (yoksa index kullanilir). */
  id?: string;
  /** Kontrol adi (orn. "Birim testleri"). */
  name: React.ReactNode;
  /** Kontrolun durumu. */
  status: StatusCheckListStatus;
  /** Kisa aciklama / bilgi satiri. */
  description?: React.ReactNode;
  /** Calisma suresi (orn. "1dk 12sn"). */
  duration?: React.ReactNode;
  /** "Detay" baglantisinin hedefi (verilirse <a> render edilir). */
  detailHref?: string;
  /** "Detay" tiklamasinda calisir (href yoksa <button> render edilir). */
  onDetailClick?: () => void;
  /** "Detay" baglanti etiketi (varsayilan "Detay"). */
  detailLabel?: React.ReactNode;
}

export interface StatusCheckListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Kart basligi (varsayilan "Kontroller"). */
  title?: React.ReactNode;
  /** Baslik altindaki aciklama. */
  description?: React.ReactNode;
  /** Kontrol satirlari. */
  checks: StatusCheckListItem[];
  /** Yukleniyor durumunda iskelet satirlar gosterir. */
  loading?: boolean;
  /** Iskelet satir sayisi (varsayilan 4). */
  skeletonRows?: number;
}

type StatusMeta = {
  label: string;
  icon: React.ReactNode;
  color: string;
  chip: string;
};

/** Durum -> etiket/ikon/renk eslesmesi (semantik tokenlar). */
const statusMeta: Record<StatusCheckListStatus, StatusMeta> = {
  success: {
    label: "başarılı",
    icon: <CheckCircle2 className="size-5" aria-hidden="true" />,
    color: "text-success",
    chip: "bg-success/10 text-success",
  },
  failed: {
    label: "başarısız",
    icon: <XCircle className="size-5" aria-hidden="true" />,
    color: "text-destructive",
    chip: "bg-destructive/10 text-destructive",
  },
  pending: {
    label: "bekliyor",
    icon: <Clock className="size-5" aria-hidden="true" />,
    color: "text-warning",
    chip: "bg-warning/10 text-warning",
  },
  running: {
    label: "çalışıyor",
    icon: <Loader2 className="size-5 animate-spin" aria-hidden="true" />,
    color: "text-info",
    chip: "bg-info/10 text-info",
  },
  skipped: {
    label: "atlandı",
    icon: <MinusCircle className="size-5" aria-hidden="true" />,
    color: "text-muted-foreground",
    chip: "bg-muted text-muted-foreground",
  },
};

/** Ozet ve sayimda kullanilan sabit durum sirasi. */
const statusOrder: StatusCheckListStatus[] = [
  "success",
  "failed",
  "running",
  "pending",
  "skipped",
];

const StatusCheckList = React.forwardRef<HTMLDivElement, StatusCheckListProps>(
  (
    {
      title = "Kontroller",
      description,
      checks,
      loading = false,
      skeletonRows = 4,
      className,
      ...props
    },
    ref,
  ) => {
    if (loading) {
      return (
        <Card ref={ref} className={cn("overflow-hidden", className)} {...props}>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
            <Skeleton className="size-10 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="divide-y divide-border">
              {Array.from({ length: Math.max(1, skeletonRows) }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 py-3">
                  <Skeleton className="size-5 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <Skeleton className="h-3 w-12" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      );
    }

    const counts = statusOrder.reduce<Record<StatusCheckListStatus, number>>(
      (acc, status) => {
        acc[status] = checks.filter((c) => c.status === status).length;
        return acc;
      },
      { success: 0, failed: 0, pending: 0, running: 0, skipped: 0 },
    );

    const total = checks.length;
    const summaryText = statusOrder
      .filter((status) => counts[status] > 0)
      .map((status) => `${counts[status]} ${statusMeta[status].label}`)
      .join(", ");

    // Genel durum tonu: once basarisiz, sonra devam eden, sonra basarili.
    const overall: StatusCheckListStatus =
      counts.failed > 0
        ? "failed"
        : counts.running > 0 || counts.pending > 0
          ? counts.running > 0
            ? "running"
            : "pending"
          : counts.success > 0
            ? "success"
            : "skipped";

    const overallHeadline =
      overall === "failed"
        ? "Bazı kontroller başarısız"
        : overall === "running" || overall === "pending"
          ? "Kontroller sürüyor"
          : overall === "success"
            ? "Tüm kontroller başarılı"
            : "Kontrol yok";

    return (
      <Card
        ref={ref}
        className={cn(
          "overflow-hidden transition-all duration-300 hover:shadow-md",
          className,
        )}
        {...props}
      >
        <CardHeader className="gap-3 space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg]:size-5",
                statusMeta[overall].chip,
              )}
              aria-hidden="true"
            >
              {statusMeta[overall].icon}
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <h3 className="truncate text-base font-semibold leading-none tracking-tight text-foreground">
                {title}
              </h3>
              <p className="truncate text-sm text-muted-foreground">
                {description ?? overallHeadline}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums",
                counts.failed > 0
                  ? "bg-destructive/10 text-destructive"
                  : counts.running > 0 || counts.pending > 0
                    ? "bg-warning/10 text-warning"
                    : "bg-success/10 text-success",
              )}
            >
              {counts.success}/{total} geçti
            </span>
          </div>
          {summaryText ? (
            <p className="text-xs font-medium text-muted-foreground">
              {summaryText}
            </p>
          ) : null}
        </CardHeader>

        <CardContent className="pt-0">
          <ul className="divide-y divide-border">
            {checks.map((check, index) => {
              const meta = statusMeta[check.status];
              const detailLabel = check.detailLabel ?? "Detay";
              const hasDetail = Boolean(check.detailHref || check.onDetailClick);
              return (
                <li
                  key={check.id ?? index}
                  className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors duration-200 hover:bg-muted/40"
                >
                  <span className={cn("shrink-0", meta.color)}>
                    {meta.icon}
                    <span className="sr-only">{meta.label}:</span>
                  </span>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="truncate text-sm font-medium text-foreground">
                      {check.name}
                    </div>
                    {check.description ? (
                      <div className="truncate text-xs text-muted-foreground">
                        {check.description}
                      </div>
                    ) : null}
                  </div>

                  {check.duration ? (
                    <span className="hidden shrink-0 items-center gap-1 text-xs tabular-nums text-muted-foreground sm:flex">
                      <Timer className="size-3.5" aria-hidden="true" />
                      {check.duration}
                    </span>
                  ) : null}

                  {hasDetail ? (
                    check.detailHref ? (
                      <a
                        href={check.detailHref}
                        className="inline-flex shrink-0 items-center gap-0.5 rounded-md text-xs font-medium text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                      >
                        {detailLabel}
                        <ChevronRight className="size-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={check.onDetailClick}
                        className="inline-flex shrink-0 items-center gap-0.5 rounded-md text-xs font-medium text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                      >
                        {detailLabel}
                        <ChevronRight className="size-3.5" aria-hidden="true" />
                      </button>
                    )
                  ) : null}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    );
  },
);
StatusCheckList.displayName = "StatusCheckList";

export { StatusCheckList };
