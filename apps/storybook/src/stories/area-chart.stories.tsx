import type { Meta, StoryObj } from "@storybook/react-vite";

import { AreaChart } from "@wowsyler/ds-ui";

const meta: Meta<typeof AreaChart> = {
  title: "Data/AreaChart",
  component: AreaChart,
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AreaChart>;

export const FislyGelirTrendi: Story = {
  args: {
    series: [
      {
        label: "Aylık gelir",
        data: [48200, 51400, 49800, 56300, 61200, 58900, 67400, 72100],
        colorIndex: 1,
      },
    ],
    labels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu"],
    height: 220,
    showGrid: true,
    highlightLast: true,
  },
};

export const DeployLensTrafik: Story = {
  args: {
    series: [
      {
        label: "Başarılı istek",
        data: [1240, 1680, 1520, 2140, 2980, 3410, 3120, 3890],
        colorIndex: 2,
      },
      {
        label: "Hatalı istek",
        data: [80, 140, 60, 210, 340, 180, 90, 120],
        colorIndex: 4,
      },
    ],
    labels: ["00", "03", "06", "09", "12", "15", "18", "21"],
    height: 200,
    showGrid: true,
    showLegend: true,
  },
};

export const GlowScanDuzCizgi: Story = {
  args: {
    series: [
      {
        label: "Cilt skoru",
        data: [62, 65, 61, 70, 74, 72, 78, 83],
        colorIndex: 3,
      },
    ],
    labels: ["1. hf", "2. hf", "3. hf", "4. hf", "5. hf", "6. hf", "7. hf", "8. hf"],
    height: 180,
    smooth: false,
    highlightLast: true,
    showLegend: true,
  },
};
