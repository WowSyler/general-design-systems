import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Baby,
  BookOpen,
  Dumbbell,
  Footprints,
  Gem,
  Glasses,
  Home,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Watch,
} from "lucide-react";

import { CategoryNavTiles, CategoryNavTilesPillStrip } from "@ds/ui";

const meta: Meta<typeof CategoryNavTiles> = {
  title: "Composites/CategoryNavTiles",
  component: CategoryNavTiles,
};

export default meta;
type Story = StoryObj<typeof CategoryNavTiles>;

export const DolapKategoriKesfi: Story = {
  args: {
    label: "Dolap kategorileri",
    columns: 4,
    items: [
      { label: "Kadın Giyim", icon: <Shirt />, count: "48.240 ürün", href: "#" },
      { label: "Erkek Giyim", icon: <Shirt />, count: "31.905 ürün", href: "#" },
      { label: "Ayakkabı", icon: <Footprints />, count: "22.118 ürün", href: "#" },
      { label: "Çanta", icon: <ShoppingBag />, count: "18.640 ürün", href: "#" },
      { label: "Aksesuar", icon: <Watch />, count: "12.377 ürün", href: "#" },
      { label: "Kozmetik", icon: <Sparkles />, count: "9.845 ürün", href: "#" },
      { label: "Elektronik", icon: <Smartphone />, count: "6.512 ürün", href: "#" },
      { label: "Ev & Yaşam", icon: <Home />, count: "5.290 ürün", href: "#" },
    ],
    className: "max-w-3xl",
  },
};

export const AltiKolonYumusak: Story = {
  args: {
    label: "Tüm kategoriler",
    columns: 6,
    variant: "soft",
    items: [
      { label: "Kadın Giyim", icon: <Shirt /> },
      { label: "Erkek Giyim", icon: <Shirt /> },
      { label: "Ayakkabı", icon: <Footprints /> },
      { label: "Çanta", icon: <ShoppingBag /> },
      { label: "Aksesuar", icon: <Watch /> },
      { label: "Kozmetik", icon: <Sparkles /> },
      { label: "Elektronik", icon: <Smartphone /> },
      { label: "Ev & Yaşam", icon: <Home /> },
      { label: "Çocuk", icon: <Baby /> },
      { label: "Spor", icon: <Dumbbell /> },
      { label: "Kitap", icon: <BookOpen /> },
      { label: "Mücevher", icon: <Gem /> },
    ],
    className: "max-w-4xl",
  },
};

export const IkiKolonSeyrek: Story = {
  args: {
    label: "Öne çıkan koleksiyonlar",
    columns: 2,
    items: [
      { label: "Vintage Seçkisi", icon: <Glasses />, count: "Yeni sezon", tone: 4, href: "#" },
      { label: "Lüks Markalar", icon: <Gem />, count: "Onaylı satıcılar", tone: 2, href: "#" },
      { label: "Butik Ayakkabı", icon: <Footprints />, count: "3.120 ürün", tone: 1, href: "#" },
      { label: "El Yapımı Takı", icon: <Sparkles />, count: "1.744 ürün", tone: 5, disabled: true },
    ],
    className: "max-w-md",
  },
};

export const KategoriPillSeridi: Story = {
  render: () => (
    <div className="max-w-xl space-y-6">
      <CategoryNavTilesPillStrip
        label="Hızlı kategori filtresi"
        items={[
          { label: "Tümü", active: true, href: "#" },
          { label: "Kadın", icon: <Shirt />, href: "#" },
          { label: "Erkek", icon: <Shirt />, href: "#" },
          { label: "Ayakkabı", icon: <Footprints />, href: "#" },
          { label: "Çanta", icon: <ShoppingBag />, href: "#" },
          { label: "Aksesuar", icon: <Watch />, href: "#" },
          { label: "Kozmetik", icon: <Sparkles />, href: "#" },
          { label: "Elektronik", icon: <Smartphone />, href: "#" },
          { label: "Çocuk", icon: <Baby />, href: "#" },
        ]}
      />
      <p className="text-sm text-muted-foreground">
        Serit taşınca yatay olarak kaydırılır; aktif pill aria-current ile işaretlenir.
      </p>
    </div>
  ),
};
