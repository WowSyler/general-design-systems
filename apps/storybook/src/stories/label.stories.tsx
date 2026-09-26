import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox, Input, Label, Switch } from "@wowsyler/ds-ui";

/**
 * Label — form kontrollerinin erişilebilir etiketi (Radix Label).
 * `htmlFor` ile kontrole bağlanır; etikete tıklamak kontrolü odaklar/değiştirir.
 * `peer-disabled` ile devre dışı kontrolün etiketi de soluklaşır.
 */
const meta: Meta<typeof Label> = {
  title: "Primitives/Label",
  component: Label,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Varsayilan: Story = {
  name: "Metin alanı ile",
  render: () => (
    <div className="grid w-[320px] max-w-full gap-2">
      <Label htmlFor="label-iban">IBAN</Label>
      <Input id="label-iban" placeholder="TR00 0000 0000 0000 0000 0000 00" />
    </div>
  ),
};

export const Zorunlu: Story = {
  name: "Zorunlu alan işareti",
  render: () => (
    <div className="grid w-[320px] max-w-full gap-2">
      <Label htmlFor="label-ad">
        Ad soyad <span className="text-destructive" aria-hidden="true">*</span>
        <span className="sr-only">(zorunlu)</span>
      </Label>
      <Input id="label-ad" required aria-required="true" placeholder="Ayşe Yılmaz" />
    </div>
  ),
};

export const SecimKontrolleri: Story = {
  name: "Onay kutusu ve anahtar ile",
  render: () => (
    <div className="grid w-[320px] max-w-full gap-1">
      <div className="flex min-h-11 items-center gap-3">
        <Checkbox id="label-kvkk" defaultChecked />
        <Label htmlFor="label-kvkk">KVKK aydınlatma metnini okudum</Label>
      </div>
      <div className="flex min-h-11 items-center gap-3">
        <Checkbox id="label-kapali" disabled />
        <Label htmlFor="label-kapali">Kampanya e-postaları (devre dışı)</Label>
      </div>
      <div className="flex min-h-11 items-center justify-between gap-3">
        <Label htmlFor="label-bildirim">Randevu hatırlatmaları</Label>
        <Switch id="label-bildirim" defaultChecked />
      </div>
    </div>
  ),
};
