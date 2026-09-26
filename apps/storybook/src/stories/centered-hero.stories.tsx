import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Rocket, ScanFace, Sparkles, Star } from "lucide-react";

import { Badge, Button, CenteredHero, LogoCloud } from "@wowsyler/ds-ui";

const meta: Meta<typeof CenteredHero> = {
  title: "Marketing/CenteredHero",
  component: CenteredHero,
};

export default meta;
type Story = StoryObj<typeof CenteredHero>;

export const DeployLens: Story = {
  render: () => (
    <CenteredHero
      atmosphere="aurora"
      eyebrow={
        <Badge variant="secondary" className="gap-1.5">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Yeni: Anlık dağıtım önizlemeleri
        </Badge>
      }
      title="Her dağıtımı yayına almadan önce gör"
      description="DeployLens; build sürelerini, önizleme ortamlarını ve hataları tek panoda toplar. Ekibin ne değiştiğini saniyeler içinde anlar."
      actions={
        <>
          <Button size="lg">
            <Rocket className="size-4" aria-hidden="true" /> Ücretsiz Başla
          </Button>
          <Button size="lg" variant="outline">
            Canlı Demoyu İzle
          </Button>
        </>
      }
      footer={
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Öncü ekipler DeployLens kullanıyor
          </p>
          <LogoCloud
            items={[
              { name: "Kargoo" },
              { name: "Notara" },
              { name: "Pixely" },
              { name: "Formdesk" },
              { name: "Vera AI" },
            ]}
          />
        </>
      }
      className="max-w-6xl"
    />
  ),
};

export const Fisly: Story = {
  render: () => (
    <CenteredHero
      atmosphere="gradient"
      eyebrow={
        <Badge variant="success" className="gap-1.5">
          <Star className="size-3.5" aria-hidden="true" />
          Muhasebeye hazır özetler
        </Badge>
      }
      title="Fişini çek, gerisini Fisly halletsin"
      description="Fişlerini fotoğrafla; KDV dökümü, kategori ayrımı ve ay sonu raporu otomatik hazırlansın. Serbest çalışanlar ve küçük işletmeler için."
      actions={
        <>
          <Button size="lg">
            30 Gün Ücretsiz Dene
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <Button size="lg" variant="ghost">
            Fiyatları Gör
          </Button>
        </>
      }
      footer={
        <p className="text-sm text-muted-foreground">
          Kredi kartı gerekmez. İstediğin an iptal et.
        </p>
      }
      className="max-w-5xl"
    />
  ),
};

export const GlowScan: Story = {
  render: () => (
    <CenteredHero
      eyebrow={
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          GlowScan
        </span>
      }
      title="Cildini tanı, rutinini ona göre kur"
      description="Tek bir selfie ile yapay zekâ destekli cilt analizi: nem, gözenek, ton eşitliği ve daha fazlası tek raporda."
      actions={
        <Button size="lg">
          <ScanFace className="size-4" aria-hidden="true" /> Analizi Başlat
        </Button>
      }
      className="max-w-4xl"
    />
  ),
};
