import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarPlus } from "lucide-react";

import { Button, ProviderCard } from "@ds/ui";

const meta: Meta<typeof ProviderCard> = {
  title: "Commerce/ProviderCard",
  component: ProviderCard,
};

export default meta;
type Story = StoryObj<typeof ProviderCard>;

/** Randevu uygulamasinda tek bir saglayici karti — dogrulanmis kuafor. */
export const Kuafor: Story = {
  args: {
    name: "Makas Kuaför Stüdyo",
    category: "Kuaför & Berber",
    rating: 4.8,
    reviewCount: 342,
    location: "Moda, Kadıköy",
    distance: "1,2 km",
    nextSlot: "Bugün 15:30",
    verified: true,
    className: "max-w-sm",
  },
};

/** Puani yuksek, yorumlu bir dis klinigi; ozel CTA slotu ile. */
export const DisKlinigi: Story = {
  args: {
    name: "Nişantaşı Ağız ve Diş Sağlığı",
    category: "Diş Hekimi · Ağız Sağlığı",
    rating: 4.9,
    reviewCount: 1287,
    location: "Nişantaşı, Şişli",
    distance: "3,4 km",
    nextSlot: "Yarın 09:00",
    verified: true,
    action: (
      <Button className="w-full">
        <CalendarPlus className="mr-2 size-4" aria-hidden="true" />
        Muayene Randevusu Al
      </Button>
    ),
    className: "max-w-sm",
  },
};

/** Musait slotu olmayan, henuz dogrulanmamis saglayici (bos-durum vurgusu). */
export const SlotYok: Story = {
  args: {
    name: "Zen Masaj & Terapi",
    category: "Masaj · Spa",
    rating: 4.3,
    reviewCount: 58,
    location: "Bağdat Caddesi, Kadıköy",
    distance: "5,1 km",
    verified: false,
    ctaLabel: "Uygunluk Bildir",
    className: "max-w-sm",
  },
};

/** Randevu saglayici listesi — arama sonuclari izgarasi. */
export const SaglayiciListesi: Story = {
  render: () => (
    <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
      <ProviderCard
        name="Makas Kuaför Stüdyo"
        category="Kuaför & Berber"
        rating={4.8}
        reviewCount={342}
        location="Moda, Kadıköy"
        distance="1,2 km"
        nextSlot="Bugün 15:30"
        verified
      />
      <ProviderCard
        name="Glow Cilt Bakım Merkezi"
        category="Güzellik · Cilt Bakımı"
        rating={4.6}
        reviewCount={214}
        location="Bahariye, Kadıköy"
        distance="2,0 km"
        nextSlot="Bugün 18:00"
        verified
      />
      <ProviderCard
        name="Nişantaşı Ağız ve Diş Sağlığı"
        category="Diş Hekimi · Ağız Sağlığı"
        rating={4.9}
        reviewCount={1287}
        location="Nişantaşı, Şişli"
        distance="3,4 km"
        nextSlot="Yarın 09:00"
        verified
      />
      <ProviderCard
        name="Zen Masaj & Terapi"
        category="Masaj · Spa"
        rating={4.3}
        reviewCount={58}
        location="Bağdat Caddesi, Kadıköy"
        distance="5,1 km"
        ctaLabel="Uygunluk Bildir"
      />
    </div>
  ),
};
