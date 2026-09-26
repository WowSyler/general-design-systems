/**
 * FooterColumns — cok kolonlu site alt bilgisi.
 * Logo, aciklama, link kolonlari ve alt satiri (telif vb.)
 * semantik tokenlarla duzenler.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface FooterLink {
  /** Link metni. */
  label: React.ReactNode;
  /** Hedef adres. */
  href?: string;
}

export interface FooterColumn {
  /** Kolon basligi. */
  title: React.ReactNode;
  /** Kolondaki linkler. */
  links: FooterLink[];
}

export interface FooterColumnsProps
  extends React.HTMLAttributes<HTMLElement> {
  /** Logo / marka slotu. */
  logo?: React.ReactNode;
  /** Marka aciklamasi. */
  description?: React.ReactNode;
  /** Link kolonlari. */
  columns: FooterColumn[];
  /** Alt satir (telif, sosyal linkler vb.). */
  bottom?: React.ReactNode;
}

export const FooterColumns = React.forwardRef<HTMLElement, FooterColumnsProps>(
  ({ logo, description, columns, bottom, className, children, ...props }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn("border-t bg-muted/30", className)}
        {...props}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {logo || description ? (
              <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
                {logo ? <div className="flex items-center gap-2">{logo}</div> : null}
                {description ? (
                  <p className="max-w-xs text-sm text-muted-foreground">
                    {description}
                  </p>
                ) : null}
              </div>
            ) : null}
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex flex-col gap-3">
                <div className="text-sm font-semibold text-foreground">
                  {column.title}
                </div>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground pointer-coarse:inline-flex pointer-coarse:min-h-11 pointer-coarse:min-w-11 pointer-coarse:items-center"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {children}
          {bottom ? (
            <div className="flex flex-col gap-2 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              {bottom}
            </div>
          ) : null}
        </div>
      </footer>
    );
  },
);
FooterColumns.displayName = "FooterColumns";
