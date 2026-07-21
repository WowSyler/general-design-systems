import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { LayoutDashboard, Rocket, Settings } from "lucide-react";

import { BrowserFrame } from "@ds/ui";

type BrowserTab = React.ComponentProps<typeof BrowserFrame>["tabs"];

const meta: Meta<typeof BrowserFrame> = {
  title: "Composites/BrowserFrame",
  component: BrowserFrame,
};

export default meta;
type Story = StoryObj<typeof BrowserFrame>;

const sekmeler: BrowserTab = [
  { label: "Panel — DeployLens", active: true, icon: <LayoutDashboard /> },
  { label: "Dağıtımlar", icon: <Rocket /> },
  { label: "Ayarlar", icon: <Settings /> },
];

/** İçerik olarak kullanılan basit bir web sayfası taslağı. */
function SayfaTaslagi() {
  return (
    <div className="flex min-h-[16rem] flex-col gap-4 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-lg font-semibold text-foreground">Genel Bakış</div>
          <div className="text-sm text-muted-foreground">Son 24 saat</div>
        </div>
        <span className="rounded-md bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
          Tüm sistemler çalışıyor
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { k: "Dağıtım", v: "128" },
          { k: "Başarı", v: "%99,2" },
          { k: "Ort. süre", v: "42 sn" },
        ].map((s) => (
          <div key={s.k} className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs text-muted-foreground">{s.k}</div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-foreground">
              {s.v}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        Son dağıtım <span className="font-medium text-foreground">a1b2c3d</span>{" "}
        commit'i ile 5 dakika önce tamamlandı.
      </div>
    </div>
  );
}

export const SekmeliOnizleme: Story = {
  render: () => (
    <div className="mx-auto max-w-3xl">
      <BrowserFrame url="deploylens.app/panel" tabs={sekmeler}>
        <SayfaTaslagi />
      </BrowserFrame>
    </div>
  ),
};

export const YalinCerceve: Story = {
  render: () => (
    <div className="mx-auto max-w-2xl">
      <BrowserFrame
        url="deploylens.app/durum"
        aspect="video"
        contentClassName="grid place-items-center"
      >
        <div className="p-6 text-center">
          <div className="text-3xl font-bold text-foreground">Canlı Önizleme</div>
          <p className="mt-2 text-sm text-muted-foreground">
            16:9 en-boy oranında sabit içerik alanı.
          </p>
        </div>
      </BrowserFrame>
    </div>
  ),
};

/** Dar (mobil) genişlikte: gezinme okları ve trafik ışıkları uyum sağlar. */
export const DarGenislik: Story = {
  render: () => (
    <div className="mx-auto max-w-[380px]">
      <BrowserFrame url="deploylens.app" secure={false}>
        <SayfaTaslagi />
      </BrowserFrame>
    </div>
  ),
};
