import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { CheckCircle2, Heart, ShoppingBag, Sparkles } from "lucide-react";

import { InfiniteScroll, InfiniteScrollSkeleton } from "@ds/ui";

const meta: Meta<typeof InfiniteScroll> = {
  title: "Composites/InfiniteScroll",
  component: InfiniteScroll,
};

export default meta;
type Story = StoryObj<typeof InfiniteScroll>;

/* ----------------------------- Dolap urun akisi ---------------------------- */

type Urun = {
  id: number;
  ad: string;
  marka: string;
  fiyat: number;
  begeni: number;
};

const MARKALAR = ["Zara", "Mango", "H&M", "Bershka", "Koton", "LC Waikiki"];
const PARCALAR = [
  "Oversize triko kazak",
  "Yüksek bel kot pantolon",
  "Deri biker ceket",
  "Çiçekli midi elbise",
  "Keten gömlek",
  "Bağcıklı spor ayakkabı",
];

const TOPLAM_URUN = 24;

function urunUret(sayfa: number): Urun[] {
  return Array.from({ length: 6 }).map((_, i) => {
    const id = sayfa * 6 + i;
    return {
      id,
      ad: PARCALAR[id % PARCALAR.length] ?? PARCALAR[0]!,
      marka: MARKALAR[id % MARKALAR.length] ?? MARKALAR[0]!,
      fiyat: 120 + ((id * 37) % 480),
      begeni: 3 + ((id * 13) % 96),
    };
  });
}

function DolapAkisi() {
  const [urunler, setUrunler] = React.useState<Urun[]>(() => urunUret(0));
  const [sayfa, setSayfa] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const hasMore = urunler.length < TOPLAM_URUN;

  const dahaFazlaYukle = React.useCallback(() => {
    setLoading(true);
    // Ag gecikmesini taklit et.
    window.setTimeout(() => {
      setUrunler((mevcut) => [...mevcut, ...urunUret(sayfa)]);
      setSayfa((s) => s + 1);
      setLoading(false);
    }, 900);
  }, [sayfa]);

  return (
    <div className="mx-auto max-w-md rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <ShoppingBag className="size-4 text-primary" aria-hidden="true" />
        Senin İçin Seçtiklerimiz
      </div>
      <InfiniteScroll
        onLoadMore={dahaFazlaYukle}
        hasMore={hasMore}
        loading={loading}
        loadingLabel="Daha fazla ürün yükleniyor"
        endMessage="Tüm ürünleri gördün — beğendiklerini kalbe eklemeyi unutma."
        className="space-y-2"
      >
        {urunler.map((u) => (
          <div
            key={u.id}
            className="flex items-center gap-3 rounded-xl border bg-background p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
              aria-hidden="true"
            >
              <ShoppingBag className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-foreground">
                {u.ad}
              </div>
              <div className="text-xs text-muted-foreground">{u.marka}</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {u.fiyat.toLocaleString("tr-TR")} ₺
              </span>
              <span className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
                <Heart className="size-3" aria-hidden="true" />
                {u.begeni}
              </span>
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export const DolapUrunAkisi: Story = {
  render: () => <DolapAkisi />,
};

/* ------------------------ GlowScan gecmisi (skeleton) ---------------------- */

type Tarama = {
  id: number;
  tarih: string;
  puan: number;
  durum: "iyilesti" | "sabit";
};

const TOPLAM_TARAMA = 18;

function taramaUret(sayfa: number): Tarama[] {
  return Array.from({ length: 6 }).map((_, i) => {
    const id = sayfa * 6 + i;
    const gun = new Date(2026, 6, 18 - id);
    return {
      id,
      tarih: gun.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
      }),
      puan: 62 + ((id * 7) % 34),
      durum: id % 3 === 0 ? "sabit" : "iyilesti",
    };
  });
}

function GlowScanGecmisi() {
  const [taramalar, setTaramalar] = React.useState<Tarama[]>(() =>
    taramaUret(0)
  );
  const [sayfa, setSayfa] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const hasMore = taramalar.length < TOPLAM_TARAMA;

  const dahaFazlaYukle = React.useCallback(() => {
    setLoading(true);
    window.setTimeout(() => {
      setTaramalar((mevcut) => [...mevcut, ...taramaUret(sayfa)]);
      setSayfa((s) => s + 1);
      setLoading(false);
    }, 1100);
  }, [sayfa]);

  return (
    <div className="mx-auto max-w-md rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Sparkles className="size-4 text-primary" aria-hidden="true" />
        Cilt Analizi Geçmişin
      </div>
      <InfiniteScroll
        onLoadMore={dahaFazlaYukle}
        hasMore={hasMore}
        loading={loading}
        loader={<InfiniteScrollSkeleton rows={2} />}
        endMessage="18 taramanın hepsi burada. İlk günden bugüne cilt puanın yükseldi."
        className="space-y-2"
      >
        {taramalar.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-xl border bg-background p-3"
          >
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold tabular-nums text-primary"
              aria-hidden="true"
            >
              {t.puan}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground">
                {t.tarih}
              </div>
              <div className="text-xs text-muted-foreground">
                Cilt sağlığı puanı: {t.puan}/100
              </div>
            </div>
            {t.durum === "iyilesti" ? (
              <span className="flex items-center gap-1 text-xs font-medium text-success">
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                İyileşti
              </span>
            ) : (
              <span className="text-xs font-medium text-muted-foreground">
                Sabit
              </span>
            )}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export const GlowScanTaramaGecmisi: Story = {
  render: () => <GlowScanGecmisi />,
};

/* ------------------------------- Liste bitti ------------------------------- */

export const ListeSonu: Story = {
  render: () => (
    <div className="mx-auto max-w-md rounded-2xl border bg-card p-4 shadow-sm">
      <InfiniteScroll
        onLoadMore={() => {}}
        hasMore={false}
        endMessage="Hepsi bu kadar — akışın sonuna ulaştın."
        className="space-y-2"
      >
        {["Keten gömlek", "Deri ceket", "Spor ayakkabı"].map((ad) => (
          <div
            key={ad}
            className="flex items-center gap-3 rounded-xl border bg-background p-3"
          >
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
              aria-hidden="true"
            >
              <ShoppingBag className="size-4" />
            </div>
            <span className="text-sm font-medium text-foreground">{ad}</span>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  ),
};
