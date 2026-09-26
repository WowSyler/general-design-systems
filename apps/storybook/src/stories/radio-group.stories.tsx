import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label, RadioGroup, RadioGroupItem } from "@wowsyler/ds-ui";

const meta: Meta<typeof RadioGroup> = {
  title: "Primitives/RadioGroup",
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  name: "Ödeme Yöntemi",
  render: () => (
    <RadioGroup defaultValue="kart" className="grid gap-3">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="kart" id="kart" />
        <Label htmlFor="kart">Kredi / banka kartı</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="nakit" id="nakit" />
        <Label htmlFor="nakit">Salonda nakit ödeme</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="havale" id="havale" />
        <Label htmlFor="havale">Havale / EFT</Label>
      </div>
    </RadioGroup>
  ),
};

export const WithDescription: Story = {
  name: "Açıklamalı",
  render: () => (
    <RadioGroup defaultValue="online" className="grid gap-4">
      <div className="flex items-start gap-2">
        <RadioGroupItem value="online" id="online" className="mt-1" />
        <div className="grid gap-0.5">
          <Label htmlFor="online">Online ön ödeme</Label>
          <p className="text-sm text-muted-foreground">
            Randevu anında kartla ödeyin, gelmediğinizde iade edilmez.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <RadioGroupItem value="kapida" id="kapida" className="mt-1" />
        <div className="grid gap-0.5">
          <Label htmlFor="kapida">Salonda ödeme</Label>
          <p className="text-sm text-muted-foreground">
            Hizmet sonrası dilediğiniz yöntemle ödeyin.
          </p>
        </div>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="kart" disabled className="grid gap-3">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="kart" id="d-kart" />
        <Label htmlFor="d-kart" className="text-muted-foreground">
          Kredi kartı
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="nakit" id="d-nakit" />
        <Label htmlFor="d-nakit" className="text-muted-foreground">
          Nakit
        </Label>
      </div>
    </RadioGroup>
  ),
};
