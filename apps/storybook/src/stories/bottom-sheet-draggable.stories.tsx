import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  CalendarPlus,
  Camera,
  Clock,
  Heart,
  MessageCircle,
  Phone,
  ScanFace,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sun,
  Truck,
} from "lucide-react";

import { BottomSheetDraggable, Button } from "@wowsyler/ds-ui";

const meta: Meta<typeof BottomSheetDraggable> = {
  title: "Composites/BottomSheetDraggable",
  component: BottomSheetDraggable,
};

export default meta;
type Story = StoryObj<typeof BottomSheetDraggable>;

/**
 * Dolap urun detayi: tetikleyici butonla acilan, tutma kolundan yukari/asagi
 * surukleyerek peek/half/full snap noktalari arasinda gecebilen bir alt sayfa.
 * Alt kisimda sabit aksiyon alani (footer) ve kaydirilabilir icerik govdesi var.
 */
export const DolapUrunDetayi: Story = {
  render: () => (
    <div className="flex min-h-[420px] items-start justify-center p-6">
      <BottomSheetDraggable
        trigger={
          <Button>
            <ShoppingBag aria-hidden="true" />
            Ürün detayını aç
          </Button>
        }
        title="Vintage Deri Ceket"
        description="Kadın · M beden · Çok iyi durumda"
        footer={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex-1">
              <MessageCircle aria-hidden="true" />
              Satıcıya sor
            </Button>
            <Button className="flex-[1.6]">
              <ShoppingBag aria-hidden="true" />
              Sepete ekle · 1.450 ₺
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-content-center rounded-full bg-primary/10 text-primary [&_svg]:size-5">
                <ShieldCheck aria-hidden="true" />
              </span>
              <div className="text-sm">
                <p className="font-medium text-foreground">Güvenli ödeme koruması</p>
                <p className="text-muted-foreground">Ürün eline ulaşana kadar askıda</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-1.5 text-sm font-semibold text-foreground">Açıklama</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Gerçek deri, 90'lar kesim vintage ceket. Az kullanıldı, hiçbir
              yıpranma yok. Astarı temiz, fermuarları sağlam. Sonbahar için ideal,
              kombinlere kolayca uyum sağlar.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-border p-3">
              <p className="text-muted-foreground">Marka</p>
              <p className="font-medium text-foreground">Belirtilmemiş</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-muted-foreground">Kargo</p>
              <p className="flex items-center gap-1 font-medium text-foreground">
                <Truck className="size-4 text-primary" aria-hidden="true" />
                Alıcı öder
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Heart aria-hidden="true" />
              Favori
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 aria-hidden="true" />
              Paylaş
            </Button>
          </div>
        </div>
      </BottomSheetDraggable>
    </div>
  ),
};

/**
 * GlowScan tarama secenekleri: kontrollu snap index. Buton grubuyla peek/half/full
 * snap noktalari programatik olarak degistirilir; kullanici tutma kolundan
 * surukleyince onSnapIndexChange ile durum senkron kalir.
 */
export const GlowScanTaramaSecenekleri: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [snap, setSnap] = React.useState(1);
    const etiketler = ["Peek", "Half", "Full"];

    return (
      <div className="flex min-h-[420px] items-start justify-center p-6">
        <Button onClick={() => setOpen(true)}>
          <ScanFace aria-hidden="true" />
          Tarama seçeneklerini aç
        </Button>

        <BottomSheetDraggable
          open={open}
          onOpenChange={setOpen}
          snapIndex={snap}
          onSnapIndexChange={setSnap}
          tone="card"
          title="Cilt Taraması Ayarları"
          description={`Aktif snap: ${etiketler[snap] ?? "-"}`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {etiketler.map((etiket, index) => (
                <Button
                  key={etiket}
                  size="sm"
                  variant={snap === index ? "default" : "outline"}
                  onClick={() => setSnap(index)}
                >
                  {etiket}
                </Button>
              ))}
            </div>

            <ul className="space-y-2">
              {[
                {
                  icon: <Sun aria-hidden="true" />,
                  baslik: "Aydınlatma kontrolü",
                  aciklama: "Doğal ışıkta en doğru sonuç",
                },
                {
                  icon: <Camera aria-hidden="true" />,
                  baslik: "Yüksek çözünürlük",
                  aciklama: "Gözenek ve leke analizi için",
                },
                {
                  icon: <Sparkles aria-hidden="true" />,
                  baslik: "Yapay zekâ önerileri",
                  aciklama: "Tarama sonrası bakım rutini öner",
                },
              ].map((secenek) => (
                <li
                  key={secenek.baslik}
                  className="flex items-center gap-3 rounded-xl border border-border p-3"
                >
                  <span className="grid size-10 shrink-0 place-content-center rounded-full bg-primary/10 text-primary [&_svg]:size-5">
                    {secenek.icon}
                  </span>
                  <div className="min-w-0 text-sm">
                    <p className="font-medium text-foreground">{secenek.baslik}</p>
                    <p className="text-muted-foreground">{secenek.aciklama}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Button className="w-full">
              <ScanFace aria-hidden="true" />
              Taramayı başlat
            </Button>
          </div>
        </BottomSheetDraggable>
      </div>
    );
  },
};

/**
 * Randevu hizli aksiyon menusu: iki snap noktali (peek/half) kompakt bir sayfa.
 * Overlay'e tiklayarak veya asagi savurarak hizlica kapatilir; mobil hizli
 * aksiyonlar icin idealdir.
 */
export const RandevuHizliAksiyon: Story = {
  render: () => (
    <div className="flex min-h-[420px] items-start justify-center p-6">
      <BottomSheetDraggable
        trigger={<Button variant="outline">Hızlı işlemler</Button>}
        snapPoints={[0.32, 0.55]}
        defaultSnapIndex={0}
        title="Ayşe Yılmaz · 14:30 Randevu"
        description="Saç kesimi + fön · Kuaför Deniz"
      >
        <ul className="divide-y divide-border">
          {[
            {
              icon: <CalendarPlus aria-hidden="true" />,
              baslik: "Randevuyu ertele",
              aciklama: "Başka bir güne taşı",
            },
            {
              icon: <Clock aria-hidden="true" />,
              baslik: "Hatırlatma kur",
              aciklama: "1 saat önce bildirim gönder",
            },
            {
              icon: <Phone aria-hidden="true" />,
              baslik: "Müşteriyi ara",
              aciklama: "0 5xx xxx xx xx",
            },
            {
              icon: <MessageCircle aria-hidden="true" />,
              baslik: "Mesaj gönder",
              aciklama: "Hazır şablonla bilgilendir",
            },
          ].map((aksiyon) => (
            <li key={aksiyon.baslik}>
              <button
                type="button"
                className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:text-primary"
              >
                <span className="grid size-9 shrink-0 place-content-center rounded-full bg-muted text-foreground [&_svg]:size-4">
                  {aksiyon.icon}
                </span>
                <span className="min-w-0 text-sm">
                  <span className="block font-medium text-foreground">
                    {aksiyon.baslik}
                  </span>
                  <span className="block text-muted-foreground">
                    {aksiyon.aciklama}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </BottomSheetDraggable>
    </div>
  ),
};
