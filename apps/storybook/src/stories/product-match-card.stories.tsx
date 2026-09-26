import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bookmark, Droplets, FlaskConical } from "lucide-react";

import { Button, ProductMatchCard } from "@wowsyler/ds-ui";

const meta: Meta<typeof ProductMatchCard> = {
  title: "Commerce/ProductMatchCard",
  component: ProductMatchCard,
};

export default meta;
type Story = StoryObj<typeof ProductMatchCard>;

export const YuksekUyum: Story = {
  args: {
    name: "Nemlendirici B5 Onarıcı Serum",
    brand: "Dermaglow",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&q=80",
    imageAlt: "Serum şişesi",
    matchPercent: 92,
    profileLabel: "Karma cildinize göre",
    reason:
      "GlowScan analiziniz nem kaybı ve ince kızarıklık gösterdi. B5 ve hyaluronik asit içeriği bu iki sinyali doğrudan hedefliyor.",
    tags: [
      { label: "Hassas cilde uygun", kind: "fit" },
      { label: "Koku içermez", kind: "fit" },
      { label: "Gözenek sıkılaştırıcı", kind: "neutral" },
    ],
    price: 480,
    className: "max-w-sm",
  },
};

export const DusukUyumUyari: Story = {
  args: {
    name: "%10 Glikolik Asit Peeling Tonik",
    brand: "AcidLab",
    icon: <FlaskConical aria-hidden="true" />,
    matchPercent: 41,
    profileLabel: "Kuru & hassas cildinize göre",
    reason:
      "Yüksek asit oranı, GlowScan taramanızda tespit edilen zayıf cilt bariyerini zorlayabilir. Haftada birden fazla kullanım önerilmez.",
    tags: [
      { label: "Yüksek asit oranı", kind: "concern" },
      { label: "Güneş hassasiyeti", kind: "concern" },
      { label: "Alkol içerir", kind: "concern" },
    ],
    price: 265,
    className: "max-w-sm",
  },
};

export const KampanyaliOneri: Story = {
  args: {
    name: "SPF 50+ Mat Bitişli Güneş Kremi",
    brand: "SunVeil",
    icon: <Droplets aria-hidden="true" />,
    matchPercent: 78,
    profileLabel: "Yağlı cildinize göre",
    reason:
      "Rutininizde güneş koruması eksik görünüyor. Mat bitiş, GlowScan'in ölçtüğü T-bölgesi parlamasını gün boyu dengeler.",
    tags: [
      { label: "Yağlı cilde uygun", kind: "fit" },
      { label: "Komedojenik değil", kind: "fit" },
      { label: "Beyaz iz bırakabilir", kind: "concern" },
    ],
    price: 349,
    originalPrice: 499,
    action: (
      <Button variant="outline" size="sm">
        <Bookmark aria-hidden="true" />
        Daha sonra
      </Button>
    ),
    className: "max-w-sm",
  },
};
