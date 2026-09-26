import type { Meta, StoryObj } from "@storybook/react-vite";

import { FunnelChart } from "@wowsyler/ds-ui";

const meta: Meta<typeof FunnelChart> = {
  title: "Data/FunnelChart",
  component: FunnelChart,
};

export default meta;
type Story = StoryObj<typeof FunnelChart>;

export const DolapSatinAlmaHunisi: Story = {
  args: {
    stages: [
      { label: "Ürünü Gördü", value: 48250 },
      { label: "Ürüne Tıkladı", value: 21840 },
      { label: "Sepete Ekledi", value: 9720 },
      { label: "Ödemeye Geçti", value: 4180 },
      { label: "Satın Aldı", value: 2960 },
    ],
  },
};

export const DeployLensOnboarding: Story = {
  args: {
    stages: [
      { label: "Kayıt Oldu", value: 3120 },
      { label: "Depo Bağladı", value: 1870 },
      { label: "İlk Dağıtım", value: 1145 },
      { label: "Ekip Davet Etti", value: 640 },
    ],
    stageHeight: 68,
  },
};

export const RandevuRezervasyonAkisi: Story = {
  args: {
    stages: [
      { label: "Salonu Ziyaret", value: 1560 },
      { label: "Hizmet Seçti", value: 820 },
      { label: "Saat Seçti", value: 540 },
      { label: "Rezervasyon", value: 386 },
    ],
    stageHeight: 56,
    formatValue: (value) => value.toLocaleString("tr-TR") + " kişi",
  },
};
