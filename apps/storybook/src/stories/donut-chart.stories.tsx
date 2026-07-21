import type { Meta, StoryObj } from "@storybook/react-vite";

import { DonutChart } from "@ds/ui";

const meta: Meta<typeof DonutChart> = {
  title: "Data/DonutChart",
  component: DonutChart,
};

export default meta;
type Story = StoryObj<typeof DonutChart>;

export const GiderDagilimi: Story = {
  args: {
    segments: [
      { label: "Market", value: 5620 },
      { label: "Ulaşım", value: 2140 },
      { label: "Yemek", value: 3080 },
      { label: "Fatura", value: 1640 },
    ],
    centerLabel: (
      <span className="flex flex-col leading-none">
        <span className="text-lg font-bold">₺12.480</span>
        <span className="mt-1 text-[10px] font-normal text-muted-foreground">
          Toplam
        </span>
      </span>
    ),
  },
};

export const RandevuDurumlari: Story = {
  args: {
    segments: [
      { label: "Tamamlandı", value: 32, colorIndex: 1 },
      { label: "Bekliyor", value: 9, colorIndex: 3 },
      { label: "İptal", value: 4, colorIndex: 5 },
    ],
    size: 120,
    centerLabel: "45",
  },
};

export const KucukBoyut: Story = {
  args: {
    segments: [
      { label: "Üst Giyim", value: 24 },
      { label: "Alt Giyim", value: 18 },
      { label: "Ayakkabı", value: 9 },
    ],
    size: 96,
  },
};
