import type { Meta, StoryObj } from "@storybook/react-vite";

import { GroupedBarChart } from "@wowsyler/ds-ui";

const meta: Meta<typeof GroupedBarChart> = {
  title: "Data/GroupedBarChart",
  component: GroupedBarChart,
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GroupedBarChart>;

export const FislyGelirGider: Story = {
  args: {
    categories: ["Oca", "Şub", "Mar", "Nis", "May", "Haz"],
    series: [
      { label: "Gelir", data: [18400, 21250, 19800, 24600, 23100, 27350] },
      { label: "Gider", data: [12800, 14100, 13600, 16900, 15400, 17250] },
    ],
    valueFormatter: (value: number) =>
      value.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
      }),
    height: 260,
  },
};

export const DeployLensOncesiSonrasi: Story = {
  args: {
    categories: ["Derleme", "Test", "Dağıtım", "Soğuk Başlatma"],
    series: [
      { label: "Önceki", data: [148, 92, 63, 41], colorIndex: 5 },
      { label: "Sonraki", data: [86, 54, 38, 19], colorIndex: 1 },
    ],
    showValues: true,
    valueFormatter: (value: number) => `${value} sn`,
    height: 240,
  },
};

export const GlowScanUcSeri: Story = {
  args: {
    categories: ["Nem", "Yağ", "Gözenek", "Kızarıklık", "Leke"],
    series: [
      { label: "1. Hafta", data: [42, 68, 55, 61, 47], colorIndex: 2 },
      { label: "4. Hafta", data: [58, 54, 49, 44, 38], colorIndex: 3 },
      { label: "8. Hafta", data: [71, 46, 41, 33, 29], colorIndex: 4 },
    ],
    valueFormatter: (value: number) => `%${value}`,
    height: 260,
  },
};
