"use client";

/**
 * ActionButton — Asenkron aksiyon butonu (mevcut Button'u sarar).
 * onClick bir Promise dondururse otomatik olarak yuklenme durumuna gecer:
 * yerlesik donen Loader2 gosterir, butonu devre disi birakir ve istege bagli
 * loadingText yazar. Islem cozulunce kisa sureligine basari (Check), reddedilince
 * hata (X) ikonu gosterir. Ek "xl" boyut, fullWidth ve "pill" sekil destekler.
 * Giris / odeme / randevu-al gibi birincil CTA'lar icin uygundur.
 */
import * as React from "react";
import { Check, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

type ActionButtonSize = "sm" | "default" | "lg" | "xl";
type ActionButtonShape = "default" | "pill";
type ActionButtonStatus = "idle" | "loading" | "success" | "error";

export interface ActionButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** Sarilan Button varyanti. */
  variant?: ButtonProps["variant"];
  /** Boyut. Button'a ek olarak "xl" sunar. */
  size?: ActionButtonSize;
  /** "pill" tam yuvarlak kose verir. */
  shape?: ActionButtonShape;
  /** Buton kapsayicinin tam genisligini kaplar. */
  fullWidth?: boolean;
  /** Kontrollu yuklenme durumu (onClick Promise dondururse otomatik yonetilir). */
  loading?: boolean;
  /** Yuklenme sirasinda gosterilecek metin; verilmezse children korunur. */
  loadingText?: string;
  /** Basari aninda gosterilecek metin; verilmezse children korunur. */
  successText?: string;
  /** Hata aninda gosterilecek metin; verilmezse children korunur. */
  errorText?: string;
  /** Statik onizleme icin gecici durumu disaridan zorlar. */
  status?: "success" | "error";
  /** Basari/hata ikonunun ekranda kalma suresi (ms). Varsayilan 1800. */
  statusDuration?: number;
  /** void veya Promise dondurebilir; Promise ise yuklenme otomatik tetiklenir. */
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void | Promise<unknown>;
}

function isPromiseLike(value: unknown): value is Promise<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { then?: unknown }).then === "function"
  );
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      variant,
      size = "default",
      shape = "default",
      fullWidth = false,
      loading = false,
      loadingText,
      successText,
      errorText,
      status,
      statusDuration = 1800,
      onClick,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const [autoStatus, setAutoStatus] =
      React.useState<ActionButtonStatus>("idle");
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
      undefined
    );

    React.useEffect(
      () => () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      },
      []
    );

    const isLoading = loading || autoStatus === "loading";
    const showSuccess = status === "success" || autoStatus === "success";
    const showError = status === "error" || autoStatus === "error";

    const flashStatus = (next: "success" | "error") => {
      setAutoStatus(next);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setAutoStatus("idle"), statusDuration);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isLoading) return;
      const result = onClick?.(event);
      if (!isPromiseLike(result)) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      setAutoStatus("loading");
      result.then(
        () => flashStatus("success"),
        () => flashStatus("error")
      );
    };

    const isXl = size === "xl";
    const buttonSize = isXl ? "default" : size;

    let content: React.ReactNode;
    let announce: string | null = null;
    if (isLoading) {
      content = (
        <>
          <Loader2 className="animate-spin" aria-hidden="true" />
          {loadingText ?? children}
        </>
      );
      announce = "Yükleniyor";
    } else if (showSuccess) {
      content = (
        <>
          <Check aria-hidden="true" />
          {successText ?? children}
        </>
      );
      announce = "Tamamlandı";
    } else if (showError) {
      content = (
        <>
          <X aria-hidden="true" />
          {errorText ?? children}
        </>
      );
      announce = "Hata oluştu";
    } else {
      content = children;
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        size={buttonSize}
        onClick={handleClick}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(
          isXl && "h-12 rounded-md px-10 text-base",
          fullWidth && "w-full",
          shape === "pill" && "rounded-full",
          showSuccess && "text-success-foreground bg-success bg-sheen",
          showError && "text-destructive-foreground bg-destructive bg-sheen",
          className
        )}
        {...props}
      >
        {content}
        {announce ? (
          <span aria-live="polite" className="sr-only">
            {announce}
          </span>
        ) : null}
      </Button>
    );
  }
);
ActionButton.displayName = "ActionButton";

export { ActionButton };
