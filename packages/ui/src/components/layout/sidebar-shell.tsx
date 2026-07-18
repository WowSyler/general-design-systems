/**
 * SidebarShell — kenar cubuklu yonetim paneli iskeleti.
 * Solda sabit genislikte, kaydirilabilir kenar cubugu (altina sabitlenen
 * footer alani ile); sagda istege bagli header ve ana icerik bulunur.
 * Not: Etkilesimli/katlanabilir shadcn Sidebar primitifi ayridir;
 * bu bilesen basit ve deterministik bir kompozittir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

interface SidebarShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Kenar cubugu icerigi (kaydirilabilir alan). */
  sidebar: React.ReactNode;
  /** Kenar cubugunun altina sabitlenen alan (kullanici karti vb.). */
  sidebarFooter?: React.ReactNode;
  /** Sag taraf ust cubugu. */
  header?: React.ReactNode;
}

const SidebarShell = React.forwardRef<HTMLDivElement, SidebarShellProps>(
  ({ className, sidebar, sidebarFooter, header, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex min-h-screen bg-background", className)}
      {...props}
    >
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm md:flex">
        <div className="flex-1 overflow-y-auto">{sidebar}</div>
        {sidebarFooter ? (
          <div className="shrink-0 border-t border-sidebar-border">
            {sidebarFooter}
          </div>
        ) : null}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        {header ? (
          <header className="flex h-14 items-center border-b border-border px-4 sm:px-6">
            {header}
          </header>
        ) : null}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
);
SidebarShell.displayName = "SidebarShell";

export { SidebarShell };
export type { SidebarShellProps };
