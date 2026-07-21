import type { Meta, StoryObj } from "@storybook/react-vite";

import { PriceTag } from "@ds/ui";

const meta: Meta<typeof PriceTag> = {
  title: "Commerce/PriceTag",
  component: PriceTag,
};

export default meta;
type Story = StoryObj<typeof PriceTag>;

/** Dolap urun kartinda: indirimli fiyat, otomatik hesaplanan rozet. */
export const KartFiyati: Story = {
  args: {
    price: 450,
    originalPrice: 620,
    size: "md",
  },
};

/** Dolap urun detayinda: buyuk fiyat, ustu cizili orijinal ve pazarlik etiketi. */
export const DetaySayfasi: Story = {
  args: {
    price: 1250,
    originalPrice: 1890,
    negotiable: true,
    size: "lg",
  },
};

/** Rayda (liste satirinda) kompakt gosterim: indirimsiz sade fiyat. */
export const RaydaSade: Story = {
  args: {
    price: 180,
    size: "sm",
  },
};

/** Elle verilen indirim yuzdesi ve pazarliga acik etiketi birlikte. */
export const PazarligaAcik: Story = {
  args: {
    price: 780,
    originalPrice: 980,
    discountPercent: 20,
    negotiable: true,
    size: "md",
  },
};

/** Uc boyutun (sm / md / lg) tek bakista karsilastirmasi. */
export const Boyutlar: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <PriceTag size="sm" price={295} originalPrice={420} />
      <PriceTag size="md" price={295} originalPrice={420} negotiable />
      <PriceTag size="lg" price={295} originalPrice={420} />
    </div>
  ),
};
