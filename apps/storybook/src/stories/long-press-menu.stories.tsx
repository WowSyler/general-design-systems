import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Copy,
  Pencil,
  Repeat2,
  Share2,
  Sparkles,
  Star,
  Tag,
  Trash2,
} from "lucide-react";

import { LongPressMenu } from "@ds/ui";

type MenuItems = React.ComponentProps<typeof LongPressMenu>["items"];

const meta: Meta<typeof LongPressMenu> = {
  title: "Composites/LongPressMenu",
  component: LongPressMenu,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof LongPressMenu>;

/** Dolap urun karti: karta uzun basinca (500ms) hizli aksiyonlar acilir. */
export const DolapUrunKarti: Story = {
  name: "Dolap — ürün kartı",
  render: () => {
    const items: MenuItems = [
      {
        key: "edit",
        label: "İlanı düzenle",
        icon: <Pencil aria-hidden="true" />,
        shortcut: "E",
        onSelect: () => console.log("düzenle"),
      },
      {
        key: "feature",
        label: "Öne çıkar",
        icon: <Star aria-hidden="true" />,
        onSelect: () => console.log("öne çıkar"),
      },
      {
        key: "share",
        label: "Bağlantıyı paylaş",
        icon: <Share2 aria-hidden="true" />,
        onSelect: () => console.log("paylaş"),
      },
      {
        key: "delete",
        label: "İlanı kaldır",
        icon: <Trash2 aria-hidden="true" />,
        variant: "destructive",
        onSelect: () => console.log("kaldır"),
      },
    ];

    return (
      <div className="flex flex-col items-center gap-3">
        <LongPressMenu items={items} label="Hızlı işlemler" defaultOpen>
          <div className="flex w-72 items-center gap-3 rounded-xl border bg-card p-3 text-card-foreground shadow-sm">
            <div className="size-14 shrink-0 rounded-lg bg-brand-gradient" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Vintage kot ceket</p>
              <p className="truncate text-xs text-muted-foreground">
                Beden M · Çok iyi durumda
              </p>
              <p className="mt-1 text-sm font-bold tabular-nums">₺240</p>
            </div>
          </div>
        </LongPressMenu>
        <p className="text-xs text-muted-foreground">
          Karta uzun basın (veya sağ tıklayın)
        </p>
      </div>
    );
  },
};

/** Fisly islem satiri: uzun basinca kategori/tekrar/sil aksiyonlari. */
export const FislyIslemSatiri: Story = {
  name: "Fisly — işlem satırı",
  render: () => {
    const items: MenuItems = [
      {
        key: "categorize",
        label: "Kategori ata",
        icon: <Tag aria-hidden="true" />,
        onSelect: () => console.log("kategori"),
      },
      {
        key: "duplicate",
        label: "Kopyala",
        icon: <Copy aria-hidden="true" />,
        shortcut: "⌘D",
        onSelect: () => console.log("kopyala"),
      },
      {
        key: "recurring",
        label: "Tekrarlayan yap",
        icon: <Repeat2 aria-hidden="true" />,
        onSelect: () => console.log("tekrar"),
      },
      {
        key: "delete",
        label: "İşlemi sil",
        icon: <Trash2 aria-hidden="true" />,
        variant: "destructive",
        onSelect: () => console.log("sil"),
      },
    ];

    return (
      <LongPressMenu
        items={items}
        onSelect={(key: string) => console.log("seçilen:", key)}
      >
        <div className="flex w-80 items-center justify-between rounded-xl border bg-card p-3.5 text-card-foreground shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-warning/15 text-warning">
              <Tag className="size-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium">Market alışverişi</p>
              <p className="text-xs text-muted-foreground">14 Temmuz · Migros</p>
            </div>
          </div>
          <span className="text-sm font-semibold tabular-nums text-destructive">
            −₺318,50
          </span>
        </div>
      </LongPressMenu>
    );
  },
};

/** GlowScan tarama sonucu: baslikli menu + kisayolsuz sade ogeler. */
export const GlowScanTaramaSonucu: Story = {
  name: "GlowScan — tarama sonucu",
  render: () => {
    const items: MenuItems = [
      {
        key: "compare",
        label: "Öncekiyle karşılaştır",
        icon: <Sparkles aria-hidden="true" />,
        onSelect: () => console.log("karşılaştır"),
      },
      {
        key: "share",
        label: "Uzmanla paylaş",
        icon: <Share2 aria-hidden="true" />,
        onSelect: () => console.log("paylaş"),
      },
      {
        key: "rename",
        label: "Yeniden adlandır",
        icon: <Pencil aria-hidden="true" />,
        disabled: true,
      },
      {
        key: "delete",
        label: "Taramayı sil",
        icon: <Trash2 aria-hidden="true" />,
        variant: "destructive",
        onSelect: () => console.log("sil"),
      },
    ];

    return (
      <LongPressMenu items={items} label="Tarama işlemleri">
        <div className="w-64 overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="aspect-[4/3] bg-aurora" aria-hidden="true" />
          <div className="flex items-center justify-between p-3">
            <div>
              <p className="text-sm font-semibold">Cilt analizi</p>
              <p className="text-xs text-muted-foreground">Nem · 72 puan</p>
            </div>
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
              İyi
            </span>
          </div>
        </div>
      </LongPressMenu>
    );
  },
};
