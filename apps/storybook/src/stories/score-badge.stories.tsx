import type { Meta, StoryObj } from "@storybook/react";

import { ScoreBadge } from "@ds/ui";

const meta: Meta<typeof ScoreBadge> = {
  title: "Composites/ScoreBadge",
  component: ScoreBadge,
};

export default meta;
type Story = StoryObj<typeof ScoreBadge>;

export const CiltSkoru: Story = {
  args: {
    value: 8.4,
    max: 10,
    label: "Cilt sağlığı skoru: 8,4 / 10",
  },
};

export const Boyutlar: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ScoreBadge value={8.4} size="sm" />
      <ScoreBadge value={8.4} size="md" />
      <ScoreBadge value={8.4} size="lg" />
    </div>
  ),
};

export const FarkliSkorlar: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ScoreBadge value={9.1} label="Nem skoru" />
      <ScoreBadge value={6.7} label="Elastikiyet skoru" />
      <ScoreBadge value={4.2} label="Gözenek skoru" />
    </div>
  ),
};
