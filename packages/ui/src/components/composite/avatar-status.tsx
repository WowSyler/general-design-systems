/**
 * AvatarStatus — Mevcut Avatar'i saran durum/sekil varyanti.
 * Sag-alt kosede halka ile cevrelenmis bir mevcudiyet noktasi (online/offline/
 * away/busy) gosterir; sekil (circle/rounded/square) ve boyut (xs..2xl)
 * varyantlarini destekler. Dolap mesajlasma/satici ve Randevu danisan-uzman
 * kartlarinda kullanilir. Tema-agnostik; salt gorsel (etkilesimsiz).
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type AvatarStatusPresence = "online" | "offline" | "away" | "busy";
export type AvatarStatusShape = "circle" | "rounded" | "square";
export type AvatarStatusSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface AvatarStatusProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Avatar gorseli (yoksa initials fallback gosterilir). */
  src?: string;
  /** Gorsel icin alternatif metin. */
  alt?: string;
  /** Fallback icerigi: bas harfler veya bir ikon. */
  fallback: React.ReactNode;
  /** Erisilebilirlik/tooltip icin kisi adi. */
  name?: string;
  /** Mevcudiyet durumu; verilmezse nokta gizlenir. */
  status?: AvatarStatusPresence;
  /** Durum noktasini gizle/goster (varsayilan: status verildiyse goster). */
  showStatus?: boolean;
  /** Avatar sekli (varsayilan: circle). */
  shape?: AvatarStatusShape;
  /** Avatar boyutu (varsayilan: md). */
  size?: AvatarStatusSize;
  /** Durum etiketini elle gecersiz kil (aria/sr-only metni). */
  statusLabel?: string;
  /** Online durumu icin ince nabiz efekti. */
  pulse?: boolean;
}

const sizeConfig: Record<
  AvatarStatusSize,
  { avatar: string; text: string; dot: string; ring: string }
> = {
  xs: { avatar: "h-6 w-6", text: "text-[10px]", dot: "h-2 w-2", ring: "ring-2" },
  sm: { avatar: "h-8 w-8", text: "text-xs", dot: "h-2.5 w-2.5", ring: "ring-2" },
  md: { avatar: "h-10 w-10", text: "text-sm", dot: "h-3 w-3", ring: "ring-2" },
  lg: { avatar: "h-12 w-12", text: "text-base", dot: "h-3.5 w-3.5", ring: "ring-2" },
  xl: { avatar: "h-16 w-16", text: "text-lg", dot: "h-4 w-4", ring: "ring-[3px]" },
  "2xl": { avatar: "h-20 w-20", text: "text-xl", dot: "h-5 w-5", ring: "ring-[3px]" },
};

const shapeClasses: Record<AvatarStatusShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-xl",
  square: "rounded-none",
};

const statusPositionClasses: Record<AvatarStatusShape, string> = {
  circle: "bottom-[6%] right-[6%]",
  rounded: "-bottom-0.5 -right-0.5",
  square: "-bottom-0.5 -right-0.5",
};

const presenceConfig: Record<
  AvatarStatusPresence,
  { dot: string; label: string }
> = {
  online: { dot: "bg-success", label: "Cevrimici" },
  offline: { dot: "bg-muted-foreground/50", label: "Cevrimdisi" },
  away: { dot: "bg-warning", label: "Uzakta" },
  busy: { dot: "bg-destructive", label: "Mesgul" },
};

const AvatarStatus = React.forwardRef<HTMLSpanElement, AvatarStatusProps>(
  (
    {
      src,
      alt,
      fallback,
      name,
      status,
      showStatus,
      shape = "circle",
      size = "md",
      statusLabel,
      pulse = false,
      className,
      ...props
    },
    ref
  ) => {
    const dims = sizeConfig[size];
    const presence = status ? presenceConfig[status] : null;
    const showDot = showStatus !== false;
    const presenceText = statusLabel ?? presence?.label;

    return (
      <span
        ref={ref}
        title={name}
        className={cn("relative inline-flex shrink-0", className)}
        {...props}
      >
        <Avatar
          className={cn(
            "shadow-sm transition-all duration-200",
            dims.avatar,
            shapeClasses[shape]
          )}
        >
          {src ? <AvatarImage src={src} alt={alt ?? name ?? ""} /> : null}
          <AvatarFallback
            className={cn(
              "rounded-[inherit] bg-muted font-medium text-muted-foreground",
              dims.text
            )}
          >
            {fallback}
          </AvatarFallback>
        </Avatar>

        {presence && showDot ? (
          <span
            aria-hidden="true"
            className={cn(
              "absolute block rounded-full ring-background",
              dims.dot,
              dims.ring,
              statusPositionClasses[shape],
              presence.dot,
              pulse && status === "online" ? "animate-glow-pulse" : null
            )}
          />
        ) : null}

        {presenceText ? (
          <span className="sr-only">
            {name ? `${name}, ` : null}
            {presenceText}
          </span>
        ) : null}
      </span>
    );
  }
);
AvatarStatus.displayName = "AvatarStatus";

export { AvatarStatus };
