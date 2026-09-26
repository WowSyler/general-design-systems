"use client";

/**
 * Carousel + CarouselItem — genel amacli yatay karusel (embla YOK).
 * Slaytlar CSS scroll-snap ile akar; parmak kaydirma (swipe) natif
 * calisir, per-view responsive olarak 1/2/3 oge gorunur. Onceki/Sonraki
 * ok butonlari uclarda pasiflesir (loop acikken sarar), altta tiklanabilir
 * nokta gostergeleri bulunur. Opsiyonel autoplay hover/odak sirasinda
 * duraklar ve prefers-reduced-motion'a saygi gosterir. Klavye (Sol/Sag/
 * Home/End) ile gezilir, bolge aria-roledescription="karusel" ile
 * etiketlenir. Dolap urun vitrini/galerisi ve GlowScan urun onerileri
 * gibi akislar icin uygundur. Cocuk olarak CarouselItem alir.
 */
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn, isRtl, logicalArrowKey } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Sabit sayi ya da kirilim bazli gorunur oge sayisi. */
export type CarouselPerView =
  | number
  | { base?: number; sm?: number; lg?: number };

interface CarouselContextValue {
  perView: number;
  gap: number;
}

const CarouselContext = React.createContext<CarouselContextValue>({
  perView: 1,
  gap: 16,
});

export interface CarouselItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Carousel tarafindan otomatik enjekte edilir (0 tabanli). */
  index?: number;
  /** Carousel tarafindan otomatik enjekte edilir (toplam slayt). */
  total?: number;
}

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, style, index, total, ...props }, ref) => {
    const { perView, gap } = React.useContext(CarouselContext);
    const width = `calc((100% - ${(perView - 1) * gap}px) / ${perView})`;
    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slayt"
        aria-label={
          index != null && total != null ? `${index + 1} / ${total}` : undefined
        }
        className={cn("relative shrink-0 snap-start", className)}
        style={{ flex: "0 0 auto", width, ...style }}
        {...props}
      />
    );
  }
);
CarouselItem.displayName = "CarouselItem";

export interface CarouselProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Gorunur oge sayisi. Sayi ya da {base, sm, lg}. Varsayilan {base:1, sm:2, lg:3}. */
  perView?: CarouselPerView;
  /** Ogeler arasi bosluk (px). Varsayilan 16. */
  gap?: number;
  /** Uclara gelince basa/sona sarar; ok butonlari pasiflesmez. */
  loop?: boolean;
  /** Otomatik ilerleme. */
  autoplay?: boolean;
  /** Autoplay araligi (ms). Varsayilan 4000. */
  autoplayInterval?: number;
  /** Ok butonlarini gosterir. Varsayilan true. */
  showArrows?: boolean;
  /** Nokta gostergelerini gosterir. Varsayilan true. */
  showDots?: boolean;
  /** Baslangic konumu (0 tabanli). Varsayilan 0. */
  defaultIndex?: number;
  /** Aktif konum degistiginde tetiklenir. */
  onIndexChange?: (index: number) => void;
  /** Karusel bolgesinin erisilebilir etiketi. */
  ariaLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
  /** Kayan bolge (viewport) icin ek sinif. */
  viewportClassName?: string;
}

function resolvePerView(config: CarouselPerView, width: number): number {
  if (typeof config === "number") return Math.max(1, config);
  const base = config.base ?? 1;
  const sm = config.sm ?? base;
  const lg = config.lg ?? sm;
  if (width >= 1024) return Math.max(1, lg);
  if (width >= 640) return Math.max(1, sm);
  return Math.max(1, base);
}

