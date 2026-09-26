import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Heart, Minus, Plus, Search, Share2, Trash2, X } from "lucide-react";

import { TouchTarget } from "@wowsyler/ds-ui";

const meta: Meta<typeof TouchTarget> = {
  title: "Primitives/TouchTarget",
  component: TouchTarget,
};

export default meta;
type Story = StoryObj<typeof TouchTarget>;

/**
 * "inset" modu (varsayilan): kucuk ikon butonlari, cevrelerinde en az
 * 44x44px'lik ortalanmis bir alanla sarilir. Kesikli anahat, her
 * hedefin gercek dokunma alanini gosterir — gorsel ikon kucuk kalsa
 * da parmakla dokunmak kolaydir. asChild ile alan dogrudan butona
 * uygulanir, ekstra DOM dugumu olusmaz.
 */
export const IkonButonlari: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {[
        { icon: Search, label: "Ara" },
        { icon: Bell, label: "Bildirimler" },
        { icon: Heart, label: "Favorilere ekle" },
        { icon: Share2, label: "Paylas" },
      ].map(({ icon: Icon, label }) => (
        <TouchTarget
          key={label}
          asChild
          className="rounded-full outline-1 outline-dashed outline-border hover:bg-accent"
        >
          <button type="button" aria-label={label}>
            <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </TouchTarget>
      ))}
    </div>
  ),
};

/**
 * "overlay" modu: ogenin gorsel boyutu degismez; ::before yalanci-ogesi
 * ile disina tasan gorunmez bir vurus alani eklenir. Cevre duzen bundan
 * etkilenmez. Asagida kucucuk (16px) "kapat" dugmesi rozetin kosesinde
 * durur ama 44px'lik dokunma alanina sahiptir. Alan burada mavi tonla
 * (before:bg-primary/10) gorunur kilindi; uretimde saydamdir.
 */
export const GorunmezVurusAlani: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6 p-6">
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-4 pr-2 text-sm font-medium shadow-sm">
        3 yeni bildirim
        <TouchTarget
          asChild
          mode="overlay"
          className="rounded-full text-muted-foreground before:rounded-full before:bg-primary/10 hover:text-foreground"
        >
          <button type="button" aria-label="Bildirimleri kapat">
            <X className="size-4" aria-hidden="true" />
          </button>
        </TouchTarget>
      </span>

      <span className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
        Filtre: Aktif
        <TouchTarget
          asChild
          mode="overlay"
          className="rounded-sm before:rounded-md before:bg-primary/10"
        >
          <button type="button" aria-label="Filtreyi kaldir">
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </TouchTarget>
      </span>
    </div>
  ),
};

/**
 * Boyut kademeleri: sm=44px (WCAG asgari), md=48px, lg=56px. Fisly
 * fis miktari icin bir adet-artir/azalt kontrolu — dokunmatik ekranda
 * rahat basmak icin hedefler buyutulmus. Kesikli anahat her kademenin
 * gercek alanini gosterir.
 */
export const BoyutKademeleri: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-sm">
            <TouchTarget
              asChild
              size={size}
              className="rounded-md outline-1 outline-dashed outline-border hover:bg-accent"
            >
              <button type="button" aria-label="Azalt">
                <Minus className="size-4" aria-hidden="true" />
              </button>
            </TouchTarget>
            <span className="w-8 text-center text-sm font-semibold tabular-nums">2</span>
            <TouchTarget
              asChild
              size={size}
              className="rounded-md outline-1 outline-dashed outline-border hover:bg-accent"
            >
              <button type="button" aria-label="Artir">
                <Plus className="size-4" aria-hidden="true" />
              </button>
            </TouchTarget>
          </div>
          <code className="text-xs text-muted-foreground">
            {size} · {size === "sm" ? "44" : size === "md" ? "48" : "56"}px
          </code>
        </div>
      ))}
    </div>
  ),
};

/**
 * mobileOnly: buyutme yalnizca kucuk ekranlarda (<768px) etkindir;
 * masaustunde ogenin dogal boyutu korunur. Pencereyi daraltip
 * genisleterek anahatin degistigini gozlemleyin. Fare ile hassas
 * tiklamada ekstra alana gerek olmadigindan bu, sik izgaralarda
 * yer tasarrufu saglar.
 */
export const YalnizcaMobil: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-3 rounded-lg border border-border bg-card p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">
        Pencereyi <span className="font-medium text-foreground">768px</span>{" "}
        altina daraltin: hedefler buyur (kesikli anahat genisler).
      </p>
      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm font-medium">GlowScan raporu</span>
        <div className="flex items-center gap-1">
          <TouchTarget
            asChild
            mobileOnly
            className="rounded-md outline-1 outline-dashed outline-border/60 hover:bg-accent"
          >
            <button type="button" aria-label="Paylas">
              <Share2 className="size-4 text-muted-foreground" aria-hidden="true" />
            </button>
          </TouchTarget>
          <TouchTarget
            asChild
            mobileOnly
            className="rounded-md outline-1 outline-dashed outline-border/60 hover:bg-accent"
          >
            <button type="button" aria-label="Sil">
              <Trash2 className="size-4 text-destructive" aria-hidden="true" />
            </button>
          </TouchTarget>
        </div>
      </div>
    </div>
  ),
};
