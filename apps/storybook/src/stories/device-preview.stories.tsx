import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Bell,
  Heart,
  Home,
  RotateCcw,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";

import { DevicePreview } from "@ds/ui";

const meta: Meta<typeof DevicePreview> = {
  title: "Composites/DevicePreview",
  component: DevicePreview,
};

export default meta;
type Story = StoryObj<typeof DevicePreview>;

/** Örnek bir açılış sayfası — çerçeve genişliğine göre akışkan davranır. */
function OrnekSayfa() {
  const urunler = [
    { ad: "Akustik Kulaklık", fiyat: "₺2.499", renk: "bg-primary/15" },
    { ad: "Mekanik Klavye", fiyat: "₺1.850", renk: "bg-success/15" },
    { ad: "Ergonomik Mouse", fiyat: "₺780", renk: "bg-warning/15" },
    { ad: "USB-C Hub", fiyat: "₺640", renk: "bg-info/15" },
  ];
  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-base font-semibold">Mağaza</span>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Search className="size-5" aria-hidden="true" />
          <Bell className="size-5" aria-hidden="true" />
          <ShoppingBag className="size-5" aria-hidden="true" />
        </div>
      </header>

      <section className="border-b border-border bg-primary/5 px-4 py-8 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          Yeni Sezon
        </p>
        <h2 className="mt-2 text-xl font-bold sm:text-2xl">
          Çalışma alanını yenile
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Tüm aksesuarlarda sınırlı süreli indirim. İçerik, seçilen cihaz
          genişliğine göre otomatik uyum sağlar.
        </p>
        <button
          type="button"
          className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm"
        >
          Alışverişe Başla
        </button>
      </section>

      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {urunler.map((u) => (
          <div
            key={u.ad}
            className="rounded-xl border border-border bg-card p-3 shadow-sm"
          >
            <div
              className={`mb-3 flex aspect-square items-center justify-center rounded-lg ${u.renk}`}
            >
              <Heart className="size-6 text-foreground/40" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium">{u.ad}</p>
            <p className="text-sm font-semibold tabular-nums text-primary">
              {u.fiyat}
            </p>
          </div>
        ))}
      </div>

      <nav className="mt-auto flex items-center justify-around border-t border-border px-4 py-3 text-muted-foreground">
        <Home className="size-5 text-foreground" aria-hidden="true" />
        <Search className="size-5" aria-hidden="true" />
        <ShoppingBag className="size-5" aria-hidden="true" />
        <User className="size-5" aria-hidden="true" />
      </nav>
    </div>
  );
}

export const Varsayilan: Story = {
  render: () => (
    <div className="mx-auto max-w-5xl">
      <DevicePreview defaultDevice="phone">
        <OrnekSayfa />
      </DevicePreview>
    </div>
  ),
};

export const MasaustuBaslangic: Story = {
  render: () => (
    <div className="mx-auto max-w-5xl">
      <DevicePreview defaultDevice="desktop">
        <OrnekSayfa />
      </DevicePreview>
    </div>
  ),
};

export const KontrolluDurumEkiyle: Story = {
  render: () => {
    const [cihaz, setCihaz] =
      React.useState<React.ComponentProps<typeof DevicePreview>["device"]>(
        "tablet"
      );
    const [anahtar, setAnahtar] = React.useState(0);

    return (
      <div className="mx-auto max-w-5xl">
        <DevicePreview
          device={cihaz}
          onDeviceChange={setCihaz}
          toolbarExtra={
            <button
              type="button"
              onClick={() => setAnahtar((k) => k + 1)}
              aria-label="Önizlemeyi yenile"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          }
        >
          <div key={anahtar}>
            <OrnekSayfa />
          </div>
        </DevicePreview>
      </div>
    );
  },
};
