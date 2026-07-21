import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, Clock, MapPin, Scissors, Sparkles, User } from "lucide-react";

import { BookingSummary, Button } from "@ds/ui";

const meta: Meta<typeof BookingSummary> = {
  title: "Composites/BookingSummary",
  component: BookingSummary,
};

export default meta;
type Story = StoryObj<typeof BookingSummary>;

// Randevu tarihi tek kaynaktan bicimlenir (tr-TR).
const randevuTarihi = new Date(2026, 6, 14).toLocaleDateString("tr-TR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export const TamOzet: Story = {
  args: {
    step: "3/3 · Onay",
    details: [
      {
        icon: <Scissors />,
        label: "Hizmet",
        value: "Saç Kesimi + Sakal Tıraşı",
        hint: "Erkek kuaförü",
        editHref: "#hizmet",
      },
      {
        icon: <User />,
        label: "Uzman",
        value: "Emre Yıldız",
        hint: "Kıdemli berber · 4,9 puan",
        editHref: "#uzman",
      },
      {
        icon: <Calendar />,
        label: "Tarih & Saat",
        value: `${randevuTarihi}, 15:30`,
        editHref: "#tarih",
      },
      {
        icon: <Clock />,
        label: "Tahmini Süre",
        value: "45 dakika",
      },
    ],
    priceRows: [
      { label: "Ara toplam", value: "₺450" },
      { label: "İlk randevu indirimi (%10)", value: "−₺45", tone: "discount" },
    ],
    total: "₺405",
    totalHint: "KDV dahil",
    note: "Ücretsiz iptal: randevudan 24 saat öncesine kadar.",
    ctaLabel: "Onayla ve Öde",
  },
};

export const IndirimsizBasit: Story = {
  args: {
    title: "Randevu Özeti",
    details: [
      {
        icon: <Sparkles />,
        label: "Hizmet",
        value: "Klasik Manikür + Kalıcı Oje",
        editHref: "#hizmet",
      },
      {
        icon: <User />,
        label: "Uzman",
        value: "Selin Aksoy",
        hint: "İlk uygun uzman",
        editHref: "#uzman",
      },
      {
        icon: <Calendar />,
        label: "Tarih & Saat",
        value: "21 Temmuz 2026, 11:00",
        editHref: "#tarih",
      },
      {
        icon: <MapPin />,
        label: "Şube",
        value: "Nişantaşı Güzellik Merkezi",
        hint: "Teşvikiye Cad. No:42",
      },
    ],
    priceRows: [{ label: "Ara toplam", value: "₺320" }],
    total: "₺320",
    totalHint: "KDV dahil",
    note: "Ödemeyi salonda da yapabilirsiniz.",
    ctaLabel: "Randevuyu Onayla",
  },
};

export const OzelCTAvePersonelYok: Story = {
  args: {
    step: "Son adım",
    details: [
      {
        icon: <Scissors />,
        label: "Hizmet",
        value: "Saç Boyama + Fön",
        editHref: "#hizmet",
      },
      {
        icon: <User />,
        label: "Uzman",
        value: "Fark etmez",
        hint: "En erken uygun uzmana atanır",
        editHref: "#uzman",
      },
      {
        icon: <Calendar />,
        label: "Tarih & Saat",
        value: "18 Temmuz 2026, 13:15",
        editHref: "#tarih",
      },
    ],
    priceRows: [
      { label: "Ara toplam", value: "₺780" },
      { label: "Sadakat puanı (150 puan)", value: "−₺75", tone: "discount" },
    ],
    total: "₺705",
    action: (
      <Button size="lg" className="w-full">
        Kaporayı Öde (₺100)
      </Button>
    ),
    note: "Kalan tutar hizmet sonrası tahsil edilir.",
  },
};

export const YapiskanKolon: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-[1fr_320px]">
      <div className="space-y-3 rounded-xl border bg-muted/30 p-6">
        <p className="text-sm font-medium text-foreground">
          Randevu adımları (sol kolon)
        </p>
        <p className="text-sm text-muted-foreground">
          Uzun formda sağdaki özet kartı <code>sticky</code> ile kaydırırken
          ekranda sabit kalır. Aşağı kaydırdıkça özet görünür kalır.
        </p>
        <div className="h-64 rounded-lg border border-dashed border-border" />
        <div className="h-64 rounded-lg border border-dashed border-border" />
      </div>
      <BookingSummary
        sticky
        step="3/3"
        details={[
          {
            icon: <Scissors />,
            label: "Hizmet",
            value: "Ombre + Kesim",
            editHref: "#hizmet",
          },
          {
            icon: <Calendar />,
            label: "Tarih & Saat",
            value: "25 Temmuz 2026, 16:00",
            editHref: "#tarih",
          },
        ]}
        priceRows={[
          { label: "Ara toplam", value: "₺1.200" },
          { label: "Kampanya indirimi", value: "−₺120", tone: "discount" },
        ]}
        total="₺1.080"
        totalHint="KDV dahil"
        note="Güvenli ödeme · iyzico altyapısı"
      />
    </div>
  ),
};

export const Yukleniyor: Story = {
  args: {
    loading: true,
    details: [],
    total: "",
  },
};
