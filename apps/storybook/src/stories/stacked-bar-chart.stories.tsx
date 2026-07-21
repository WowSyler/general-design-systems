import type { Meta, StoryObj } from "@storybook/react-vite";

import { StackedBarChart } from "@ds/ui";

const meta: Meta<typeof StackedBarChart> = {
  title: "Data/StackedBarChart",
  component: StackedBarChart,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StackedBarChart>;

// Fisly: aylik kategori-zaman gider dagilimi (mutlak degerler).
export const FislyKategoriZaman: Story = {
  args: {
    categories: ["Oca", "Şub", "Mar", "Nis", "May", "Haz"],
    series: [
      { label: "Market", data: [3240, 2980, 3410, 3120, 3680, 3520] },
      { label: "Ulaşım", data: [1120, 1340, 980, 1210, 1450, 1380] },
      { label: "Yemek", data: [2140, 1890, 2320, 2610, 2480, 2750] },
      { label: "Fatura", data: [1480, 1620, 1390, 1740, 1580, 1690] },
    ],
    showValues: true,
  },
};

// DeployLens: ortamlara gore dagitim sayilari (yuzde-100 yigin modu).
export const DeployLensOrtamDagilimi: Story = {
  args: {
    categories: ["Pzt", "Sal", "Çar", "Per", "Cum"],
    series: [
      { label: "Üretim", data: [4, 6, 3, 8, 5], colorIndex: 1 },
      { label: "Hazırlık", data: [9, 7, 11, 6, 10], colorIndex: 3 },
      { label: "Geliştirme", data: [14, 18, 12, 21, 16], colorIndex: 4 },
    ],
    stackMode: "percent",
    height: 240,
  },
};

// Dolap: gunluk siparis durumlari (sade, eksen ve toplam olmadan).
export const DolapSiparisDurumlari: Story = {
  args: {
    categories: ["1. Hafta", "2. Hafta", "3. Hafta", "4. Hafta"],
    series: [
      { label: "Teslim Edildi", data: [128, 156, 142, 189], colorIndex: 2 },
      { label: "Kargoda", data: [42, 38, 51, 47], colorIndex: 5 },
      { label: "İptal", data: [12, 9, 15, 8], colorIndex: 1 },
    ],
    showAxis: false,
    showLegend: true,
  },
};
