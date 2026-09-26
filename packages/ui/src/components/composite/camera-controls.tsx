/**
 * CameraControls — Kamera kontrol cubugu (foto cekme alt bari).
 * Ortada buyuk yuvarlak deklansör (shutter) butonu, solda galeri/son-foto
 * kisayolu, sagda kamera cevir butonu ve ustte opsiyonel flas/zamanlayici
 * kontrolleri bulunur. Ekran altina sabitlenebilir (fixed). Tum butonlar
 * erisilebilir etiketlere, buyuk dokunma hedeflerine ve focus halkasina
 * sahiptir. GlowScan cilt taramasi ve Dolap urun fotografi cekme akislari icin.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Images, SwitchCamera, Timer, Zap, ZapOff } from "lucide-react";

import { cn } from "@/lib/utils";

export type CameraControlsFlashMode = "off" | "on" | "auto";

const cameraControlsVariants = cva(
  "flex w-full flex-col gap-3 border-t bg-background/95 px-6 pb-6 pt-4 backdrop-blur",
  {
    variants: {
      fixed: {
        true: "fixed inset-x-0 bottom-0 z-40",
        false: "relative",
      },
    },
    defaultVariants: {
      fixed: false,
    },
  }
);

const flashConfig: Record<
  CameraControlsFlashMode,
  { icon: React.ReactNode; label: string; tag: string; active: boolean }
> = {
  off: {
    icon: <ZapOff className="size-4" aria-hidden="true" />,
    label: "Flaş: kapalı",
    tag: "Kapalı",
    active: false,
  },
  on: {
    icon: <Zap className="size-4" aria-hidden="true" />,
    label: "Flaş: açık",
    tag: "Açık",
    active: true,
  },
  auto: {
    icon: <Zap className="size-4" aria-hidden="true" />,
    label: "Flaş: otomatik",
    tag: "Oto",
    active: true,
  },
};

export interface CameraControlsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof cameraControlsVariants> {
  /** Deklansör (shutter) butonuna basildiginda tetiklenir. */
  onCapture?: () => void;
  /** Deklansör butonunun erisilebilir etiketi. Varsayilan "Fotoğraf çek". */
  captureLabel?: string;
  /** Soldaki galeri/son-foto kisayolu icerigi (or. son cekilen fotograf). */
  galleryThumbnail?: React.ReactNode;
  /** Galeri butonunun erisilebilir etiketi. Varsayilan "Galeriyi aç". */
  galleryLabel?: string;
  /** Galeri butonuna basildiginda tetiklenir. */
  onOpenGallery?: () => void;
  /** Sagdaki kamera cevir butonuna basildiginda tetiklenir. */
  onFlipCamera?: () => void;
  /** Kamera cevir butonunun erisilebilir etiketi. Varsayilan "Kamerayı çevir". */
  flipLabel?: string;
  /** Tanimlanirsa ust satirda flas kontrolu gosterilir. */
  flash?: CameraControlsFlashMode;
  /** Flas butonuna basildiginda tetiklenir (mod dongusu tuketicide yonetilir). */
  onFlashToggle?: () => void;
  /** Tanimlanirsa ust satirda zamanlayici kontrolu gosterilir. 0 = kapali. */
  timerSeconds?: number;
  /** Zamanlayici butonuna basildiginda tetiklenir. */
  onTimerToggle?: () => void;
  /** Tum kontrolleri devre disi birakir. */
  disabled?: boolean;
}

const CameraControls = React.forwardRef<HTMLDivElement, CameraControlsProps>(
  (
    {
      onCapture,
      captureLabel = "Fotoğraf çek",
      galleryThumbnail,
      galleryLabel = "Galeriyi aç",
      onOpenGallery,
      onFlipCamera,
      flipLabel = "Kamerayı çevir",
      flash,
      onFlashToggle,
      timerSeconds,
      onTimerToggle,
      disabled = false,
      fixed,
      className,
      ...props
    },
    ref
  ) => {
    const hasOptionsRow = flash !== undefined || timerSeconds !== undefined;
    const flashState = flash ? flashConfig[flash] : null;
    const timerActive = timerSeconds !== undefined && timerSeconds > 0;
    const timerLabel = timerActive
      ? `Zamanlayıcı: ${timerSeconds} saniye`
      : "Zamanlayıcı: kapalı";

    const optionButton =
      "inline-flex items-center gap-1.5 rounded-full border pointer-coarse:min-h-11 pointer-coarse:min-w-11 px-3 py-1.5 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40";

    return (
      <div
        ref={ref}
        role="toolbar"
        aria-label="Kamera kontrolleri"
        aria-orientation="horizontal"
        className={cn(cameraControlsVariants({ fixed }), className)}
        {...props}
      >
        {hasOptionsRow ? (
          <div className="flex items-center justify-center gap-2">
            {flashState ? (
              <button
                type="button"
                disabled={disabled}
                aria-pressed={flashState.active}
                aria-label={flashState.label}
                onClick={onFlashToggle}
                className={cn(
                  optionButton,
                  flashState.active
                    ? "border-transparent bg-warning/15 text-warning"
                    : "bg-muted/40 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {flashState.icon}
                <span aria-hidden="true">{flashState.tag}</span>
              </button>
            ) : null}
            {timerSeconds !== undefined ? (
              <button
                type="button"
                disabled={disabled}
                aria-pressed={timerActive}
                aria-label={timerLabel}
                onClick={onTimerToggle}
                className={cn(
                  optionButton,
                  timerActive
                    ? "border-transparent bg-primary/15 text-primary"
                    : "bg-muted/40 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Timer className="size-4" aria-hidden="true" />
                <span className="tabular-nums" aria-hidden="true">
                  {timerActive ? `${timerSeconds}s` : "Kapalı"}
                </span>
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="grid grid-cols-3 items-center">
          <div className="justify-self-start">
            <button
              type="button"
              disabled={disabled}
              aria-label={galleryLabel}
              onClick={onOpenGallery}
              className="flex size-12 items-center justify-center overflow-hidden rounded-2xl border bg-muted/50 text-muted-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-ring/60 hover:text-foreground hover:shadow-md active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40"
            >
              {galleryThumbnail ?? (
                <Images className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="justify-self-center">
            <button
              type="button"
              disabled={disabled}
              aria-label={captureLabel}
              onClick={onCapture}
              className="group relative flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow ring-4 ring-primary/20 transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
            >
              <span
                aria-hidden="true"
                className="absolute inset-1.5 rounded-full ring-2 ring-inset ring-primary-foreground/50 transition-all duration-200 group-active:inset-2.5"
              />
            </button>
          </div>

          <div className="justify-self-end">
            <button
              type="button"
              disabled={disabled}
              aria-label={flipLabel}
              onClick={onFlipCamera}
              className="flex size-12 items-center justify-center rounded-full border bg-muted/50 text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-ring/60 hover:bg-accent hover:text-accent-foreground hover:shadow-md active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40"
            >
              <SwitchCamera className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);
CameraControls.displayName = "CameraControls";

export { CameraControls, cameraControlsVariants };
