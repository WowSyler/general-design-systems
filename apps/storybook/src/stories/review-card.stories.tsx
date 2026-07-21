import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { ReviewCard } from "@ds/ui";

const meta: Meta<typeof ReviewCard> = {
  title: "Composites/ReviewCard",
  component: ReviewCard,
};

export default meta;
type Story = StoryObj<typeof ReviewCard>;

type ReviewCardPhoto = React.ComponentProps<typeof ReviewCard>["photos"];

// Offline calisan, tema-notr ornek foto kucukresimleri (inline SVG data-URI).
const swatch = (from: string, to: string, label: string): string => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs><rect width='96' height='96' rx='14' fill='url(#g)'/><text x='50%' y='55%' font-family='sans-serif' font-size='40' text-anchor='middle' dominant-baseline='middle'>${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const dolapPhotos: ReviewCardPhoto = [
  { src: swatch("#7c3aed", "#a855f7", "🧥"), alt: "Ceketin önden görünümü" },
  { src: swatch("#db2777", "#f472b6", "🏷️"), alt: "Marka etiketi yakın çekim" },
  { src: swatch("#0ea5e9", "#38bdf8", "📦"), alt: "Kargo paketi" },
];

const glowScanPhotos: ReviewCardPhoto = [
  { src: swatch("#f59e0b", "#fbbf24", "🧴"), alt: "Serum şişesi" },
  { src: swatch("#10b981", "#34d399", "✨"), alt: "28 gün sonrası cilt" },
];

export const Dolap: Story = {
  render: () => (
    <div className="max-w-xl">
      <ReviewCard
        authorName="Selin Aydın"
        authorHandle="@selin.vintage"
        rating={5}
        date={new Date(2026, 6, 14)}
        verifiedBuyer
        subject="Vintage Levi's 501 Ceket · Beden M"
        title="Fotoğraftakinden bile güzel geldi"
        photos={dolapPhotos}
        helpfulCount={42}
        onHelpful={() => {}}
      >
        Ceket tam beklediğim gibi, hiç yıpranma yok ve dikişleri sapasağlam.
        Satıcı kargoyu aynı gün verdi, özenle paketlenmişti. Dolap'tan yaptığım
        en iyi alışverişlerden biri, gönül rahatlığıyla tavsiye ederim.
      </ReviewCard>
    </div>
  ),
};

export const RandevuFaydaliIsaretli: Story = {
  render: () => (
    <div className="max-w-xl">
      <ReviewCard
        authorName="Merve Şahin"
        rating={5}
        date={new Date(2026, 5, 28)}
        verifiedBuyer
        subject="Saç Kesimi & Fön · Ayşe Yıldız"
        title="Randevu tam saatinde başladı"
        helpfulCount={17}
        markedHelpful
        onHelpful={() => {}}
      >
        Kadıköy şubesinde Ayşe Hanım gerçekten işinin ehli. Ne istediğimi
        dikkatle dinledi ve tam istediğim gibi kesti. Randevu üzerinden almak
        çok pratikti, beklemeden içeri girdim.
      </ReviewCard>
    </div>
  ),
};

export const GlowScanElestirel: Story = {
  render: () => (
    <div className="max-w-xl">
      <ReviewCard
        authorName="Deniz Korkmaz"
        authorHandle="@denizk"
        rating={2}
        date={new Date(2026, 6, 3)}
        subject="C Vitamini Serum · 28 günlük rutin"
        title="Cildimde tahrişe yol açtı"
        photos={glowScanPhotos}
        helpfulCount={9}
        onHelpful={() => {}}
      >
        GlowScan analizinde önerilen serumu 4 hafta düzenli kullandım fakat
        hassas cildim kızardı. Belki daha düşük konsantrasyon daha uygun olurdu.
        Yıne de uygulama içindeki takip özelliği değişimi görmemi sağladı.
      </ReviewCard>
    </div>
  ),
};

export const YorumListesi: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-4">
      <ReviewCard
        authorName="Ece Yıldırım"
        rating={5}
        date={new Date(2026, 6, 12)}
        verifiedBuyer
        helpfulCount={31}
        onHelpful={() => {}}
      >
        Ürün açıklamadaki gibi, tertemiz geldi. Kesinlikle tekrar alışveriş
        yaparım.
      </ReviewCard>
      <ReviewCard
        authorName="Burak Aslan"
        rating={4}
        date={new Date(2026, 6, 9)}
        verifiedBuyer
        helpfulCount={12}
        onHelpful={() => {}}
      >
        Kalitesi güzel ama beden biraz dar kaldı. Bir beden büyük almanızı
        tavsiye ederim.
      </ReviewCard>
      <ReviewCard
        authorName="Anonim Kullanıcı"
        rating={3}
        date={new Date(2026, 6, 5)}
      >
        Fiyatına göre idare eder, kargosu biraz geç geldi.
      </ReviewCard>
    </div>
  ),
};

export const Yukleniyor: Story = {
  args: {
    authorName: "Yükleniyor",
    rating: 0,
    date: new Date(2026, 6, 14),
    loading: true,
  },
};
