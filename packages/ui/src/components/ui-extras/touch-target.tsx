/**
 * TouchTarget — Dokunma hedefi sarmalayici (erisilebilirlik).
 * Kucuk bir ikonu/butonu, cevresinde gorunmez ama tiklanabilir en az
 * 44x44px'lik bir alanla sarar; boylece parmakla dokunma mobilde
 * kolaylasir (WCAG 2.5.5 / 2.5.8 dokunma hedefi olcusu).
 *
 * Iki mod:
 *  - "inset"   : cocugu esnek bir kutu icinde ortalar ve kutuyu en az
 *                44px yapar (padding yaklasimi). Cevre duzeni bu alan
 *                kadar yer kaplar. En ongorulebilir, guvenli varsayilan.
 *  - "overlay" : gorsel boyutu ayni birakir; ::before yalanci-ogesiyle
 *                ogenin disina tasan gorunmez bir vurus alani ekler.
 *                Cevre duzeni etkilenmez (negatif-margin etkisi). Kucuk
 *                bir "kapat" (X) dugmesine 44px vurus alani vermek gibi.
 *
 * asChild ile mevcut bir <button>/<a> ogesine ekstra DOM dugumu
 * olusturmadan uygulanir — vurus alani dogrudan etkilesimli ogeye
 * baglanir. mobileOnly ile buyutme yalnizca <md ekranlarda etkindir.
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const touchTargetVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center",
  {
    variants: {
      mode: {
        inset: "",
        overlay:
          "before:absolute before:left-1/2 before:top-1/2 before:h-full before:w-full before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    compoundVariants: [
      // inset: kutuyu dogrudan buyut (44 / 48 / 56 px)
      { mode: "inset", size: "sm", class: "min-h-11 min-w-11" },
      { mode: "inset", size: "md", class: "min-h-12 min-w-12" },
      { mode: "inset", size: "lg", class: "min-h-14 min-w-14" },
      // overlay: vurus alanini ::before ile tasit
      { mode: "overlay", size: "sm", class: "before:min-h-11 before:min-w-11" },
      { mode: "overlay", size: "md", class: "before:min-h-12 before:min-w-12" },
      { mode: "overlay", size: "lg", class: "before:min-h-14 before:min-w-14" },
    ],
    defaultVariants: {
      mode: "inset",
      size: "sm",
    },
  }
);

type TouchTargetMode = NonNullable<
  VariantProps<typeof touchTargetVariants>["mode"]
>;

/** mobileOnly icin >=md ekranlarda buyutmeyi geri alan siniflar. */
const touchTargetMobileReset: Record<TouchTargetMode, string> = {
  inset: "md:min-h-0 md:min-w-0",
  overlay: "md:before:hidden",
};

export interface TouchTargetProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof touchTargetVariants> {
  /**
   * Cocuk ogeyi dogrudan sarar; ekstra bir <span> dugumu olusturmaz.
   * Ornek: vurus alanini bir <button> veya <a> uzerine uygular.
   */
  asChild?: boolean;
  /**
   * true ise buyutulmus dokunma hedefi yalnizca kucuk ekranlarda
   * (<md, 768px alti) etkindir; masaustunde ogenin dogal boyutu
   * korunur. Fare ile hassas tiklamada ekstra alana gerek yoktur.
   */
  mobileOnly?: boolean;
}

const TouchTarget = React.forwardRef<HTMLSpanElement, TouchTargetProps>(
  (
    {
      className,
      mode,
      size,
      asChild = false,
      mobileOnly = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "span";
    const resolvedMode: TouchTargetMode = mode ?? "inset";
    return (
      <Comp
        ref={ref}
        className={cn(
          touchTargetVariants({ mode, size }),
          mobileOnly && touchTargetMobileReset[resolvedMode],
          className
        )}
        {...props}
      />
    );
  }
);
TouchTarget.displayName = "TouchTarget";

export { TouchTarget, touchTargetVariants };
export type { TouchTargetMode };