function getStep(el: HTMLElement, gap: number): number {
  const first = el.children[0] as HTMLElement | undefined;
  if (!first) return 0;
  if (el.children.length >= 2) {
    const second = el.children[1] as HTMLElement;
    return second.offsetLeft - first.offsetLeft;
  }
  return first.offsetWidth + gap;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      perView = { base: 1, sm: 2, lg: 3 },
      gap = 16,
      loop = false,
      autoplay = false,
      autoplayInterval = 4000,
      showArrows = true,
      showDots = true,
      defaultIndex = 0,
      onIndexChange,
      ariaLabel = "Karusel",
      prevLabel = "Önceki",
      nextLabel = "Sonraki",
      viewportClassName,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const scrollerRef = React.useRef<HTMLDivElement>(null);
    const tickingRef = React.useRef(false);
    const pausedRef = React.useRef(false);
    const reducedMotionRef = React.useRef(false);
    const maxIndexRef = React.useRef(0);
    const activeIndexRef = React.useRef(Math.max(0, defaultIndex));

    const [perViewState, setPerViewState] = React.useState(1);
    const [activeIndex, setActiveIndex] = React.useState(() =>
      Math.max(0, defaultIndex)
    );

    const childArray = React.Children.toArray(children).filter(
      React.isValidElement
    );
    const total = childArray.length;
    const effectivePerView = Math.max(1, Math.min(perViewState, total || 1));
    const maxIndex = Math.max(0, total - effectivePerView);
    const scrollable = maxIndex > 0;

    maxIndexRef.current = maxIndex;
    activeIndexRef.current = activeIndex;

    // En guncel perView yapilandirmasini ResizeObserver icin ref'te tut.
    const configRef = React.useRef(perView);
    configRef.current = perView;

    // Gorunur oge sayisini kapsayici genisligine gore olc.
    React.useEffect(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const measure = () =>
        setPerViewState(resolvePerView(configRef.current, el.clientWidth));
      measure();
      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    // Hareket-azaltma tercihini izle.
    React.useEffect(() => {
      if (typeof window === "undefined" || !window.matchMedia) return;
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      reducedMotionRef.current = mq.matches;
      const onChange = () => {
        reducedMotionRef.current = mq.matches;
      };
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }, []);

    // Kontrollu geri cagirimi ref'te tut.
    const onIndexChangeRef = React.useRef(onIndexChange);
    React.useEffect(() => {
      onIndexChangeRef.current = onIndexChange;
    });
    React.useEffect(() => {
      onIndexChangeRef.current?.(activeIndex);
    }, [activeIndex]);

    const goTo = React.useCallback(
      (index: number, smooth = true) => {
        const el = scrollerRef.current;
        if (!el) return;
        const mx = maxIndexRef.current;
        let target = index;
        if (loop) {
          if (target > mx) target = 0;
          else if (target < 0) target = mx;
        } else {
          target = Math.max(0, Math.min(index, mx));
        }
        const step = getStep(el, gap);
        el.scrollTo({
          // RTL kaydırma kabında scrollLeft sona doğru negatiftir
          left: target * step * (isRtl(el) ? -1 : 1),
          behavior: smooth && !reducedMotionRef.current ? "smooth" : "auto",
        });
        setActiveIndex(target);
      },
      [loop, gap]
    );

    const goToRef = React.useRef(goTo);
    React.useEffect(() => {
      goToRef.current = goTo;
    }, [goTo]);

    // Baslangic konumunu animasyonsuz ayarla (yalnizca ilk montaj).
    React.useEffect(() => {
      const el = scrollerRef.current;
      if (!el || defaultIndex <= 0) return;
      requestAnimationFrame(() => {
        const step = getStep(el, gap);
        el.scrollLeft =
          Math.min(defaultIndex, maxIndexRef.current) * step * (isRtl(el) ? -1 : 1);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleScroll = React.useCallback(() => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        tickingRef.current = false;
        const el = scrollerRef.current;
        if (!el) return;
        const step = getStep(el, gap);
        if (step <= 0) return;
        const idx = Math.max(
          0,
          Math.min(Math.round(Math.abs(el.scrollLeft) / step), maxIndexRef.current)
        );
        setActiveIndex((prev) => (prev === idx ? prev : idx));
      });
    }, [gap]);

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
          goTo(maxIndex);
          break;
        default:
          break;
      }
    };

    // Autoplay: hover/odak/etkilesim sirasinda duraklar.
    React.useEffect(() => {
      if (!autoplay || maxIndex <= 0) return;
      const id = window.setInterval(() => {
        if (pausedRef.current || reducedMotionRef.current) return;
        const cur = activeIndexRef.current;
        const mx = maxIndexRef.current;
        if (cur >= mx) {
          if (loop) goToRef.current(0);
        } else {
          goToRef.current(cur + 1);
        }
      }, autoplayInterval);
      return () => window.clearInterval(id);
    }, [autoplay, autoplayInterval, maxIndex, loop]);

    const pause = () => {
      pausedRef.current = true;
    };
    const resume = () => {
      pausedRef.current = false;
    };

    if (total === 0) return null;

    const prevDisabled = !loop && activeIndex <= 0;
    const nextDisabled = !loop && activeIndex >= maxIndex;

    return (
      <div
        ref={ref}
        role="region"
        aria-roledescription="karusel"
        aria-label={ariaLabel}
        className={cn("relative flex flex-col gap-4", className)}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocusCapture={pause}
        onBlurCapture={resume}
        onPointerDown={pause}
        onPointerUp={resume}
        {...props}
      >
        <div className="relative">
          <CarouselContext.Provider
            value={{ perView: effectivePerView, gap }}
          >
            <div
              ref={scrollerRef}
              role="group"
              aria-label="Slaytlar"
              tabIndex={0}
              onScroll={handleScroll}
              onKeyDown={handleKeyDown}
              style={{ gap }}
              className={cn(
                "relative flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                viewportClassName
              )}
            >
              {childArray.map((child, index) =>
                React.cloneElement(
                  child as React.ReactElement<CarouselItemProps>,
                  { index, total, key: child.key ?? index }
                )
              )}
            </div>
          </CarouselContext.Provider>

          {showArrows && scrollable ? (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={() => goTo(activeIndex - 1)}
                disabled={prevDisabled}
                aria-label={prevLabel}
                className="absolute start-2 top-1/2 z-10 size-9 -translate-y-1/2 rounded-full border shadow-md backdrop-blur transition-all duration-200 hover:shadow-lg disabled:opacity-0"
              >
                <ChevronLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={() => goTo(activeIndex + 1)}
                disabled={nextDisabled}
                aria-label={nextLabel}
                className="absolute end-2 top-1/2 z-10 size-9 -translate-y-1/2 rounded-full border shadow-md backdrop-blur transition-all duration-200 hover:shadow-lg disabled:opacity-0"
              >
                <ChevronRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </Button>
            </>
          ) : null}
        </div>

        {showDots && scrollable ? (
          <div
            role="group"
            aria-label="Slayt göstergeleri"
            className="flex flex-wrap items-center justify-center gap-2 pointer-coarse:gap-0"
          >
            {Array.from({ length: maxIndex + 1 }).map((_, index) => {
              const active = index === activeIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`${index + 1}. konuma git`}
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
        ) : null}
      </div>
    );
  }
);
Carousel.displayName = "Carousel";

export { Carousel, CarouselItem };
