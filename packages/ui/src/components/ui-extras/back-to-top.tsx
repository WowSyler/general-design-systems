/**
 * BackToTop — Yukari cik butonu.
 * Sayfa dikey kaydirmasi belirlenen esigi (varsayilan 400px) gecince
 * sag-altta yapiskan (fixed) olarak animate-fade-up ile beliren yuvarlak
 * buton. Tiklaninca pencere yumusak (smooth) sekilde en uste kayar.
 * ArrowUp ikonu tasir; aria-label ile ekran okuyuculara duyurulur.
 * Statik onizleme icin forceVisible ile esikten bagimsiz gorunur kilinabilir.
 */
"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const backToTopVariants = cva(
  "fixed bottom-6 right-6 z-50 inline-flex items-center justify-center rounded-full shadow-lg ring-offset-background transition-all duration-300 animate-fade-up hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary bg-sheen text-primary-foreground hover:brightness-[1.06]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-input bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:bg-accent hover:text-accent-foreground hover:border-ring/60",
      },
      size: {
        default: "h-11 w-11 [&_svg]:size-5",
        sm: "h-9 w-9 [&_svg]:size-4",
        lg: "h-12 w-12 [&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BackToTopProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof backToTopVariants> {
  /** Butonun belirmesi icin gereken kaydirma esigi (px). Varsayilan 400. */
  threshold?: number;
  /** Erisilebilirlik etiketi. Varsayilan "Sayfanin en ustune don". */
  label?: string;
  /** Esikten bagimsiz her zaman gorunur kilar (statik onizleme icin). */
  forceVisible?: boolean;
}

const BackToTop = React.forwardRef<HTMLButtonElement, BackToTopProps>(
  (
    {
      threshold = 400,
      label = "Sayfanın en üstüne dön",
      forceVisible = false,
      variant,
      size,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(forceVisible);

    React.useEffect(() => {
      if (forceVisible) {
        setVisible(true);
        return;
      }
      const handleScroll = () => {
        setVisible(window.scrollY > threshold);
      };
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold, forceVisible]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!visible) return null;

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        onClick={handleClick}
        className={cn(backToTopVariants({ variant, size, className }))}
        {...props}
      >
        <ArrowUp aria-hidden="true" />
      </button>
    );
  }
);
BackToTop.displayName = "BackToTop";

export { BackToTop, backToTopVariants };
