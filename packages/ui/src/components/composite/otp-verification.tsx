"use client";

/**
 * OtpVerification — Tek kullanimlik kod (OTP) dogrulama karti.
 * Mevcut InputOTP primitifi uzerine kurulu kompozit: baslik, hedefe
 * (e-posta/telefon) gonderim bilgisi, kod alani, geri sayimli tekrar
 * gonderme baglantisi, Dogrula butonu ve hata durumu icerir.
 * Randevu/GlowScan/Fisly 2FA ve telefon dogrulama akislari icin.
 */

import * as React from "react";
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

export interface OtpVerificationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "title"> {
  /** Kodun gonderildigi hedef (e-posta adresi veya telefon numarasi). */
  destination: string;
  /** Ust baslik. */
  title?: React.ReactNode;
  /** Kod hane sayisi. */
  length?: number;
  /** Tekrar gonderme baglantisi icin geri sayim saniyesi. */
  resendSeconds?: number;
  /** Kontrollu deger (opsiyonel). Verilmezse bilesen kendi durumunu tutar. */
  value?: string;
  /** Deger her degistiginde tetiklenir. */
  onChange?: (value: string) => void;
  /** Dogrula tiklaninca, tam kod ile tetiklenir. */
  onVerify?: (code: string) => void;
  /** Tekrar gonder tiklaninca tetiklenir; geri sayim sifirlanir. */
  onResend?: () => void;
  /** Dogrulama isteyen buton ve alan yukleniyor durumunda kilitlenir. */
  loading?: boolean;
  /** Doluysa hata mesaji gosterilir ve alan hatali olarak isaretlenir. */
  error?: string;
  /** Dogrula buton etiketi. */
  verifyLabel?: React.ReactNode;
}

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const OtpVerification = React.forwardRef<HTMLDivElement, OtpVerificationProps>(
  (
    {
      destination,
      title = "Doğrulama kodunu girin",
      length = 6,
      resendSeconds = 45,
      value: valueProp,
      onChange,
      onVerify,
      onResend,
      loading = false,
      error,
      verifyLabel = "Doğrula",
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState("");
    const value = valueProp ?? internalValue;

    const [remaining, setRemaining] = React.useState(resendSeconds);
    const reactId = React.useId();
    const errorId = `${reactId}-error`;
    const helpId = `${reactId}-help`;

    const hasError = Boolean(error);
    const canResend = remaining <= 0;
    const isComplete = value.length === length;

    React.useEffect(() => {
      if (remaining <= 0) return;
      const timer = window.setTimeout(() => {
        setRemaining((prev) => prev - 1);
      }, 1000);
      return () => window.clearTimeout(timer);
    }, [remaining]);

    const handleChange = (next: string) => {
      if (valueProp === undefined) setInternalValue(next);
      onChange?.(next);
    };

    const handleResend = () => {
      if (!canResend) return;
      if (valueProp === undefined) setInternalValue("");
      onChange?.("");
      setRemaining(resendSeconds);
      onResend?.();
    };

    const handleVerify = () => {
      if (!isComplete || loading) return;
      onVerify?.(value);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full max-w-sm flex-col gap-5 text-center",
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
            aria-hidden="true"
          >
            <ShieldCheck className="size-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p id={helpId} className="text-sm text-muted-foreground">
              Kod{" "}
              <span className="font-medium text-foreground">{destination}</span>{" "}
              adresine gönderildi.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <InputOTP
            maxLength={length}
            value={value}
            onChange={handleChange}
            disabled={loading}
            containerClassName="justify-center"
            aria-label={`${length} haneli doğrulama kodu`}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? errorId : helpId}
          >
            <InputOTPGroup>
              {Array.from({ length }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className={cn(
                    "h-12 w-11 text-base",
                    hasError && "border-destructive text-destructive"
                  )}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {hasError ? (
            <p
              id={errorId}
              role="alert"
              className="flex items-center gap-1.5 text-sm font-medium text-destructive animate-fade-up"
            >
              <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="button"
            className="w-full"
            onClick={handleVerify}
            disabled={loading || !isComplete}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ShieldCheck className="size-4" aria-hidden="true" />
            )}
            {loading ? "Doğrulanıyor..." : verifyLabel}
          </Button>

          <p className="text-sm text-muted-foreground">
            Kod gelmedi mi?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className="rounded-sm font-medium tabular-nums text-primary touch-hitbox underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:font-normal disabled:text-muted-foreground"
            >
              {canResend
                ? "Kodu tekrar gönder"
                : `Tekrar gönder (${formatCountdown(remaining)})`}
            </button>
          </p>
        </div>
      </div>
    );
  }
);
OtpVerification.displayName = "OtpVerification";

export { OtpVerification };
