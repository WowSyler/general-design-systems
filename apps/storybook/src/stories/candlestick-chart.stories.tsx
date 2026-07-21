import type { Meta, StoryObj } from "@storybook/react-vite";

import { CandlestickChart } from "@ds/ui";

const meta: Meta<typeof CandlestickChart> = {
  title: "Data/CandlestickChart",
  component: CandlestickChart,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CandlestickChart>;

export const HaftalikPiyasa: Story = {
  args: {
    data: [
      { date: "Pzt", open: 142.4, high: 148.9, low: 141.2, close: 147.8 },
      { date: "Sal", open: 147.8, high: 151.3, low: 146.0, close: 149.6 },
      { date: "Çar", open: 149.6, high: 150.2, low: 143.4, close: 144.1 },
      { date: "Per", open: 144.1, high: 146.7, low: 140.8, close: 141.5 },
      { date: "Cum", open: 141.5, high: 145.9, low: 141.0, close: 145.3 },
      { date: "Cmt", open: 145.3, high: 149.4, low: 144.8, close: 148.7 },
      { date: "Paz", open: 148.7, high: 153.6, low: 148.2, close: 152.9 },
    ],
  },
};

export const GunlukDolapEndeksi: Story = {
  name: "Günlük Dolap Endeksi",
  args: {
    height: 300,
    data: [
      { date: "1 Tem", open: 3820, high: 3910, low: 3790, close: 3885 },
      { date: "2 Tem", open: 3885, high: 3920, low: 3805, close: 3820 },
      { date: "3 Tem", open: 3820, high: 3860, low: 3740, close: 3760 },
      { date: "4 Tem", open: 3760, high: 3810, low: 3720, close: 3805 },
      { date: "5 Tem", open: 3805, high: 3990, low: 3800, close: 3965 },
      { date: "6 Tem", open: 3965, high: 4040, low: 3940, close: 4020 },
      { date: "7 Tem", open: 4020, high: 4055, low: 3910, close: 3930 },
      { date: "8 Tem", open: 3930, high: 3985, low: 3880, close: 3975 },
      { date: "9 Tem", open: 3975, high: 4110, low: 3970, close: 4095 },
      { date: "10 Tem", open: 4095, high: 4160, low: 4060, close: 4140 },
    ],
  },
};

export const AylikDususTrendi: Story = {
  name: "Aylık Düşüş Trendi",
  args: {
    slotWidth: 44,
    valueFormatter: (value) =>
      value.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
      }),
    data: [
      { date: "Oca", open: 285, high: 292, low: 268, close: 271 },
      { date: "Şub", open: 271, high: 278, low: 254, close: 259 },
      { date: "Mar", open: 259, high: 264, low: 241, close: 246 },
      { date: "Nis", open: 246, high: 255, low: 238, close: 252 },
      { date: "May", open: 252, high: 257, low: 229, close: 233 },
      { date: "Haz", open: 233, high: 238, low: 218, close: 221 },
    ],
  },
};
