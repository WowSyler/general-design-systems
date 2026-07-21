"use client";

/**
 * ResponsiveDialog — Cihaza uyarlanan diyalog.
 *
 * Masaustunde (md+) merkezi bir Radix `Dialog`, mobilde (md alti) alttan acilan
 * bir `Drawer` (vaul) olarak render eder. Gecis `useIsMobile` ile calisir; her
 * iki modda da erisilebilir (odak tuzagi, Esc ile kapatma, overlay tiklamasi,
 * baslik/aciklama iliskilendirmesi).
 *
 * Iki kullanim bicimi vardir:
 *  1) Hazir `ResponsiveDialog` — open/onOpenChange, trigger, title, description,
 *     children ve footer proplariyla tek parcada calisir.
 *  2) Bilesik alt parcalar — `ResponsiveDialogRoot`, `ResponsiveDialogTrigger`,
 *     `ResponsiveDialogContent`, `ResponsiveDialogHeader`,
 *     `ResponsiveDialogBody`, `ResponsiveDialogFooter`, `ResponsiveDialogTitle`,
 *     `ResponsiveDialogDescription`, `ResponsiveDialogClose` ile serbest kurgu.
 *
 * Her iki bicim de ayni temeli (Dialog + Drawer) kullanir; alt parcalar
 * kok bilesenin sagladigi baglamdan mobil/masaustu bilgisini okur.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

/* -------------------------------------------------------------------------- */
/*                                   Baglam                                    */
/* -------------------------------------------------------------------------- */

interface ResponsiveDialogContextValue {
  /** Su an mobil (Drawer) modunda mi? */
  isMobile: boolean;
}

const ResponsiveDialogContext =
  React.createContext<ResponsiveDialogContextValue | null>(null);

function useResponsiveDialogContext(
  component: string,
): ResponsiveDialogContextValue {
  const ctx = React.useContext(ResponsiveDialogContext);
  if (!ctx) {
    throw new Error(
      `${component}, bir <ResponsiveDialogRoot> (ya da <ResponsiveDialog>) icinde kullanilmalidir.`,
    );
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*                               Kok / Root                                    */
/* -------------------------------------------------------------------------- */

export interface ResponsiveDialogRootProps {
  /** Kontrollu acik durum. */
  open?: boolean;
  /** Kontrolsuz baslangic acik durumu. */
  defaultOpen?: boolean;
  /** Acik durum degisince cagrilir. */
  onOpenChange?: (open: boolean) => void;
  /** Alt parcalar (trigger, content vb.). */
  children?: React.ReactNode;
}

/**
 * Diyalogun kokunu (Dialog ya da Drawer) render eder ve alt parcalara
 * mobil/masaustu baglamini saglar.
 */
const ResponsiveDialogRoot = ({
  children,
  ...props
}: ResponsiveDialogRootProps) => {
  const isMobile = useIsMobile();
  const value = React.useMemo<ResponsiveDialogContextValue>(
    () => ({ isMobile }),
    [isMobile],
  );

  const Root = isMobile ? Drawer : Dialog;

  return (
    <ResponsiveDialogContext.Provider value={value}>
      <Root {...props}>{children}</Root>
    </ResponsiveDialogContext.Provider>
  );
};
ResponsiveDialogRoot.displayName = "ResponsiveDialogRoot";

/* -------------------------------------------------------------------------- */
/*                                 Tetikleyici                                 */
/* -------------------------------------------------------------------------- */

export interface ResponsiveDialogTriggerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  /** Verilen tek cocugu tetikleyici olarak kullanir (or. <Button>). */
  asChild?: boolean;
}

const ResponsiveDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  ResponsiveDialogTriggerProps
>((props, ref) => {
  const { isMobile } = useResponsiveDialogContext("ResponsiveDialogTrigger");
  const Comp = isMobile ? DrawerTrigger : DialogTrigger;
  return <Comp ref={ref} {...props} />;
});
ResponsiveDialogTrigger.displayName = "ResponsiveDialogTrigger";

/* -------------------------------------------------------------------------- */
/*                                   Kapat                                     */
/* -------------------------------------------------------------------------- */

export interface ResponsiveDialogCloseProps
  extends React.ComponentPropsWithoutRef<"button"> {
  /** Verilen tek cocugu kapatma tetikleyicisi olarak kullanir. */
  asChild?: boolean;
}

const ResponsiveDialogClose = React.forwardRef<
  HTMLButtonElement,
  ResponsiveDialogCloseProps
>((props, ref) => {
  const { isMobile } = useResponsiveDialogContext("ResponsiveDialogClose");
  const Comp = isMobile ? DrawerClose : DialogClose;
  return <Comp ref={ref} {...props} />;
});
ResponsiveDialogClose.displayName = "ResponsiveDialogClose";

/* -------------------------------------------------------------------------- */
/*                                  Icerik                                     */
/* -------------------------------------------------------------------------- */

export interface ResponsiveDialogContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ResponsiveDialogContent = React.forwardRef<
  HTMLDivElement,
  ResponsiveDialogContentProps
>(({ className, children, ...props }, ref) => {
  const { isMobile } = useResponsiveDialogContext("ResponsiveDialogContent");

  if (isMobile) {
    return (
      <DrawerContent
        ref={ref}
        className={cn("max-h-[92dvh] pb-4", className)}
        {...props}
      >
        {children}
      </DrawerContent>
    );
  }

  return (
    <DialogContent
      ref={ref}
      className={cn("w-full max-w-lg", className)}
      {...props}
    >
      {children}
    </DialogContent>
  );
});
ResponsiveDialogContent.displayName = "ResponsiveDialogContent";

/* -------------------------------------------------------------------------- */
/*                                  Baslik alani                               */
/* -------------------------------------------------------------------------- */

const ResponsiveDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { isMobile } = useResponsiveDialogContext("ResponsiveDialogHeader");
  const Comp = isMobile ? DrawerHeader : DialogHeader;
  return <Comp className={className} {...props} />;
};
ResponsiveDialogHeader.displayName = "ResponsiveDialogHeader";

