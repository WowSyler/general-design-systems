import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { CheckCircle2 } from "lucide-react";

import { OtpVerification } from "@wowsyler/ds-ui";

const meta: Meta<typeof OtpVerification> = {
  title: "Composites/OtpVerification",
  component: OtpVerification,
  decorators: [
    (Story) => (
      <div className="flex min-h-64 items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OtpVerification>;

export const Default: Story = {
  name: "E-posta Doğrulama (Fisly)",
  args: {
    title: "E-posta adresini doğrula",
    destination: "info@fisly.com.tr",
    resendSeconds: 45,
  },
};

export const TelefonDogrulama: Story = {
  name: "SMS ile Telefon Doğrulama (Randevu)",
  args: {
    title: "Telefon numaranı doğrula",
    destination: "+90 555 012 34 78",
    length: 4,
    resendSeconds: 30,
    verifyLabel: "Numarayı doğrula",
  },
};

export const HataliKod: Story = {
  name: "Hatalı Kod",
  args: {
    title: "Güvenlik kodunu girin",
    destination: "a***n@glowscan.app",
    value: "402517",
    error: "Girdiğiniz kod hatalı veya süresi dolmuş. Lütfen tekrar deneyin.",
    resendSeconds: 0,
  },
};

export const CanliDogrulama: Story = {
  name: "Canlı Doğrulama (GlowScan 2FA)",
  render: () => {
    const DOGRU_KOD = "480210";
    const [code, setCode] = React.useState("");
    const [error, setError] = React.useState<string | undefined>(undefined);
    const [loading, setLoading] = React.useState(false);
    const [verified, setVerified] = React.useState(false);

    if (verified) {
      return (
        <div className="flex w-full max-w-sm flex-col items-center gap-3 text-center animate-fade-up">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-success/10 text-success ring-1 ring-inset ring-success/20">
            <CheckCircle2 className="size-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">
              Cihazın doğrulandı
            </h2>
            <p className="text-sm text-muted-foreground">
              GlowScan hesabına güvenle giriş yapabilirsin. Test kodu:{" "}
              <span className="font-medium tabular-nums text-foreground">
                480210
              </span>
            </p>
          </div>
        </div>
      );
    }

    return (
      <OtpVerification
        title="Cihazını doğrula"
        destination="+90 532 114 90 22"
        value={code}
        error={error}
        loading={loading}
        resendSeconds={30}
        onChange={(next) => {
          setCode(next);
          if (error) setError(undefined);
        }}
        onVerify={(entered) => {
          setLoading(true);
          window.setTimeout(() => {
            setLoading(false);
            if (entered === DOGRU_KOD) {
              setVerified(true);
            } else {
              setError("Kod hatalı. Test için 480210 girin.");
            }
          }, 900);
        }}
        onResend={() => {
          setCode("");
          setError(undefined);
        }}
      />
    );
  },
};
