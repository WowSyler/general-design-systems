import type { Meta, StoryObj } from "@storybook/react-vite";

import { GaugeChart } from "@ds/ui";

const meta: Meta<typeof GaugeChart> = {
  title: "Data/GaugeChart",
  component: GaugeChart,
};

export default meta;
type Story = StoryObj<typeof GaugeChart>;

export const GlowScanCiltSkoru: Story = {
  args: {
    value: 82,
    min: 0,
    max: 100,
    unit: "puan",
    label: "Cilt Sağlık Skoru",
    zones: [
      { from: 0, to: 40, tone: "destructive" },
      { from: 40, to: 70, tone: "warning" },
      { from: 70, to: 100, tone: "success" },
    ],
  },
};

export const DeployLensSaglik: Story = {
  args: {
    value: 58,
    min: 0,
    max: 100,
    unit: "%",
    label: "Servis Sağlığı",
    span: 270,
    size: 240,
    zones: [
      { from: 0, to: 50, tone: "destructive" },
      { from: 50, to: 80, tone: "warning" },
      { from: 80, to: 100, tone: "success" },
    ],
  },
};

export const RandevuDolulukOrani: Story = {
  args: {
    value: 74,
    min: 0,
    max: 100,
    unit: "%",
    label: "Günlük Doluluk",
    size: 200,
  },
};
