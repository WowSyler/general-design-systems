/**
 * AppShell — ust cubuklu (topbar) uygulama iskeleti.
 * Yapiskan header icinde logo, navigasyon ve aksiyonlar;
 * altinda istege bagli banner seridi, ana icerik ve footer bulunur.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header sol tarafinda gorunen logo alani. */
  logo?: React.ReactNode;
  /** Header icindeki navigasyon (md ve uzeri ekranlarda gorunur). */
  nav?: React.ReactNode;
  /** Header sag tarafindaki aksiyon alani. */
  actions?: React.ReactNode;
  /** Header altinda tam genislikte serit (duyuru vb.). */
  banner?: React.ReactNode;
  /** Sayfa alt bilgisi. */
  footer?: React.ReactNode;
}

const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  (
    { className, logo, nav, actions, banner, footer, children, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn("flex min-h-screen flex-col bg-background", className)}
      {...props}
    >
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center gap-6 px-4 sm:px-6">
          {logo ? (
            <div className="flex shrink-0 items-center">{logo}</div>
          ) : null}
          {nav ? (
            <nav className="hidden items-center gap-6 md:flex">{nav}</nav>
          ) : null}
          {actions ? (
            <div className="ml-auto flex items-center gap-2">{actions}</div>
          ) : null}
        </div>
      </header>
      {banner ? (
        <div className="w-full border-b border-border bg-muted">{banner}</div>
      ) : null}
      <main className="flex-1 p-4 sm:p-6">{children}</main>
      {footer ? (
        <footer className="border-t border-border">{footer}</footer>
      ) : null}
    </div>
  )
);
AppShell.displayName = "AppShell";

export { AppShell };
export type { AppShellProps };
