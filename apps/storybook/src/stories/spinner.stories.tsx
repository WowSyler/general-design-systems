import type { Meta, StoryObj } from "@storybook/react";

import { Spinner } from "@ds/ui";

const meta: Meta<typeof Spinner> = {
  title: "Primitives/Spinner",
  component: Spinner,
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Varsayilan: Story = {};

export const Boyutlar: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" label="Küçük yükleniyor" />
      <Spinner size="md" label="Orta yükleniyor" />
      <Spinner size="lg" label="Büyük yükleniyor" />
    </div>
  ),
};

export const MetinliDurum: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner size="sm" label="Dağıtım günlükleri yükleniyor" />
      <span>Dağıtım günlükleri getiriliyor...</span>
    </div>
  ),
};
