import type { Meta, StoryObj } from "@storybook/react-vite";

import { CategoryBreakdown } from "@wowsyler/ds-ui";

const meta: Meta<typeof CategoryBreakdown> = {
  title: "Composites/CategoryBreakdown",
  component: CategoryBreakdown,
};

export default meta;
type Story = StoryObj<typeof CategoryBreakdown>;

export const FislyKategorileri: Story = {
  args: {
    title: "Temmuz 2026 Gider Dağılımı",
    items: [
      { label: "Yakıt", value: "₺4.243", percent: 34 },
      { label: "Yemek", value: "₺3.494", percent: 28 },
      { label: "Ofis", value: "₺2.246", percent: 18 },
      { label: "Seyahat", value: "₺1.498", percent: 12 },
      { label: "Diğer", value: "₺999", percent: 8 },
    ],
    className: "max-w-md",
  },
};

export const Basliksiz: Story = {
  args: {
    items: [
      { label: "Yakıt", value: "₺4.243", percent: 34, colorIndex: 1 },
      { label: "Yemek", value: "₺3.494", percent: 28, colorIndex: 3 },
      { label: "Ofis", value: "₺2.246", percent: 18, colorIndex: 5 },
    ],
    className: "max-w-md",
  },
};
