import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Check, CornerDownLeft } from "lucide-react";

import { NumericKeypad } from "@wowsyler/ds-ui";

type NumericKeypadKey = React.ComponentProps<typeof NumericKeypad>["onKeyPress"];

const meta: Meta<typeof NumericKeypad> = {
  title: "Composites/NumericKeypad",
  component: NumericKeypad,
  decorators: [
    (Story) => (
      <div className="flex min-h-80 items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NumericKeypad>;

export const Default: Story = {
  name: "Hızlı Tutar Girişi (Fisly)",
  args: {
    currency: "₺",
    defaultValue: "1250,00",
    label: "İşlem tutarı",
  },
};

export const AdetGirisi: Story = {
  name: "Adet Girişi (Ondalıksız)",
  args: {
    allowDecimal: false,
    maxIntegerDigits: 4,
    placeholder: "0",
    label: "Ürün adedi",
  },
};

export const BosDurum: Story = {
  name: "Boş Durum",
  args: {
    currency: "₺",
    label: "Tahsil edilecek tutar",
  },
};

export const CanliTahsilat: Story = {
  name: "Canlı Tahsilat (Fisly hızlı işlem)",
  render: () => {
    const [amount, setAmount] = React.useState("");
    const [lastKey, setLastKey] = React.useState<string | null>(null);
    const [saved, setSaved] = React.useState<number | null>(null);

    const numeric = Number(amount.replace(",", ".")) || 0;
    const canSave = numeric > 0;

    const keyLabel = (key: string | null): string => {
      if (key === null) return "—";
      if (key === "backspace") return "geri sil";
      if (key === ",") return "virgül";
      return key;
    };

    const handleKeyPress: NumericKeypadKey = (key) => setLastKey(key);

    return (
      <div className="flex w-full max-w-xs flex-col gap-5">
        <div className="space-y-1 text-center">
          <h3 className="text-base font-semibold text-foreground">
            Nakit tahsilat ekle
          </h3>
          <p className="text-sm text-muted-foreground">
            Müşteriden alınan tutarı girin, kasaya işleyin.
          </p>
        </div>

        <NumericKeypad
          currency="₺"
          value={amount}
          onChange={(next) => {
            setAmount(next);
            if (saved !== null) setSaved(null);
          }}
          onKeyPress={handleKeyPress}
          label="Tahsilat tutarı"
        />

        <div className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CornerDownLeft className="size-3.5" aria-hidden="true" />
            Son tuş
          </span>
          <span className="font-medium tabular-nums text-foreground">
            {keyLabel(lastKey)}
          </span>
        </div>

        <button
          type="button"
          disabled={!canSave}
          onClick={() =>
            setSaved(Number(numeric.toFixed(2)))
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary bg-sheen px-4 text-sm font-medium text-primary-foreground shadow transition-all duration-200 hover:shadow-md hover:brightness-[1.06] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
        >
          <Check className="size-4" aria-hidden="true" />
          {canSave
            ? `${numeric.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} ₺ tahsil et`
            : "Tutar girin"}
        </button>

        {saved !== null ? (
          <p
            role="status"
            className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-center text-sm font-medium text-success animate-fade-up"
          >
            {saved.toLocaleString("tr-TR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            ₺ kasaya işlendi.
          </p>
        ) : null}
      </div>
    );
  },
};
