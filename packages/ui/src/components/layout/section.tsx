/**
 * Section — icerik bolumu.
 * Semantik <section> etiketi ile kucuk bir baslik satiri
 * (baslik, aciklama, aksiyonlar) ve altinda icerik alani sunar.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

interface SectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Bolum basligi. */
  title?: React.ReactNode;
  /** Baslik altinda gorunen kisa aciklama. */
  description?: React.ReactNode;
  /** Sag hizali aksiyon alani. */
  actions?: React.ReactNode;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, title, description, actions, children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      {title || description || actions ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            {title ? (
              <h2 className="text-lg font-semibold text-foreground">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  )
);
Section.displayName = "Section";

export { Section };
export type { SectionProps };