/* -------------------------------------------------------------------------- */
/*                                   Govde                                     */
/* -------------------------------------------------------------------------- */

/**
 * Baslik ile footer arasindaki kaydirilabilir govde. Mobilde yatay dolgu ve
 * dikey kaydirma ekler; masaustunde DialogContent'in dolgusunu kullanir.
 */
const ResponsiveDialogBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isMobile } = useResponsiveDialogContext("ResponsiveDialogBody");
  return (
    <div
      ref={ref}
      className={cn(
        "min-w-0 text-sm text-foreground",
        isMobile && "overflow-y-auto px-4 pb-2",
        className,
      )}
      {...props}
    />
  );
});
ResponsiveDialogBody.displayName = "ResponsiveDialogBody";

/* -------------------------------------------------------------------------- */
/*                                   Altlik                                    */
/* -------------------------------------------------------------------------- */

const ResponsiveDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { isMobile } = useResponsiveDialogContext("ResponsiveDialogFooter");
  const Comp = isMobile ? DrawerFooter : DialogFooter;
  return <Comp className={className} {...props} />;
};
ResponsiveDialogFooter.displayName = "ResponsiveDialogFooter";

/* -------------------------------------------------------------------------- */
/*                              Baslik / Aciklama                              */
/* -------------------------------------------------------------------------- */

export interface ResponsiveDialogTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

const ResponsiveDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  ResponsiveDialogTitleProps
>(({ className, ...props }, ref) => {
  const { isMobile } = useResponsiveDialogContext("ResponsiveDialogTitle");
  const Comp = isMobile ? DrawerTitle : DialogTitle;
  return <Comp ref={ref} className={className} {...props} />;
});
ResponsiveDialogTitle.displayName = "ResponsiveDialogTitle";

export interface ResponsiveDialogDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const ResponsiveDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  ResponsiveDialogDescriptionProps
>(({ className, ...props }, ref) => {
  const { isMobile } = useResponsiveDialogContext(
    "ResponsiveDialogDescription",
  );
  const Comp = isMobile ? DrawerDescription : DialogDescription;
  return <Comp ref={ref} className={className} {...props} />;
});
ResponsiveDialogDescription.displayName = "ResponsiveDialogDescription";

/* -------------------------------------------------------------------------- */
/*                          Hazir bilesen (convenience)                        */
/* -------------------------------------------------------------------------- */

export interface ResponsiveDialogProps {
  /** Kontrollu acik durum. */
  open?: boolean;
  /** Kontrolsuz baslangic acik durumu. */
  defaultOpen?: boolean;
  /** Acik durum degisince cagrilir. */
  onOpenChange?: (open: boolean) => void;
  /** Diyalogu acan tetikleyici (or. <Button>). Verilmezse yalniz kontrollu kullanilir. */
  trigger?: React.ReactNode;
  /** Gorunur baslik. Verilmezse baslik erisim icin gizli (sr-only) render edilir. */
  title?: React.ReactNode;
  /**
   * Baslik gorunur degilken erisilebilir ad. Yalniz `title` verilmediginde
   * kullanilir. Varsayilan: "Diyalog".
   */
  accessibleTitle?: string;
  /** Baslik altindaki aciklama metni. */
  description?: React.ReactNode;
  /** Diyalog govdesi. */
  children?: React.ReactNode;
  /** Altlikta gosterilecek icerik (or. eylem butonlari). */
  footer?: React.ReactNode;
  /** Icerik kapsayicisina ek sinif. */
  contentClassName?: string;
  /** Govde kapsayicisina ek sinif. */
  bodyClassName?: string;
}

/**
 * Cihaza uyarlanan hazir diyalog. Alt parcalari kendi icinde kurar; hizli
 * kullanim icin idealdir. Daha ozgur duzenler icin alt parcalari dogrudan
 * kullanabilirsiniz.
 */
const ResponsiveDialog = ({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  accessibleTitle = "Diyalog",
  description,
  children,
  footer,
  contentClassName,
  bodyClassName,
}: ResponsiveDialogProps) => {
  const hasVisibleHeader = Boolean(title) || Boolean(description);

  return (
    <ResponsiveDialogRoot
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {trigger ? (
        <ResponsiveDialogTrigger asChild>{trigger}</ResponsiveDialogTrigger>
      ) : null}
      <ResponsiveDialogContent className={contentClassName}>
        <ResponsiveDialogHeader className={cn(!hasVisibleHeader && "sr-only")}>
          <ResponsiveDialogTitle className={cn(!title && "sr-only")}>
            {title ?? accessibleTitle}
          </ResponsiveDialogTitle>
          {description ? (
            <ResponsiveDialogDescription>
              {description}
            </ResponsiveDialogDescription>
          ) : null}
        </ResponsiveDialogHeader>

        {children ? (
          <ResponsiveDialogBody className={bodyClassName}>
            {children}
          </ResponsiveDialogBody>
        ) : null}

        {footer ? (
          <ResponsiveDialogFooter>{footer}</ResponsiveDialogFooter>
        ) : null}
      </ResponsiveDialogContent>
    </ResponsiveDialogRoot>
  );
};
ResponsiveDialog.displayName = "ResponsiveDialog";

export {
  ResponsiveDialog,
  ResponsiveDialogRoot,
  ResponsiveDialogTrigger,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogBody,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
};
