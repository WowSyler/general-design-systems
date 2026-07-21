/**
 * ShareButtons — Paylas butonlari yatay grubu (Dolap urun, GlowScan sonuc).
 * Sosyal platform ikonlarini (WhatsApp / X / Facebook / e-posta / baglanti
 * kopyala) yatay, kaydirilabilir bir grup halinde gosterir. Ikon-only veya
 * etiketli calisir; opsiyonel "Paylas" basligi tasir.
 *
 * Paylasim hedefleri (WhatsApp/X/Facebook/e-posta) yerel <a> baglantilaridir:
 * JavaScript olmadan da calisirlar, bu yuzden bilesen durumsuzdur ("use client"
 * gerektirmez). "Baglanti kopyala" tiklaninca varsa panoya yazar ve onCopyLink
 * geri cagrisini tetikler; geri bildirim/toast tuketiciye birakilir.
 *
 * Marka logolari (WhatsApp/X/Facebook) lucide'de bulunmadigi icin currentColor
 * ile inline SVG olarak gomulmustur ve aria-hidden'dir.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Copy, Mail, Share2 } from "lucide-react";

import { cn } from "@/lib/utils";

/** Desteklenen paylasim platformlari. */
export type ShareButtonsPlatform = "whatsapp" | "x" | "facebook" | "email" | "copy";

const shareButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border border-input bg-background font-medium text-foreground shadow-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:border-ring/60 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:transition-transform hover:[&_svg]:scale-110",
  {
    variants: {
      size: {
        sm: "text-xs [&_svg]:size-3.5",
        default: "text-sm [&_svg]:size-4",
        lg: "text-sm [&_svg]:size-[1.125rem]",
      },
      shape: {
        rounded: "rounded-md",
        pill: "rounded-full",
      },
      labeled: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { labeled: false, size: "sm", class: "size-8" },
      { labeled: false, size: "default", class: "size-9" },
      { labeled: false, size: "lg", class: "size-11" },
      { labeled: true, size: "sm", class: "h-8 px-3" },
      { labeled: true, size: "default", class: "h-9 px-4" },
      { labeled: true, size: "lg", class: "h-11 px-5" },
    ],
    defaultVariants: { size: "default", shape: "rounded", labeled: false },
  }
);

type ShareButtonsSize = NonNullable<VariantProps<typeof shareButtonVariants>["size"]>;
type ShareButtonsShape = NonNullable<VariantProps<typeof shareButtonVariants>["shape"]>;

function WhatsAppLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

type ShareHrefInput = { url: string; text?: string; emailSubject?: string };

/** Anchor tabanli platformlarin ust-veri kaydi. */
interface PlatformDef {
  label: string;
  ariaLabel: string;
  icon: React.ReactNode;
  buildHref: (input: ShareHrefInput) => string;
}

const platformDefs: Record<Exclude<ShareButtonsPlatform, "copy">, PlatformDef> = {
  whatsapp: {
    label: "WhatsApp",
    ariaLabel: "WhatsApp'ta paylas",
    icon: <WhatsAppLogo />,
    buildHref: ({ url, text }) =>
      `https://wa.me/?text=${encodeURIComponent(text ? `${text} ${url}` : url)}`,
  },
  x: {
    label: "X",
    ariaLabel: "X'te paylas",
    icon: <XLogo />,
    buildHref: ({ url, text }) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}${
        text ? `&text=${encodeURIComponent(text)}` : ""
      }`,
  },
  facebook: {
    label: "Facebook",
    ariaLabel: "Facebook'ta paylas",
    icon: <FacebookLogo />,
    buildHref: ({ url }) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  email: {
    label: "E-posta",
    ariaLabel: "E-posta ile paylas",
    icon: <Mail aria-hidden="true" />,
    buildHref: ({ url, text, emailSubject }) =>
      `mailto:?subject=${encodeURIComponent(emailSubject ?? text ?? "Bir baglanti paylasildi")}&body=${encodeURIComponent(
        text ? `${text}\n\n${url}` : url
      )}`,
  },
};

export interface ShareButtonsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Paylasilacak baglanti (zorunlu). */
  url: string;
  /** Paylasim metni / baslik; WhatsApp, X ve e-postada kullanilir. */
  text?: string;
  /** E-posta konusu; verilmezse text kullanilir. */
  emailSubject?: string;
  /** Gosterilecek platformlar ve sirasi. Varsayilan: hepsi. */
  platforms?: ShareButtonsPlatform[];
  /** Ikon yaninda metin etiketi gosterir. Varsayilan false (icon-only). */
  showLabels?: boolean;
  /** Buton boyutu. Varsayilan "default". */
  size?: ShareButtonsSize;
  /** Buton kose yaricapi. Varsayilan "rounded". */
  shape?: ShareButtonsShape;
  /** Ust "Paylas" basligini gosterir. Varsayilan true. */
  showHeading?: boolean;
  /** Baslik metni. Varsayilan "Paylas". */
  heading?: string;
  /** Anchor baglantilarini yeni sekmede acar. Varsayilan true. */
  newTab?: boolean;
  /** "Baglanti kopyala" secildiginde (panoya yazmadan sonra) cagrilir. */
  onCopyLink?: () => void;
  /** Herhangi bir platform secildiginde platform anahtariyla cagrilir. */
  onShare?: (platform: ShareButtonsPlatform) => void;
}

const defaultOrder: ShareButtonsPlatform[] = [
  "whatsapp",
  "x",
  "facebook",
  "email",
  "copy",
];

const ShareButtons = React.forwardRef<HTMLDivElement, ShareButtonsProps>(
  (
    {
      url,
      text,
      emailSubject,
      platforms = defaultOrder,
      showLabels = false,
      size = "default",
      shape = "rounded",
      showHeading = true,
      heading = "Paylas",
      newTab = true,
      onCopyLink,
      onShare,
      className,
      ...props
    },
    ref
  ) => {
    const handleCopy = () => {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard?.writeText
      ) {
        void navigator.clipboard.writeText(url).catch(() => {});
      }
      onCopyLink?.();
      onShare?.("copy");
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2.5", className)}
        {...props}
      >
        {showHeading ? (
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Share2 className="size-3.5" aria-hidden="true" />
            <span>{heading}</span>
          </div>
        ) : null}

        <div
          role="group"
          aria-label={heading}
          className="flex flex-wrap items-center gap-2"
        >
          {platforms.map((platform) => {
            if (platform === "copy") {
              return (
                <button
                  key="copy"
                  type="button"
                  onClick={handleCopy}
                  title="Baglantiyi kopyala"
                  aria-label={showLabels ? undefined : "Baglantiyi kopyala"}
                  className={cn(
                    shareButtonVariants({ size, shape, labeled: showLabels })
                  )}
                >
                  <Copy aria-hidden="true" />
                  {showLabels ? <span>Baglantiyi kopyala</span> : null}
                </button>
              );
            }

            const def = platformDefs[platform];
            return (
              <a
                key={platform}
                href={def.buildHref({ url, text, emailSubject })}
                target={newTab ? "_blank" : undefined}
                rel={newTab ? "noopener noreferrer" : undefined}
                onClick={() => onShare?.(platform)}
                title={def.label}
                aria-label={showLabels ? undefined : def.ariaLabel}
                className={cn(
                  shareButtonVariants({ size, shape, labeled: showLabels })
                )}
              >
                {def.icon}
                {showLabels ? <span>{def.label}</span> : null}
              </a>
            );
          })}
        </div>
      </div>
    );
  }
);
ShareButtons.displayName = "ShareButtons";

export { ShareButtons, shareButtonVariants };
