import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { WaterfallChart } from "@wowsyler/ds-ui";

type Steps = React.ComponentProps<typeof WaterfallChart>["steps"];

const meta: Meta<typeof WaterfallChart> = {
  title: "Data/WaterfallChart",
  component: WaterfallChart,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof WaterfallChart>;

// Fisly: aylik nakit akisi. Devir + gelirler - giderler -> ay sonu bakiye.
const fislyNakitAkisi: Steps = [
  { label: "Devreden", value: 8400, type: "baslangic" },
  { label: "Maaş", value: 32500, type: "artis" },
  { label: "Ek Gelir", value: 4200, type: "artis" },
  { label: "Kira", value: 14500, type: "azalis" },
  { label: "Market", value: 6800, type: "azalis" },
  { label: "Faturalar", value: 3100, type: "azalis" },
  { label: "Ay Sonu", value: 0, type: "toplam" },
];

export const FislyNakitAkisi: Story = {
  args: {
    steps: fislyNakitAkisi,
    valueFormatter: (v: number) =>
      `${Math.round(v).toLocaleString("tr-TR")} ₺`,
  },
};

// DeployLens: sürüm sonrası ortalama yanıt süresi değişim analizi (ms).
const deploylensDegisim: Steps = [
  { label: "v2.3 Taban", value: 480, type: "baslangic" },
  { label: "Önbellek", value: 120, type: "azalis" },
  { label: "Sorgu Düz.", value: 65, type: "azalis" },
  { label: "Yeni Modül", value: 90, type: "artis" },
  { label: "CDN", value: 40, type: "azalis" },
  { label: "v2.4 Sonuç", value: 0, type: "toplam" },
];

export const DeployLensDegisimAnalizi: Story = {
  args: {
    steps: deploylensDegisim,
    valueFormatter: (v: number) =>
      `${Math.round(v).toLocaleString("tr-TR")} ms`,
    height: 260,
  },
};

// Dolap: çeyreklik kâr-zarar dökümü, eksen kapalı sade görünüm.
const dolapKarZarar: Steps = [
  { label: "Q1 Kâr", value: 142000, type: "baslangic" },
  { label: "Satış Artışı", value: 58000, type: "artis" },
  { label: "İade/İptal", value: 21000, type: "azalis" },
  { label: "Pazarlama", value: 34000, type: "azalis" },
  { label: "Q2 Kâr", value: 0, type: "toplam" },
];

export const DolapKarZararDokumu: Story = {
  args: {
    steps: dolapKarZarar,
    showAxis: false,
    height: 220,
  },
};
