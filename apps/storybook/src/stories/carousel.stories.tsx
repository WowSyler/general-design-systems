import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Carousel, CarouselItem } from "@wowsyler/ds-ui";
import {
  Shirt,
  ShoppingBag,
  Footprints,
  Watch,
  Sparkles,
  Sun,
  Droplet,
  FlaskConical,
  Tag,
  Store,
} from "lucide-react";

const meta: Meta<typeof Carousel> = {
  title: "Composites/Carousel",
  component: Carousel,
};

export default meta;
type Story = StoryObj<typeof Carousel>;

type UrunKartiProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  price: string;
  badge?: string;
};

function UrunKarti({ icon, title, subtitle, price, badge }: UrunKartiProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-brand-gradient text-primary-foreground [&_svg]:size-10 [&_svg]:opacity-90 [&_svg]:transition-transform [&_svg]:duration-300 group-hover:[&_svg]:scale-110">
        {icon}
        {badge ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
            <Tag className="size-3" aria-hidden="true" />
            {badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="truncate text-sm font-semibold">{title}</h3>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        <div className="mt-auto pt-2 text-base font-bold tabular-nums">
          {price}
        </div>
      </div>
    </article>
  );
}

/**
 * Dolap ikinci-el vitrin: masaustunde 3, tablette 2, mobilde 1 urun.
 */
export const DolapUrunVitrini: Story = {
  args: {
    ariaLabel: "Öne çıkan ürünler",
    className: "max-w-4xl",
  },
  render: (args) => (
    <Carousel {...args}>
      <CarouselItem>
        <UrunKarti
          icon={<Shirt />}
          title="Vintage Kot Ceket"
          subtitle="Levi's · M beden · Çok iyi durumda"
          price="₺349"
          badge="Yeni eklendi"
        />
      </CarouselItem>
      <CarouselItem>
        <UrunKarti
          icon={<ShoppingBag />}
          title="El Örgüsü Yün Kazak"
          subtitle="Krem rengi · L beden"
          price="₺189"
        />
      </CarouselItem>
      <CarouselItem>
        <UrunKarti
          icon={<Footprints />}
          title="Deri Chelsea Bot"
          subtitle="Kahverengi · 41 numara"
          price="₺520"
          badge="İndirimde"
        />
      </CarouselItem>
      <CarouselItem>
        <UrunKarti
          icon={<Watch />}
          title="Klasik Deri Saat"
          subtitle="Az kullanılmış · Kutulu"
          price="₺275"
        />
      </CarouselItem>
      <CarouselItem>
        <UrunKarti
          icon={<Shirt />}
          title="İpek Desenli Gömlek"
          subtitle="Çiçek desen · S beden"
          price="₺210"
          badge="Az kullanılmış"
        />
      </CarouselItem>
      <CarouselItem>
        <UrunKarti
          icon={<ShoppingBag />}
          title="Örgü Omuz Çantası"
          subtitle="Hasır detay · Yazlık"
          price="₺160"
        />
      </CarouselItem>
    </Carousel>
  ),
};

/**
 * GlowScan urun onerileri: otomatik donen, sonsuz sarmali karusel.
 */
export const GlowScanUrunOnerileri: Story = {
  args: {
    ariaLabel: "Cilt analizine göre öneriler",
    className: "max-w-4xl",
    perView: { base: 1, sm: 2, lg: 3 },
    autoplay: true,
    loop: true,
    autoplayInterval: 3500,
  },
  render: (args) => (
    <Carousel {...args}>
      <CarouselItem>
        <UrunKarti
          icon={<Droplet />}
          title="Hyaluronik Nem Serumu"
          subtitle="Kuru cilt için · %2 konsantrasyon"
          price="₺289"
          badge="Sana özel"
        />
      </CarouselItem>
      <CarouselItem>
        <UrunKarti
          icon={<Sun />}
          title="SPF 50+ Güneş Kremi"
          subtitle="Mat bitiş · Leke karşıtı"
          price="₺215"
        />
      </CarouselItem>
      <CarouselItem>
        <UrunKarti
          icon={<FlaskConical />}
          title="C Vitamini Toniği"
          subtitle="Aydınlatıcı · Sabah rutini"
          price="₺179"
          badge="Sana özel"
        />
      </CarouselItem>
      <CarouselItem>
        <UrunKarti
          icon={<Sparkles />}
          title="Gece Yenileyici Krem"
          subtitle="Retinol içerir · Gözenek sıklaştırıcı"
          price="₺340"
        />
      </CarouselItem>
      <CarouselItem>
        <UrunKarti
          icon={<Droplet />}
          title="Nemlendirici Maske"
          subtitle="Haftalık bakım · 5'li paket"
          price="₺125"
        />
      </CarouselItem>
    </Carousel>
  ),
};

type BannerProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
};

function BannerSlayt({ icon, title, description, cta }: BannerProps) {
  return (
    <div className="relative flex h-full min-h-[13rem] flex-col justify-center overflow-hidden rounded-xl bg-brand-gradient bg-sheen p-8 text-primary-foreground">
      <div
        className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-background/20 backdrop-blur [&_svg]:size-6"
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="font-display text-2xl font-bold tracking-tight">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed opacity-90">
        {description}
      </p>
      <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
        {cta}
      </span>
    </div>
  );
}

/**
 * Tek gorunumlu tam-genislik kampanya karuseli (ok + noktalar).
 */
export const KampanyaBanneri: Story = {
  args: {
    ariaLabel: "Dolap kampanyaları",
    className: "max-w-2xl",
    perView: 1,
  },
  render: (args) => (
    <Carousel {...args}>
      <CarouselItem>
        <BannerSlayt
          icon={<Store />}
          title="Dolabını paraya çevir"
          description="Giymediğin kıyafetleri fotoğrafla, birkaç dakikada satışa çıkar. İlk ilanın komisyonsuz."
          cta="Hemen ilan ver"
        />
      </CarouselItem>
      <CarouselItem>
        <BannerSlayt
          icon={<Tag />}
          title="Yaz indirimi başladı"
          description="Seçili mağazalarda binlerce üründe %40'a varan fırsatlar seni bekliyor."
          cta="Fırsatları keşfet"
        />
      </CarouselItem>
      <CarouselItem>
        <BannerSlayt
          icon={<Sparkles />}
          title="Sana özel seçkiler"
          description="Beğendiğin stillere göre haftalık kişisel koleksiyonlar hazırlıyoruz."
          cta="Seçkileri gör"
        />
      </CarouselItem>
    </Carousel>
  ),
};
