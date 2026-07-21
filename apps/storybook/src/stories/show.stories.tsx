import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Show, Hide } from "@ds/ui";
import { Monitor, Smartphone, Tablet } from "lucide-react";

const meta: Meta<typeof Show> = {
  title: "Layout/Show",
  component: Show,
};

export default meta;
type Story = StoryObj<typeof Show>;

const Panel = ({
  tone = "muted",
  icon,
  children,
}: {
  tone?: "muted" | "primary" | "success" | "info";
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const toneClasses: Record<string, string> = {
    muted: "bg-muted text-muted-foreground border-border",
    primary: "bg-primary/10 text-primary border-primary/30",
    success: "bg-success/10 text-success border-success/30",
    info: "bg-info/10 text-info border-info/30",
  };
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium ${toneClasses[tone]}`}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
};

const Hint = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs text-muted-foreground">{children}</p>
);

/**
 * Gorunurluk canvas GENISLIGINE gore degisir. Storybook araç çubuğundaki
 * viewport seçenekleriyle ya da paneli yeniden boyutlandırarak deneyin.
 */
export const TemelKullanim: Story = {
  render: () => (
    <div className="flex w-full max-w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Hint>
          Paneli daraltıp genişleterek blokların belirip kaybolmasını izleyin
          (sm=640 · md=768 · lg=1024 · xl=1280 · 2xl=1536).
        </Hint>
      </div>

      <div className="flex flex-col gap-3">
        <Show above="md" display="flex">
          <Panel tone="primary" icon={<Monitor className="size-4 shrink-0" />}>
            above=&quot;md&quot; · md (768px) ve ÜSTÜNDE görünür
          </Panel>
        </Show>

        <Show below="md" display="flex">
          <Panel tone="info" icon={<Smartphone className="size-4 shrink-0" />}>
            below=&quot;md&quot; · md ALTINDA (mobil) görünür
          </Panel>
        </Show>

        <Show only="md" display="flex">
          <Panel tone="success" icon={<Tablet className="size-4 shrink-0" />}>
            only=&quot;md&quot; · YALNIZCA md aralığında (768–1023px) görünür
          </Panel>
        </Show>

        <Show only="2xl" display="flex">
          <Panel tone="success" icon={<Monitor className="size-4 shrink-0" />}>
            only=&quot;2xl&quot; · yalnızca çok geniş ekranda (≥1536px) görünür
          </Panel>
        </Show>
      </div>
    </div>
  ),
};

/**
 * Show ve Hide aynı proplarla tam ters davranır:
 * Hide above="md" === Show below="md".
 */
export const GosterVeGizle: Story = {
  render: () => (
    <div className="grid w-full max-w-full grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-3">
        <Hint>Show — belirtilen aralıkta GÖSTERİR</Hint>
        <Show above="lg" display="flex">
          <Panel tone="primary">Show above=&quot;lg&quot; · lg ve üstü</Panel>
        </Show>
        <Show below="lg" display="flex">
          <Panel tone="info">Show below=&quot;lg&quot; · lg altı</Panel>
        </Show>
      </div>

      <div className="flex flex-col gap-3">
        <Hint>Hide — belirtilen aralıkta GİZLER (tersi)</Hint>
        <Hide above="lg" display="flex">
          <Panel tone="info">Hide above=&quot;lg&quot; · = Show below=&quot;lg&quot;</Panel>
        </Hide>
        <Hide below="lg" display="flex">
          <Panel tone="primary">Hide below=&quot;lg&quot; · = Show above=&quot;lg&quot;</Panel>
        </Hide>
      </div>
    </div>
  ),
};

/**
 * Gerçek desen (Randevu): mobilde alt gezinme çubuğu, masaüstünde kenar menü.
 * İki yapı da SSR'da render edilir; yalnızca CSS ile biri gizlenir.
 */
export const MobilMasaustuDeseni: Story = {
  render: () => (
    <div className="w-full max-w-full overflow-hidden rounded-xl border border-border">
      {/* Masaustu: kenar menu + icerik (md ve ustu) */}
      <Hide below="md" display="flex">
        <div className="min-h-[220px]">
          <aside className="flex w-56 shrink-0 flex-col gap-2 border-r border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Kenar Menü
            </p>
            {["Randevular", "Takvim", "Müşteriler", "Ayarlar"].map((item) => (
              <div
                key={item}
                className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent"
              >
                {item}
              </div>
            ))}
          </aside>
          <main className="flex-1 p-6">
            <h3 className="text-lg font-semibold text-foreground">Masaüstü Düzeni</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              md (768px) ve üstünde soldaki kenar menü görünür.
            </p>
          </main>
        </div>
      </Hide>

      {/* Mobil: icerik + alt gezinme (md alti) */}
      <Show below="md" display="block">
        <div className="min-h-[220px]">
          <main className="p-6 pb-20">
            <h3 className="text-lg font-semibold text-foreground">Mobil Düzen</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              md altında kenar menü gizlenir, yerine alttan sabit gezinme gelir.
            </p>
          </main>
          <nav className="flex items-center justify-around border-t border-border bg-card p-2">
            {[
              { icon: <Smartphone className="size-5" />, label: "Randevu" },
              { icon: <Tablet className="size-5" />, label: "Takvim" },
              { icon: <Monitor className="size-5" />, label: "Profil" },
            ].map((tab) => (
              <button
                key={tab.label}
                className="flex min-h-[44px] flex-1 flex-col items-center gap-1 rounded-md py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </Show>
    </div>
  ),
};
