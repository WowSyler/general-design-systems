import type { Meta, StoryObj } from "@storybook/react-vite";

import { MetricBar } from "@ds/ui";

const meta: Meta<typeof MetricBar> = {
  title: "Composites/MetricBar",
  component: MetricBar,
};

export default meta;
type Story = StoryObj<typeof MetricBar>;

export const Nem: Story = {
  args: {
    label: "Nem",
    value: 72,
    tone: "primary",
  },
};

export const GlowScanMetrikleri: Story = {
  render: () => (
    <div className="max-w-sm space-y-4">
      <MetricBar label="Nem" value={72} tone="primary" />
      <MetricBar label="Elastikiyet" value={58} tone="success" />
      <MetricBar label="Gözenek Görünümü" value={41} tone="warning" />
      <MetricBar label="Kızarıklık" value={23} tone="destructive" />
      <MetricBar label="Cilt Tonu Eşitliği" value={66} tone="primary" />
    </div>
  ),
};

export const KucukBoyut: Story = {
  render: () => (
    <div className="max-w-sm space-y-3">
      <MetricBar label="Nem" value={72} size="sm" tone="primary" />
      <MetricBar label="Elastikiyet" value={58} size="sm" tone="success" />
    </div>
  ),
};

export const OzelDeger: Story = {
  args: {
    label: "Kolajen Skoru",
    value: 84,
    displayValue: "8,4 / 10",
    tone: "success",
  },
};
