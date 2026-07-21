import type { Meta, StoryObj } from "@storybook/react-vite";

import { BudgetBar } from "@ds/ui";
import { Car, Home, ShoppingCart, Sparkles, Utensils } from "lucide-react";

const meta: Meta<typeof BudgetBar> = {
  title: "Composites/BudgetBar",
  component: BudgetBar,
};

export default meta;
type Story = StoryObj<typeof BudgetBar>;

export const NormalKullanim: Story = {
  args: {
    label: "Yemek",
    spent: 2340,
    limit: 4000,
    icon: <Utensils />,
    className: "max-w-md",
  },
};

export const EsikUyarisi: Story = {
  args: {
    label: "Market",
    spent: 3680,
    limit: 4000,
    icon: <ShoppingCart />,
    className: "max-w-md",
  },
};

export const LimitAsildi: Story = {
  args: {
    label: "Yakıt",
    spent: 5240,
    limit: 4000,
    icon: <Car />,
    className: "max-w-md",
  },
};

export const FislyKategoriListesi: Story = {
  render: () => (
    <div className="w-full max-w-md divide-y divide-border rounded-xl border border-border bg-card p-2 shadow-sm">
      <BudgetBar label="Kira" spent={12500} limit={12500} icon={<Home />} />
      <BudgetBar label="Yemek" spent={2340} limit={4000} icon={<Utensils />} />
      <BudgetBar label="Market" spent={3680} limit={4000} icon={<ShoppingCart />} />
      <BudgetBar label="Yakıt" spent={5240} limit={4000} icon={<Car />} />
      <BudgetBar label="Eğlence" spent={720} limit={2500} icon={<Sparkles />} />
    </div>
  ),
};
