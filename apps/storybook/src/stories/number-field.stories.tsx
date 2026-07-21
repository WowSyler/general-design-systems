import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { NumberField } from "@ds/ui";

const meta: Meta<typeof NumberField> = {
  title: "Primitives/Number Field",
  component: NumberField,
};

export default meta;
type Story = StoryObj<typeof NumberField>;

export const KisiSayisi: Story = {
  render: () => {
    const [kisi, setKisi] = React.useState<number | null>(2);
    return (
      <div className="w-72 space-y-2">
        <label
          htmlFor="randevu-kisi"
          className="text-sm font-medium text-foreground"
        >
          Rezervasyon için kişi sayısı
        </label>
        <NumberField
          id="randevu-kisi"
          value={kisi}
          onValueChange={setKisi}
          min={1}
          max={12}
          step={1}
          aria-label="Kişi sayısı"
        />
        <p className="text-xs text-muted-foreground">
          Randevu başına en fazla 12 kişi. Şu an: {kisi ?? "—"} kişi.
        </p>
      </div>
    );
  },
};

export const TutarAlani: Story = {
  render: () => {
    const [tutar, setTutar] = React.useState<number | null>(1250);
    return (
      <div className="w-72 space-y-2">
        <label
          htmlFor="fisly-tutar"
          className="text-sm font-medium text-foreground"
        >
          Fatura tutarı
        </label>
        <NumberField
          id="fisly-tutar"
          className="w-full"
          value={tutar}
          onValueChange={setTutar}
          min={0}
          step={50}
          format="currency"
          currency="TRY"
          align="end"
          placeholder="₺0,00"
          aria-label="Fatura tutarı"
        />
        <p className="text-xs text-muted-foreground">
          Fisly gider kaydı — 50 ₺ adımlarla düzenleyin.
        </p>
      </div>
    );
  },
};

export const OranVeOndalik: Story = {
  render: () => {
    const [kdv, setKdv] = React.useState<number | null>(20);
    const [ph, setPh] = React.useState<number | null>(5.5);
    return (
      <div className="w-72 space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="kdv-orani"
            className="text-sm font-medium text-foreground"
          >
            KDV oranı
          </label>
          <NumberField
            id="kdv-orani"
            className="w-full"
            value={kdv}
            onValueChange={setKdv}
            min={0}
            max={100}
            step={1}
            format="percent"
            align="end"
            aria-label="KDV oranı"
          />
          <p className="text-xs text-muted-foreground">
            Ok tuşlarıyla artırın, PageUp/PageDown ile 10&apos;ar basamak atlayın.
          </p>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="glowscan-ph"
            className="text-sm font-medium text-foreground"
          >
            Cilt pH değeri
          </label>
          <NumberField
            id="glowscan-ph"
            className="w-full"
            value={ph}
            onValueChange={setPh}
            min={0}
            max={14}
            step={0.1}
            suffix=" pH"
            align="end"
            aria-label="Cilt pH değeri"
          />
          <p className="text-xs text-muted-foreground">
            GlowScan ölçümü — 0,1 hassasiyetle ondalık giriş.
          </p>
        </div>
      </div>
    );
  },
};

export const DurumlarVeBoyutlar: Story = {
  render: () => {
    const [adet, setAdet] = React.useState<number | null>(3);
    return (
      <div className="flex w-72 flex-col gap-5">
        <NumberField
          value={adet}
          onValueChange={setAdet}
          size="sm"
          min={0}
          aria-label="Küçük boy"
        />
        <NumberField
          value={adet}
          onValueChange={setAdet}
          size="lg"
          min={0}
          aria-label="Büyük boy"
        />
        <NumberField
          value={12}
          readOnly
          min={0}
          aria-label="Salt okunur alan"
        />
        <NumberField
          value={5}
          disabled
          min={0}
          aria-label="Devre dışı alan"
        />
      </div>
    );
  },
};
