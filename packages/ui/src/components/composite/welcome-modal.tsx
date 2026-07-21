"use client";

/**
 * WelcomeModal — Karsilama/baslangic modali (Dialog uzerine kurulu).
 * Yeni kullanici karsilama akislari icin gorsel/ikon basligi, buyuk baslik +
 * aciklama, opsiyonel ozellik listesi (ikon + metin), birincil + ikincil CTA
 * ve opsiyonel "bir daha gosterme" secenegi sunar. Acik durumu hem kontrollu
 * (open/onOpenChange) hem kontrolsuz (defaultOpen) kullanilabilir; CTA'lar
 * varsayilan olarak modali kapatir. DeployLens/Dolap/Randevu/GlowScan/Fisly
 * onboarding akislarinda kullanilir.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const welcomeModalIconVariants = cva(
  "grid shrink-0 place-content-center rounded-2xl [&_svg]:size-7",
  {
    variants: {
      tone: {
        brand:
          "bg-brand-gradient bg-sheen text-primary-foreground shadow-glow",
        primary: "bg-primary/10 text-primary shadow-sm",
        success: "bg-success/10 text-success shadow-sm",
        info: "bg-info/10 text-info shadow-sm",
      },
      size: {
        default: "size-14",
        lg: "size-16",
      },
    },
    defaultVariants: {
      tone: "brand",
      size: "default",
    },
  },
);

type WelcomeModalTone = NonNullable<
  VariantProps<typeof welcomeModalIconVariants>["tone"]
>;

/** Ozellik listesindeki tek bir madde. */
export interface WelcomeModalFeature {
  /** Sol taraftaki ikon (or. lucide ikonu). */
  icon?: React.ReactNode;
  /** Ozellik basligi. */
  title: React.ReactNode;
  /** Opsiyonel kisa aciklama. */
  description?: React.ReactNode;
}

/** Birincil/ikincil CTA yapilandirmasi. */
export interface WelcomeModalAction {
  /** Buton etiketi. */
  label: React.ReactNode;
  /** Tiklama isleyicisi. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Sol tarafta gosterilecek ikon. */
  icon?: React.ReactNode;
  /** Tiklaninca modali kapat (varsayilan: true). */
  closeOnClick?: boolean;
  /** Buton devre disi. */
  disabled?: boolean;
}

export interface WelcomeModalProps {
  /** Kontrollu acik durum. */
  open?: boolean;
  /** Kontrolsuz baslangic acik durumu. */
  defaultOpen?: boolean;
  /** Acik durum degisince cagrilir. */
  onOpenChange?: (open: boolean) => void;
  /** Modali acan tetikleyici (or. <Button>). Verilmezse yalniz kontrollu kullanilir. */
  trigger?: React.ReactNode;
  /** Ust kisimda tam genislikte gorsel/banner alani (or. resim, illustrasyon). */
  media?: React.ReactNode;
  /** Baslik ustundeki ikon rozeti. media verilmediyse gosterilir. */
  icon?: React.ReactNode;
  /** Ikon rozeti tonu. */
  tone?: WelcomeModalTone;
  /** Baslik ustundeki kucuk etiket (overline). */
  eyebrow?: React.ReactNode;
  /** Buyuk baslik. */
  title: React.ReactNode;
  /** Aciklama metni. */
  description?: React.ReactNode;
  /** Opsiyonel ozellik listesi (ikon + metin). */
  features?: WelcomeModalFeature[];
  /** Birincil CTA (zorunlu). */
  primaryAction: WelcomeModalAction;
  /** Opsiyonel ikincil CTA. */
  secondaryAction?: WelcomeModalAction;
  /** "Bir daha gosterme" onay kutusunu gosterir. */
  showDontShowAgain?: boolean;
  /** Onay kutusu etiketi. */
  dontShowAgainLabel?: React.ReactNode;
  /** Kontrollu onay kutusu durumu. */
  dontShowAgainChecked?: boolean;
  /** Onay kutusu degisince cagrilir. */
  onDontShowAgainChange?: (checked: boolean) => void;
  /** DialogContent ek sinif. */
  className?: string;
}

