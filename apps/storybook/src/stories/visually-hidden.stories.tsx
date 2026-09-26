import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Heart, Search, Trash2 } from "lucide-react";

import { Button, VisuallyHidden } from "@wowsyler/ds-ui";

const meta: Meta<typeof VisuallyHidden> = {
  title: "Primitives/VisuallyHidden",
  component: VisuallyHidden,
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

/**
 * Ikon-only butonlar: gorsel olarak yalniz ikon gorunur, ekran
 * okuyucular VisuallyHidden metniyle aksiyonu anlamli sekilde okur.
 */
export const IkonButonlari: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon">
        <Search aria-hidden="true" />
        <VisuallyHidden>Randevu ara</VisuallyHidden>
      </Button>
      <Button variant="outline" size="icon">
        <Bell aria-hidden="true" />
        <VisuallyHidden>Bildirimleri aç</VisuallyHidden>
      </Button>
      <Button variant="outline" size="icon">
        <Heart aria-hidden="true" />
        <VisuallyHidden>Favorilere ekle</VisuallyHidden>
      </Button>
      <Button variant="destructive" size="icon">
        <Trash2 aria-hidden="true" />
        <VisuallyHidden>İlanı sil</VisuallyHidden>
      </Button>
    </div>
  ),
};

/**
 * "İçeriğe atla" baglantisi: fare kullanicilari icin gizli, ancak
 * Tab tusuna basildiginda ekranin sol ustunde gorunur hale gelir.
 */
export const AtlamaBaglantisi: Story = {
  render: () => (
    <div className="relative min-h-40 w-full max-w-md rounded-lg border p-4">
      <VisuallyHidden asChild focusable>
        <a href="#ana-icerik">Ana içeriğe atla</a>
      </VisuallyHidden>
      <p className="text-sm text-muted-foreground">
        Klavyeyle bu alana odaklanıp <span className="font-medium text-foreground">Tab</span> tuşuna
        basın; gizli "Ana içeriğe atla" bağlantısı görünür hale gelecek.
      </p>
      <nav className="mt-3 flex gap-3 text-sm">
        <a href="#" className="text-primary underline-offset-4 hover:underline touch-hitbox">
          Panel
        </a>
        <a href="#" className="text-primary underline-offset-4 hover:underline touch-hitbox">
          Dağıtımlar
        </a>
        <a href="#" className="text-primary underline-offset-4 hover:underline touch-hitbox">
          Ayarlar
        </a>
      </nav>
      <p id="ana-icerik" className="mt-6 text-sm">
        DeployLens üretim ortamı sorunsuz çalışıyor.
      </p>
    </div>
  ),
};

/**
 * Canli bolge (aria-live): durum degisikligi gorsel olarak rozetle,
 * ekran okuyucuya ise VisuallyHidden ile tam cumleyle iletilir.
 */
export const CanliDurumBolgesi: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">GlowScan analizi</span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success"
          aria-hidden="true"
        >
          <span className="size-1.5 rounded-full bg-success" />
          Tamamlandı
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        Cilt analizi raporunuz hazır.
      </p>
      <div role="status" aria-live="polite">
        <VisuallyHidden>
          GlowScan cilt analizi tamamlandı, raporunuz görüntülenmeye hazır.
        </VisuallyHidden>
      </div>
    </div>
  ),
};

/**
 * asChild ile mevcut bir baglantiyi sararak ekstra baglam eklemek:
 * gorsel "Devamını oku" metni tekrarlanirken ekran okuyucu hangi
 * yaziya ait oldugunu ogrenir.
 */
export const AsChildEkBaglam: Story = {
  render: () => (
    <article className="w-full max-w-sm space-y-2 rounded-lg border p-4">
      <h3 className="text-sm font-semibold">Fisly ile giderlerinizi otomatik ayırın</h3>
      <p className="text-sm text-muted-foreground">
        Yapay zeka destekli fiş tarama ile harcamalarınız saniyeler içinde kategorilere ayrılır.
      </p>
      <a
        href="#"
        className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline touch-hitbox"
      >
        Devamını oku
        <VisuallyHidden asChild>
          <span>: Fisly ile giderlerinizi otomatik ayırın</span>
        </VisuallyHidden>
      </a>
    </article>
  ),
};

/**
 * Erisilebilir tablo basligi: sutun anlamini gorsel olarak ikonla,
 * ekran okuyucuya ise VisuallyHidden basligiyla verir.
 */
export const TabloBasligi: Story = {
  render: () => (
    <table className="w-full max-w-sm border-collapse text-sm">
      <thead>
        <tr className="border-b text-left text-muted-foreground">
          <th className="py-2 font-medium">Ürün</th>
          <th className="py-2 text-right font-medium">Fiyat</th>
          <th className="py-2 text-right">
            <VisuallyHidden>İşlemler</VisuallyHidden>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b">
          <td className="py-2">Vintage deri ceket</td>
          <td className="py-2 text-right tabular-nums">₺ 450</td>
          <td className="py-2 text-right">
            <Button variant="ghost" size="icon">
              <Heart aria-hidden="true" />
              <VisuallyHidden>Vintage deri ceketi favorilere ekle</VisuallyHidden>
            </Button>
          </td>
        </tr>
        <tr>
          <td className="py-2">Örgü triko kazak</td>
          <td className="py-2 text-right tabular-nums">₺ 220</td>
          <td className="py-2 text-right">
            <Button variant="ghost" size="icon">
              <Heart aria-hidden="true" />
              <VisuallyHidden>Örgü triko kazağı favorilere ekle</VisuallyHidden>
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  ),
};
