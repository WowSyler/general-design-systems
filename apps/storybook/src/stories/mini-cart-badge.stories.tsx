import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShoppingCart } from "lucide-react";

import { MiniCartBadge } from "@wowsyler/ds-ui";

const meta: Meta<typeof MiniCartBadge> = {
  title: "Composites/MiniCartBadge",
  component: MiniCartBadge,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof MiniCartBadge>;

export const DolapSepet: Story = {
  name: "Dolap — üst bar sepet",
  args: {
    count: 3,
    total: "₺1.248,50",
    variant: "outline",
  },
};

export const DoluSepet: Story = {
  name: "Dolgun buton + tutar",
  args: {
    count: 8,
    total: "₺3.960,00",
    variant: "default",
    size: "lg",
  },
};

export const SadeceSayac: Story = {
  name: "Yalnız sayaç (tutarsız)",
  args: {
    count: 2,
    variant: "ghost",
    icon: <ShoppingCart className="size-4" />,
  },
};

export const CokSayida: Story = {
  name: "99+ ürün",
  args: {
    count: 128,
    max: 99,
    total: "₺54.310,90",
    variant: "outline",
  },
};

export const BosSepet: Story = {
  name: "Boş sepet",
  args: {
    count: 0,
    variant: "outline",
    total: "₺0,00",
  },
};

export const BaglantiOlarak: Story = {
  name: "Bağlantı olarak (asChild)",
  render: (args) => (
    <MiniCartBadge {...args} asChild label="Sepete git — 5 ürün">
      <a href="#sepet" />
    </MiniCartBadge>
  ),
  args: {
    count: 5,
    total: "₺2.150,00",
    variant: "default",
  },
};
