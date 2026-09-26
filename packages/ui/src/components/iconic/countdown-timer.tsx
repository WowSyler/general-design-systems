"use client";

/**
 * CountdownTimer — hedef tarihe geri sayan imza bileseni.
 * Kalan sureyi gun/saat/dakika/saniye olarak ya ayri kutucuklarda
 * (buyuk `tabular-nums` + etiket, "blocks"), tek satir kompakt
 * ("inline") ya da marka gradyanli bir bant icinde ("banner") gosterir.
 * Her saniye `window.setInterval` ile tazelenir; hedefe ulasildiginda
 * `onComplete` bir kez tetiklenir ve "Sona erdi" durumuna gecer.
 * Erisilebilirlik: kok `role="timer"`; gorsel rakamlar `aria-hidden`,
 * ekran okuyuculara `sr-only` bir ozet sunulur. Dolap flash kampanya,
 * Randevu "randevuna X kaldi" senaryolari icin uygundur.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Clock, Hourglass } from "lucide-react";

import { cn } from "@/lib/utils";

type CountdownTimerUnitKey = "days" | "hours" | "minutes" | "seconds";

const defaultLabels: Record<CountdownTimerUnitKey, string> = {
  days: "Gün",
  hours: "Saat",
  minutes: "Dakika",
  seconds: "Saniye",
};

const blockNumber = cva(
  "font-display font-bold leading-none tabular-nums",
  {
    variants: {
      size: {
        sm: "text-xl",
        md: "text-2xl sm:text-3xl",
        lg: "text-3xl sm:text-5xl",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const blockBox = cva(
  "flex flex-col items-center justify-center rounded-lg border transition-colors duration-200",
  {
    variants: {
      size: {
        sm: "min-w-[2.75rem] px-2 py-1.5",
        // Dar ekranda (<640px) bir kademe küçülür — 4 kutu 320px'e sığar
        md: "min-w-[3rem] px-2 py-2 sm:min-w-[3.75rem] sm:px-3 sm:py-2.5",
        lg: "min-w-[3.5rem] px-2 py-2.5 sm:min-w-[5rem] sm:px-4 sm:py-3.5",
      },
      tone: {
        surface: "border-border bg-muted/60 text-foreground",
        gradient: "border-white/20 bg-white/15 text-primary-foreground",
      },
    },
    defaultVariants: { size: "md", tone: "surface" },
  },
);

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function toTimestamp(to: Date | number | string): number {
  return to instanceof Date ? to.getTime() : new Date(to).getTime();
}

export interface CountdownTimerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof blockNumber> {
  /** Geri sayilacak hedef tarih (Date, epoch ms ya da ISO metin). */
  to: Date | number | string;
  /** Yerlesim bicimi. blocks: kutucuklar, inline: kompakt satir, banner: gradyan bant. */
  variant?: "blocks" | "inline" | "banner";
  /** Kutucuk boyutu (blocks/banner). */
  size?: "sm" | "md" | "lg";
  /** Gun kutusunu gizle (kisa kampanyalar icin). */
  hideDays?: boolean;
  /** Birim etiketlerini ozellestir. */
  labels?: Partial<Record<CountdownTimerUnitKey, string>>;
  /** Geri sayim bitince bir kez cagrilir. */
  onComplete?: () => void;
  /** Bitis durumunda gosterilecek metin. Varsayilan "Sona erdi". */
  completedLabel?: React.ReactNode;
  /** banner varyantinda sol tarafta gosterilen ikon. */
  icon?: React.ReactNode;
  /** banner varyantinda ust baslik. */
  title?: React.ReactNode;
  /** banner varyantinda baslik alti aciklama. */
  description?: React.ReactNode;
}

