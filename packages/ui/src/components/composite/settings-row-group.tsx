/**
 * SettingsRow / SettingsGroup — Ayarlar ve profil ekrani deseni.
 * SettingsRow: solda ikon + baslik + aciklama, sagda kontrol yuvasi
 * (switch, select, chevron veya buton gibi herhangi bir React ogesi).
 * SettingsGroup: baslik + aciklama ve ayrilmis (divide-y) alt satirlari
 * Card icinde toplar; "danger" tonu destructive cerceve/vurgu uygular.
 * Tema-agnostik, salt sunum; DeployLens/Dolap/Randevu/GlowScan/Fisly
 * Ayarlar ekranlarinda kullanilir.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const settingsRowIconVariants = cva(
  "flex size-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4",
  {
    variants: {
      tone: {
        default: "bg-muted text-muted-foreground",
        danger: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: { tone: "default" },
  }
);

export interface SettingsRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof settingsRowIconVariants> {
  /** Sol taraftaki ikon (genellikle lucide size-4). */
  icon?: React.ReactNode;
  /** Satir basligi. */
  title: React.ReactNode;
  /** Baslik altindaki aciklama metni. */
  description?: React.ReactNode;
  /** Sag taraftaki kontrol yuvasi: Switch, Select, buton veya chevron. */
  control?: React.ReactNode;
  /** Destructive vurgu (tehlikeli islem satiri). */
  danger?: boolean;
}

const SettingsRow = React.forwardRef<HTMLDivElement, SettingsRowProps>(
  ({ icon, title, description, control, danger = false, className, ...props }, ref) => {
    const tone = danger ? "danger" : "default";
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-4 px-4 py-4 transition-colors sm:px-6",
          className
        )}
        {...props}
      >
        {icon ? (
          <span className={cn(settingsRowIconVariants({ tone }))} aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "text-sm font-medium",
              danger ? "text-destructive" : "text-foreground"
            )}
          >
            {title}
          </div>
          {description ? (
            <div className="mt-0.5 text-sm text-muted-foreground">{description}</div>
          ) : null}
        </div>
        {control ? (
          <div className="flex shrink-0 items-center justify-end">{control}</div>
        ) : null}
      </div>
    );
  }
);
SettingsRow.displayName = "SettingsRow";

export interface SettingsGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Grup basligi (ustte, kart icinde). */
  title?: React.ReactNode;
  /** Baslik altindaki aciklama. */
  description?: React.ReactNode;
  /** Destructive cerceve ve baslik tonu. */
  danger?: boolean;
  /** Grup satirlari (SettingsRow ogeleri). */
  children?: React.ReactNode;
}

const SettingsGroup = React.forwardRef<HTMLDivElement, SettingsGroupProps>(
  ({ title, description, danger = false, className, children, ...props }, ref) => {
    const hasHeader = Boolean(title || description);
    return (
      <Card
        ref={ref}
        className={cn(
          "overflow-hidden transition-all duration-300",
          danger ? "border-destructive/40 bg-destructive/[0.02]" : "hover:shadow-md",
          className
        )}
        {...props}
      >
        {hasHeader ? (
          <div className="px-4 pb-3 pt-5 sm:px-6">
            {title ? (
              <div
                className={cn(
                  "text-sm font-semibold tracking-tight",
                  danger ? "text-destructive" : "text-foreground"
                )}
              >
                {title}
              </div>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
        ) : null}
        <div className={cn("divide-y divide-border", hasHeader && "border-t border-border")}>
          {children}
        </div>
      </Card>
    );
  }
);
SettingsGroup.displayName = "SettingsGroup";

export { SettingsRow, SettingsGroup, settingsRowIconVariants };
