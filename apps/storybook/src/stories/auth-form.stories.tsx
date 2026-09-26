import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { ScanFace, Sparkles } from "lucide-react";

import { AuthForm, AuthShell, SocialAuthButtons } from "@wowsyler/ds-ui";

type AuthFormMode = React.ComponentProps<typeof AuthForm>["mode"];

const meta: Meta<typeof AuthForm> = {
  title: "Composites/AuthForm",
  component: AuthForm,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof AuthForm>;

/**
 * Tam akis: modlar arasi gecis (login <-> signup <-> forgot <-> reset),
 * sosyal giris slotu ve async gonderim (yuklenme animasyonu) bir arada.
 * GlowScan cilt analizi hesabina giris senaryosu.
 */
function AuthFlowDemo() {
  const [mode, setMode] = React.useState<AuthFormMode>("login");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleSubmit = (
    values: { email?: string; password?: string },
    current: AuthFormMode
  ) =>
    new Promise<void>((resolve, reject) => {
      setError(null);
      setSuccess(null);
      setTimeout(() => {
        if (current === "login" && values.password === "yanlis") {
          setError("E-posta veya şifre hatalı. Lütfen tekrar deneyin.");
          reject(new Error("gecersiz"));
          return;
        }
        if (current === "forgot") {
          setSuccess(
            `${values.email ?? "adresinize"} sıfırlama bağlantısı gönderildi.`
          );
        }
        resolve();
      }, 1200);
    });

  const switchMode = (next: AuthFormMode) => {
    setMode(next);
    setError(null);
    setSuccess(null);
  };

  return (
    <AuthShell
      logo={
        <span className="flex items-center gap-2 text-lg font-semibold">
          <ScanFace className="size-6 text-primary" /> GlowScan
        </span>
      }
      footer={
        <p>
          Devam ederek{" "}
          <a href="#" className="font-medium text-foreground underline">
            Kullanım Şartları
          </a>{" "}
          ve{" "}
          <a href="#" className="font-medium text-foreground underline">
            Gizlilik Politikası
          </a>
          &apos;nı kabul edersiniz.
        </p>
      }
    >
      <AuthForm
        mode={mode}
        error={error}
        success={success}
        onSubmit={handleSubmit}
        onModeChange={switchMode}
        social={
          mode === "login" || mode === "signup" ? (
            <SocialAuthButtons providers={["google", "apple"]} />
          ) : undefined
        }
      />
    </AuthShell>
  );
}

export const Akis: Story = {
  name: "Tam Akış (İnteraktif)",
  render: () => <AuthFlowDemo />,
};

/**
 * Kayit modu: ad, e-posta, sifre ve sifre-tekrar alanlari;
 * sifreler eslesmezse alan-ici hata gosterir (deneme: farkli iki sifre gir).
 * Dolap ikinci el moda pazari uyelik akisi.
 */
export const Kayit: Story = {
  name: "Kayıt (Signup)",
  render: () => (
    <AuthShell
      logo={<span className="text-lg font-semibold">Dolap</span>}
      footer={<p>Gardırobunu paraya çevirmeye bugün başla.</p>}
    >
      <AuthForm
        mode="signup"
        social={<SocialAuthButtons providers={["google", "apple"]} />}
        onSubmit={() => new Promise((resolve) => setTimeout(resolve, 1000))}
      />
    </AuthShell>
  ),
};

/**
 * Sifre sifirlama akisi: sadece e-posta alani, basari geri bildirimi
 * ve "Girise don" alt linki. Randevu klinik yonetim paneli senaryosu.
 */
export const SifremiUnuttum: Story = {
  name: "Şifremi Unuttum + Başarı",
  render: () => (
    <AuthShell
      logo={
        <span className="flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="size-5 text-primary" /> Randevu
        </span>
      }
    >
      <AuthForm
        mode="forgot"
        success="ozan@klinik.com adresine sıfırlama bağlantısı gönderildi. Gelen kutunu kontrol et."
        onSubmit={() => new Promise((resolve) => setTimeout(resolve, 900))}
      />
    </AuthShell>
  ),
};
