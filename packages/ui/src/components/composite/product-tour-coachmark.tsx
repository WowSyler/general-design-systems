"use client";

/**
 * ProductTourCoachmark — Urun turu balonu (spotlight + isaretci popover).
 * Onboarding gezintisinde hedef ogeyi vurgular: opsiyonel karartma scrim +
 * hedefi ceviren isik halkasi, yonlu ok, baslik + aciklama, adim gostergesi
 * (nokta + "2 / 5"), Geri / Ileri / Atla eylemleri. Hedef bir CSS secici veya
 * ref ile cozulur; konum top/bottom/left/right ile ayarlanir.
 * Erisilebilir: role=dialog + aria-modal, baslik/aciklama baglari, klavye
 * (Escape = atla, Ok saglari/sol = ileri/geri), acilista odak balona gelir.
 * Tema-agnostik: yalnizca semantik tokenlar kullanilir.
 */
import * as React from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";

import { cn, logicalArrowKey } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Balonun hedefe gore konumu. */
export type ProductTourPlacement = "top" | "bottom" | "left" | "right";

/** Hedef oge referansi: CSS secici ya da element ref'i. */
export type ProductTourTarget =
  | string
  | React.RefObject<HTMLElement | null>;

export interface ProductTourStep {
  /** Vurgulanacak hedef: "#kimlik" secici ya da bir element ref'i. */
  target: ProductTourTarget;
  /** Balon basligi. */
  title: React.ReactNode;
  /** Aciklama metni. */
  description: React.ReactNode;
  /** Bu adim icin konum (varsayilan: bilesenin placement prop'u). */
  placement?: ProductTourPlacement;
}

export interface ProductTourCoachmarkProps {
  /** Sirali tur adimlari. */
  steps: ProductTourStep[];
  /** Turun acik olup olmadigi (kontrollu). */
  open?: boolean;
  /** Baslangicta acik mi (kontrolsuz). */
  defaultOpen?: boolean;
  /** Acik durumu degisince tetiklenir. */
  onOpenChange?: (open: boolean) => void;
  /** Aktif adim indeksi (kontrollu, 0 tabanli). */
  step?: number;
  /** Baslangic adimi (kontrolsuz). */
  defaultStep?: number;
  /** Aktif adim degisince tetiklenir. */
  onStepChange?: (step: number) => void;
  /** Hedef disini karartan scrim + tiklama engeli gosterir. */
  overlay?: boolean;
  /** Tum konumlar icin varsayilan yerlesim. */
  placement?: ProductTourPlacement;
  /** Son adim tamamlaninca ("Bitir") tetiklenir. */
  onFinish?: () => void;
  /** "Atla" ya da Escape ile kapatilinca tetiklenir. */
  onSkip?: () => void;
  /** Buton/eylem etiketleri (i18n icin). */
  labels?: Partial<{
    back: string;
    next: string;
    finish: string;
    skip: string;
    close: string;
  }>;
  className?: string;
}

/** Hedef ile balon arasindaki bosluk (px). */
const GAP = 14;
/** Vurgu halkasinin hedefe eklediigi ic bosluk (px). */
const PAD = 8;
/** Ekran kenarindan korunan pay (px). */
const MARGIN = 12;
/** Sabit balon genisligi (px). */
const CARD_WIDTH = 320;

type Rect = { top: number; left: number; width: number; height: number };

const defaultLabels = {
  back: "Geri",
  next: "Ileri",
  finish: "Bitir",
  skip: "Atla",
  close: "Kapat",
};

