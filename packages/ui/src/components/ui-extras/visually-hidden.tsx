/**
 * VisuallyHidden — Ekran-okuyucu-only icerik.
 * Icerigi gorsel olarak gizler ama erisilebilirlik agacinda birakir
 * (standart "sr-only" teknigi: clip + 1px kutu). Ikon-only butonlara
 * metin etiketi, canli bolgelere durum metni ve baglam eklemek icin
 * kullanilir. asChild ile mevcut bir elemani ekstra DOM dugumu
 * olusturmadan sarar; focusable ile klavye odaginda gorunur hale gelir
 * (klasik "icerige atla" baglanti deseni).
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

export interface VisuallyHiddenProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Cocuk elemani dogrudan sarar; ekstra bir <span> dugumu olusturmaz.
   * Ornek: bir <a> veya <button> uzerine sr-only stilini uygular.
   */
  asChild?: boolean;
  /**
   * true ise klavye odagi geldiginde icerik gorunur olur ve ekranin
   * sol ustune yerlesir. "Icerige atla" gibi atlama baglantilarinda
   * kullanilir; fare kullanicilari icin gizli kalir.
   */
  focusable?: boolean;
}

const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ asChild = false, focusable = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        ref={ref}
        className={cn(
          "sr-only",
          focusable &&
            "focus-within:not-sr-only focus-within:fixed focus-within:start-4 focus-within:top-4 focus-within:z-50 focus-within:inline-flex focus-within:h-10 focus-within:items-center focus-within:rounded-md focus-within:border focus-within:border-border focus-within:bg-background focus-within:px-4 focus-within:text-sm focus-within:font-medium focus-within:text-foreground focus-within:no-underline focus-within:shadow-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
          className
        )}
        {...props}
      />
    );
  }
);
VisuallyHidden.displayName = "VisuallyHidden";

export { VisuallyHidden };
