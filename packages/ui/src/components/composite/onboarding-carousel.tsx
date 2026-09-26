"use client";

/**
 * OnboardingCarousel — Ilk-acilis tanitim karuseli (mobil-ilk).
 * Tam-genislik slaytlar (ikon/gorsel + baslik + aciklama) yatay
 * scroll-snap ile akar; parmak kaydirma (swipe) natif calisir, klavye
 * ok tuslari (Sol/Sag/Home/End) ile de gezilir. Altta tiklanabilir
 * nokta gostergeleri, Atla ve Ileri butonlari; son slaytta baslangic
 * CTA'si (or. GlowScan/Randevu/Fisly ilk kurulum akislari) bulunur.
 */
import * as React from "react";
import { Check, ChevronRight } from "lucide-react";

import { cn, isRtl, logicalArrowKey } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface OnboardingCarouselSlide {
  /** Ust kisimda dairesel rozet icinde gosterilecek ikon. */
  icon?: React.ReactNode;
  /** Ikon yerine tam-genislik gorsel/ozel icerik. */
  media?: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
}

export interface OnboardingCarouselProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Slayt listesi. */
  slides: OnboardingCarouselSlide[];
  /** Baslangicta gosterilen slayt (0 tabanli). Varsayilan 0. */
  defaultIndex?: number;
  /** Aktif slayt degistiginde tetiklenir. */
  onIndexChange?: (index: number) => void;
  /** "Atla" tiklaninca tetiklenir. */
  onSkip?: () => void;
  /** Son slayttaki CTA tiklaninca tetiklenir. */
  onComplete?: () => void;
  /** Atla butonunu gosterir. Varsayilan true. */
  showSkip?: boolean;
  skipLabel?: string;
  nextLabel?: string;
  /** Son slayttaki baslangic butonu etiketi. */
  ctaLabel?: string;
  /** Karusel bolgesinin erisilebilir etiketi. */
  ariaLabel?: string;
}

const OnboardingCarousel = React.forwardRef<
  HTMLDivElement,
  OnboardingCarouselProps
>(
  (
    {
      slides,
      defaultIndex = 0,
      onIndexChange,
      onSkip,
      onComplete,
      showSkip = true,
      skipLabel = "Atla",
      nextLabel = "İleri",
      ctaLabel = "Başla",
      ariaLabel = "Tanıtım turu",
      className,
      ...props
    },
    ref
  ) => {
    const count = slides.length;
    const scrollerRef = React.useRef<HTMLDivElement>(null);
    const tickingRef = React.useRef(false);
    const [activeIndex, setActiveIndex] = React.useState(() =>
      Math.max(0, Math.min(defaultIndex, Math.max(0, count - 1)))
    );

    // Kontrollu geri cagirimi ref'te tut; efekt her render'da tetiklenmesin.
    const onIndexChangeRef = React.useRef(onIndexChange);
    React.useEffect(() => {
      onIndexChangeRef.current = onIndexChange;
    });
    React.useEffect(() => {
      onIndexChangeRef.current?.(activeIndex);
    }, [activeIndex]);

    // Baslangic konumunu animasyonsuz ayarla.
    React.useEffect(() => {
      const el = scrollerRef.current;
      if (el && activeIndex > 0) {
        // RTL kaydırma kabında scrollLeft başlangıçta 0, sona doğru negatiftir
        el.scrollLeft = activeIndex * el.clientWidth * (isRtl(el) ? -1 : 1);
      }
      // Yalnizca ilk montajda calisir.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const goTo = React.useCallback(
      (index: number) => {
        const el = scrollerRef.current;
        if (!el) return;
        const clamped = Math.max(0, Math.min(index, count - 1));
        el.scrollTo({
          left: clamped * el.clientWidth * (isRtl(el) ? -1 : 1),
          behavior: "smooth",
        });
      },
      [count]
    );

    const handleScroll = React.useCallback(() => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        tickingRef.current = false;
        const el = scrollerRef.current;
        if (!el || el.clientWidth === 0) return;
        const next = Math.round(Math.abs(el.scrollLeft) / el.clientWidth);
        setActiveIndex((prev) => (prev === next ? prev : next));
      });
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch (logicalArrowKey(event.key, event.currentTarget)) {
        case "ArrowRight":
          event.preventDefault();
          goTo(activeIndex + 1);
          break;
        case "ArrowLeft":
          event.preventDefault();
          goTo(activeIndex - 1);
          break;
        case "Home":
          event.preventDefault();
          goTo(0);
          break;
        case "End":
          event.preventDefault();
          goTo(count - 1);
          break;
        default:
          break;
      }
    };

    if (count === 0) return null;

    const isLast = activeIndex >= count - 1;

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-2xl border bg-card bg-sheen text-card-foreground shadow-lg",
          className
        )}
        {...props}
      >
        <div
          ref={scrollerRef}
          role="group"
          aria-roledescription="karusel"
          aria-label={ariaLabel}
          tabIndex={0}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          className="relative flex snap-x snap-mandatory overflow-x-auto scroll-smooth outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              role="group"
              aria-roledescription="slayt"
              aria-label={`${index + 1} / ${count}`}
              className="flex min-h-[19rem] w-full shrink-0 snap-center flex-col items-center justify-center px-8 py-10 text-center"
            >
              {slide.media ? (
                <div className="mb-6 w-full overflow-hidden rounded-xl">
                  {slide.media}
                </div>
              ) : slide.icon ? (
                <div
                  className="mb-6 flex size-20 items-center justify-center rounded-3xl bg-brand-gradient text-primary-foreground shadow-glow transition-transform duration-300 [&_svg]:size-9"
                  aria-hidden="true"
                >
                  {slide.icon}
                </div>
              ) : null}
              <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
                {slide.title}
              </h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {slide.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t bg-background/40 px-6 py-5">
          <div
            role="group"
            aria-label="Slayt göstergeleri"
            className="flex flex-wrap items-center justify-center gap-2 pointer-coarse:gap-0"
          >
            {slides.map((_, index) => {
              const active = index === activeIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`${index + 1}. slayta git`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    // Dokunmatik: nokta görseli aynı kalır, iç boşlukla 44px'lik hedef olur
                    "h-2 shrink-0 rounded-full transition-all duration-300 pointer-coarse:box-content pointer-coarse:bg-clip-content pointer-coarse:p-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                    active
                      ? "w-6 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  )}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4">
            {showSkip && !isLast ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => onSkip?.()}
                className="text-muted-foreground"
              >
                {skipLabel}
              </Button>
            ) : (
              <span aria-hidden="true" />
            )}

            {isLast ? (
              <Button type="button" onClick={() => onComplete?.()} className="gap-2">
                <Check className="size-4" aria-hidden="true" />
                {ctaLabel}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="gap-2"
              >
                {nextLabel}
                <ChevronRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);
OnboardingCarousel.displayName = "OnboardingCarousel";

export { OnboardingCarousel };
