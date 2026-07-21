/**
 * ErrorPageState — Tam-sayfa hata/durum ekrani.
 * ResultState satir-ici sonuc gosterirken bu bilesen tum viewport'u
 * kaplayan ortali bir durum ekrani sunar. cva ile 404/500/offline/
 * maintenance/forbidden varyantlari; her varyant kendi buyuk tonlu
 * illustrasyonu (halka icinde dev ikon), durum kodu etiketi, baslik ve
 * aciklamayla gelir. Varsayilan birincil + ikincil aksiyonlar (Ana Sayfa
 * / Tekrar Dene / Geri) variant'a gore secilir; primaryAction/
 * secondaryAction ya da actions ile tamamen ezilebilir. Dekoratif tonlu
 * isima ve grain dokusu ile ferah bir atmosfer olusturur.
 */
import * as React from "react";
import {
  ArrowLeft,
  Construction,
  FileQuestion,
  Home,
  RotateCw,
  ServerCrash,
  ShieldOff,
  WifiOff,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const errorPageStateIllustration = cva(
  "relative flex items-center justify-center rounded-full ring-1 transition-all duration-300",
  {
    variants: {
      variant: {
        "404": "bg-primary/10 text-primary ring-primary/20",
        "500": "bg-destructive/10 text-destructive ring-destructive/20",
        offline: "bg-info/10 text-info ring-info/20",
        maintenance: "bg-warning/10 text-warning ring-warning/20",
        forbidden: "bg-destructive/10 text-destructive ring-destructive/20",
      },
      size: {
        default: "size-28",
        lg: "size-32",
      },
    },
    defaultVariants: {
      variant: "404",
      size: "default",
    },
  }
);

type ErrorPageStateVariant = NonNullable<
  VariantProps<typeof errorPageStateIllustration>["variant"]
>;

type ErrorPageStateAction = "home" | "retry" | "back";

interface ErrorPageStateConfig {
  icon: React.ElementType;
  code: string;
  title: string;
  description: string;
  /** Dekoratif tonlu isimanin renk sinifi. */
  glow: string;
  /** Etiket rozetinin renk sinifi. */
  badge: string;
  /** error tonu role=alert, digerleri role=status kullanir. */
  severe: boolean;
  primary: ErrorPageStateAction;
  secondary: ErrorPageStateAction | null;
}

const variantConfig: Record<ErrorPageStateVariant, ErrorPageStateConfig> = {
  "404": {
    icon: FileQuestion,
    code: "Hata 404",
    title: "Sayfa bulunamadi",
    description:
      "Aradiginiz sayfa tasinmis ya da hic var olmamis olabilir. Adresi kontrol edin veya panele geri donun.",
    glow: "bg-primary/20",
    badge: "bg-primary/10 text-primary ring-primary/20",
    severe: false,
    primary: "home",
    secondary: "back",
  },
  "500": {
    icon: ServerCrash,
    code: "Hata 500",
    title: "Beklenmeyen bir sorun olustu",
    description:
      "Sunucularimizda gecici bir hata yasandi. Ekibimiz durumdan haberdar; birkac dakika icinde tekrar deneyebilirsiniz.",
    glow: "bg-destructive/20",
    badge: "bg-destructive/10 text-destructive ring-destructive/20",
    severe: true,
    primary: "retry",
    secondary: "home",
  },
  offline: {
    icon: WifiOff,
    code: "Baglanti yok",
    title: "Internet baglantisi kesildi",
    description:
      "Su an cevrimdisi gorunuyorsunuz. Baglantinizi kontrol edip yeniden deneyin; degisiklikleriniz baglanti gelince eslenecek.",
    glow: "bg-info/20",
    badge: "bg-info/10 text-info ring-info/20",
    severe: false,
    primary: "retry",
    secondary: "home",
  },
  maintenance: {
    icon: Construction,
    code: "Bakim modu",
    title: "Kisa bir bakim yapiyoruz",
    description:
      "Servisi daha iyi hale getirmek icin planli bakim calismasi surdurulyor. Cok yakinda tekrar aramizda olacaksiniz.",
    glow: "bg-warning/20",
    badge: "bg-warning/10 text-warning ring-warning/20",
    severe: false,
    primary: "retry",
    secondary: null,
  },
  forbidden: {
    icon: ShieldOff,
    code: "Hata 403",
    title: "Bu sayfaya erisim izniniz yok",
    description:
      "Bu icerigi goruntulemek icin gerekli yetkiye sahip degilsiniz. Yanlislik oldugunu dusunuyorsaniz hesap yoneticinizle iletisime gecin.",
    glow: "bg-destructive/20",
    badge: "bg-destructive/10 text-destructive ring-destructive/20",
    severe: true,
    primary: "home",
    secondary: "back",
  },
};

export interface ErrorPageStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Ekran tipi; illustrasyon, kod, varsayilan baslik/aciklama ve aksiyonlari belirler. */
  variant: ErrorPageStateVariant;
  /** Varsayilan basligi ezer. */
  title?: React.ReactNode;
  /** Varsayilan aciklamayi ezer. */
  description?: React.ReactNode;
  /** Varsayilan durum kodu etiketini ezer; null ile gizlenir. */
  code?: React.ReactNode;
  /** Varsayilan illustrasyon ikonunu ezer. */
  icon?: React.ReactNode;
  /** "Ana Sayfa" aksiyonunun hedef adresi (asChild <a>). */
  homeHref?: string;
  /** "Tekrar Dene" aksiyonuna baglanan geri cagirim. */
  onRetry?: () => void;
  /** "Geri" aksiyonuna baglanan geri cagirim. */
  onBack?: () => void;
  /** Birincil aksiyonu tamamen ezer. */
  primaryAction?: React.ReactNode;
  /** Ikincil aksiyonu tamamen ezer. */
  secondaryAction?: React.ReactNode;
  /** Tum aksiyon alanini ezer (primaryAction/secondaryAction yerine gecer). */
  actions?: React.ReactNode;
  /** Aksiyonlarin altindaki ince yardimci metin (ornek: destek baglantisi). */
  footer?: React.ReactNode;
}

