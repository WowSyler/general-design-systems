import type { Meta, StoryObj } from "@storybook/react-vite";

import { LabeledField, Input, Textarea } from "@wowsyler/ds-ui";

const meta: Meta<typeof LabeledField> = {
  title: "Primitives/LabeledField",
  component: LabeledField,
};

export default meta;
type Story = StoryObj<typeof LabeledField>;

export const Varsayilan: Story = {
  render: () => (
    <div className="w-80 max-w-full">
      <LabeledField label="Salon Adı" htmlFor="salon-adi">
        <Input id="salon-adi" placeholder="Örn. Nova Güzellik Stüdyosu" />
      </LabeledField>
    </div>
  ),
};

export const Ipuclu: Story = {
  name: "İpucu Metinli",
  render: () => (
    <div className="w-80 max-w-full">
      <LabeledField
        label="Randevu Notu"
        htmlFor="randevu-notu"
        hint="Bu not yalnızca salon ekibi tarafından görülür."
      >
        <Textarea id="randevu-notu" placeholder="Müşteri saç boyası alerjisi belirtti..." />
      </LabeledField>
    </div>
  ),
};

export const Hatali: Story = {
  name: "Hata Durumu",
  render: () => (
    <div className="w-80 max-w-full">
      <LabeledField
        label="E-posta"
        htmlFor="eposta"
        required
        error="Geçerli bir e-posta adresi girin."
      >
        <Input
          id="eposta"
          type="email"
          defaultValue="ayse.yilmaz@"
          aria-invalid="true"
          className="border-destructive"
        />
      </LabeledField>
    </div>
  ),
};

export const ZorunluAlan: Story = {
  name: "Zorunlu Alan",
  render: () => (
    <div className="w-80 max-w-full">
      <LabeledField
        label="Vergi Numarası"
        htmlFor="vergi-no"
        required
        hint="Fiş eşleştirme için 10 haneli vergi numaranız gerekli."
      >
        <Input id="vergi-no" inputMode="numeric" placeholder="1234567890" />
      </LabeledField>
    </div>
  ),
};
