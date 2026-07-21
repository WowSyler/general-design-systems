import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search } from "lucide-react";

import { Input, Label } from "@ds/ui";

const meta: Meta<typeof Input> = {
  title: "Primitives/Input",
  component: Input,
  args: { placeholder: "İşletme adı" },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="email">E-posta</Label>
      <Input id="email" type="email" placeholder="ornek@fisly.app" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="plan">Abonelik planı</Label>
      <Input id="plan" disabled value="GlowScan Pro (yıllık)" readOnly />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className="pl-9" placeholder="Dolap içinde ara: kışlık mont..." />
    </div>
  ),
};
