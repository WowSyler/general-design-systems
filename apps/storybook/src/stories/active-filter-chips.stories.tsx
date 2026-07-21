import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ActiveFilterChips, type ActiveFilterChipItem } from "@ds/ui";

const meta: Meta<typeof ActiveFilterChips> = {
  title: "Composites/ActiveFilterChips",
  component: ActiveFilterChips,
};

export default meta;
type Story = StoryObj<typeof ActiveFilterChips>;

/** DeployLens dağıtım listesine uygulanmış filtreler. */
export const DagitimFiltreleri: Story = {
  args: {
    resultCount: 128,
    filters: [
      { id: "durum", label: "Durum", value: "Başarısız" },
      { id: "ortam", label: "Ortam", value: "Production" },
      { id: "bolge", label: "Bölge", value: "eu-central-1" },
      { id: "tarih", label: "Tarih", value: "Son 7 gün" },
    ],
  },
};

/** Dolap vitrininde canlı olarak kaldırılabilen ürün filtreleri. */
export const Interaktif: Story = {
  render: () => {
    const initial: ActiveFilterChipItem[] = [
      { id: "kategori", label: "Kategori", value: "Kadın Giyim" },
      { id: "beden", label: "Beden", value: "M" },
      { id: "renk", label: "Renk", value: "Bordo" },
      { id: "durum", label: "Durum", value: "Yeni Etiketli" },
      { id: "fiyat", label: "Fiyat", value: "₺0 – ₺250" },
      { id: "kargo", label: "Kargo", value: "Ücretsiz" },
    ];
    const [filters, setFilters] = useState<ActiveFilterChipItem[]>(initial);

    return (
      <div className="max-w-2xl space-y-4">
        <ActiveFilterChips
          filters={filters}
          resultCount={filters.length === 0 ? 4820 : filters.length * 37}
          onRemove={(id) =>
            setFilters((prev) => prev.filter((f) => f.id !== id))
          }
          onClearAll={() => setFilters([])}
          emptyMessage="Aktif filtre yok — tüm ürünler gösteriliyor."
        />
        {filters.length === 0 ? (
          <button
            type="button"
            onClick={() => setFilters(initial)}
            className="text-xs text-primary underline-offset-4 hover:underline"
          >
            Örnek filtreleri geri yükle
          </button>
        ) : null}
      </div>
    );
  },
};

/** Fisly gider aramasında yalnızca iki boyut ve sonuç sayacı. */
export const SonucSayaci: Story = {
  args: {
    resultCount: 47,
    resultNoun: "fiş",
    filters: [
      { id: "kategori", label: "Kategori", value: "Yemek" },
      { id: "ay", label: "Ay", value: "Temmuz 2026" },
    ],
  },
};

/** Filtre uygulanmamış boş durum. */
export const BosDurum: Story = {
  args: {
    filters: [],
    emptyMessage: "Henüz filtre uygulanmadı.",
  },
};
