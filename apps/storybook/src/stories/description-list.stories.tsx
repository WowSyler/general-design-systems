import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Calendar,
  CreditCard,
  Droplet,
  GitCommitHorizontal,
  Hash,
  Landmark,
  Receipt,
  Rocket,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
} from "lucide-react";

import { DescriptionList } from "@wowsyler/ds-ui";

const meta: Meta<typeof DescriptionList> = {
  title: "Composites/DescriptionList",
  component: DescriptionList,
};

export default meta;
type Story = StoryObj<typeof DescriptionList>;

/**
 * DeployLens — yatay dağıtım detay panosu. Etiketler solda sabit,
 * commit özeti kopyalanabilir.
 */
export const DagitimDetayi: Story = {
  args: {
    orientation: "horizontal",
    bordered: true,
    items: [
      { term: "Ortam", description: "Production", icon: <Rocket /> },
      { term: "Durum", description: "Başarıyla yayınlandı" },
      {
        term: "Commit",
        description: "a1f9c7e",
        icon: <GitCommitHorizontal />,
        copyable: true,
        copyValue: "a1f9c7e4d2b8f0a3c6519e7d2b8f0a3c6519e7d2",
      },
      { term: "Süre", description: "2 dk 14 sn" },
      { term: "Tetikleyen", description: "Elif Yıldız", icon: <User /> },
    ],
  },
};

/**
 * GlowScan — cilt analizi özeti, responsive iki kolonlu grid.
 */
export const CiltAnaliziOzeti: Story = {
  args: {
    orientation: "grid",
    bordered: true,
    items: [
      { term: "Cilt tipi", description: "Karma", icon: <Sparkles /> },
      { term: "Nem seviyesi", description: "%68", icon: <Droplet /> },
      { term: "Gözenek yoğunluğu", description: "Orta" },
      { term: "Güneş hasarı", description: "Düşük", icon: <Sun /> },
      { term: "Önerilen SPF", description: "50+", icon: <ShieldCheck /> },
      { term: "Genel skor", description: "82 / 100" },
    ],
  },
};

/**
 * Fisly — fatura özeti; dikey yerleşim, ayraç çizgili.
 * Fatura no ve IBAN kopyalanabilir.
 */
export const FaturaOzeti: Story = {
  render: () => (
    <div className="max-w-md">
      <DescriptionList
        orientation="horizontal"
        divided
        items={[
          {
            term: "Fatura no",
            description: "FSL-2026-004182",
            icon: <Hash />,
            copyable: true,
          },
          { term: "Kesim tarihi", description: "14 Temmuz 2026", icon: <Calendar /> },
          { term: "Ara toplam", description: "₺1.240,00" },
          { term: "KDV (%20)", description: "₺248,00", icon: <Receipt /> },
          { term: "Genel toplam", description: "₺1.488,00", icon: <CreditCard /> },
          {
            term: "IBAN",
            description: "TR33 0006 1005 1978 6457 8413 26",
            icon: <Landmark />,
            copyable: true,
          },
        ]}
      />
    </div>
  ),
};

/**
 * Randevu — sade dikey künye kartı (çerçevesiz).
 */
export const RandevuKunyesi: Story = {
  args: {
    orientation: "vertical",
    items: [
      { term: "Hizmet", description: "Saç kesimi + fön" },
      { term: "Uzman", description: "Merve Aksoy" },
      { term: "Tarih & saat", description: "18 Temmuz Cumartesi, 14:30" },
      { term: "Ücret", description: "₺450" },
    ],
  },
};
