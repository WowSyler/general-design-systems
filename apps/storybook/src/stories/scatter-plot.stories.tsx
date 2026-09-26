import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScatterPlot } from "@wowsyler/ds-ui";

const meta: Meta<typeof ScatterPlot> = {
  title: "Data/ScatterPlot",
  component: ScatterPlot,
  decorators: [
    (Story) => (
      <div className="w-full max-w-lg">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ScatterPlot>;

export const DagitimPerformansi: Story = {
  args: {
    xLabel: "Yapı süresi (sn)",
    yLabel: "Paket boyutu (KB)",
    series: [
      {
        label: "Üretim dağıtımları",
        points: [
          { x: 42, y: 820 },
          { x: 58, y: 940 },
          { x: 61, y: 1010 },
          { x: 73, y: 1180 },
          { x: 88, y: 1240 },
          { x: 96, y: 1360 },
          { x: 110, y: 1520 },
          { x: 124, y: 1610 },
        ],
      },
      {
        label: "Önizleme dağıtımları",
        points: [
          { x: 38, y: 760 },
          { x: 47, y: 690 },
          { x: 52, y: 880 },
          { x: 66, y: 830 },
          { x: 79, y: 1040 },
          { x: 91, y: 980 },
        ],
        colorIndex: 4,
      },
    ],
  },
};

export const HataOraniKorelasyonu: Story = {
  args: {
    xLabel: "İstek/sn",
    yLabel: "Hata oranı (%)",
    height: 240,
    series: [
      {
        label: "Servis düğümleri",
        points: [
          { x: 120, y: 0.4 },
          { x: 240, y: 0.6 },
          { x: 310, y: 0.9 },
          { x: 480, y: 1.3 },
          { x: 560, y: 1.8 },
          { x: 720, y: 2.6 },
          { x: 830, y: 3.4 },
          { x: 940, y: 4.1 },
        ],
        colorIndex: 5,
      },
    ],
    showLegend: false,
  },
};

export const KabarcikGecikmeDagilimi: Story = {
  args: {
    xLabel: "Ortalama gecikme (ms)",
    yLabel: "P95 gecikme (ms)",
    series: [
      {
        label: "Frankfurt bölgesi",
        points: [
          { x: 42, y: 110, r: 1200 },
          { x: 58, y: 150, r: 3400 },
          { x: 71, y: 190, r: 5600 },
          { x: 96, y: 240, r: 8900 },
          { x: 128, y: 320, r: 4200 },
        ],
        colorIndex: 2,
      },
      {
        label: "İstanbul bölgesi",
        points: [
          { x: 64, y: 180, r: 2100 },
          { x: 88, y: 220, r: 6800 },
          { x: 104, y: 280, r: 9600 },
          { x: 142, y: 360, r: 3300 },
        ],
        colorIndex: 3,
      },
    ],
  },
};
