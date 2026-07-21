import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Bell,
  CalendarClock,
  Heart,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

import { PullToRefresh } from "@ds/ui";

const meta: Meta<typeof PullToRefresh> = {
  title: "Composites/PullToRefresh",
  component: PullToRefresh,
};

export default meta;
type Story = StoryObj<typeof PullToRefresh>;

/** Telefon cercevesi — mobil baglami taklit eder. */
function TelefonCerceve({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border bg-card shadow-xl">
      {children}
    </div>
  );
}

/** Ag gecikmesini taklit eden yardimci. */
function bekle(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/* ----------------------------- Dolap urun akisi ---------------------------- */

type Urun = {
  id: number;
  ad: string;
  marka: string;
  fiyat: number;
  begeni: number;
};

const PARCALAR = [
  "Oversize triko kazak",
  "Yüksek bel kot pantolon",
  "Deri biker ceket",
  "Çiçekli midi elbise",
  "Keten gömlek",
  "Bağcıklı spor ayakkabı",
  "Kaşe palto",
  "İpek fular",
];
const MARKALAR = ["Zara", "Mango", "H&M", "Bershka", "Koton", "LC Waikiki"];

function urunUret(baslangic: number, adet: number): Urun[] {
  return Array.from({ length: adet }).map((_, i) => {
    const id = baslangic + i;
    return {
      id,
      ad: PARCALAR[id % PARCALAR.length]!,
      marka: MARKALAR[id % MARKALAR.length]!,
      fiyat: 120 + ((id * 37) % 480),
      begeni: 3 + ((id * 13) % 96),
    };
  });
}

function DolapAkisi() {
  const [urunler, setUrunler] = React.useState<Urun[]>(() => urunUret(0, 8));
  const [sayac, setSayac] = React.useState(8);

  const yenile = React.useCallback(async () => {
    await bekle(1300);
    setUrunler((mevcut) => [...urunUret(sayac, 3), ...mevcut]);
    setSayac((s) => s + 3);
  }, [sayac]);

  return (
    <TelefonCerceve>
      <div className="flex items-center gap-2 border-b bg-background/60 px-4 py-3 text-sm font-semibold text-foreground">
        <ShoppingBag className="size-4 text-primary" aria-hidden="true" />
        Senin İçin Seçtiklerimiz
      </div>
      <PullToRefresh onRefresh={yenile} className="h-[440px]">
        <ul className="divide-y">
          {urunler.map((u) => (
            <li
              key={u.id}
              className="flex items-center gap-3 px-4 py-3 transition-colors duration-200 hover:bg-accent/40"
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
            </li>
          ))}
        </ul>
      </PullToRefresh>
    </TelefonCerceve>
  );
}

export const DolapUrunAkisi: Story = {
  render: () => <DolapAkisi />,
};

/* --------------------------- Randevu bildirimleri -------------------------- */

type Bildirim = {
  id: number;
  baslik: string;
  detay: string;
  dakika: number;
  okundu: boolean;
};

const BILDIRIM_HAVUZU: Omit<Bildirim, "id" | "dakika" | "okundu">[] = [
  {
    baslik: "Randevun onaylandı",
    detay: "Yarın 14:30 — Saç kesim & fön, Elif Kuaför",
  },
  {
    baslik: "Yeni değerlendirme",
    detay: "Zeynep A. ziyaretin için 5 yıldız bıraktı",
  },
  {
    baslik: "Hatırlatma",
    detay: "Cilt bakımı randevuna 2 gün kaldı",
  },
  {
    baslik: "Kampanya",
    detay: "Bu hafta manikür randevularında %20 indirim",
  },
];

function bildirimUret(baslangic: number, adet: number): Bildirim[] {
  return Array.from({ length: adet }).map((_, i) => {
    const id = baslangic + i;
    const kaynak = BILDIRIM_HAVUZU[id % BILDIRIM_HAVUZU.length]!;
    return {
      id,
      baslik: kaynak.baslik,
      detay: kaynak.detay,
      dakika: 2 + id * 7,
      okundu: id >= adet,
    };
  });
}

function RandevuBildirimAkisi() {
  const [bildirimler, setBildirimler] = React.useState<Bildirim[]>(() =>
    bildirimUret(0, 5)
  );
  const [sayac, setSayac] = React.useState(5);

  const yenile = React.useCallback(async () => {
    await bekle(1500);
    setBildirimler((mevcut) => [...bildirimUret(sayac, 2), ...mevcut]);
    setSayac((s) => s + 2);
  }, [sayac]);

  return (
    <TelefonCerceve>
      <div className="flex items-center justify-between border-b bg-background/60 px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Bell className="size-4 text-primary" aria-hidden="true" />
          Bildirimler
        </span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium tabular-nums text-primary">
          {bildirimler.filter((b) => !b.okundu).length} yeni
        </span>
      </div>
      <PullToRefresh onRefresh={yenile} tone="accent" className="h-[420px]">
        <ul className="divide-y">
          {bildirimler.map((b) => (
            <li
              key={b.id}
              className="flex items-start gap-3 px-4 py-3 transition-colors duration-200 hover:bg-accent/40"
            >
              <div
                className={
                  b.okundu
                    ? "mt-1 size-2 shrink-0 rounded-full bg-transparent"
                    : "mt-1 size-2 shrink-0 rounded-full bg-primary"
                }
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <CalendarClock
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="truncate text-sm font-medium text-foreground">
                    {b.baslik}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{b.detay}</p>
              </div>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {b.dakika} dk
              </span>
            </li>
          ))}
        </ul>
      </PullToRefresh>
    </TelefonCerceve>
  );
}

export const RandevuBildirimleri: Story = {
  render: () => <RandevuBildirimAkisi />,
};

/* --------------------- Ozel esik + GlowScan tarama akisi -------------------- */

function GlowScanAkisi() {
  const [puanlar, setPuanlar] = React.useState<number[]>([72, 68, 74, 70, 66]);

  const yenile = React.useCallback(async () => {
    await bekle(1200);
    setPuanlar((mevcut) => [60 + ((mevcut.length * 11) % 38), ...mevcut]);
  }, []);

  return (
    <TelefonCerceve>
      <div className="flex items-center gap-2 border-b bg-background/60 px-4 py-3 text-sm font-semibold text-foreground">
        <Sparkles className="size-4 text-primary" aria-hidden="true" />
        Cilt Analizi Geçmişin
      </div>
      <PullToRefresh
        onRefresh={yenile}
        threshold={96}
        maxPull={150}
        tone="primary"
        size="lg"
        pullingLabel="Yeni tarama için çekin"
        releaseLabel="Bırak ve yenile"
        className="h-[400px]"
      >
        <div className="space-y-2 p-4">
          {puanlar.map((puan, i) => (
            <div
              key={`${puan}-${i}`}
              className="flex items-center gap-3 rounded-xl border bg-background p-3"
            >
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold tabular-nums text-primary"
                aria-hidden="true"
              >
                {puan}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground">
                  {new Date(2026, 6, 18 - i).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  Cilt sağlığı puanı: {puan}/100
                </div>
              </div>
            </div>
          ))}
        </div>
      </PullToRefresh>
    </TelefonCerceve>
  );
}

export const OzelEsikGlowScan: Story = {
  render: () => <GlowScanAkisi />,
};
