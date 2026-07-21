import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { ColorPicker } from "@ds/ui";

const meta: Meta<typeof ColorPicker> = {
  title: "Primitives/ColorPicker",
  component: ColorPicker,
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

const urunRenkleri = [
  { value: "#1c1c1e", label: "Siyah" },
  { value: "#f5f0e8", label: "Krem" },
  { value: "#c2410c", label: "Kiremit" },
  { value: "#c9a24b", label: "Hardal" },
  { value: "#2f7d4f", label: "Çam Yeşili" },
  { value: "#31427a", label: "Lacivert" },
  { value: "#b0555f", label: "Gül Kurusu" },
  { value: "#7c3aed", label: "Mor" },
];

const etiketRenkleri = [
  { value: "#2f7d4f", label: "Satışta" },
  { value: "#c9a24b", label: "Pazarlık" },
  { value: "#b91c1c", label: "Rezerve" },
  { value: "#0e7490", label: "Kargo Dahil" },
  { value: "#6b7280", label: "Arşiv" },
  { value: "#7c3aed", label: "Öne Çıkan" },
];

export const UrunRengi: Story = {
  render: () => {
    const [renk, setRenk] = React.useState("#31427a");
    return (
      <div className="flex w-72 flex-col gap-2">
        <p className="text-sm font-medium text-foreground">
          Ürün ana rengi
        </p>
        <ColorPicker
          value={renk}
          onValueChange={setRenk}
          swatches={urunRenkleri}
          defaultOpen
        />
        <p className="text-xs text-muted-foreground">
          Dolap ilanında bu renk, arama filtrelerinde eşleştirme için kullanılır.
        </p>
      </div>
    );
  },
};

export const EtiketRengi: Story = {
  render: () => {
    const [renk, setRenk] = React.useState("#2f7d4f");
    return (
      <div className="flex w-72 flex-col gap-2">
        <p className="text-sm font-medium text-foreground">Etiket rengi</p>
        <ColorPicker
          value={renk}
          onValueChange={setRenk}
          swatches={etiketRenkleri}
          recentColors={["#0e7490", "#b91c1c"]}
          label="Etiket rengi seç"
        />
        <p className="text-xs text-muted-foreground">
          Koleksiyon etiketlerini renkle gruplayarak vitrinini düzenle.
        </p>
      </div>
    );
  },
};

export const SerbestHexKodu: Story = {
  render: () => {
    const [renk, setRenk] = React.useState("");
    return (
      <div className="flex w-72 flex-col gap-2">
        <p className="text-sm font-medium text-foreground">
          Marka dışı özel renk
        </p>
        <ColorPicker
          value={renk}
          onValueChange={setRenk}
          placeholder="Ürün rengini seç"
          defaultOpen
        />
        <p className="text-xs text-muted-foreground">
          Paletten seç ya da alttaki alana ürünün gerçek HEX kodunu (örn. #8a5a44)
          yazarak ekle.
        </p>
      </div>
    );
  },
};
