import type { Meta, StoryObj } from "@storybook/react";

import { Separator } from "@ds/ui";

const meta: Meta<typeof Separator> = {
  title: "Primitives/Separator",
  component: Separator,
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  render: () => (
    <div className="w-[320px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Dolap</h4>
        <p className="text-sm text-muted-foreground">
          Gardırobunuzu dijitalleştirin, kombin önerileri alın.
        </p>
      </div>
      <Separator className="my-4" />
      <p className="text-sm text-muted-foreground">
        128 parça, 24 kombin, 6 favori.
      </p>
    </div>
  ),
};

export const Vertical: Story = {
  name: "Dikey",
  render: () => (
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Randevular</span>
      <Separator orientation="vertical" />
      <span>Müşteriler</span>
      <Separator orientation="vertical" />
      <span>Raporlar</span>
    </div>
  ),
};
