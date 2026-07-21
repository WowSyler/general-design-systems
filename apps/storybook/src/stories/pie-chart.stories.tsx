import type { Meta, StoryObj } from "@storybook/react-vite";

import { PieChart } from "@ds/ui";

const meta: Meta<typeof PieChart> = {
  title: "Data/PieChart",
  component: PieChart,
};

export default meta;
type Story = StoryObj<typeof PieChart>;

export const HarcamaDagilimi: Story = {
  args: {
    segments: [
      { label: "Market", value: 4820 },
      { label: "Kira", value: 9500 },
      { label: "Ulaşım", value: 1740 },
      { label: "Eğlence", value: 2260 },
      { label: "Faturalar", value: 1980 },
    ],
    size: 200,
  },
};

export const DilimEtiketleriVeAyirma: Story = {
  name: "Dilim Etiketleri + Ayırma",
  args: {
    segments: [
      { label: "Yeme İçme", value: 38, colorIndex: 1 },
      { label: "Abonelikler", value: 22, colorIndex: 2 },
      { label: "Alışveriş", value: 27, colorIndex: 4 },
      { label: "Diğer", value: 13, colorIndex: 5 },
    ],
    size: 200,
    padAngle: 3,
    showSliceLabels: true,
  },
};

export const TekOranLegendsiz: Story = {
  name: "Tek Oran (legend'siz)",
  args: {
    segments: [
      { label: "Bütçe içi", value: 72, colorIndex: 1 },
      { label: "Bütçe aşımı", value: 28, colorIndex: 5 },
    ],
    size: 160,
    showLegend: false,
    showSliceLabels: true,
  },
};
