import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles, Star } from "lucide-react";

import { Button, TiltCard } from "@ds/ui";

const meta: Meta<typeof TiltCard> = {
  title: "Iconic/TiltCard",
  component: TiltCard,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof TiltCard>;

export const GlowScanUrunu: Story = {
  render: () => (
    <TiltCard glare className="max-w-xs">
      <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-brand-gradient">
        <Sparkles className="size-10 text-primary-foreground" aria-hidden="true" />
      </div>
      <div className="mt-4 flex items-center gap-1 text-primary">
        <Star className="size-4 fill-current" aria-hidden="true" />
        <span className="text-sm font-medium text-card-foreground">4.9</span>
        <span className="text-sm text-muted-foreground">(1.284 değerlendirme)</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold text-card-foreground">
        GlowScan Cilt Analiz Cihazı
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Tek dokunuşla nem, gözenek ve elastikiyet ölçümü; sonuçlar telefonunuza
        anında düşer.
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-bold text-card-foreground">2.499 ₺</span>
        <Button size="sm">Sepete ekle</Button>
      </div>
    </TiltCard>
  ),
};
