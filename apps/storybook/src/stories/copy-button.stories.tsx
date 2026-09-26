import type { Meta, StoryObj } from "@storybook/react-vite";

import { CopyButton, CopyField } from "@wowsyler/ds-ui";

const meta: Meta<typeof CopyButton> = {
  title: "Primitives/CopyButton",
  component: CopyButton,
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

/** İki temel biçim: yalnız ikon ve etiketli buton (DeployLens deploy kimliği). */
export const IkonVeEtiket: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <CopyButton value="dpl_8f3a21c94b" aria-label="Deploy kimliğini kopyala" />
      <CopyButton value="dpl_8f3a21c94b" label="Kimliği kopyala" />
      <CopyButton
        value="https://app.deploylens.dev/d/8f3a21"
        label="Bağlantıyı kopyala"
        variant="secondary"
      />
    </div>
  ),
};

/** CopyField: solda monospace deger, sağda kopya butonu — panoya tek dokunuş. */
export const AlanBicimi: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Üretim yayın adresi
        </span>
        <CopyField
          label="Deploy URL"
          value="https://app.deploylens.dev/d/8f3a21"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Fisly tahsilat IBAN'ı
        </span>
        <CopyField label="IBAN" value="TR33 0006 1005 1978 6457 8413 26" />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          API anahtarı
        </span>
        <CopyField
          label="API anahtarı"
          value="dpl_demo_ORNEK_ANAHTAR_4f2b8c1a"
          copiedLabel="Panoya alındı"
        />
      </div>
    </div>
  ),
};

/** Buton varyantları ve bir Fisly fatura numarası satırı. */
export const Varyantlar: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <CopyButton value="FTR-2026-004821" label="Kopyala" variant="default" />
        <CopyButton value="FTR-2026-004821" label="Kopyala" variant="outline" />
        <CopyButton value="FTR-2026-004821" label="Kopyala" variant="ghost" />
      </div>

      <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs text-muted-foreground">Fatura numarası</span>
          <span className="truncate font-mono text-sm tabular-nums">
            FTR-2026-004821
          </span>
        </div>
        <CopyButton
          value="FTR-2026-004821"
          label="Numarayı kopyala"
          variant="outline"
          size="sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <CopyButton
          value="https://app.deploylens.dev/d/8f3a21"
          aria-label="Yayın bağlantısını kopyala"
        />
        <span className="text-xs text-muted-foreground">
          Devre dışı örneği:
        </span>
        <CopyButton value="dpl_8f3a21c94b" label="Kopyala" disabled />
      </div>
    </div>
  ),
};
