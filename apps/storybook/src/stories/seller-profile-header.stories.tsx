import type { Meta, StoryObj } from "@storybook/react-vite";

import { SellerProfileHeader } from "@wowsyler/ds-ui";

const meta: Meta<typeof SellerProfileHeader> = {
  title: "Composites/SellerProfileHeader",
  component: SellerProfileHeader,
};

export default meta;
type Story = StoryObj<typeof SellerProfileHeader>;

/** Dolap satıcı profili: doğrulanmış rozet, istatistikler ve aksiyon butonları. */
export const DolapSaticiProfili: Story = {
  render: () => (
    <div className="w-[26rem] max-w-full">
      <SellerProfileHeader
        name="Selin Aksoy"
        handle="@selin.vintage"
        fallback="SA"
        verified
        followers={12480}
        rating={4.9}
        ratingCount={2143}
        sold={5860}
        joinedLabel="2021'den beri üye · Genelde 1 saat içinde yanıtlar"
        onFollow={() => {}}
        onMessage={() => {}}
      />
    </div>
  ),
};

/** Zaten takip edilen satıcı: buton "Takip Ediliyor" durumuna geçer. */
export const TakipEdiliyor: Story = {
  render: () => (
    <div className="w-[26rem] max-w-full">
      <SellerProfileHeader
        name="Kerem Doğan"
        handle="@keremin.dolabi"
        fallback="KD"
        verified
        followers={3218}
        rating={4.7}
        ratingCount={648}
        sold={1290}
        joinedLabel="2023'ten beri üye"
        following
        onFollow={() => {}}
        onMessage={() => {}}
      />
    </div>
  ),
};

/** Yeni satıcı: rozetsiz, düşük istatistikli ve yalnızca mesaj butonlu sade blok. */
export const YeniSatici: Story = {
  render: () => (
    <div className="w-[26rem] max-w-full">
      <SellerProfileHeader
        name="Ece Yıldırım"
        fallback="EY"
        followers={42}
        rating={5.0}
        ratingCount={8}
        sold={11}
        joinedLabel="Bu ay katıldı"
        onMessage={() => {}}
      />
    </div>
  ),
};
