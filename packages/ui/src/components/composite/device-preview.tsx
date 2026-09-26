"use client";

/**
 * DevicePreview — Çok-cihaz önizleme aracı (responsive vitrin/geliştirme).
 * Üstte cihaz seçici (Telefon / Tablet / Masaüstü segment kontrolü) yer alır;
 * seçilen cihaza göre içerik, genişliği sınırlandırılmış bir çerçeve içinde
 * ortalanarak sunulur (telefon 390px, tablet 820px, masaüstü tam genişlik).
 * Çerçeve akışkandır: dar ekranlarda `max-w-full` ile küçülür ve genişlik
 * değişimi yumuşak bir geçişle canlandırılır. Kontrollü (device/onDeviceChange)
 * veya kontrolsüz (defaultDevice) olarak kullanılabilir.
 */
import * as React from "react";
import { Smartphone, Tablet, Monitor } from "lucide-react";

import { cn } from "@/lib/utils";

export type DevicePreviewDevice = "phone" | "tablet" | "desktop";

interface DeviceConfig {
  value: DevicePreviewDevice;
  label: string;
  icon: React.ReactNode;
  /** Çerçevenin maksimum genişliği (px); null ise tam genişlik. */
  width: number | null;
}

const DEVICES: DeviceConfig[] = [
  {
    value: "phone",
    label: "Telefon",
    icon: <Smartphone aria-hidden="true" />,
    width: 390,
  },
  {
    value: "tablet",
    label: "Tablet",
    icon: <Tablet aria-hidden="true" />,
    width: 820,
  },
  {
    value: "desktop",
    label: "Masaüstü",
    icon: <Monitor aria-hidden="true" />,
    width: null,
  },
];

export interface DevicePreviewProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Kontrollü seçili cihaz. */
  device?: DevicePreviewDevice;
  /** Kontrolsüz kullanımda başlangıç cihazı. Varsayılan "phone". */
  defaultDevice?: DevicePreviewDevice;
  /** Cihaz değiştiğinde tetiklenir. */
  onDeviceChange?: (device: DevicePreviewDevice) => void;
  /** Aktif cihaz/genişlik etiketini gösterir. Varsayılan true. */
  showWidthLabel?: boolean;
  /** Üstteki cihaz seçici araç çubuğunu gizler. */
  hideToolbar?: boolean;
  /** Araç çubuğunun sağına eklenecek ek içerik (ör. yenile düğmesi). */
  toolbarExtra?: React.ReactNode;
  /** İç çerçeveye uygulanacak ek sınıf. */
  frameClassName?: string;
}

const DevicePreview = React.forwardRef<HTMLDivElement, DevicePreviewProps>(
  (
    {
      device,
      defaultDevice = "phone",
      onDeviceChange,
      showWidthLabel = true,
      hideToolbar = false,
      toolbarExtra,
      frameClassName,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isControlled = device !== undefined;
    const [internalDevice, setInternalDevice] =
      React.useState<DevicePreviewDevice>(defaultDevice);
    const current = isControlled ? device : internalDevice;

    const setDevice = React.useCallback(
      (next: DevicePreviewDevice) => {
        if (!isControlled) setInternalDevice(next);
        onDeviceChange?.(next);
      },
      [isControlled, onDeviceChange]
    );

    const active =
      DEVICES.find((d) => d.value === current) ?? DEVICES[DEVICES.length - 1]!;

    const widthLabel = active.width
      ? `${active.label} · ${active.width}px`
      : `${active.label} · Tam genişlik`;

    return (
      <div ref={ref} className={cn("w-full min-w-0", className)} {...props}>
        {!hideToolbar ? (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div
              role="group"
              aria-label="Cihaz seçimi"
              className="inline-flex rounded-lg bg-muted p-1"
            >
              {DEVICES.map((d) => {
                const isActive = d.value === active.value;
                return (
                  <button
                    key={d.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setDevice(d.value)}
                    className={cn(
                      "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4 [&_svg]:shrink-0 sm:min-h-0",
                      isActive
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {d.icon}
                    <span>{d.label}</span>
                  </button>
                );
              })}
            </div>

            {showWidthLabel || toolbarExtra ? (
              <div className="flex items-center gap-3">
                {showWidthLabel ? (
                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {widthLabel}
                  </span>
                ) : null}
                {toolbarExtra}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="relative flex w-full justify-center overflow-x-auto rounded-xl border border-border bg-muted/30 p-3 sm:p-6">
          <div
            style={{
              maxWidth: active.width ? `${active.width}px` : "100%",
            }}
            className={cn(
              "w-full max-w-full overflow-hidden rounded-lg border border-border bg-background shadow-sm transition-[max-width] duration-300 ease-out",
              frameClassName
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);
DevicePreview.displayName = "DevicePreview";

export { DevicePreview };
