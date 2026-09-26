import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  CheckCircle2,
  Clock,
  Shirt,
  ShoppingBag,
  Sparkles,
  Tag,
  XCircle,
} from "lucide-react";

import { FacetedFilter, type FacetedFilterOption } from "@wowsyler/ds-ui";

const meta: Meta<typeof FacetedFilter> = {
  title: "Composites/FacetedFilter",
  component: FacetedFilter,
};

export default meta;
type Story = StoryObj<typeof FacetedFilter>;

// DeployLens — dağıtım (deployment) durumu facet'i
const dagitimDurumlari: FacetedFilterOption[] = [
  {
    value: "basarili",
    label: "Başarılı",
    count: 128,
    icon: <CheckCircle2 className="text-success" />,
  },
  {
    value: "beklemede",
    label: "Beklemede",
    count: 14,
    icon: <Clock className="text-warning" />,
  },
  {
    value: "basarisiz",
    label: "Başarısız",
    count: 7,
    icon: <XCircle className="text-destructive" />,
  },
  { value: "iptal", label: "İptal Edildi", count: 3 },
];

// Dolap — ürün kategorisi facet'i (adetli, ikonlu)
const urunKategorileri: FacetedFilterOption[] = [
  { value: "elbise", label: "Elbise", count: 342, icon: <Shirt /> },
  { value: "canta", label: "Çanta", count: 118, icon: <ShoppingBag /> },
  { value: "ayakkabi", label: "Ayakkabı", count: 96, icon: <Tag /> },
  { value: "aksesuar", label: "Aksesuar", count: 74, icon: <Sparkles /> },
  { value: "ceket", label: "Ceket & Mont", count: 41, icon: <Shirt /> },
  { value: "etek", label: "Etek", count: 28, icon: <Shirt /> },
];

export const DagitimDurumu: Story = {
  render: () => {
    const [secili, setSecili] = React.useState<string[]>(["basarisiz"]);
    return (
      <div className="flex min-h-72 flex-col gap-4">
        <FacetedFilter
          title="Durum"
          options={dagitimDurumlari}
          selected={secili}
          onSelectedChange={setSecili}
          searchPlaceholder="Durum ara…"
          emptyMessage="Bu isimde bir durum yok."
        />
        <p className="text-sm text-muted-foreground tabular-nums">
          DeployLens — {secili.length} durum filtreleniyor
          {secili.length ? `: ${secili.join(", ")}` : ""}.
        </p>
      </div>
    );
  },
};

export const UrunKategorisiAcik: Story = {
  render: () => (
    <div className="flex min-h-96 flex-col">
      <FacetedFilter
        defaultOpen
        title="Kategori"
        options={urunKategorileri}
        defaultSelected={["elbise", "canta"]}
        searchPlaceholder="Kategori ara…"
        emptyMessage="Kategori bulunamadı."
        clearLabel="Seçilenleri temizle"
      />
    </div>
  ),
};

export const FiltreCubugu: Story = {
  render: () => {
    const [durum, setDurum] = React.useState<string[]>(["basarili"]);
    const [kategori, setKategori] = React.useState<string[]>([
      "elbise",
      "canta",
      "ayakkabi",
    ]);
    return (
      <div className="flex min-h-72 flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
        <span className="mr-1 text-sm font-medium text-muted-foreground">
          Filtreler:
        </span>
        <FacetedFilter
          title="Durum"
          options={dagitimDurumlari}
          selected={durum}
          onSelectedChange={setDurum}
          searchPlaceholder="Durum ara…"
        />
        <FacetedFilter
          title="Kategori"
          options={urunKategorileri}
          selected={kategori}
          onSelectedChange={setKategori}
          searchPlaceholder="Kategori ara…"
          maxBadges={2}
        />
      </div>
    );
  },
};
