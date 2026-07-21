import type { Meta, StoryObj } from "@storybook/react-vite";

import { BudgetRing } from "@ds/ui";

const meta: Meta<typeof BudgetRing> = {
  title: "Data/BudgetRing",
  component: BudgetRing,
};

export default meta;
type Story = StoryObj<typeof BudgetRing>;

export const FislyMarketButcesi: Story = {
  args: {
    label: "Market",
    spent: 2340,
    limit: 4000,
  },
};

export const FislyUyariEsigi: Story = {
  args: {
    label: "Ulaşım",
    spent: 1720,
    limit: 2000,
  },
};

export const FislyButceAsimi: Story = {
  args: {
    label: "Yeme İçme",
    spent: 3150,
    limit: 2500,
  },
};

export const AylikGenelButce: Story = {
  args: {
    label: "Aylık Toplam Bütçe",
    spent: 8450,
    limit: 15000,
    size: 200,
  },
};
