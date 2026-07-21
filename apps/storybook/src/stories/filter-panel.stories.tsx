import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { FilterPanel, type FilterPanelValue } from "@ds/ui";

const meta: Meta<typeof FilterPanel> = {
  title: "Composites/FilterPanel",
  component: FilterPanel,
};

export default meta;
type Story = StoryObj<typeof FilterPanel>;

/**
 * Dolap ürün listesi: beden/renk/marka checkbox facet'leri (sayaç rozetli),
 * kargo tercihi radio grubu ve fiyat için min-max aralık.
 */
export const DolapUrunFiltresi: Story = {
  args: {
    title: "Ürünleri filtrele",
    defaultValue: {
      beden: ["m", "l"],
      fiyat: [150, 900],
    },
    sections: [
      {
        id: "beden",
        type: "checkbox",
        title: "Beden",
        options: [
          { value: "xs", label: "XS", count: 12 },
          { value: "s", label: "S", count: 48 },
          { value: "m", label: "M", count: 91 },
          { value: "l", label: "L", count: 64 },
          { value: "xl", label: "XL", count: 23 },
        ],
      },
      {
        id: "renk",
        type: "checkbox",
        title: "Renk",
        options: [
          { value: "siyah", label: "Siyah", count: 132 },
          { value: "beyaz", label: "Beyaz", count: 87 },
          { value: "lacivert", label: "Lacivert", count: 41 },
          { value: "bej", label: "Bej", count: 29 },
        ],
      },
      {
        id: "marka",
        type: "checkbox",
        title: "Marka",
        options: [
          { value: "zara", label: "Zara", count: 56 },
          { value: "mango", label: "Mango", count: 38 },
          { value: "koton", label: "Koton", count: 74 },
          { value: "lcw", label: "LC Waikiki", count: 90 },
        ],
      },
      {
        id: "kargo",
        type: "radio",
        title: "Kargo",
        options: [
          { value: "hepsi", label: "Tümü" },
          { value: "ucretsiz", label: "Ücretsiz kargo" },
          { value: "hizli", label: "Aynı gün teslim" },
        ],
      },
      {
        id: "fiyat",
        type: "range",
        title: "Fiyat aralığı",
        min: 0,
        max: 2000,
        step: 50,
        prefix: "₺",
      },
    ],
  },
};

/**
 * Fisly gider raporu: kategori/hesap checkbox'ları ve gün cinsinden
 * tarih aralığı. Uygula/Temizle çıktısı canlı olarak gösterilir.
 */
export const FislyGiderFiltresi: Story = {
  render: () => {
    const [applied, setApplied] = useState<FilterPanelValue | null>(null);

    return (
      <div className="flex flex-wrap items-start gap-6">
        <FilterPanel
          title="Giderleri filtrele"
          defaultValue={{ durum: "bekleyen" }}
          onApply={setApplied}
          sections={[
            {
              id: "kategori",
              type: "checkbox",
              title: "Kategori",
              options: [
                { value: "yakit", label: "Yakıt", count: 18 },
                { value: "yemek", label: "Yemek", count: 42 },
                { value: "ofis", label: "Ofis", count: 9 },
                { value: "seyahat", label: "Seyahat", count: 6 },
              ],
            },
            {
              id: "hesap",
              type: "checkbox",
              title: "Hesap",
              options: [
                { value: "kurumsal", label: "Kurumsal kart", count: 51 },
                { value: "nakit", label: "Nakit", count: 14 },
                { value: "havale", label: "Havale/EFT", count: 10 },
              ],
            },
            {
              id: "durum",
              type: "radio",
              title: "Onay durumu",
              options: [
                { value: "bekleyen", label: "Bekleyen" },
                { value: "onayli", label: "Onaylı" },
                { value: "reddedilen", label: "Reddedilen" },
              ],
            },
            {
              id: "tarih",
              type: "range",
              title: "Son (gün)",
              min: 0,
              max: 90,
              step: 5,
              suffix: " gün",
            },
          ]}
        />
        <pre className="min-w-56 rounded-lg border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
          {applied
            ? JSON.stringify(applied, null, 2)
            : "“Filtreleri uygula” ile\nseçili değerleri görün."}
        </pre>
      </div>
    );
  },
};

/**
 * DeployLens dağıtım listesi: ortam çoklu seçimi ve durum radio grubu.
 * Alt aksiyon çubuğu gizlenerek anında filtreleme deseni gösterilir.
 */
export const DeployLensDagitimFiltresi: Story = {
  args: {
    title: "Dağıtımları filtrele",
    hideActions: true,
    defaultValue: {
      ortam: ["production"],
      durum: "basarisiz",
    },
    sections: [
      {
        id: "ortam",
        type: "checkbox",
        title: "Ortam",
        options: [
          { value: "production", label: "Production", count: 128 },
          { value: "staging", label: "Staging", count: 64 },
          { value: "preview", label: "Preview", count: 210 },
        ],
      },
      {
        id: "durum",
        type: "radio",
        title: "Durum",
        options: [
          { value: "hepsi", label: "Tümü" },
          { value: "basarili", label: "Başarılı" },
          { value: "basarisiz", label: "Başarısız" },
          { value: "beklemede", label: "Beklemede" },
        ],
      },
      {
        id: "sure",
        type: "range",
        title: "Build süresi (sn)",
        min: 0,
        max: 600,
        step: 10,
        suffix: " sn",
        defaultOpen: false,
      },
    ],
  },
};
