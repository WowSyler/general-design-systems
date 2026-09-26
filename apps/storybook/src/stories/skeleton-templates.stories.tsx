import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  SkeletonCard,
  SkeletonChart,
  SkeletonDetail,
  SkeletonList,
  SkeletonStatGrid,
  SkeletonTable,
} from "@wowsyler/ds-ui";

/**
 * Hazir Skeleton kompozisyonlari — veri gelene kadar gosterilen yer
 * tutucular. Mevcut Skeleton primitifinden turetilir; her sablon kendi
 * sarmalayicisinda role="status" ile "yukleniyor" olarak duyurulur.
 */
const meta: Meta<typeof SkeletonList> = {
  title: "Primitives/SkeletonTemplates",
  component: SkeletonList,
};

export default meta;
type Story = StoryObj<typeof SkeletonList>;

/** DeployLens dagitim listesi yuklenirken gosterilen satir yer tutuculari. */
export const Liste: Story = {
  render: () => (
    <div className="max-w-lg">
      <SkeletonList count={4} label="Dağıtımlar yükleniyor" />
    </div>
  ),
};

/** Fisly gider tablosu yuklenirken kolon x satir izgarasi. */
export const Tablo: Story = {
  render: () => (
    <div className="max-w-2xl">
      <SkeletonTable rows={5} columns={4} label="Gider tablosu yükleniyor" />
    </div>
  ),
};

/** Dolap urun karti — medya, baslik ve govde satirlariyla. */
export const Kart: Story = {
  render: () => (
    <div className="max-w-sm">
      <SkeletonCard showMedia lines={3} label="Ürün kartı yükleniyor" />
    </div>
  ),
};

/** DeployLens gosterge panosu KPI kartlari yuklenirken. */
export const OzetIzgarasi: Story = {
  render: () => (
    <div className="max-w-3xl">
      <SkeletonStatGrid count={4} columns={4} label="Panel özetleri yükleniyor" />
    </div>
  ),
};

/** GlowScan cilt analizi grafigi yuklenirken eksen + cubuklar. */
export const Grafik: Story = {
  render: () => (
    <div className="max-w-xl">
      <SkeletonChart bars={7} label="Analiz grafiği yükleniyor" />
    </div>
  ),
};

/** Randevu musteri profili detayi yuklenirken avatar + alanlar. */
export const ProfilDetay: Story = {
  render: () => (
    <div className="max-w-lg">
      <SkeletonDetail fields={4} label="Müşteri profili yükleniyor" />
    </div>
  ),
};

/** Tum sablonlarin bir arada gorunumu (galeri). */
export const TumSablonlar: Story = {
  render: () => (
    <div className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
      <SkeletonList count={3} label="Liste yükleniyor" />
      <SkeletonCard showMedia lines={2} label="Kart yükleniyor" />
      <SkeletonTable rows={4} columns={3} label="Tablo yükleniyor" />
      <SkeletonChart bars={6} label="Grafik yükleniyor" />
      <div className="lg:col-span-2">
        <SkeletonStatGrid count={4} columns={4} label="Özetler yükleniyor" />
      </div>
      <div className="lg:col-span-2">
        <SkeletonDetail fields={6} label="Detay yükleniyor" />
      </div>
    </div>
  ),
};
