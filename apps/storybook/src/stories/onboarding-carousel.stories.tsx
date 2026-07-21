import type { Meta, StoryObj } from "@storybook/react-vite";

import { OnboardingCarousel, type OnboardingCarouselSlide } from "@ds/ui";
import {
  ScanFace,
  Sparkles,
  ShieldCheck,
  Store,
  CalendarClock,
  BellRing,
  Receipt,
  PieChart,
  Wallet,
} from "lucide-react";

const meta: Meta<typeof OnboardingCarousel> = {
  title: "Composites/Onboarding Carousel",
  component: OnboardingCarousel,
};

export default meta;
type Story = StoryObj<typeof OnboardingCarousel>;

const glowScanSlides: OnboardingCarouselSlide[] = [
  {
    icon: <ScanFace />,
    title: "Cildini tanıyalım",
    description:
      "Ön kameranla 10 saniyelik bir tarama yap; GlowScan cilt tonunu, gözenekleri ve nem seviyeni analiz etsin.",
  },
  {
    icon: <Sparkles />,
    title: "Kişisel rutinin hazır",
    description:
      "Analiz sonucuna göre sabah ve akşam için adım adım bakım önerileri ve ürün eşleştirmeleri sunuyoruz.",
  },
  {
    icon: <ShieldCheck />,
    title: "Verilerin sende kalır",
    description:
      "Tüm taramalar cihazında işlenir. İstemediğin sürece hiçbir fotoğraf buluta yüklenmez.",
  },
];

export const GlowScanTanitim: Story = {
  args: {
    slides: glowScanSlides,
    className: "max-w-sm",
    ctaLabel: "Taramayı başlat",
    onSkip: () => console.log("onboarding atlandı"),
    onComplete: () => console.log("onboarding tamamlandı"),
  },
};

const randevuSlides: OnboardingCarouselSlide[] = [
  {
    icon: <Store />,
    title: "Salonunu tanımla",
    description:
      "İşletme adını, hizmetlerini ve çalışma saatlerini gir; Randevu profili birkaç dakikada hazır olsun.",
  },
  {
    icon: <CalendarClock />,
    title: "Takvimini yönet",
    description:
      "Müşteriler uygun saatleri görüp online randevu alır; çift rezervasyon riski otomatik engellenir.",
  },
  {
    icon: <BellRing />,
    title: "Hatırlatmalar otomatik",
    description:
      "Randevudan 24 saat önce SMS hatırlatması gönderilir, gelmeyen müşteri oranın belirgin şekilde düşer.",
  },
];

export const RandevuIsletmeKurulumu: Story = {
  args: {
    slides: randevuSlides,
    className: "max-w-sm",
    ctaLabel: "İşletmeyi oluştur",
    defaultIndex: 1,
  },
};

const fislySlides: OnboardingCarouselSlide[] = [
  {
    icon: <Receipt />,
    title: "Fişleri fotoğrafla",
    description:
      "Market ve fatura fişlerini çek; Fisly tutarı, tarihi ve kategoriyi senin için otomatik okusun.",
  },
  {
    icon: <PieChart />,
    title: "Harcamanı gör",
    description:
      "Aylık bütçeni kategori kategori takip et; nereye ne kadar harcadığını tek bakışta anla.",
  },
  {
    icon: <Wallet />,
    title: "Birikime başla",
    description:
      "Hedef belirle, Fisly gelir-gider dengeni izleyip her ay ne kadar biriktirebileceğini önersin.",
  },
];

export const FislyFinansTakibi: Story = {
  args: {
    slides: fislySlides,
    className: "max-w-sm",
    ctaLabel: "Hesabımı bağla",
    showSkip: false,
  },
};