const WelcomeModal = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  WelcomeModalProps
>(
  (
    {
      open,
      defaultOpen,
      onOpenChange,
      trigger,
      media,
      icon,
      tone = "brand",
      eyebrow,
      title,
      description,
      features,
      primaryAction,
      secondaryAction,
      showDontShowAgain = false,
      dontShowAgainLabel = "Bunu bir daha gosterme",
      dontShowAgainChecked,
      onDontShowAgainChange,
      className,
    },
    ref,
  ) => {
    const isControlled = open !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
      defaultOpen ?? false,
    );
    const actualOpen = isControlled ? open : uncontrolledOpen;

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange],
    );

    const isCheckboxControlled = dontShowAgainChecked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(false);
    const actualChecked = isCheckboxControlled
      ? dontShowAgainChecked
      : uncontrolledChecked;

    const dontShowId = React.useId();
    const descriptionId = React.useId();

    const runAction = React.useCallback(
      (action: WelcomeModalAction) =>
        (event: React.MouseEvent<HTMLButtonElement>) => {
          action.onClick?.(event);
          if (action.closeOnClick ?? true) setOpen(false);
        },
      [setOpen],
    );

    return (
      <Dialog open={actualOpen} onOpenChange={setOpen}>
        {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
        <DialogContent
          ref={ref}
          aria-describedby={description ? descriptionId : undefined}
          className={cn("max-w-md gap-0 overflow-hidden p-0", className)}
        >
          {media ? (
            <div className="relative aspect-[16/7] w-full overflow-hidden bg-muted [&_img]:size-full [&_img]:object-cover [&_svg]:size-full">
              {media}
            </div>
          ) : null}

          <div className="flex flex-col gap-5 p-6">
            <div className="flex flex-col gap-3">
              {icon && !media ? (
                <div
                  className={cn(welcomeModalIconVariants({ tone }))}
                  aria-hidden="true"
                >
                  {icon}
                </div>
              ) : null}

              <div className="flex flex-col gap-1.5">
                {eyebrow ? (
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {eyebrow}
                  </span>
                ) : null}
                <DialogTitle className="text-2xl font-bold font-display tracking-tight text-foreground">
                  {title}
                </DialogTitle>
                {description ? (
                  <DialogDescription
                    id={descriptionId}
                    className="text-sm leading-relaxed text-muted-foreground"
                  >
                    {description}
                  </DialogDescription>
                ) : null}
              </div>
            </div>

            {features && features.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 rounded-lg transition-colors"
                  >
                    {feature.icon ? (
                      <span
                        className="mt-0.5 grid size-9 shrink-0 place-content-center rounded-lg bg-primary/10 text-primary [&_svg]:size-4"
                        aria-hidden="true"
                      >
                        {feature.icon}
                      </span>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {feature.title}
                      </p>
                      {feature.description ? (
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {feature.description}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}

            {showDontShowAgain ? (
              <div className="flex items-center gap-2">
                <Checkbox
                  id={dontShowId}
                  checked={actualChecked}
                  onCheckedChange={(value) => {
                    const next = value === true;
                    if (!isCheckboxControlled) setUncontrolledChecked(next);
                    onDontShowAgainChange?.(next);
                  }}
                />
                <Label
                  htmlFor={dontShowId}
                  className="cursor-pointer text-sm font-normal text-muted-foreground"
                >
                  {dontShowAgainLabel}
                </Label>
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {secondaryAction ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={runAction(secondaryAction)}
                  disabled={secondaryAction.disabled}
                >
                  {secondaryAction.icon}
                  {secondaryAction.label}
                </Button>
              ) : null}
              <Button
                type="button"
                onClick={runAction(primaryAction)}
                disabled={primaryAction.disabled}
                className="sm:min-w-32"
              >
                {primaryAction.icon}
                {primaryAction.label}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);
WelcomeModal.displayName = "WelcomeModal";

export { WelcomeModal, welcomeModalIconVariants };
