import type { Meta, StoryObj } from "@storybook/react-vite";

import { AuroraBackground, Button } from "@ds/ui";
import { ScanLine, Sparkles } from "lucide-react";

const meta: Meta<typeof AuroraBackground> = {
  title: "Iconic/AuroraBackground",
  component: AuroraBackground,
};

export default meta;
type Story = StoryObj<typeof AuroraBackground>;

/** GlowScan hero metni aurora üzerinde + Fisly CTA. */
export const GlowScanHero: Story = {
  render: () => (
    <AuroraBackground className="min-h-[460px] rounded-2xl border border-border">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-24 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          <ScanLine className="size-3.5" aria-hidden="true" />
          Yapay zekâ destekli cilt analizi
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Cildini GlowScan ile tanı, doğru rutini keşfet
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          30 saniyelik tarama ile nem, gözenek ve leke haritanı çıkar; sana özel
          bakım planını anında al.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg">Ücretsiz taramaya başla</Button>
          <Button size="lg" variant="outline">
            Nasıl çalışır?
          </Button>
        </div>
      </div>
    </AuroraBackground>
  ),
};

/** Grain dokusu eklenmiş, canlı yoğunluklu Fisly CTA bloğu. */
export const FislyCta: Story = {
  render: () => (
    <AuroraBackground
      grain
      intensity="vivid"
      className="rounded-2xl border border-border"
    >
      <div className="flex flex-col items-center gap-5 px-6 py-16 text-center">
        <Sparkles className="size-8 text-primary" aria-hidden="true" />
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Faturalarını Fisly'e taşı, tahsilatı hızlandır
        </h2>
        <p className="max-w-lg text-muted-foreground">
          İlk 100 e-faturan ücretsiz. Kurulum yok, muhasebe entegrasyonu tek
          tıkla hazır.
        </p>
        <Button size="lg">Fisly'i ücretsiz dene</Button>
      </div>
    </AuroraBackground>
  ),
};

/** Daha sakin (subtle) yoğunluk — arka plan ağırlıklı kullanım. */
export const SakinYogunluk: Story = {
  render: () => (
    <AuroraBackground
      intensity="subtle"
      className="min-h-[320px] rounded-2xl border border-border"
    >
      <div className="flex flex-col items-center gap-3 px-6 py-24 text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          Randevu panelin hazır
        </h2>
        <p className="max-w-md text-muted-foreground">
          Bugünkü 12 randevunu tek ekranda gör, boş saatleri anında doldur.
        </p>
      </div>
    </AuroraBackground>
  ),
};