function resolveTarget(target: ProductTourTarget): HTMLElement | null {
  if (typeof window === "undefined") return null;
  if (typeof target === "string") {
    return document.querySelector<HTMLElement>(target);
  }
  return target.current ?? null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export const ProductTourCoachmark = React.forwardRef<
  HTMLDivElement,
  ProductTourCoachmarkProps
>(
  (
    {
      steps,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      step: stepProp,
      defaultStep = 0,
      onStepChange,
      overlay = true,
      placement = "bottom",
      onFinish,
      onSkip,
      labels,
      className,
    },
    ref,
  ) => {
    const [openState, setOpenState] = React.useState(defaultOpen);
    const [stepState, setStepState] = React.useState(defaultStep);
    const [rect, setRect] = React.useState<Rect | null>(null);
    const cardRef = React.useRef<HTMLDivElement>(null);
    const baseId = React.useId();
    const titleId = `${baseId}-title`;
    const descId = `${baseId}-desc`;

    const open = openProp ?? openState;
    const total = steps.length;
    const currentStep = clamp(stepProp ?? stepState, 0, Math.max(0, total - 1));
    const activeStep = steps[currentStep];
    const l = { ...defaultLabels, ...labels };

    const setOpen = React.useCallback(
      (next: boolean) => {
        setOpenState(next);
        onOpenChange?.(next);
      },
      [onOpenChange],
    );

    const setStep = React.useCallback(
      (next: number) => {
        setStepState(next);
        onStepChange?.(next);
      },
      [onStepChange],
    );

    // Hedefin viewport konumunu olcer; acilis, adim, scroll ve resize'da yeniler.
    React.useLayoutEffect(() => {
      if (!open || !activeStep) return;

      const measure = () => {
        const el = resolveTarget(activeStep.target);
        if (!el) {
          setRect(null);
          return;
        }
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      };

      measure();
      window.addEventListener("resize", measure);
      window.addEventListener("scroll", measure, true);
      return () => {
        window.removeEventListener("resize", measure);
        window.removeEventListener("scroll", measure, true);
      };
    }, [open, activeStep, currentStep]);

    // Acilis / adim degisiminde odagi balona tasi.
    React.useEffect(() => {
      if (open && cardRef.current) {
        cardRef.current.focus();
      }
    }, [open, currentStep]);

    if (!open || total === 0 || !activeStep) return null;

    const isFirst = currentStep === 0;
    const isLast = currentStep === total - 1;
    const stepPlacement = activeStep.placement ?? placement;

    const handleNext = () => {
      if (isLast) {
        setOpen(false);
        onFinish?.();
        return;
      }
      setStep(currentStep + 1);
    };

    const handleBack = () => {
      if (!isFirst) setStep(currentStep - 1);
    };

    const handleSkip = () => {
      setOpen(false);
      onSkip?.();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const key = logicalArrowKey(event.key, event.currentTarget);
      if (key === "Escape") {
        event.preventDefault();
        handleSkip();
      } else if (key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      } else if (key === "ArrowLeft") {
        event.preventDefault();
        handleBack();
      }
    };

    // Konum hesaplari (viewport, position: fixed).
    const vw = typeof window !== "undefined" ? window.innerWidth : CARD_WIDTH;
    const spot = rect
      ? {
          top: rect.top - PAD,
          left: rect.left - PAD,
          width: rect.width + PAD * 2,
          height: rect.height + PAD * 2,
        }
      : null;

    let cardStyle: React.CSSProperties;
    let arrowStyle: React.CSSProperties;
    const arrowBase =
      "absolute size-3 rotate-45 border bg-popover shadow-sm";

    if (spot) {
      const centerX = spot.left + spot.width / 2;
      const centerY = spot.top + spot.height / 2;

      if (stepPlacement === "top" || stepPlacement === "bottom") {
        const left = clamp(
          centerX - CARD_WIDTH / 2,
          MARGIN,
          Math.max(MARGIN, vw - CARD_WIDTH - MARGIN),
        );
        const arrowLeft = clamp(centerX - left, 20, CARD_WIDTH - 20);
        if (stepPlacement === "bottom") {
          cardStyle = { top: spot.top + spot.height + GAP, left };
          arrowStyle = {
            top: -6,
            left: arrowLeft,
            marginLeft: -6,
            borderRight: "0",
            borderBottom: "0",
          };
        } else {
          cardStyle = {
            top: spot.top - GAP,
            left,
            transform: "translateY(-100%)",
          };
          arrowStyle = {
            bottom: -6,
            left: arrowLeft,
            marginLeft: -6,
            borderLeft: "0",
            borderTop: "0",
          };
        }
      } else if (stepPlacement === "right") {
        cardStyle = {
          top: centerY,
          left: spot.left + spot.width + GAP,
          transform: "translateY(-50%)",
        };
        arrowStyle = {
          left: -6,
          top: "50%",
          marginTop: -6,
          borderRight: "0",
          borderTop: "0",
        };
      } else {
        cardStyle = {
          top: centerY,
          left: spot.left - GAP,
          transform: "translate(-100%, -50%)",
        };
        arrowStyle = {
          right: -6,
          top: "50%",
          marginTop: -6,
          borderLeft: "0",
          borderBottom: "0",
        };
      }
    } else {
      // Hedef bulunamazsa balonu ekran ortasinda goster (guvenli geri donus).
      cardStyle = {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
      arrowStyle = { display: "none" };
    }

    return (
      <div
        ref={ref}
        className={cn("fixed inset-0 z-50", className)}
        data-slot="product-tour-coachmark"
      >
        {/* Karartma scrim + tiklama engeli */}
        {overlay ? (
          <div
            aria-hidden="true"
            onClick={handleSkip}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-[1px] animate-fade-up"
          />
        ) : null}

        {/* Hedefi ceviren isik halkasi (scrim ustunde, hedef gorunur kalir) */}
        {spot ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute rounded-lg ring-2 ring-primary/80 ring-offset-2 ring-offset-transparent shadow-glow transition-all duration-300"
            style={{
              top: spot.top,
              left: spot.left,
              width: spot.width,
              height: spot.height,
            }}
          />
        ) : null}

        {/* Isaretci balon */}
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          style={{ position: "fixed", width: CARD_WIDTH, maxWidth: "calc(100vw - 1.5rem)", ...cardStyle }}
          className="z-10 rounded-xl border bg-popover p-4 text-popover-foreground shadow-xl outline-none animate-fade-up"
        >
          <span aria-hidden="true" className={cn(arrowBase)} style={arrowStyle} />

          <div className="flex items-start justify-between gap-3">
            <h2
              id={titleId}
              className="font-display text-base font-semibold leading-tight text-foreground"
            >
              {activeStep.title}
            </h2>
            <button
              type="button"
              onClick={handleSkip}
              aria-label={l.close}
              className="-me-1 -mt-1 rounded-md p-1 touch-hitbox text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <p
            id={descId}
            className="mt-1.5 text-sm leading-relaxed text-muted-foreground"
          >
            {activeStep.description}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            {/* Adim gostergesi */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                {steps.map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      index === currentStep
                        ? "w-4 bg-primary"
                        : index < currentStep
                          ? "w-1.5 bg-primary/50"
                          : "w-1.5 bg-muted",
                    )}
                  />
                ))}
              </div>
              <span className="text-xs font-medium tabular-nums text-muted-foreground">
                {currentStep + 1} / {total}
              </span>
            </div>

            {/* Eylemler */}
            <div className="flex items-center gap-2">
              {isFirst ? (
                <Button variant="ghost" size="sm" onClick={handleSkip}>
                  {l.skip}
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  <ArrowLeft className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
                  {l.back}
                </Button>
              )}
              <Button size="sm" onClick={handleNext}>
                {isLast ? (
                  <>
                    <Check className="size-3.5" aria-hidden="true" />
                    {l.finish}
                  </>
                ) : (
                  <>
                    {l.next}
                    <ArrowRight className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
ProductTourCoachmark.displayName = "ProductTourCoachmark";
