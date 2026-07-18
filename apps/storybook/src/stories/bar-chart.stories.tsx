import type { Meta, StoryObj } from "@storybook/react";

import { BarChart } from "@ds/ui";

const meta: Meta<typeof BarChart> = {
  title: "Data/BarChart",
  component: BarChart,
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BarChart>;

export const AylikGiderler: Story = {
  args: {
    data: [
      { label: "Oca", value: 8420 },
      { label: "Şub", value: 9150 },
      { label: "Mar", value: 7680 },
      { label: "Nis", value: 11240 },
      { label: "May", value: 10380 },
      { label: "Haz", value: 12480 },
    ],
  },
};

export const DegerlerGorunur: Story = {
  args: {
    data: [
      { label: "Market", value: 47 },
      { label: "Ulaşım", value: 23 },
      { label: "Yemek", value: 35 },
      { label: "Fatura", value: 12 },
    ],
    showValues: true,
    height: 120,
  },
};

export const HaftalikRandevular: Story = {
  args: {
    data: [
      { label: "Pzt", value: 6 },
      { label: "Sal", value: 9 },
      { label: "Çar", value: 4 },
      { label: "Per", value: 11 },
      { label: "Cum", value: 8 },
      { label: "Cmt", value: 14 },
      { label: "Paz", value: 2 },
    ],
    showValues: true,
  },
};
