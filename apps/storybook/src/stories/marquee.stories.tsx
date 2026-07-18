import type { Meta, StoryObj } from "@storybook/react";

import { Marquee, TestimonialCard } from "@ds/ui";

const meta: Meta<typeof Marquee> = {
  title: "Iconic/Marquee",
  component: Marquee,
};

export default meta;
type Story = StoryObj<typeof Marquee>;

const markalar = [
  "DeployLens",
  "Dolap",
  "Randevu",
  "GlowScan",
  "Fisly",
  "Fatura.io",
  "Kargoo",
  "Bulutteknik",
];

const yorumlar = [
  {
    quote:
      "DeployLens'e geçtikten sonra dağıtım hatalarını canlıya çıkmadan yakalıyoruz. Ekip artık cuma günü de rahat deploy alıyor.",
    name: "Selin Aydın",
    title: "CTO · Bulutteknik",
    rating: 5,
  },
  {
    quote:
      "Randevu ile no-show oranımız %40 düştü. Otomatik hatırlatmalar salonumuz için oyunu değiştirdi.",
    name: "Mert Koç",
    title: "İşletme Sahibi · Kuaför Mert",
    rating: 5,
  },
  {
    quote:
      "GlowScan'in cilt analizi raporları müşterilerime somut bir yol haritası veriyor. Güven ilk seansta kuruluyor.",
    name: "Dr. Ayşe Demir",
    title: "Dermatolog · GlowScan",
    rating: 4,
  },
  {
    quote:
      "Dolap'ta dolabımı boşaltırken ek gelir elde ettim. İlan vermek gerçekten iki dakika sürüyor.",
    name: "Zeynep Yılmaz",
    title: "Satıcı · Dolap",
    rating: 5,
  },
];

/** LogoCloud tarzı sonsuz kayan marka şeridi. */
export const MarkaSeridi: Story = {
  render: () => (
    <div className="bg-background py-8">
      <Marquee speed="26s">
        {markalar.map((marka) => (
          <span
            key={marka}
            className="text-2xl font-semibold text-muted-foreground"
          >
            {marka}
          </span>
        ))}
      </Marquee>
    </div>
  ),
};

/** TestimonialCard'lardan oluşan kayan yorum şeridi. */
export const YorumSeridi: Story = {
  render: () => (
    <div className="bg-muted/30 py-10">
      <Marquee speed="40s" className="[--gap:2rem]">
        {yorumlar.map((yorum) => (
          <TestimonialCard
            key={yorum.name}
            className="w-[340px] shrink-0 bg-card"
            quote={yorum.quote}
            name={yorum.name}
            title={yorum.title}
            rating={yorum.rating}
          />
        ))}
      </Marquee>
    </div>
  ),
};

/** Ters yönde ve daha hızlı kayan ikinci bir marka şeridi. */
export const TersYon: Story = {
  render: () => (
    <div className="bg-background py-8">
      <Marquee speed="18s" reverse>
        {markalar.map((marka) => (
          <span
            key={marka}
            className="text-2xl font-semibold text-muted-foreground"
          >
            {marka}
          </span>
        ))}
      </Marquee>
    </div>
  ),
};

/** Dikey kayan yorum kolonu. */
export const Dikey: Story = {
  render: () => (
    <div className="mx-auto h-[420px] w-[360px] bg-muted/30 py-6">
      <Marquee vertical speed="30s" className="h-full">
        {yorumlar.map((yorum) => (
          <TestimonialCard
            key={yorum.name}
            className="w-[320px] shrink-0 bg-card"
            quote={yorum.quote}
            name={yorum.name}
            title={yorum.title}
            rating={yorum.rating}
          />
        ))}
      </Marquee>
    </div>
  ),
};
