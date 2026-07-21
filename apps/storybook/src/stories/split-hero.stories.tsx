import type { Meta, StoryObj } from "@storybook/react-vite";
import { Receipt, ScanFace } from "lucide-react";

import { Button, SplitHero } from "@ds/ui";

const meta: Meta<typeof SplitHero> = {
  title: "Marketing/SplitHero",
  component: SplitHero,
};

export default meta;
type Story = StoryObj<typeof SplitHero>;

export const GlowScan: Story = {
  render: () => (
    <SplitHero
      eyebrow="GlowScan"
      title="Cildini tanı, rutinini kur"
      description="Tek bir selfie ile yapay zekâ destekli cilt analizi: nem, elastikiyet, gözenek ve ton eşitliği dahil 10 metrik tek raporda."
      actions={
        <>
          <Button size="lg">
            <ScanFace className="mr-2 size-4" aria-hidden="true" /> Analizi
            Başlat
          </Button>
          <Button size="lg" variant="outline">
            Örnek Raporu Gör
          </Button>
        </>
      }
      className="max-w-5xl"
    />
  ),
};

export const TersYonluMedyali: Story = {
  render: () => (
    <SplitHero
      reverse
      eyebrow="Fisly"
      title="Fişini çek, gerisini bize bırak"
      description="Fişlerinizi fotoğraflayın; Fisly KDV dökümünü çıkarsın, giderlerinizi kategorilere ayırsın ve ay sonunda muhasebeye hazır özet sunsun."
      actions={
        <Button size="lg">
          <Receipt className="mr-2 size-4" aria-hidden="true" /> Ücretsiz Dene
        </Button>
      }
      media={
        <div className="flex aspect-video w-full items-center justify-center bg-muted">
          <div className="rounded-xl bg-card p-6 text-center shadow-lg">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Temmuz Özeti
            </div>
            <div className="mt-1 font-display text-3xl font-bold">
              ₺48.350
            </div>
            <div className="text-sm text-muted-foreground">
              214 fiş · 6 kategori
            </div>
          </div>
        </div>
      }
      className="max-w-5xl"
    />
  ),
};
