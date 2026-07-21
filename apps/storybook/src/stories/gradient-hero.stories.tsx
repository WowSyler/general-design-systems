import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScanFace, Sparkles } from "lucide-react";

import { Button, GlassCard, GradientHero } from "@ds/ui";

const meta: Meta<typeof GradientHero> = {
  title: "Composites/GradientHero",
  component: GradientHero,
};

export default meta;
type Story = StoryObj<typeof GradientHero>;

export const GlowScanLanding: Story = {
  render: () => (
    <GradientHero
      eyebrow="GLOWSCAN"
      title="Cildinin ihtiyacını saniyeler içinde keşfet"
      subtitle="Tek bir selfie ile yapay zekâ destekli cilt analizi: nem, elastikiyet, gözenek ve daha fazlası. Kişisel bakım rutinin seni bekliyor."
      size="lg"
      actions={
        <>
          <Button variant="secondary" size="lg">
            <ScanFace className="mr-2 size-4" /> Analizi Başlat
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/40 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
          >
            Nasıl Çalışır?
          </Button>
        </>
      }
    >
      <div className="mt-8 grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        <GlassCard className="text-left">
          <Sparkles className="mb-2 size-5" aria-hidden="true" />
          <div className="text-sm font-semibold">10 Metrikte Analiz</div>
          <p className="mt-1 text-sm opacity-90">
            Nem, elastikiyet, gözenek, kızarıklık ve ton eşitliği dahil 10
            metrik tek raporda.
          </p>
        </GlassCard>
        <GlassCard className="text-left">
          <ScanFace className="mb-2 size-5" aria-hidden="true" />
          <div className="text-sm font-semibold">Kişisel Bakım Rutini</div>
          <p className="mt-1 text-sm opacity-90">
            Sonuçlarına göre sabah ve akşam rutinin otomatik oluşturulur,
            gelişimin haftalık takip edilir.
          </p>
        </GlassCard>
      </div>
    </GradientHero>
  ),
};

export const SolaHizali: Story = {
  args: {
    eyebrow: "GLOWSCAN",
    title: "Cilt sağlığında yeni dönem",
    subtitle: "Salonunuz için profesyonel cilt analizi araçları.",
    align: "start",
    overlay: true,
    actions: <Button variant="secondary">Satışla Görüş</Button>,
  },
};
