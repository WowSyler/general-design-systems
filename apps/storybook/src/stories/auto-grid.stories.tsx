import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Boxes,
  Gauge,
  Rocket,
  ScanFace,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import { AutoGrid } from "@ds/ui";

const meta: Meta<typeof AutoGrid> = {
  title: "Layout/AutoGrid",
  component: AutoGrid,
};

export default meta;
type Story = StoryObj<typeof AutoGrid>;

/** Tema-agnostik ornek kart — yalnizca semantik tokenlar kullanir. */
const DemoCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: ReactNode;
}) => (
  <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm transition-shadow hover:shadow-md">
    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
      {icon}
    </div>
    <div className="flex flex-col gap-1">
      <h3 className="truncate text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

/**
 * Varsayilan davranis: minItemWidth ~16rem. Sarmalayiciyi daraltip genisletince
 * kolon sayisi kirilim noktasi olmadan kendiliginden degisir.
 */
export const Default: Story = {
  render: () => (
    <AutoGrid className="max-w-4xl">
      {[
        {
          title: "Otomatik dağıtım",
          description: "Her push sonrası önizleme ortamı hazırlanır.",
          icon: <Rocket className="size-5" />,
        },
        {
          title: "Canlı metrikler",
          description: "Yanıt süresi ve hata oranı gerçek zamanlı.",
          icon: <Gauge className="size-5" />,
        },
        {
          title: "Sürüm geçmişi",
          description: "Tek tıkla önceki dağıtıma geri dönün.",
          icon: <Boxes className="size-5" />,
        },
        {
          title: "Akıllı öneriler",
          description: "Yapılandırma iyileştirmeleri otomatik bulunur.",
          icon: <Sparkles className="size-5" />,
        },
      ].map((c) => (
        <DemoCard key={c.title} {...c} />
      ))}
    </AutoGrid>
  ),
};

/**
 * minItemWidth degistikce yogunluk degisir: dar oge → daha cok kolon,
 * genis oge → daha az kolon. Tumu ayni ekran genisliginde.
 */
export const OgeGenisligi: Story = {
  render: () => (
    <div className="flex max-w-4xl flex-col gap-8">
      <section className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground">
          minItemWidth = 10rem (yoğun)
        </p>
        <AutoGrid minItemWidth="10rem" gap="sm">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex h-16 items-center justify-center rounded-lg bg-muted text-sm font-medium text-muted-foreground"
            >
              #{i + 1}
            </div>
          ))}
        </AutoGrid>
      </section>
      <section className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground">
          minItemWidth = 18rem (ferah)
        </p>
        <AutoGrid minItemWidth="18rem" gap="sm">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex h-16 items-center justify-center rounded-lg bg-muted text-sm font-medium text-muted-foreground"
            >
              #{i + 1}
            </div>
          ))}
        </AutoGrid>
      </section>
    </div>
  ),
};

/**
 * Dar sarmalayici: kap, oge minimum genisliginden dar olsa bile
 * tek kolona duser ve yatay tasma olusmaz (min(minItemWidth, 100%)).
 */
export const DarKapVeUrunKartlari: Story = {
  render: () => (
    <div className="w-full max-w-xs rounded-xl border border-dashed border-border p-3">
      <p className="mb-3 text-xs text-muted-foreground">
        Dar kolon (maks. 20rem) — kartlar taşmadan sığar
      </p>
      <AutoGrid minItemWidth={200} gap="md">
        {[
          { title: "Vintage kot ceket", price: "₺240", icon: <ShoppingBag className="size-5" /> },
          { title: "Krem triko kazak", price: "₺180", icon: <ShoppingBag className="size-5" /> },
          { title: "Deri omuz çantası", price: "₺320", icon: <ShoppingBag className="size-5" /> },
        ].map((u) => (
          <div
            key={u.title}
            className="flex min-w-0 flex-col gap-2 rounded-lg border border-border bg-card p-3 text-card-foreground"
          >
            <div className="flex size-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              {u.icon}
            </div>
            <span className="truncate text-sm font-medium text-foreground">
              {u.title}
            </span>
            <span className="text-sm font-semibold text-primary">{u.price}</span>
          </div>
        ))}
      </AutoGrid>
    </div>
  ),
};

/**
 * fill (auto-fill): oge sayisi az olsa bile bos raylar korunur; ogeler
 * satirin tamamina yayilmak yerine minimum genisliginde hizalanir.
 */
export const FillVeAutoFit: Story = {
  render: () => (
    <div className="flex max-w-4xl flex-col gap-8">
      <section className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground">
          Varsayilan (auto-fit): iki öğe kalan alanı doldurur
        </p>
        <AutoGrid minItemWidth="14rem">
          <DemoCard
            title="GlowScan analizi"
            description="Cilt taraması tamamlandı."
            icon={<ScanFace className="size-5" />}
          />
          <DemoCard
            title="Sonuç raporu"
            description="Öneriler hazırlandı."
            icon={<Sparkles className="size-5" />}
          />
        </AutoGrid>
      </section>
      <section className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground">
          fill (auto-fill): iki öğe minimum genişlikte kalır, boş ray korunur
        </p>
        <AutoGrid minItemWidth="14rem" fill>
          <DemoCard
            title="GlowScan analizi"
            description="Cilt taraması tamamlandı."
            icon={<ScanFace className="size-5" />}
          />
          <DemoCard
            title="Sonuç raporu"
            description="Öneriler hazırlandı."
            icon={<Sparkles className="size-5" />}
          />
        </AutoGrid>
      </section>
    </div>
  ),
};
