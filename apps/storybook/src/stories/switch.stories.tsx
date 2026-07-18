import type { Meta, StoryObj } from "@storybook/react";

import { Label, Switch } from "@ds/ui";

const meta: Meta<typeof Switch> = {
  title: "Primitives/Switch",
  component: Switch,
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="bildirim" />
      <Label htmlFor="bildirim">E-posta bildirimleri</Label>
    </div>
  ),
};

export const BildirimAyarlari: Story = {
  name: "Bildirim Ayarları Satırları",
  render: () => (
    <div className="w-full max-w-md divide-y rounded-lg border">
      <div className="flex items-center justify-between p-4">
        <div className="grid gap-0.5">
          <Label htmlFor="deploy">Deploy tamamlandığında bildir</Label>
          <p className="text-sm text-muted-foreground">
            DeployLens karşılaştırması hazır olunca e-posta gönderilir.
          </p>
        </div>
        <Switch id="deploy" defaultChecked />
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="grid gap-0.5">
          <Label htmlFor="fark">Görsel fark bulunduğunda uyar</Label>
          <p className="text-sm text-muted-foreground">
            Piksel farkı eşiği aşılırsa anında bildirim al.
          </p>
        </div>
        <Switch id="fark" defaultChecked />
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="grid gap-0.5">
          <Label htmlFor="haftalik">Haftalık özet</Label>
          <p className="text-sm text-muted-foreground">
            Her pazartesi geçen haftanın deploy özetini gönder.
          </p>
        </div>
        <Switch id="haftalik" />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="kapali" disabled />
      <Label htmlFor="kapali" className="text-muted-foreground">
        Slack entegrasyonu (yakında)
      </Label>
    </div>
  ),
};
