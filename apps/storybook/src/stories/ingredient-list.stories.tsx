import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { IngredientList } from "@wowsyler/ds-ui";

type IngredientItem = React.ComponentProps<typeof IngredientList>["items"][number];

const meta: Meta<typeof IngredientList> = {
  title: "Commerce/IngredientList",
  component: IngredientList,
};

export default meta;
type Story = StoryObj<typeof IngredientList>;

/** GlowScan nemlendirici serum icerik dokumu. */
const serumItems: IngredientItem[] = [
  {
    name: "Hyaluronik Asit",
    role: "nemlendirici",
    concentration: "%2",
    note: "Cildin su tutma kapasitesini artırır, dolgun bir görünüm verir.",
    suitableFor: ["kuru", "hassas", "normal"],
  },
  {
    name: "Niasinamid",
    role: "aktif",
    concentration: "%5",
    note: "Gözenek görünümünü azaltır, cilt tonunu eşitler.",
    suitableFor: ["yagli", "karma"],
  },
  {
    name: "Panthenol (B5)",
    role: "yatistirici",
    note: "Tahriş olmuş cildi yatıştırır, bariyeri destekler.",
    suitableFor: ["hassas", "kuru"],
  },
  {
    name: "E Vitamini",
    role: "antioksidan",
    note: "Serbest radikallere karşı korur, formülü stabil tutar.",
  },
  {
    name: "Fenoksietanol",
    role: "koruyucu",
    flag: "caution",
    note: "Koruyucu madde; çok hassas ciltlerde nadiren tahrişe yol açabilir.",
  },
];

/** Salt icerik dokumu: rol rozetleri, fayda ikonlari ve bir uyari satiri. */
export const SerumIcerikleri: Story = {
  args: {
    title: "Nem Bombası Serum",
    subtitle: "GlowScan doğrulanmış içerik listesi",
    items: serumItems,
  },
};

/** Kuru cilt secili: eslesen icerikler tonlu zemin ve rozetle one cikar. */
export const KuruCiltVurgusu: Story = {
  args: {
    title: "Nem Bombası Serum",
    subtitle: "Cilt tipine göre öne çıkan içerikler",
    skinType: "kuru",
    items: serumItems,
  },
};

/** Alerjen ve dikkat uyarilariyla parfumlu bir temizleyici. */
export const AlerjenUyarilari: Story = {
  args: {
    title: "Ferahlatıcı Jel Temizleyici",
    subtitle: "Hassas ciltler içerik uyarılarına dikkat etmeli",
    skinType: "hassas",
    items: [
      {
        name: "Gliserin",
        role: "nemlendirici",
        note: "Nazik nemlendirme sağlar, temizlik sonrası gerginliği azaltır.",
        suitableFor: ["hassas", "kuru", "normal"],
      },
      {
        name: "Aloe Vera Özü",
        role: "yatistirici",
        note: "Cildi yatıştırır, kızarıklığı azaltır.",
        suitableFor: ["hassas"],
      },
      {
        name: "Salisilik Asit",
        role: "aktif",
        concentration: "%1",
        flag: "caution",
        note: "Gözenek temizler; hassas ciltte kademeli kullanım önerilir.",
      },
      {
        name: "Parfüm (Parfum)",
        role: "koruyucu",
        flag: "allergen",
        note: "Yaygın alerjen; hassas ve reaktif ciltler için önerilmez.",
      },
      {
        name: "Limonen",
        role: "antioksidan",
        flag: "allergen",
        note: "Doğal esans bileşeni; bilinen bir temas alerjeni.",
      },
    ],
  },
};
