import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { CartLineItem, QuantityStepper, Separator } from "@wowsyler/ds-ui";

const meta: Meta<typeof CartLineItem> = {
  title: "Commerce/CartLineItem",
  component: CartLineItem,
};

export default meta;
type Story = StoryObj<typeof CartLineItem>;

function AdetliSatir() {
  const [adet, setAdet] = React.useState(1);
  return (
    <CartLineItem
      title="Mavi Oxford Gömlek"
      variant="M Beden · Mavi"
      price="₺450"
      quantity={<QuantityStepper value={adet} onValueChange={setAdet} max={3} />}
      onRemove={() => console.log("Ürün sepetten kaldırıldı")}
      className="max-w-xl"
    />
  );
}

export const Varsayilan: Story = {
  render: () => <AdetliSatir />,
};

export const KaldirmaButonsuz: Story = {
  args: {
    title: "Siyah Deri Ceket",
    variant: "L Beden",
    price: "₺1.250",
    className: "max-w-xl",
  },
};

export const SepetListesi: Story = {
  render: () => (
    <div className="max-w-xl">
      <CartLineItem
        title="Mavi Oxford Gömlek"
        variant="M Beden · Mavi"
        price="₺450"
        onRemove={() => console.log("Gömlek kaldırıldı")}
      />
      <Separator />
      <CartLineItem
        title="Beyaz Sneaker"
        variant="42 Numara"
        price="₺780"
        onRemove={() => console.log("Sneaker kaldırıldı")}
      />
    </div>
  ),
};
