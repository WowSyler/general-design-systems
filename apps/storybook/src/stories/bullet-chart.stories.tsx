import type { Meta, StoryObj } from "@storybook/react-vite";

import { BulletChart } from "@ds/ui";

const meta: Meta<typeof BulletChart> = {
  title: "Data/BulletChart",
  component: BulletChart,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BulletChart>;

// Fisly: aylik butce vs gerceklesen harcama (ortak olcek, TL bicimi).
export const FislyButceVsGerceklesme: Story = {
  args: {
    rows: [
      { label: "Market", value: 3820, target: 3500, ranges: [2500, 4000, 5000] },
      { label: "Ulaşım", value: 980, target: 1200, ranges: [800, 1400, 2000] },
      { label: "Yemek", value: 2740, target: 2200, ranges: [1500, 2500, 3200] },
      { label: "Fatura", value: 1590, target: 1650, ranges: [1000, 1800, 2400] },
      { label: "Eğlence", value: 640, target: 900, ranges: [500, 1000, 1500] },
    ],
    formatValue: (v) => `${v.toLocaleString("tr-TR")} ₺`,
  },
};

// DeployLens: servislerin SLA gerceklesme oranlari (% olcek, ortak max 100).
export const DeployLensSlaHedefi: Story = {
  args: {
    max: 100,
    rows: [
      {
        label: "API Ağ Geçidi",
        value: 99.7,
        target: 99.9,
        ranges: [95, 99, 100],
        colorIndex: 1,
      },
      {
        label: "Kimlik Servisi",
        value: 99.95,
        target: 99.9,
        ranges: [95, 99, 100],
        colorIndex: 1,
      },
      {
        label: "Ödeme Servisi",
        value: 98.4,
        target: 99.5,
        ranges: [95, 99, 100],
        colorIndex: 1,
      },
      {
        label: "Bildirim Kuyruğu",
        value: 99.2,
        target: 99.0,
        ranges: [95, 99, 100],
        colorIndex: 1,
      },
    ],
    formatValue: (v) => `%${v.toLocaleString("tr-TR")}`,
  },
};

// Randevu: gunluk doluluk hedefi (tek satir, sade, bant ve deger olmadan).
export const RandevuGunlukDoluluk: Story = {
  args: {
    showValues: false,
    barHeight: 32,
    rows: [
      { label: "Bugünkü randevu", value: 34, target: 42, colorIndex: 4 },
    ],
  },
};
