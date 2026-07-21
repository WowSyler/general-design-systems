import type { Meta, StoryObj } from "@storybook/react-vite";
import { AtSign, Globe, Percent, Search } from "lucide-react";

import { InputAffix } from "@ds/ui";

const meta: Meta<typeof InputAffix> = {
  title: "Primitives/InputAffix",
  component: InputAffix,
};

export default meta;
type Story = StoryObj<typeof InputAffix>;

export const Varsayilan: Story = {
  render: () => (
    <div className="w-80">
      <InputAffix
        leadingAddon="₺"
        trailingAddon="TL"
        inputMode="decimal"
        placeholder="0,00"
        defaultValue="149,90"
        className="tabular-nums"
      />
    </div>
  ),
};

export const Boyutlar: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <InputAffix
        inputSize="sm"
        leadingAddon="₺"
        placeholder="0,00"
        defaultValue="24,50"
        className="tabular-nums"
      />
      <InputAffix
        inputSize="md"
        leadingAddon="₺"
        placeholder="0,00"
        defaultValue="149,90"
        className="tabular-nums"
      />
      <InputAffix
        inputSize="lg"
        leadingAddon="₺"
        placeholder="0,00"
        defaultValue="1.299,00"
        className="tabular-nums"
      />
    </div>
  ),
};

export const IkonVeSonek: Story = {
  name: "İkon ve Sonek",
  render: () => (
    <div className="w-80 space-y-4">
      <InputAffix
        leadingIcon={<AtSign />}
        placeholder="kullanici_adi"
        defaultValue="ozan.k"
      />
      <InputAffix
        leadingIcon={<Globe />}
        trailingAddon=".com.tr"
        placeholder="magazam"
        defaultValue="dolap-butik"
      />
      <InputAffix
        trailingIcon={<Percent />}
        inputMode="numeric"
        placeholder="Komisyon oranı"
        defaultValue="12"
        className="tabular-nums"
      />
      <InputAffix
        leadingIcon={<Search />}
        placeholder="Ürün veya kategori ara..."
      />
    </div>
  ),
};

export const Durumlar: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <InputAffix
        leadingAddon="₺"
        placeholder="0,00"
        defaultValue="0,00"
        invalid
        aria-label="Tutar"
        className="tabular-nums"
      />
      <p className="-mt-2 text-xs text-destructive">
        Tutar sıfırdan büyük olmalıdır.
      </p>
      <InputAffix
        leadingAddon="₺"
        placeholder="0,00"
        defaultValue="850,00"
        disabled
        className="tabular-nums"
      />
    </div>
  ),
};

export const FislyTutarGirisi: Story = {
  name: "Fisly Tutar Girişi",
  render: () => (
    <form
      className="w-80 space-y-4 rounded-xl border bg-card p-5 shadow-sm"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="space-y-1.5">
        <label
          htmlFor="fisly-tutar"
          className="text-sm font-medium text-foreground"
        >
          Fiş tutarı
        </label>
        <InputAffix
          id="fisly-tutar"
          inputSize="lg"
          leadingAddon="₺"
          trailingAddon="KDV dahil"
          inputMode="decimal"
          placeholder="0,00"
          defaultValue="327,45"
          className="tabular-nums"
        />
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor="fisly-oran"
          className="text-sm font-medium text-foreground"
        >
          KDV oranı
        </label>
        <InputAffix
          id="fisly-oran"
          trailingIcon={<Percent />}
          inputMode="numeric"
          placeholder="20"
          defaultValue="20"
          className="tabular-nums"
        />
      </div>
    </form>
  ),
};
