import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox, Label } from "@wowsyler/ds-ui";

const meta: Meta<typeof Checkbox> = {
  title: "Primitives/Checkbox",
  component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="kvkk" />
      <Label htmlFor="kvkk">KVKK aydınlatma metnini okudum, onaylıyorum</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="sms" defaultChecked />
      <Label htmlFor="sms">Randevu hatırlatmalarını SMS ile gönder</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="pasif" disabled />
        <Label htmlFor="pasif" className="text-muted-foreground">
          Fiş taramasında otomatik kategori (Pro plana özel)
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="pasif-secili" disabled defaultChecked />
        <Label htmlFor="pasif-secili" className="text-muted-foreground">
          KDV tutarını otomatik ayıkla
        </Label>
      </div>
    </div>
  ),
};
