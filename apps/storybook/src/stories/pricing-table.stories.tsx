import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight } from "lucide-react";

import { Button, PricingTable } from "@wowsyler/ds-ui";

const meta: Meta<typeof PricingTable> = {
  title: "Marketing/PricingTable",
  component: PricingTable,
};

export default meta;
type Story = StoryObj<typeof PricingTable>;

/** Aylik/yillik gecisi icin salt-gorsel segment kontrolu (slot ornegi). */
function BillingSwitch({ active }: { active: "aylik" | "yillik" }) {
  return (
    <div className="inline-flex items-center rounded-full border bg-muted/40 p-1">
      <Button
        variant={active === "aylik" ? "default" : "ghost"}
        size="sm"
        className="rounded-full"
      >
        Aylık
      </Button>
      <Button
        variant={active === "yillik" ? "default" : "ghost"}
        size="sm"
        className="gap-2 rounded-full"
      >
        Yıllık
        <span className="rounded-full bg-success/15 px-1.5 py-0.5 text-[10px] font-semibold text-success">
          2 ay bedava
        </span>
      </Button>
    </div>
  );
}

/** DeployLens dağıtım altyapısı için 3 planlı karşılaştırma tablosu. */
export const DeployLensAbonelik: Story = {
  render: (args) => (
    <div className="mx-auto max-w-4xl p-6">
      <PricingTable {...args} />
    </div>
  ),
  args: {
    featureColumnLabel: "Özellikler",
    caption: "Tüm planlar 14 gün ücretsiz denemeyle başlar. İstediğin an iptal et.",
    plans: [
      {
        id: "baslangic",
        name: "Başlangıç",
        price: "₺0",
        period: "/ay",
        description: "Kişisel projeler ve ilk dağıtımlar için.",
        cta: (
          <Button variant="outline" className="w-full">
            Ücretsiz Başla
          </Button>
        ),
      },
      {
        id: "takim",
        name: "Takım",
        price: "₺249",
        period: "/ay",
        description: "Büyüyen ekipler için önizleme ve rollback.",
        highlighted: true,
        cta: (
          <Button className="w-full">
            Takımı Yükselt
            <ArrowRight aria-hidden="true" />
          </Button>
        ),
      },
      {
        id: "kurumsal",
        name: "Kurumsal",
        price: "₺899",
        period: "/ay",
        description: "SSO, denetim ve öncelikli destek.",
        cta: (
          <Button variant="outline" className="w-full">
            Satışla Görüş
          </Button>
        ),
      },
    ],
    features: [
      { label: "Aylık dağıtım", values: ["100", "Sınırsız", "Sınırsız"] },
      { label: "Eşzamanlı derleme", values: ["1", "5", "20"] },
      { label: "Önizleme ortamı", values: [true, true, true] },
      {
        label: "Rollback & geçmiş",
        hint: "Tek tıkla önceki sürüme dön",
        values: [false, true, true],
      },
      { label: "Özel alan adı", values: [false, true, true] },
      { label: "Denetim günlükleri", values: [false, false, true] },
      { label: "SAML / SSO", values: [false, false, true] },
      {
        label: "Destek",
        values: ["Topluluk", "E-posta", "Öncelikli SLA"],
      },
    ],
  },
};

/** GlowScan cilt analizi — yıllık faturalama slotu ile. */
export const GlowScanYillik: Story = {
  render: (args) => (
    <div className="mx-auto max-w-4xl p-6">
      <PricingTable {...args} />
    </div>
  ),
  args: {
    featureColumnLabel: "Plan ayrıntıları",
    periodSwitcher: <BillingSwitch active="yillik" />,
    caption: "Yıllık ödemede 2 ay bedava. Fiyatlara KDV dahildir.",
    plans: [
      {
        id: "cilt-plus",
        name: "Cilt+",
        price: "₺390",
        period: "/yıl",
        description: "Düzenli takip isteyen bireyler için.",
        cta: (
          <Button variant="outline" className="w-full">
            Planı Seç
          </Button>
        ),
      },
      {
        id: "cilt-pro",
        name: "Cilt Pro",
        price: "₺890",
        period: "/yıl",
        description: "Sınırsız tarama ve uzman görüşmesi.",
        highlighted: true,
        highlightLabel: "En Çok Tercih Edilen",
        cta: (
          <Button className="w-full">
            Pro'ya Geç
            <ArrowRight aria-hidden="true" />
          </Button>
        ),
      },
      {
        id: "klinik",
        name: "Klinik",
        price: "₺2.490",
        period: "/yıl",
        description: "Güzellik merkezleri ve dermatoloji klinikleri.",
        cta: (
          <Button variant="outline" className="w-full">
            Teklif Al
          </Button>
        ),
      },
    ],
    features: [
      { label: "Aylık cilt taraması", values: ["4", "Sınırsız", "Sınırsız"] },
      { label: "Yapay zekâ analiz raporu", values: [true, true, true] },
      { label: "Kişiselleştirilmiş ürün önerisi", values: [true, true, true] },
      {
        label: "Dermatolog görüşmesi",
        hint: "Görüntülü, 20 dakika",
        values: [false, "Ayda 1", "Ayda 4"],
      },
      { label: "İlerleme grafiği & arşiv", values: [false, true, true] },
      { label: "Çoklu profil", values: ["1", "3", "10"] },
    ],
  },
};

/** Randevu — sade 2 planlı ücretsiz/pro karşılaştırması. */
export const RandevuIkiPlan: Story = {
  render: (args) => (
    <div className="mx-auto max-w-2xl p-6">
      <PricingTable {...args} />
    </div>
  ),
  args: {
    featureColumnLabel: "Özellikler",
    caption: "İşletme büyüdükçe planı istediğin an yükseltebilirsin.",
    plans: [
      {
        id: "ucretsiz",
        name: "Ücretsiz",
        price: "₺0",
        period: "/ay",
        description: "Tek çalışanlı işletmeler için başlangıç.",
        cta: (
          <Button variant="outline" className="w-full">
            Hemen Başla
          </Button>
        ),
      },
      {
        id: "pro",
        name: "Pro",
        price: "₺149",
        period: "/ay",
        description: "SMS hatırlatma ve online ödeme dahil.",
        highlighted: true,
        cta: (
          <Button className="w-full">
            Pro'yu Dene
            <ArrowRight aria-hidden="true" />
          </Button>
        ),
      },
    ],
    features: [
      { label: "Aylık randevu", values: ["50", "Sınırsız"] },
      { label: "Personel sayısı", values: ["1", "10"] },
      { label: "Takvim entegrasyonu", values: [true, true] },
      {
        label: "SMS hatırlatma",
        hint: "No-show oranını düşürür",
        values: [false, true],
      },
      { label: "Online ödeme", values: [false, true] },
    ],
  },
};