const actionMeta: Record<
  ErrorPageStateAction,
  { icon: React.ElementType; label: string }
> = {
  home: { icon: Home, label: "Ana Sayfaya Don" },
  retry: { icon: RotateCw, label: "Tekrar Dene" },
  back: { icon: ArrowLeft, label: "Geri Don" },
};

const ErrorPageState = React.forwardRef<HTMLDivElement, ErrorPageStateProps>(
  (
    {
      variant,
      title,
      description,
      code,
      icon,
      homeHref = "/",
      onRetry,
      onBack,
      primaryAction,
      secondaryAction,
      actions,
      footer,
      className,
      ...props
    },
    ref
  ) => {
    const config = variantConfig[variant];
    const Icon = config.icon;

    const renderAction = (
      kind: ErrorPageStateAction,
      emphasis: "primary" | "secondary"
    ) => {
      const { icon: ActionIcon, label } = actionMeta[kind];
      const buttonVariant = emphasis === "primary" ? "default" : "outline";

      if (kind === "home") {
        return (
          <Button asChild variant={buttonVariant} size="lg">
            <a href={homeHref}>
              <ActionIcon aria-hidden="true" />
              {label}
            </a>
          </Button>
        );
      }

      return (
        <Button
          variant={buttonVariant}
          size="lg"
          onClick={kind === "retry" ? onRetry : onBack}
        >
          <ActionIcon aria-hidden="true" />
          {label}
        </Button>
      );
    };

    const primaryNode =
      primaryAction ?? renderAction(config.primary, "primary");
    const secondaryNode =
      secondaryAction ??
      (config.secondary ? renderAction(config.secondary, "secondary") : null);

    return (
      <div
        ref={ref}
        role={config.severe ? "alert" : "status"}
        aria-live={config.severe ? "assertive" : "polite"}
        className={cn(
          "relative flex min-h-[70vh] w-full animate-fade-up flex-col items-center justify-center overflow-hidden px-6 py-16 text-center",
          className
        )}
        {...props}
      >
        {/* Dekoratif tonlu isima + grain dokusu */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/3 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl",
            config.glow
          )}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grain opacity-[0.04]"
        />

        <div className="relative flex flex-col items-center gap-6">
          {/* Illustrasyon */}
          <div className={cn(errorPageStateIllustration({ variant }))}>
            <span
              aria-hidden="true"
              className="absolute inset-3 rounded-full border border-dashed border-current opacity-20"
            />
            {icon ?? <Icon className="size-12" aria-hidden="true" />}
          </div>

          {/* Durum kodu etiketi */}
          {code !== null ? (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1",
                config.badge
              )}
            >
              {code ?? config.code}
            </span>
          ) : null}

          {/* Baslik + aciklama */}
          <div className="space-y-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title ?? config.title}
            </h1>
            <p className="mx-auto max-w-md text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description ?? config.description}
            </p>
          </div>

          {/* Aksiyonlar */}
          {actions ?? (
            <div className="mt-1 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {primaryNode}
              {secondaryNode}
            </div>
          )}

          {footer ? (
            <div className="mt-2 text-xs text-muted-foreground">{footer}</div>
          ) : null}
        </div>
      </div>
    );
  }
);
ErrorPageState.displayName = "ErrorPageState";

export { ErrorPageState, errorPageStateIllustration };
export type { ErrorPageStateVariant };
