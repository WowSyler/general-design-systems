import type { Meta, StoryObj } from "@storybook/react-vite";

import { RadarChart } from "@ds/ui";

const meta: Meta<typeof RadarChart> = {
  title: "Data/RadarChart",
  component: RadarChart,
};

export default meta;
type Story = StoryObj<typeof RadarChart>;

export const CiltAnalizi: Story = {
  args: {
    axes: [
      { label: "Nem" },
      { label: "Gözenek" },
      { label: "Kırışıklık" },
      { label: "Kızarıklık" },
      { label: "Leke" },
      { label: "Doku" },
    ],
    series: [
      {
        label: "Bu tarama",
        values: [72, 58, 41, 34, 47, 66],
        colorIndex: 1,
      },
    ],
  },
};

export const OncesiSonrasi: Story = {
  args: {
    axes: [
      { label: "Nem" },
      { label: "Gözenek" },
      { label: "Kırışıklık" },
      { label: "Kızarıklık" },
      { label: "Leke" },
      { label: "Doku" },
    ],
    series: [
      {
        label: "İlk tarama",
        values: [48, 44, 38, 61, 39, 52],
        colorIndex: 4,
      },
      {
        label: "8 hafta sonra",
        values: [78, 63, 55, 42, 58, 71],
        colorIndex: 2,
      },
    ],
  },
};

export const CiltTipiKarsilastirma: Story = {
  args: {
    size: 340,
    axes: [
      { label: "Yağ dengesi" },
      { label: "Nem" },
      { label: "Elastikiyet" },
      { label: "Parlaklık" },
      { label: "Sıkılık" },
    ],
    series: [
      {
        label: "GlowScan hedefi",
        values: [80, 85, 78, 82, 76],
        colorIndex: 3,
      },
      {
        label: "Senin cildin",
        values: [54, 62, 49, 58, 45],
        colorIndex: 5,
      },
    ],
    showDots: true,
  },
};
