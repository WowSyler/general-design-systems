import type { Meta, StoryObj } from "@storybook/react-vite";
import { Gauge, TrendingUp, Wallet, Zap } from "lucide-react";

import { TrendDeltaBadge } from "@ds/ui";

const meta: Meta<typeof TrendDeltaBadge> = {
  title: "Primitives/TrendDeltaBadge",
  component: TrendDeltaBadge,
};

export default meta;
type Story = StoryObj<typeof TrendDeltaBadge>;

export const Varsayilan: Story = {
  args: {
    direction: "up",
    value: "%12,4",
  },
};

/** Uc yon ve iki boyut — duz (normal) semantik: yukselis yesil, dusus kirmizi. */
export const YonlerVeBoyutlar: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <TrendDeltaBadge direction="up" value="%12,4" />
        <TrendDeltaBadge direction="down" value="%3,8" />
        <TrendDeltaBadge direction="flat" value="%0,0" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <TrendDeltaBadge direction="up" value="%12,4" size="sm" />
        <TrendDeltaBadge direction="down" value="%3,8" size="sm" />
        <TrendDeltaBadge direction="flat" value="%0,0" size="sm" />
      </div>
    </div>
  ),
};

/**
 * invertColors karsilastirmasi — ayni yon, ters renk.
 * Ust satir normal (up=iyi), alt satir ters semantik (down=iyi).
 */
export const TersSemantik: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Normal (artış iyi) — ör. gelir, dönüşüm oranı
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <TrendDeltaBadge direction="up" value="+%18,2" />
          <TrendDeltaBadge direction="down" value="-%6,5" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Ters (düşüş iyi) — ör. gider, gecikme, hata oranı
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <TrendDeltaBadge direction="up" value="+%18,2" invertColors />
          <TrendDeltaBadge direction="down" value="-%6,5" invertColors />
        </div>
      </div>
    </div>
  ),
};

/**
 * Fisly — aylik gider ozeti. Giderde dusus iyidir, bu yuzden
 * invertColors ile kategori bazli delta rozetleri gosterilir.
 */
export const FislyGiderOzeti: Story = {
  render: () => {
    const kalemler = [
      { kategori: "Market", tutar: "₺4.280", yon: "down" as const, delta: "-%9,1" },
      { kategori: "Ulaşım", tutar: "₺1.560", yon: "up" as const, delta: "+%14,7" },
      { kategori: "Faturalar", tutar: "₺2.940", yon: "flat" as const, delta: "%0,0" },
      { kategori: "Eğlence", tutar: "₺820", yon: "down" as const, delta: "-%22,3" },
    ];

    return (
      <div className="w-80 divide-y divide-border rounded-xl border bg-card">
        <div className="flex items-center gap-2 px-4 py-3">
          <span className="rounded-lg bg-primary/10 p-1.5 text-primary">
            <Wallet className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">Temmuz gideri</p>
            <p className="text-xs text-muted-foreground">Geçen aya göre</p>
          </div>
        </div>
        {kalemler.map((k) => (
          <div
            key={k.kategori}
            className="flex items-center justify-between gap-3 px-4 py-2.5"
          >
            <span className="text-sm text-foreground">{k.kategori}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium tabular-nums">{k.tutar}</span>
              <TrendDeltaBadge
                direction={k.yon}
                value={k.delta}
                size="sm"
                invertColors
              />
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * DeployLens — servis metrikleri. p95 gecikme ve hata oraninda dusus
 * iyidir (invertColors); istek hacminde artis normaldir.
 */
export const DeployLensMetrikleri: Story = {
  render: () => {
    const metrikler = [
      {
        ad: "p95 gecikme",
        deger: "182 ms",
        yon: "down" as const,
        delta: "-38 ms",
        ters: true,
        icon: <Zap className="size-4" aria-hidden="true" />,
      },
      {
        ad: "Hata oranı",
        deger: "%0,42",
        yon: "down" as const,
        delta: "-%0,18",
        ters: true,
        icon: <Gauge className="size-4" aria-hidden="true" />,
      },
      {
        ad: "İstek hacmi",
        deger: "1,24 M",
        yon: "up" as const,
        delta: "+%9,6",
        ters: false,
        icon: <TrendingUp className="size-4" aria-hidden="true" />,
      },
    ];

    return (
      <div className="grid w-[34rem] grid-cols-3 gap-3">
        {metrikler.map((m) => (
          <div
            key={m.ad}
            className="space-y-2 rounded-xl border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              {m.icon}
              <span className="text-xs font-medium">{m.ad}</span>
            </div>
            <p className="text-2xl font-bold tabular-nums">{m.deger}</p>
            <TrendDeltaBadge
              direction={m.yon}
              value={m.delta}
              size="sm"
              invertColors={m.ters}
            />
          </div>
        ))}
      </div>
    );
  },
};
