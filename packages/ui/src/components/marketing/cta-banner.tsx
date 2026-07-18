/**
 * CtaBanner — marka gradyanli eylem cagrisi bandi.
 * Sayfa sonlarinda basligi, aciklamayi ve aksiyon butonlarini
 * brand-gradient arka plan ve radyal parilti ile sunar.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface CtaBannerProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Ana baslik. */
  title: React.ReactNode;
  /** Destekleyici aciklama. */
  description?: React.ReactNode;
  /** Aksiyon butonlari slotu. */
  actions?: React.ReactNode;
  /** Icerik hizalamasi. */
  align?: "center" | "start";
}

const alignClasses: Record<"center" | "start", string> = {
  center: "items-center text-center",
  start: "items-start text-left",
};

export const CtaBanner = React.forwardRef<HTMLElement, CtaBannerProps>(
  ({ title, description, actions, align = "center", className, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl bg-brand-gradient px-6 py-12 text-primary-foreground",
          className,
        )}
        {...props}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_80%_at_50%_0%,rgb(255_255_255/0.16),transparent)]"
        />
        <div
          className={cn("relative z-10 flex flex-col gap-4", alignClasses[align])}
        >
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="max-w-2xl text-base opacity-90">{description}</p>
          ) : null}
          {actions ? (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {actions}
            </div>
          ) : null}
          {children}
        </div>
      </section>
    );
  },
);
CtaBanner.displayName = "CtaBanner";
