/**
 * AppointmentCard — Randevu karti (Randevu).
 * Sol tarafta buyuk tarih/saat blogu (gun + ay + saat), ortada hizmet adi,
 * uzman/personel (avatar + isim + unvan), sure ve konum; sagda durum rozeti
 * (Onaylandi / Bekliyor / Iptal) ve eylemler (Yeniden planla / Iptal).
 * Sunumsal bilesen: eylem butonlari tuketici tarafindan onReschedule/onCancel
 * ile baglanir; loading durumunda Skeleton yer tutuculari render eder.
 */
import * as React from "react";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  MapPin,
  XCircle,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Randevu durumu — rozet rengi ve ikonunu belirler. */
export type AppointmentCardStatus = "confirmed" | "pending" | "cancelled";

interface AppointmentStatusConfig {
  label: string;
  icon: React.ReactNode;
  badge: string;
  dot: string;
}

const statusConfig: Record<AppointmentCardStatus, AppointmentStatusConfig> = {
  confirmed: {
    label: "Onaylandı",
    icon: <CheckCircle2 aria-hidden="true" />,
    badge: "bg-success/15 text-success",
    dot: "bg-success",
  },
  pending: {
    label: "Bekliyor",
    icon: <Clock aria-hidden="true" />,
    badge: "bg-warning/15 text-warning",
    dot: "bg-warning",
  },
  cancelled: {
    label: "İptal",
    icon: <XCircle aria-hidden="true" />,
    badge: "bg-destructive/15 text-destructive",
    dot: "bg-destructive",
  },
};

/** Sol tarih blogunun durum tonuna gore stil varyantlari. */
const dateBlockVariants = cva(
  "flex w-20 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-3 text-center transition-colors",
  {
    variants: {
      status: {
        confirmed: "bg-primary/10 text-primary",
        pending: "bg-warning/10 text-warning",
        cancelled: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      status: "confirmed",
    },
  }
);

/** "Ayşe Yılmaz" -> "AY" bas harflerini uretir. */
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase("tr-TR"))
    .join("");
}

export interface AppointmentCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof dateBlockVariants> {
  /** Randevu tarih ve saati. */
  date: Date;
  /** Hizmet/islem adi (or. "Sac Kesimi & Fon"). */
  service: string;
  /** Randevuyu verecek uzman/personel adi. */
  staffName: string;
  /** Uzman unvani/rolu (or. "Kidemli Kuafor"). */
  staffRole?: string;
  /** Uzman avatar gorsel adresi (opsiyonel; yoksa bas harfler). */
  staffAvatarSrc?: string;
  /** Randevu suresi (or. "45 dk"). */
  duration: React.ReactNode;
  /** Konum/sube bilgisi. */
  location: React.ReactNode;
  /** Randevu durumu. */
  status: AppointmentCardStatus;
  /** "Yeniden planla" eylemi; verilmezse buton gizlenir. */
  onReschedule?: React.MouseEventHandler<HTMLButtonElement>;
  /** "Iptal" eylemi; verilmezse buton gizlenir. */
  onCancel?: React.MouseEventHandler<HTMLButtonElement>;
  /** Yeniden planla buton metni. */
  rescheduleLabel?: string;
  /** Iptal buton metni. */
  cancelLabel?: string;
  /** Yukleme durumu (skeleton yer tutucular). */
  loading?: boolean;
}

const AppointmentCard = React.forwardRef<HTMLDivElement, AppointmentCardProps>(
  (
    {
      date,
      service,
      staffName,
      staffRole,
      staffAvatarSrc,
      duration,
      location,
      status,
      onReschedule,
      onCancel,
      rescheduleLabel = "Yeniden planla",
      cancelLabel = "İptal",
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-stretch",
            className
          )}
          {...props}
        >
          <Skeleton className="h-[76px] w-20 rounded-lg" />
          <div className="flex min-w-0 flex-1 flex-col gap-2 py-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
      );
    }

    const config = statusConfig[status];
    const isCancelled = status === "cancelled";

    const weekday = date.toLocaleDateString("tr-TR", { weekday: "short" });
    const day = date.toLocaleDateString("tr-TR", { day: "2-digit" });
    const month = date.toLocaleDateString("tr-TR", { month: "short" });
    const time = date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const ariaLabel = `${service}, ${staffName}, ${date.toLocaleDateString(
      "tr-TR",
      { day: "numeric", month: "long", weekday: "long" }
    )} ${time}, ${config.label}`;

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        className={cn(
          "flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 sm:flex-row sm:items-stretch",
          className
        )}
        {...props}
      >
        {/* Sol: tarih / saat blogu */}
        <div className={cn(dateBlockVariants({ status }))} aria-hidden="true">
          <span className="text-[11px] font-medium uppercase tracking-wide opacity-80">
            {weekday}
          </span>
          <span className="text-2xl font-bold leading-none tabular-nums">
            {day}
          </span>
          <span className="text-xs font-medium uppercase tracking-wide opacity-80">
            {month}
          </span>
          <span className="mt-1 flex items-center gap-1 text-xs font-semibold tabular-nums">
            <Clock className="size-3" aria-hidden="true" />
            {time}
          </span>
        </div>

        {/* Orta: hizmet + uzman + sure + konum */}
        <div className="min-w-0 flex-1 space-y-2">
          <h3
            className={cn(
              "truncate text-base font-semibold text-foreground",
              isCancelled && "text-muted-foreground line-through"
            )}
          >
            {service}
          </h3>

          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              {staffAvatarSrc ? (
                <AvatarImage src={staffAvatarSrc} alt={staffName} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                {getInitials(staffName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-medium text-foreground">
                {staffName}
              </div>
              {staffRole ? (
                <div className="truncate text-xs text-muted-foreground">
                  {staffRole}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 tabular-nums">
              <CalendarClock className="size-3.5" aria-hidden="true" />
              {duration}
            </span>
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{location}</span>
            </span>
          </div>
        </div>

        {/* Sag: durum rozeti + eylemler */}
        <div className="flex shrink-0 flex-row items-center justify-between gap-2 sm:flex-col sm:items-end sm:justify-start">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium [&_svg]:size-3.5 [&_svg]:shrink-0",
              config.badge
            )}
          >
            {config.icon}
            {config.label}
          </span>

          {!isCancelled && (onReschedule || onCancel) ? (
            <div className="flex items-center gap-2">
              {onReschedule ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onReschedule}
                >
                  <CalendarClock aria-hidden="true" />
                  {rescheduleLabel}
                </Button>
              ) : null}
              {onCancel ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  {cancelLabel}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);
AppointmentCard.displayName = "AppointmentCard";

export { AppointmentCard, dateBlockVariants as appointmentCardDateBlockVariants };
