import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Bus,
  Clapperboard,
  Fuel,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  PiggyBank,
  Plane,
  ReceiptText,
  Shirt,
  ShoppingCart,
  Smartphone,
  Tag,
  Utensils,
  Zap,
} from "lucide-react";

import { CategoryPicker, CategoryPickerItem, type CategoryPickerOption } from "@ds/ui";

const meta: Meta<typeof CategoryPicker> = {
  title: "Composites/CategoryPicker",
  component: CategoryPicker,
};

export default meta;
type Story = StoryObj<typeof CategoryPicker>;

/* Fisly: yeni harcamayi bir kategoriye yazma (arama + yeni kategori) */
const islemKategorileri: CategoryPickerOption[] = [
  { value: "market", label: "Market", icon: <ShoppingCart />, tone: 1 },
  { value: "ulasim", label: "Ulaşım", icon: <Bus />, tone: 2 },
  { value: "fatura", label: "Fatura", icon: <ReceiptText />, tone: 3 },
  { value: "eglence", label: "Eğlence", icon: <Clapperboard />, tone: 4 },
  { value: "yemek", label: "Yeme-İçme", icon: <Utensils />, tone: 5 },
  { value: "saglik", label: "Sağlık", icon: <HeartPulse />, tone: 1 },
  { value: "giyim", label: "Giyim", icon: <Shirt />, tone: 2 },
  { value: "kira", label: "Kira", icon: <Home />, tone: 3 },
  { value: "egitim", label: "Eğitim", icon: <GraduationCap />, tone: 4 },
  { value: "seyahat", label: "Seyahat", icon: <Plane />, tone: 5 },
  { value: "hediye", label: "Hediye", icon: <Gift />, tone: 1 },
  { value: "teknoloji", label: "Teknoloji", icon: <Smartphone />, tone: 2 },
];

function IslemKategorisiOrnek() {
  const [secili, setSecili] = React.useState("market");
  const [ekstra, setEkstra] = React.useState<CategoryPickerOption[]>([]);

  const kategoriler = [...islemKategorileri, ...ekstra];
  const seciliEtiket = kategoriler.find((k) => k.value === secili)?.label ?? "—";

  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">İşlem kategorisi</h2>
        <p className="text-sm text-muted-foreground">
          −₺248,90 tutarındaki bu harcamayı hangi kategoriye yazalım?
        </p>
      </div>

      <CategoryPicker
        options={kategoriler}
        value={secili}
        onValueChange={setSecili}
        searchable
        columns={4}
        label="İşlem kategorisi"
        onAddCategory={() => {
          const yeni: CategoryPickerOption = {
            value: `ozel-${ekstra.length + 1}`,
            label: `Özel ${ekstra.length + 1}`,
            icon: <Tag />,
            tone: 4,
          };
          setEkstra((onceki) => [...onceki, yeni]);
          setSecili(yeni.value);
        }}
      />

      <p className="text-sm text-muted-foreground">
        Seçilen kategori: <span className="font-medium text-foreground">{seciliEtiket}</span>
      </p>
    </div>
  );
}

export const IslemKategorisi: Story = {
  render: () => <IslemKategorisiOrnek />,
};

/* Fisly: aylik butce dagilimi (3 sutun, tutar ozetiyle) */
const butceKategorileri: CategoryPickerOption[] = [
  { value: "birikim", label: "Birikim", icon: <PiggyBank />, tone: 1 },
  { value: "kira", label: "Kira / Konut", icon: <Home />, tone: 3 },
  { value: "market", label: "Market", icon: <ShoppingCart />, tone: 2 },
  { value: "ulasim", label: "Ulaşım", icon: <Fuel />, tone: 5 },
  { value: "faturalar", label: "Faturalar", icon: <Zap />, tone: 4 },
  { value: "eglence", label: "Eğlence", icon: <Clapperboard />, tone: 1 },
];

const butceLimitleri: Record<string, number> = {
  birikim: 6000,
  kira: 12500,
  market: 4500,
  ulasim: 1800,
  faturalar: 2400,
  eglence: 1500,
};

function ButceKategorisiOrnek() {
  const [secili, setSecili] = React.useState("kira");
  const limit = butceLimitleri[secili] ?? 0;

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">Bütçe kategorisi</h2>
        <p className="text-sm text-muted-foreground">
          Temmuz ayı bütçenden bir kategori seçerek limitini gör.
        </p>
      </div>

      <CategoryPicker
        options={butceKategorileri}
        value={secili}
        onValueChange={setSecili}
        columns={3}
        label="Bütçe kategorisi"
      />

      <div className="flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3">
        <span className="text-sm text-muted-foreground">Aylık limit</span>
        <span className="text-lg font-semibold tabular-nums text-foreground">
          {limit.toLocaleString("tr-TR")} ₺
        </span>
      </div>
    </div>
  );
}

export const ButceKategorisi: Story = {
  render: () => <ButceKategorisiOrnek />,
};

/* Bos arama durumu + tekil karo varyantlari */
export const BosAramaVeTekilKaro: Story = {
  render: () => (
    <div className="mx-auto max-w-xl space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Arama sonucu bulunamadığında</p>
        <CategoryPicker
          options={islemKategorileri.slice(0, 6)}
          value="market"
          searchable
          searchPlaceholder="Deneyin: 'kripto'"
          onAddCategory={() => {}}
          emptyText="Bu isimde bir kategori yok."
          addLabel="Kategori oluştur"
        />
        <p className="text-xs text-muted-foreground">
          Yukarıdaki kutuya eşleşmeyen bir metin yazınca boş durum görünür.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Tekil karo (seçili / boşta)</p>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
          <CategoryPickerItem icon={<ShoppingCart />} label="Market" tone={1} selected />
          <CategoryPickerItem icon={<Bus />} label="Ulaşım" tone={2} />
          <CategoryPickerItem icon={<ReceiptText />} label="Fatura" tone={3} />
          <CategoryPickerItem icon={<Clapperboard />} label="Eğlence" tone={4} />
          <CategoryPickerItem icon={<HeartPulse />} label="Sağlık" tone={5} />
          <CategoryPickerItem icon={<Plane />} label="Seyahat" tone={2} disabled />
        </div>
      </div>
    </div>
  ),
};
