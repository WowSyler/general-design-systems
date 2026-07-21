import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Phone, Send } from "lucide-react";

import { PhoneInput } from "@ds/ui";

type PhoneValue = React.ComponentProps<typeof PhoneInput>["defaultValue"];

const meta: Meta<typeof PhoneInput> = {
  title: "Primitives/Phone Input",
  component: PhoneInput,
};

export default meta;
type Story = StoryObj<typeof PhoneInput>;

export const Varsayilan: Story = {
  render: () => {
    const [value, setValue] = React.useState<PhoneValue>({
      country: "TR",
      number: "5321234567",
    });
    return (
      <div className="w-80 space-y-2">
        <label
          htmlFor="musteri-tel"
          className="text-sm font-medium text-foreground"
        >
          Cep telefonu
        </label>
        <PhoneInput
          id="musteri-tel"
          value={value}
          onValueChange={setValue}
        />
        <p className="text-xs text-muted-foreground tabular-nums">
          Kayitli deger: {value?.country} · {value?.number || "—"}
        </p>
      </div>
    );
  },
};

export const RandevuMusteriKaydi: Story = {
  render: () => {
    const [value, setValue] = React.useState<PhoneValue>({
      country: "TR",
      number: "",
    });
    const dolu = (value?.number.length ?? 0) >= 10;
    return (
      <div className="w-96 space-y-4 rounded-xl border border-border bg-card p-6 shadow-md">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-card-foreground">
            Yeni müşteri
          </h3>
          <p className="text-sm text-muted-foreground">
            Randevu onayı ve hatırlatma SMS'i bu numaraya gönderilir.
          </p>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="randevu-tel"
            className="flex items-center gap-1.5 text-sm font-medium text-card-foreground"
          >
            <Phone className="size-3.5 text-muted-foreground" aria-hidden="true" />
            Telefon numarası
          </label>
          <PhoneInput
            id="randevu-tel"
            value={value}
            onValueChange={setValue}
            searchPlaceholder="Ülke ara…"
          />
        </div>
        <button
          type="button"
          disabled={!dolu}
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary bg-sheen px-4 text-sm font-medium text-primary-foreground shadow transition-all duration-200 hover:shadow-md hover:brightness-[1.06] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          <Send className="size-4" aria-hidden="true" />
          Doğrulama kodu gönder
        </button>
      </div>
    );
  },
};

export const UlkeListesiAcik: Story = {
  render: () => (
    <div className="flex h-96 w-80 flex-col">
      <PhoneInput
        defaultOpen
        defaultValue={{ country: "DE", number: "1721234567" }}
        searchPlaceholder="Ülke veya kod ara…"
        emptyMessage="Böyle bir ülke yok."
      />
    </div>
  ),
};

export const FarkliUlkelerVeDevreDisi: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <PhoneInput defaultValue={{ country: "NL", number: "612345678" }} />
      <PhoneInput defaultValue={{ country: "GB", number: "7700900123" }} />
      <PhoneInput
        disabled
        defaultValue={{ country: "TR", number: "5321234567" }}
      />
    </div>
  ),
};
