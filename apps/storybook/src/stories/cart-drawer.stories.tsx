import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShoppingBag } from "lucide-react";

import { Button, CartDrawer } from "@wowsyler/ds-ui";

type CartDrawerItem = React.ComponentProps<typeof CartDrawer>["items"][number];

const meta: Meta<typeof CartDrawer> = {
  title: "Composites/CartDrawer",
  component: CartDrawer,
};

export default meta;
type Story = StoryObj<typeof CartDrawer>;

const baslangicUrunleri: CartDrawerItem[] = [
  {
    id: "1",
    title: "Vintage Kot Ceket",
    variant: "M Beden · Açık Mavi",
    price: 420,
    quantity: 1,
    maxQuantity: 2,
    imageAlt: "Vintage kot ceket",
  },
  {
    id: "2",
    title: "Örgü Triko Kazak",
    variant: "S Beden · Bej",
    price: 260,
    quantity: 2,
    maxQuantity: 5,
    imageAlt: "Örgü triko kazak",
  },
  {
    id: "3",
    title: "Deri Postal",
    variant: "39 Numara · Kahverengi",
    price: 890,
    quantity: 1,
    maxQuantity: 3,
    imageAlt: "Deri postal",
  },
];

function DolapSepeti() {
  const [urunler, setUrunler] = React.useState<CartDrawerItem[]>(
    baslangicUrunleri,
  );

  const adetGuncelle = (id: string, adet: number) => {
    setUrunler((onceki) =>
      onceki.map((u) => (u.id === id ? { ...u, quantity: adet } : u)),
    );
  };

  const kaldir = (id: string) => {
    setUrunler((onceki) => onceki.filter((u) => u.id !== id));
  };

  return (
    <CartDrawer
      items={urunler}
      trigger={
        <Button variant="outline">
          <ShoppingBag /> Sepetim ({urunler.length})
        </Button>
      }
      shipping={0}
      freeShippingThreshold={1500}
      onQuantityChange={adetGuncelle}
      onRemove={kaldir}
      onCheckout={() => console.log("Ödemeye geçiliyor")}
    />
  );
}

export const Varsayilan: Story = {
  render: () => <DolapSepeti />,
};

export const KargoUcretli: Story = {
  render: () => (
    <CartDrawer
      defaultOpen
      items={[
        {
          id: "a",
          title: "Pamuklu Basic Tişört",
          variant: "L Beden · Siyah",
          price: 149,
          quantity: 3,
          maxQuantity: 6,
        },
        {
          id: "b",
          title: "Keten Şort",
          variant: "M Beden · Haki",
          price: 220,
          quantity: 1,
        },
      ]}
      shipping={49.9}
      onCheckout={() => console.log("Ödeme")}
      trigger={<Button variant="outline">Sepeti aç</Button>}
    />
  ),
};

export const AlttanCekmece: Story = {
  render: () => (
    <CartDrawer
      defaultOpen
      side="bottom"
      title="Hızlı Sepet"
      items={[
        {
          id: "x",
          title: "Retro Güneş Gözlüğü",
          variant: "Tek Beden · Amber",
          price: 320,
          quantity: 1,
          maxQuantity: 2,
        },
      ]}
      shipping={0}
      onCheckout={() => console.log("Ödeme")}
      trigger={<Button variant="outline">Alttan aç</Button>}
    />
  ),
};

export const BosSepet: Story = {
  render: () => (
    <CartDrawer
      defaultOpen
      items={[]}
      onContinueShopping={() => console.log("Keşfet")}
      trigger={<Button variant="outline">Boş sepet</Button>}
    />
  ),
};
