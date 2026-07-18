/**
 * MarketingShell — halka acik / pazarlama sayfasi iskeleti.
 * Ortalanmis dar konteyner icinde header (logo, navigasyon, CTA),
 * ana icerik ve footer sunar. `maxWidth` ile konteyner genisligi secilir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type MarketingShellMaxWidth = "lg" | "xl";

const marketingMaxWidthClasses: Record<MarketingShellMaxWidth, string> = {
  lg: "max-w-5xl",
  xl: "max-w-6xl",
};

interface MarketingShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header solunda gorunen logo alani. */
  logo?: React.ReactNode;
  /** Header ortasindaki navigasyon (md ve uzeri ekranlarda gorunur). */
  nav?: React.ReactNode;
  /** Header sagindaki cagri butonu alani. */
  cta?: React.ReactNode;
  /** Sayfa alt bilgisi. */
  footer?: React.ReactNode;
  /** Konteyner genisligi. Varsayilan: "lg". */
  maxWidth?: MarketingShellMaxWidth;
}

const MarketingShell = React.forwardRef<HTMLDivElement, MarketingShellProps>(
  (
    { className, logo, nav, cta, footer, maxWidth = "lg", children, ...props },
    ref
  ) => {
    const maxWidthClass = marketingMaxWidthClasses[maxWidth];

    return (
      <div
        ref={ref}
        className={cn("flex min-h-screen flex-col bg-background", className)}
        {...props}
      >
        <header className="border-b border-border">
          <div
            className={cn(
              "mx-auto flex h-16 items-center justify-between px-4 sm:px-6",
              maxWidthClass
            )}
          >
            {logo ? (
              <div className="flex shrink-0 items-center">{logo}</div>
            ) : null}
            {nav ? (
              <nav className="hidden items-center gap-6 md:flex">{nav}</nav>
            ) : null}
            {cta ? <div className="flex items-center gap-2">{cta}</div> : null}
          </div>
        </header>
        <main
          className={cn(
            "mx-auto w-full flex-1 px-4 py-8 sm:px-6",
            maxWidthClass
          )}
        >
          {children}
        </main>
        {footer ? (
          <footer className="border-t border-border">
            <div className={cn("mx-auto px-4 py-8 sm:px-6", maxWidthClass)}>
              {footer}
            </div>
          </footer>
        ) : null}
      </div>
    );
  }
);
MarketingShell.displayName = "MarketingShell";

export { MarketingShell };
export type { MarketingShellProps, MarketingShellMaxWidth };
