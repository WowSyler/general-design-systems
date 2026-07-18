import type { Meta, StoryObj } from "@storybook/react";
import { ShoppingCart } from "lucide-react";

import { Button, ProductCard } from "@ds/ui";

const meta: Meta<typeof ProductCard> = {
  title: "Commerce/ProductCard",
  component: ProductCard,
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const MaviGomlek: Story = {
  args: {
    title: "Mavi Oxford Gömlek — Az Kullanılmış, M Beden",
    price: "₺450",
    oldPrice: "₺620",
    rating: 4.5,
    badge: "İndirim",
    action: (
      <Button className="w-full" size="sm">
        <ShoppingCart className="mr-2 size-4" aria-hidden="true" />
        Sepete Ekle
      </Button>
    ),
    className: "max-w-xs",
  },
};

export const GorselsizUrun: Story = {
  args: {
    title: "Siyah Deri Ceket — Vintage",
    price: "₺1.250",
    rating: 5,
    className: "max-w-xs",
  },
};

export const SadeFiyat: Story = {
  args: {
    title: "Beyaz Sneaker, 42 Numara",
    price: "₺780",
    badge: "Yeni",
    className: "max-w-xs",
  },
};
