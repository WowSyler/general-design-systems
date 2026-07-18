import type { Meta, StoryObj } from "@storybook/react";
import { Droplets } from "lucide-react";

import { GlassCard, GradientHero, ScoreBadge } from "@ds/ui";

const meta: Meta<typeof GlassCard> = {
  title: "Composites/GlassCard",
  component: GlassCard,
};

export default meta;
type Story = StoryObj<typeof GlassCard>;

export const HeroUzerinde: Story = {
  render: () => (
    <GradientHero
      eyebrow="GLOWSCAN"
      title="Bugünkü cilt skorun hazır"
      size="md"
    >
      <GlassCard className="mt-6 w-full max-w-sm text-left">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Droplets className="size-5" aria-hidden="true" />
            <span className="text-sm font-semibold">Nem Dengesi</span>
          </div>
          <ScoreBadge value={8.4} className="bg-white/20 text-white" />
        </div>
        <p className="mt-2 text-sm opacity-90">
          Cildinin nem seviyesi son 7 günde %12 arttı. Rutinini aynen sürdür.
        </p>
      </GlassCard>
    </GradientHero>
  ),
};

export const DusukYogunluk: Story = {
  render: () => (
    <div className="rounded-2xl bg-brand-gradient p-8">
      <GlassCard intensity="sm" className="max-w-sm text-primary-foreground">
        <div className="text-sm font-semibold">Hafif bulanıklık (sm)</div>
        <p className="mt-1 text-sm opacity-90">
          Daha az backdrop-blur ile ince cam efekti.
        </p>
      </GlassCard>
    </div>
  ),
};
