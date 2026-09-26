"use client";

/**
 * AuthForm — Birlestirilmis kimlik dogrulama formu.
 * Tek bilesenle dort modu yonetir: login / signup / forgot / reset.
 * Moda gore alanlari (ad, e-posta, sifre, sifre-tekrar) otomatik secer;
 * sifre alanlari icin PasswordInput, birincil aksiyon icin ActionButton
 * (async onSubmit'te otomatik yuklenme) kullanir. Hata/basari geri
 * bildirimi AlertCallout ile verilir, moda gore alt navigasyon linkleri
 * (Sifremi unuttum / Hesap olustur / Girise don) onModeChange'i tetikler.
 * Opsiyonel social slotu (ornek: SocialAuthButtons) ust ya da alta konur.
 * AuthShell icinde kullanilmak uzere tasarlanmistir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui-extras/password-input";
import { ActionButton } from "@/components/composite/action-button";
import { AlertCallout } from "@/components/composite/alert-callout";

type AuthFormMode = "login" | "signup" | "forgot" | "reset";

/** onSubmit'e iletilen ve alanlardan toplanan degerler. */
interface AuthFormValues {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

type AuthFieldName = keyof AuthFormValues;

interface AuthFieldDef {
  name: AuthFieldName;
  label: string;
  placeholder: string;
  type: "text" | "email";
  autoComplete: string;
  secret?: boolean;
}

const fieldDefs: Record<AuthFieldName, AuthFieldDef> = {
  name: {
    name: "name",
    label: "Ad Soyad",
    placeholder: "Adınızı girin",
    type: "text",
    autoComplete: "name",
  },
  email: {
    name: "email",
    label: "E-posta",
    placeholder: "ornek@eposta.com",
    type: "email",
    autoComplete: "email",
  },
  password: {
    name: "password",
    label: "Şifre",
    placeholder: "••••••••",
    type: "text",
    autoComplete: "current-password",
    secret: true,
  },
  confirmPassword: {
    name: "confirmPassword",
    label: "Şifre (Tekrar)",
    placeholder: "••••••••",
    type: "text",
    autoComplete: "new-password",
    secret: true,
  },
};

interface ModeConfig {
  title: string;
  description: string;
  submitLabel: string;
  fields: AuthFieldName[];
  /** Alt navigasyon: bilgi metni + link etiketi + hedef mod. */
  nav: { prompt?: string; label: string; to: AuthFormMode };
}

const modeConfig: Record<AuthFormMode, ModeConfig> = {
  login: {
    title: "Giriş Yap",
    description: "Hesabınıza erişmek için bilgilerinizi girin.",
    submitLabel: "Giriş Yap",
    fields: ["email", "password"],
    nav: { prompt: "Hesabınız yok mu?", label: "Hesap oluştur", to: "signup" },
  },
  signup: {
    title: "Hesap Oluştur",
    description: "Birkaç saniyede yeni bir hesap oluşturun.",
    submitLabel: "Hesap Oluştur",
    fields: ["name", "email", "password", "confirmPassword"],
    nav: { prompt: "Zaten hesabınız var mı?", label: "Giriş yap", to: "login" },
  },
  forgot: {
    title: "Şifreni mi unuttun?",
    description: "E-posta adresini gir, sıfırlama bağlantısı gönderelim.",
    submitLabel: "Sıfırlama Bağlantısı Gönder",
    fields: ["email"],
    nav: { label: "Girişe dön", to: "login" },
  },
  reset: {
    title: "Yeni Şifre Belirle",
    description: "Hesabın için yeni bir güçlü şifre oluştur.",
    submitLabel: "Şifreyi Güncelle",
    fields: ["password", "confirmPassword"],
    nav: { label: "Girişe dön", to: "login" },
  },
};

export interface AuthFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "title"> {
  /** Aktif mod; gorunen alanlari ve metinleri belirler. Varsayilan "login". */
  mode?: AuthFormMode;
  /** Toplanan degerlerle cagrilir. Promise dondururse buton yuklenmeye gecer. */
  onSubmit?: (
    values: AuthFormValues,
    mode: AuthFormMode
  ) => void | Promise<unknown>;
  /** Alt link (Hesap olustur / Girise don vb.) tiklaninca yeni modu bildirir. */
  onModeChange?: (mode: AuthFormMode) => void;
  /** login modunda sifre satirindaki "Sifremi unuttum" linki tiklaninca. */
  onForgotPassword?: () => void;
  /** Baslik override (verilmezse moda gore secilir). */
  title?: React.ReactNode;
  /** Aciklama override (verilmezse moda gore secilir). */
  description?: React.ReactNode;
  /** Birincil buton etiketi override. */
  submitLabel?: React.ReactNode;
  /** Hata mesaji; verilirse ustte error tonlu AlertCallout gosterilir. */
  error?: React.ReactNode;
  /** Basari mesaji; verilirse ustte success tonlu AlertCallout gosterilir. */
  success?: React.ReactNode;
  /** Disaridan yuklenme zorlama (async onSubmit ile ayrica otomatik yonetilir). */
  loading?: boolean;
  /** Tum alanlari ve butonu devre disi birakir. */
  disabled?: boolean;
  /** Alanlarin baslangic degerleri (ornek: reset modunda e-postayi onceden doldur). */
  defaultValues?: AuthFormValues;
  /** Sosyal giris slotu (ornek: <SocialAuthButtons .../>). */
  social?: React.ReactNode;
  /** Sosyal slot konumu. Varsayilan "top". */
  socialPosition?: "top" | "bottom";
  /** Kart kabuğunu kaldirir; formu ciplak render eder. Varsayilan true. */
  asCard?: boolean;
}

function AuthDivider() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        veya
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

const AuthForm = React.forwardRef<HTMLFormElement, AuthFormProps>(
  (
    {
      mode = "login",
      onSubmit,
      onModeChange,
      onForgotPassword,
      title,
      description,
      submitLabel,
      error,
      success,
      loading = false,
      disabled = false,
      defaultValues,
      social,
      socialPosition = "top",
      asCard = true,
      className,
      ...props
    },
    ref
  ) => {
    const config = modeConfig[mode];
    const baseId = React.useId();
    const [submitting, setSubmitting] = React.useState(false);
    const [matchError, setMatchError] = React.useState<string | null>(null);

    const busy = submitting || loading;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (busy || disabled) return;

      const form = event.currentTarget;
      const data = new FormData(form);
      const values: AuthFormValues = {};
      for (const field of config.fields) {
        values[field] = (data.get(field) as string | null) ?? "";
      }

      // Sifre-tekrar tutarliligi (signup/reset) — istemci tarafi kontrol.
      if (
        config.fields.includes("confirmPassword") &&
        values.password !== values.confirmPassword
      ) {
        setMatchError("Şifreler eşleşmiyor.");
        return;
      }
      setMatchError(null);

      const result = onSubmit?.(values, mode);
      if (
        result &&
        typeof (result as { then?: unknown }).then === "function"
      ) {
        setSubmitting(true);
        (result as Promise<unknown>).then(
          () => setSubmitting(false),
          () => setSubmitting(false)
        );
      }
    };

    const showDivider = Boolean(social);

    const socialBlock = social ? (
      <div className="space-y-4">
        {social}
        {showDivider ? <AuthDivider /> : null}
      </div>
    ) : null;

    const fields = (
      <div className="space-y-4">
        {config.fields.map((fieldName) => {
          const def = fieldDefs[fieldName];
          const inputId = `${baseId}-${fieldName}`;
          const isConfirm = fieldName === "confirmPassword";
          const fieldError = isConfirm ? matchError : null;
          const showForgot = fieldName === "password" && mode === "login";

          return (
            <div key={fieldName} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor={inputId}>{def.label}</Label>
                {showForgot ? (
                  <button
                    type="button"
                    onClick={onForgotPassword ?? (() => onModeChange?.("forgot"))}
                    disabled={disabled}
                    className="rounded-sm text-xs font-medium text-muted-foreground touch-hitbox underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Şifremi unuttum
                  </button>
                ) : null}
              </div>
              {def.secret ? (
                <PasswordInput
                  id={inputId}
                  name={fieldName}
                  placeholder={def.placeholder}
                  autoComplete={
                    fieldName === "password" && mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  required
                  disabled={disabled}
                  aria-invalid={fieldError ? true : undefined}
                  aria-describedby={fieldError ? `${inputId}-error` : undefined}
                />
              ) : (
                <Input
                  id={inputId}
                  name={fieldName}
                  type={def.type}
                  placeholder={def.placeholder}
                  autoComplete={def.autoComplete}
                  defaultValue={defaultValues?.[fieldName]}
                  required
                  disabled={disabled}
                />
              )}
              {fieldError ? (
                <p
                  id={`${inputId}-error`}
                  role="alert"
                  className="text-xs font-medium text-destructive"
                >
                  {fieldError}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    );

    const feedback =
      error || success ? (
        <div className="space-y-3">
          {error ? (
            <AlertCallout tone="error" title="Bir sorun oluştu" description={error} />
          ) : null}
          {success ? (
            <AlertCallout tone="success" title="Başarılı" description={success} />
          ) : null}
        </div>
      ) : null;

    const body = (
      <div className="space-y-5">
        {feedback}
        {socialPosition === "top" ? socialBlock : null}
        {fields}
        <ActionButton
          type="submit"
          fullWidth
          loading={busy}
          loadingText={config.submitLabel}
          disabled={disabled}
        >
          {submitLabel ?? config.submitLabel}
        </ActionButton>
        {socialPosition === "bottom" ? socialBlock : null}
        <div className="text-center text-sm text-muted-foreground">
          {config.nav.prompt ? <span>{config.nav.prompt} </span> : null}
          <button
            type="button"
            onClick={() => onModeChange?.(config.nav.to)}
            disabled={disabled}
            className="rounded-sm font-medium text-foreground underline-offset-4 touch-hitbox transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            {config.nav.label}
          </button>
        </div>
      </div>
    );

    const resolvedTitle = title ?? config.title;
    const resolvedDescription = description ?? config.description;

    if (!asCard) {
      return (
        <form
          ref={ref}
          onSubmit={handleSubmit}
          noValidate
          aria-busy={busy || undefined}
          className={cn("w-full space-y-5", className)}
          {...props}
        >
          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {resolvedTitle}
            </h2>
            <p className="text-sm text-muted-foreground">{resolvedDescription}</p>
          </div>
          {body}
        </form>
      );
    }

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        noValidate
        aria-busy={busy || undefined}
        className={cn("w-full", className)}
        {...props}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">{resolvedTitle}</CardTitle>
            <CardDescription>{resolvedDescription}</CardDescription>
          </CardHeader>
          <CardContent>{body}</CardContent>
          <CardFooter className="justify-center border-t bg-muted/20 py-4 text-center text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
              256-bit SSL ile korunan güvenli bağlantı
            </span>
          </CardFooter>
        </Card>
      </form>
    );
  }
);
AuthForm.displayName = "AuthForm";

export { AuthForm };
export type { AuthFormMode, AuthFormValues, AuthFieldName };
