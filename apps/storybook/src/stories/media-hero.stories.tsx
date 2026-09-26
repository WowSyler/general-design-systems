import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Play, ScanFace, ShoppingBag, Sparkles } from "lucide-react";

import { Button, MediaHero } from "@wowsyler/ds-ui";

const meta: Meta<typeof MediaHero> = {
  title: "Marketing/MediaHero",
  component: MediaHero,
};

export default meta;
type Story = StoryObj<typeof MediaHero>;

export const GlowScan: Story = {
  render: () => (
    <MediaHero
      eyebrow={
        <>
          <Sparkles className="size-3.5" aria-hidden="true" /> Yapay zekâ cilt
          analizi
        </>
      }
      title="Cildini gerçekten tanıyan bir başlangıç"
      description="Tek bir selfie ile nem, gözenek, ton eşitliği ve elastikiyet dahil 10 metriği analiz ediyoruz. Kişiye özel rutin, saniyeler içinde hazır."
      actions={
        <>
          <Button size="lg">
            <ScanFace className="size-4" aria-hidden="true" /> Ücretsiz Analiz
          </Button>
          <Button size="lg" variant="outline">
            Nasıl Çalışır?
          </Button>
        </>
      }
      minHeight="lg"
      overlay="gradient"
      media={
        <img
          src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1600&q=80"
          alt="Cilt bakımı yapan bir kişinin yakın çekimi"
        />
      }
      className="max-w-6xl"
    />
  ),
};

export const DolapOrtaHizali: Story = {
  render: () => (
    <MediaHero
      align="center"
      overlay="dark"
      minHeight="md"
      eyebrow="Dolap"
      title="Gardırobun yeniden dolaşımda"
      description="İkinci el moda burada canlanıyor. Sat, keşfet, takas et; her parçaya ikinci bir hayat ver."
      actions={
        <>
          <Button size="lg">
            <ShoppingBag className="size-4" aria-hidden="true" /> Keşfetmeye Başla
          </Button>
          <Button size="lg" variant="secondary">
            İlan Ver <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </>
      }
      media={
        <img
          src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1600&q=80"
          alt="Askıda asılı duran renkli kıyafetler"
        />
      }
      className="max-w-6xl"
    />
  ),
};

export const MarkaGradyaniVideoSlot: Story = {
  render: () => (
    <MediaHero
      overlay="brand"
      minHeight="lg"
      eyebrow={
        <>
          <Play className="size-3.5" aria-hidden="true" /> Tanıtım videosu
        </>
      }
      title="Randevu almak hiç bu kadar kolay olmamıştı"
      description="İşletmeni ekle, takvimini paylaş, müşterilerin saniyeler içinde rezervasyon yapsın. Hatırlatmalar otomatik, iptaller sorunsuz."
      actions={
        <>
          <Button size="lg">Hemen Dene</Button>
          <Button size="lg" variant="outline">
            <Play className="size-4" aria-hidden="true" /> Videoyu İzle
          </Button>
        </>
      }
      media={<div className="h-full w-full bg-conic-brand" aria-hidden="true" />}
      className="max-w-6xl"
    />
  ),
};
