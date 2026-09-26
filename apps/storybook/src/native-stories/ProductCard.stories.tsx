import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid, PriceTag, ProductCard, Rating, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/ProductCard", component: ProductCard, ...nativeMeta, args: { title: "Keten oversize gömlek", brand: "Mango", price: 450, originalPrice: 600, meta: "M beden · Az kullanılmış" } } satisfies Meta<typeof ProductCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Izgara: Story = {
  render: () => {
    const [fav, setFav] = React.useState<Record<string, boolean>>({ b: true });
    const items = [
      { id: "a", title: "Keten oversize gömlek", brand: "Mango", price: 450, originalPrice: 600, meta: "M · Az kullanılmış", badge: "Yeni" },
      { id: "b", title: "Deri çapraz çanta", brand: "Zara", price: 820, meta: "Tek beden · Yeni gibi" },
      { id: "c", title: "Yün kaşe kaban", brand: "COS", price: 2150, originalPrice: 2900, meta: "S · İyi" },
      { id: "d", title: "Beyaz sneaker", brand: "Adidas", price: 900, meta: "39 · Kullanılmış", sold: true },
    ];
    return (
      <Grid columns={{ base: 2, md: 3, lg: 4 }}>
        {items.map((i) => (
          <ProductCard
            key={i.id}
            title={i.title}
            brand={i.brand}
            price={i.price}
            originalPrice={i.originalPrice}
            meta={i.meta}
            badge={i.badge}
            soldOut={i.sold}
            favorite={fav[i.id] === true}
            onToggleFavorite={(n) => setFav((f) => ({ ...f, [i.id]: n }))}
            onPress={() => undefined}
          />
        ))}
      </Grid>
    );
  },
};

export const FiyatVePuan: Story = {
  render: () => {
    const [r, setR] = React.useState(4);
    return (
      <VStack gap="lg">
        <PriceTag price={450} originalPrice={600} size="lg" />
        <PriceTag price={1299.9} fractionDigits={2} />
        <Rating value={4.5} count={128} showValue />
        <Rating value={r} onChange={setR} size={24} accessibilityLabel="Satıcıyı puanla" />
      </VStack>
    );
  },
};
