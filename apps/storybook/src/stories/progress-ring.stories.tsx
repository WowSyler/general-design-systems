import type { Meta, StoryObj } from "@storybook/react";

import { ProgressRing } from "@ds/ui";

const meta: Meta<typeof ProgressRing> = {
  title: "Data/ProgressRing",
  component: ProgressRing,
};

export default meta;
type Story = StoryObj<typeof ProgressRing>;

export const GlowScanSkoru: Story = {
  args: {
    value: 84,
    label: (
      <span className="flex flex-col items-center leading-none">
        <span className="text-xl font-bold">8.4</span>
        <span className="mt-1 text-[10px] font-normal text-muted-foreground">/ 10</span>
      </span>
    ),
    size: 120,
    strokeWidth: 10,
  },
};

export const ButceKullanimi: Story = {
  args: {
    value: 62,
    tone: "warning",
  },
};

export const Tonlar: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <ProgressRing value={84} tone="primary" />
      <ProgressRing value={100} tone="success" />
      <ProgressRing value={62} tone="warning" />
      <ProgressRing value={18} tone="destructive" />
    </div>
  ),
};

export const KucukBoyut: Story = {
  args: {
    value: 45,
    size: 56,
    strokeWidth: 6,
  },
};
