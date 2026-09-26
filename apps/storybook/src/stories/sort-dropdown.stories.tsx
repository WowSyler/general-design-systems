import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { SortDropdown } from "@wowsyler/ds-ui";

const meta: Meta<typeof SortDropdown> = {
  title: "Primitives/SortDropdown",
  component: SortDropdown,
};

export default meta;
type Story = StoryObj<typeof SortDropdown>;

const urunSecenekleri = [
  { value: "en-yeni", label: "En yeni", direction: "desc" as const },
  { value: "fiyat-artan", label: "Fiyat: artan", direction: "asc" as const },
  { value: "fiyat-azalan", label: "Fiyat: azalan", direction: "desc" as const },
  { value: "en-populer", label: "En popüler", direction: "none" as const },
  { value: "indirim", label: "İndirim oranı", direction: "desc" as const },
];

const yorumSecenekleri = [
  { value: "en-faydali", label: "En faydalı", direction: "none" as const },
  { value: "en-yeni", label: "En yeni", direction: "desc" as const },
  { value: "puan-yuksek", label: "Puan: yüksekten", direction: "desc" as const },
  { value: "puan-dusuk", label: "Puan: düşükten", direction: "asc" as const },
];

/** Dolap ürün listesi için kontrollü sıralama seçici. */
export const UrunSiralama: Story = {
  render: () => {
    const [value, setValue] = React.useState("en-yeni");
    return (
      <div className="flex flex-col gap-3">
        <SortDropdown
          options={urunSecenekleri}
          value={value}
          onValueChange={setValue}
        />
        <p className="text-sm text-muted-foreground">
          Aktif sıralama:{" "}
          <span className="font-medium text-foreground">
            {urunSecenekleri.find((o) => o.value === value)?.label}
          </span>
        </p>
      </div>
    );
  },
};

/** GlowScan ürün yorumları için puan yönlü sıralama. */
export const YorumSiralama: Story = {
  render: () => (
    <SortDropdown
      options={yorumSecenekleri}
      defaultValue="en-faydali"
      label="Sırala"
      align="start"
    />
  ),
};

/** Menü açık önizleme: yön ikonları ve seçili Check işareti. */
export const AcikMenu: Story = {
  render: () => (
    <div className="flex h-80 justify-center">
      <SortDropdown
        defaultOpen
        options={urunSecenekleri}
        defaultValue="fiyat-artan"
        align="start"
      />
    </div>
  ),
};

/** Seçim yapılmamış ve devre dışı durumlar. */
export const BosVeDevreDisi: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <SortDropdown
        options={urunSecenekleri}
        placeholder="Sıralama seçin"
      />
      <SortDropdown options={urunSecenekleri} disabled defaultValue="en-yeni" />
    </div>
  ),
};
