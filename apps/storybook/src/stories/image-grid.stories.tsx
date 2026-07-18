import type { Meta, StoryObj } from "@storybook/react";
import { Heart } from "lucide-react";

import { Badge, Button, ImageGrid, PhotoCard } from "@ds/ui";

const meta: Meta<typeof ImageGrid> = {
  title: "Composites/ImageGrid",
  component: ImageGrid,
};

export default meta;
type Story = StoryObj<typeof ImageGrid>;

const favoriButonu = (
  <Button
    variant="ghost"
    size="icon"
    aria-label="Favorilere ekle"
    className="size-8 bg-background/70 backdrop-blur-sm hover:bg-background/90"
  >
    <Heart className="size-4" />
  </Button>
);

interface KiyafetItem {
  title: string;
  subtitle: string;
  badge?: "yeni" | "favori";
}

const kiyafetler: KiyafetItem[] = [
  { title: "Mavi Gömlek", subtitle: "Üst Giyim", badge: "yeni" },
  { title: "Siyah Blazer", subtitle: "Ceket", badge: "favori" },
  { title: "Beyaz Tişört", subtitle: "Üst Giyim" },
  { title: "Gri Kumaş Pantolon", subtitle: "Alt Giyim", badge: "favori" },
  { title: "Bej Trençkot", subtitle: "Dış Giyim" },
  { title: "Lacivert Kazak", subtitle: "Üst Giyim", badge: "yeni" },
  { title: "Siyah Oxford", subtitle: "Ayakkabı" },
  { title: "Kot Ceket", subtitle: "Dış Giyim" },
];

function kiyafetBadge(badge?: KiyafetItem["badge"]) {
  if (badge === "yeni") return <Badge variant="info-soft">Yeni</Badge>;
  if (badge === "favori") return <Badge variant="success-soft">Favori</Badge>;
  return undefined;
}

export const Gardirop: Story = {
  render: () => (
    <ImageGrid className="max-w-4xl">
      {kiyafetler.map((item) => (
        <PhotoCard
          key={item.title}
          alt={item.title}
          title={item.title}
          subtitle={item.subtitle}
          badge={kiyafetBadge(item.badge)}
          topRight={favoriButonu}
        />
      ))}
    </ImageGrid>
  ),
};

export const PortreOranli: Story = {
  render: () => (
    <ImageGrid className="max-w-3xl">
      {kiyafetler.slice(0, 4).map((item) => (
        <PhotoCard
          key={item.title}
          alt={item.title}
          title={item.title}
          subtitle={item.subtitle}
          aspect="portrait"
          badge={kiyafetBadge(item.badge)}
          topRight={favoriButonu}
        />
      ))}
    </ImageGrid>
  ),
};
