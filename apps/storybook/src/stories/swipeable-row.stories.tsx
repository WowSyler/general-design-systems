import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Archive,
  BellOff,
  CalendarClock,
  Heart,
  Star,
  Tag,
  Trash2,
} from "lucide-react";

import { SwipeableRow, SwipeableRowGroup } from "@wowsyler/ds-ui";

const meta: Meta<typeof SwipeableRow> = {
  title: "Composites/SwipeableRow",
  component: SwipeableRow,
};

export default meta;
type Story = StoryObj<typeof SwipeableRow>;

type Action = React.ComponentProps<typeof SwipeableRow>["actions"][number];

/** Ortak satir icerigi — Dolap urun karti gorunumu. */
function ProductContent({
  title,
  brand,
  price,
  emoji,
}: {
  title: string;
  brand: string;
  price: string;
  emoji: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-xl">
        {emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-foreground">{title}</div>
        <div className="truncate text-xs text-muted-foreground">{brand}</div>
      </div>
      <div className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
        {price}
      </div>
    </div>
  );
}

export const Varsayilan: Story = {
  render: () => {
    const actions: Action[] = [
      { key: "sil", label: "Sil", icon: <Trash2 />, variant: "destructive" },
      { key: "arsiv", label: "Arşivle", icon: <Archive />, variant: "muted" },
      { key: "favori", label: "Favori", icon: <Heart />, variant: "warning" },
    ];
    return (
      <div className="w-full max-w-md">
        <p className="mb-2 text-xs text-muted-foreground">
          Satırı sola kaydırın; uca kadar kaydırıp bırakınca Sil tetiklenir.
        </p>
        <div className="overflow-hidden rounded-xl border shadow-sm">
          <SwipeableRow actions={actions}>
            <ProductContent
              emoji="🧥"
              title="Vintage deri ceket"
              brand="Zara · L beden"
              price="₺680"
            />
          </SwipeableRow>
        </div>
      </div>
    );
  },
};

export const DolapListesi: Story = {
  render: () => {
    type Item = {
      id: number;
      title: string;
      brand: string;
      price: string;
      emoji: string;
    };
    function Demo() {
      const [items, setItems] = React.useState<Item[]>([
        { id: 1, title: "Çizgili keten gömlek", brand: "Mango · M", price: "₺240", emoji: "👕" },
        { id: 2, title: "Süet bilekli bot", brand: "Derimod · 39", price: "₺520", emoji: "👢" },
        { id: 3, title: "Örgü hırka", brand: "LC Waikiki · S", price: "₺180", emoji: "🧶" },
        { id: 4, title: "Deri omuz çantası", brand: "Matmazel", price: "₺430", emoji: "👜" },
      ]);

      return (
        <div className="w-full max-w-md">
          <p className="mb-2 text-xs text-muted-foreground">
            {items.length} ilan · sola kaydırıp Sil ile listeden çıkarın.
          </p>
          <SwipeableRowGroup>
            {items.map((item) => (
              <SwipeableRow
                key={item.id}
                actions={[
                  {
                    key: "sil",
                    label: "Sil",
                    icon: <Trash2 />,
                    variant: "destructive",
                    onAction: () =>
                      setItems((prev) => prev.filter((i) => i.id !== item.id)),
                  },
                  { key: "etiket", label: "Etiket", icon: <Tag />, variant: "info" },
                  { key: "one-cikar", label: "Öne çıkar", icon: <Star />, variant: "warning" },
                ]}
              >
                <ProductContent
                  emoji={item.emoji}
                  title={item.title}
                  brand={item.brand}
                  price={item.price}
                />
              </SwipeableRow>
            ))}
          </SwipeableRowGroup>
          {items.length === 0 ? (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Tüm ilanlar kaldırıldı.
            </p>
          ) : null}
        </div>
      );
    }
    return <Demo />;
  },
};

export const RandevuBildirimleri: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <p className="mb-2 text-xs text-muted-foreground">
        Randevu hatırlatmaları — kaydırıp erteleyin veya sessize alın.
      </p>
      <SwipeableRowGroup>
        <SwipeableRow
          actions={[
            { key: "ertele", label: "Ertele", icon: <CalendarClock />, variant: "info" },
            { key: "sessiz", label: "Sessiz", icon: <BellOff />, variant: "muted" },
          ]}
        >
          <div className="flex items-start gap-3 px-4 py-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CalendarClock className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground">
                Saç kesimi — Modart Kuaför
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                Yarın 14:30 · Ayşe Demir ile
              </div>
            </div>
          </div>
        </SwipeableRow>
        <SwipeableRow
          actions={[
            { key: "iptal", label: "İptal", icon: <Trash2 />, variant: "destructive" },
            { key: "ertele", label: "Ertele", icon: <CalendarClock />, variant: "info" },
          ]}
        >
          <div className="flex items-start gap-3 px-4 py-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
              <Star className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground">
                Cilt bakımı — GlowScan Klinik
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                24 Temmuz Cuma 11:00 · onaylandı
              </div>
            </div>
          </div>
        </SwipeableRow>
      </SwipeableRowGroup>
    </div>
  ),
};
