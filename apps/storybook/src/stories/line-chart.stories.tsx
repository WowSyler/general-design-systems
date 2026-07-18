import type { Meta, StoryObj } from "@storybook/react";

import { LineChart } from "@ds/ui";

const meta: Meta<typeof LineChart> = {
  title: "Data/LineChart",
  component: LineChart,
  decorators: [
    (Story) => (
      <div className="w-full max-w-lg">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LineChart>;

export const AylikGiderTrendi: Story = {
  args: {
    series: [
      {
        label: "Market",
        data: [3240, 2980, 3410, 3120, 3680, 3520],
      },
      {
        label: "Ulaşım",
        data: [1120, 1340, 980, 1210, 1450, 1380],
      },
      {
        label: "Yemek",
        data: [2140, 1890, 2320, 2610, 2480, 2750],
      },
    ],
    showLegend: true,
  },
};

export const NoktaliGorunum: Story = {
  args: {
    series: [
      {
        label: "Toplam Gider",
        data: [8420, 9150, 7680, 11240, 10380, 12480],
        colorIndex: 2,
      },
    ],
    height: 160,
    showDots: true,
    showLegend: true,
  },
};

export const FaturaKarsilastirma: Story = {
  args: {
    series: [
      {
        label: "Elektrik",
        data: [640, 720, 590, 810, 880, 940],
        colorIndex: 4,
      },
      {
        label: "Doğalgaz",
        data: [980, 1240, 760, 420, 310, 280],
        colorIndex: 5,
      },
    ],
    height: 180,
    showDots: true,
    showLegend: true,
  },
};