const CountdownTimer = React.forwardRef<HTMLDivElement, CountdownTimerProps>(
  (
    {
      to,
      variant = "blocks",
      size = "md",
      hideDays = false,
      labels,
      onComplete,
      completedLabel = "Sona erdi",
      icon,
      title,
      description,
      className,
      ...props
    },
    ref,
  ) => {
    const target = React.useMemo(() => toTimestamp(to), [to]);

    // onComplete'i ref'te tutuyoruz: her render'da yeni fonksiyon gelse bile
    // interval yeniden kurulmaz (yalnizca hedef degisince).
    const onCompleteRef = React.useRef(onComplete);
    React.useEffect(() => {
      onCompleteRef.current = onComplete;
    });

    const [remaining, setRemaining] = React.useState<number>(() =>
      Math.max(0, target - Date.now()),
    );

    React.useEffect(() => {
      let fired = false;
      const tick = () => {
        const next = Math.max(0, target - Date.now());
        setRemaining(next);
        if (next <= 0 && !fired) {
          fired = true;
          onCompleteRef.current?.();
        }
      };

      tick();
      if (target - Date.now() <= 0) return;

      const id = window.setInterval(tick, 1000);
      return () => window.clearInterval(id);
    }, [target]);

    const isComplete = remaining <= 0;
    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const resolvedLabels = { ...defaultLabels, ...labels };

    const units: Array<{ key: CountdownTimerUnitKey; value: number }> = [
      ...(hideDays ? [] : [{ key: "days" as const, value: days }]),
      { key: "hours", value: hours },
      { key: "minutes", value: minutes },
      { key: "seconds", value: seconds },
    ];

    const srText = isComplete
      ? typeof completedLabel === "string"
        ? completedLabel
        : "Sona erdi"
      : `Kalan süre: ${hideDays ? "" : `${days} gün `}${hours} saat ${minutes} dakika ${seconds} saniye`;

    const completedPill = (
      <span
        aria-hidden="true"
        className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-semibold text-muted-foreground"
      >
        <Clock className="size-4" />
        {completedLabel}
      </span>
    );

    const renderBlocks = (tone: "surface" | "gradient") => (
      <div
        aria-hidden="true"
        className="flex max-w-full items-start gap-1 sm:gap-2.5"
      >
        {units.map((unit, index) => (
          <React.Fragment key={unit.key}>
            {index > 0 ? (
              <span
                className={cn(
                  blockNumber({ size }),
                  "pt-1 opacity-40",
                  tone === "gradient" ? "text-primary-foreground" : "text-muted-foreground",
                )}
              >
                :
              </span>
            ) : null}
            <div className={cn(blockBox({ size, tone }))}>
              <span className={cn(blockNumber({ size }))}>{pad2(unit.value)}</span>
              <span
                className={cn(
                  "mt-1 text-[10px] font-medium uppercase tracking-wide",
                  tone === "gradient"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground",
                )}
              >
                {resolvedLabels[unit.key]}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    );

    // --- inline varyant -------------------------------------------------
    if (variant === "inline") {
      return (
        <div
          ref={ref}
          role="timer"
          aria-live="off"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium text-foreground",
            className,
          )}
          {...props}
        >
          <span className="sr-only">{srText}</span>
          {isComplete ? (
            <span aria-hidden="true" className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Clock className="size-3.5" />
              {completedLabel}
            </span>
          ) : (
            <span aria-hidden="true" className="inline-flex items-center gap-1.5">
              <Hourglass className="size-3.5 text-primary" />
              <span className="tabular-nums">
                {!hideDays && days > 0 ? `${days}g ` : ""}
                {pad2(hours)}:{pad2(minutes)}:{pad2(seconds)}
              </span>
            </span>
          )}
        </div>
      );
    }

    // --- banner varyant -------------------------------------------------
    if (variant === "banner") {
      return (
        <div
          ref={ref}
          role="timer"
          aria-live="off"
          className={cn(
            "relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-xl bg-brand-gradient bg-sheen px-5 py-4 text-primary-foreground shadow-lg",
            className,
          )}
          {...props}
        >
          <span className="sr-only">
            {title ? `${title}. ` : ""}
            {srText}
          </span>
          <div aria-hidden="true" className="flex min-w-0 items-center gap-3">
            {icon ? (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/15 [&>svg]:size-5">
                {icon}
              </span>
            ) : null}
            <div className="min-w-0">
              {title ? (
                <p className="truncate font-display text-base font-bold leading-tight">
                  {title}
                </p>
              ) : null}
              {description ? (
                <p className="truncate text-sm text-primary-foreground/80">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
          {isComplete ? (
            <span
              aria-hidden="true"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-sm font-semibold"
            >
              <Clock className="size-4" />
              {completedLabel}
            </span>
          ) : (
            renderBlocks("gradient")
          )}
        </div>
      );
    }

    // --- blocks varyant (varsayilan) ------------------------------------
    return (
      <div
        ref={ref}
        role="timer"
        aria-live="off"
        className={cn("inline-flex flex-col gap-2", className)}
        {...props}
      >
        <span className="sr-only">{srText}</span>
        {isComplete ? completedPill : renderBlocks("surface")}
      </div>
    );
  },
);
CountdownTimer.displayName = "CountdownTimer";

export { CountdownTimer };
