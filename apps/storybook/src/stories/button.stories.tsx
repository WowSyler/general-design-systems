import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download, Plus } from "lucide-react";

import { Button } from "@wowsyler/ds-ui";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  args: { children: "Kaydet" },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Birincil</Button>
      <Button variant="secondary">İkincil</Button>
      <Button variant="outline">Çerçeveli</Button>
      <Button variant="ghost">Hayalet</Button>
      <Button variant="destructive">Sil</Button>
      <Button variant="link">Bağlantı</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Küçük</Button>
      <Button size="default">Normal</Button>
      <Button size="lg">Büyük</Button>
      <Button size="icon" aria-label="Ekle">
        <Plus className="size-4" />
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Button>
      <Download className="mr-2 size-4" /> Raporu indir
    </Button>
  ),
};
