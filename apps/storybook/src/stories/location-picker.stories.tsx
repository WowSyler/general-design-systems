import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { LocationPicker } from "@ds/ui";

type Suggestion = React.ComponentProps<typeof LocationPicker>["suggestions"];

const randevuAdresleri: Suggestion = [
  {
    id: "moda",
    label: "Moda Caddesi No:42",
    description: "Kadıköy, İstanbul",
    point: { x: 34, y: 28 },
  },
  {
    id: "bagdat",
    label: "Bağdat Caddesi No:210",
    description: "Suadiye, Kadıköy",
    point: { x: 68, y: 46 },
  },
  {
    id: "acibadem",
    label: "Acıbadem Mahallesi, Çeçen Sokak",
    description: "Üsküdar, İstanbul",
    point: { x: 22, y: 58 },
  },
  {
    id: "atasehir",
    label: "Barbaros Mahallesi, Halk Caddesi",
    description: "Ataşehir, İstanbul",
    point: { x: 80, y: 22 },
  },
];

const dolapAdresleri: Suggestion = [
  {
    id: "besiktas",
    label: "Çırağan Caddesi No:17",
    description: "Beşiktaş, İstanbul",
    point: { x: 40, y: 34 },
  },
  {
    id: "nisantasi",
    label: "Teşvikiye Mahallesi, Valikonağı Caddesi",
    description: "Şişli, İstanbul",
    point: { x: 58, y: 20 },
  },
  {
    id: "cihangir",
    label: "Cihangir, Sıraselviler Caddesi No:5",
    description: "Beyoğlu, İstanbul",
    point: { x: 30, y: 50 },
  },
];

const meta: Meta<typeof LocationPicker> = {
  title: "Composites/LocationPicker",
  component: LocationPicker,
};

export default meta;
type Story = StoryObj<typeof LocationPicker>;

export const RandevuAdresi: Story = {
  render: () => (
    <LocationPicker
      suggestions={randevuAdresleri}
      searchPlaceholder="Randevu adresi ara…"
      confirmLabel="Bu adrese randevu oluştur"
      onConfirm={(value) => console.log("Randevu konumu:", value)}
    />
  ),
};

export const DolapTeslimNoktasi: Story = {
  render: () => (
    <LocationPicker
      suggestions={dolapAdresleri}
      searchPlaceholder="Teslim noktası ara…"
      confirmLabel="Teslim noktasını kaydet"
      onConfirm={(value) => console.log("Dolap teslim noktası:", value)}
    />
  ),
};

export const KayitliKonumdanBaslar: Story = {
  render: () => (
    <LocationPicker
      suggestions={randevuAdresleri}
      defaultPoint={{ x: 68, y: 46 }}
      defaultAddress="Bağdat Caddesi No:210, Suadiye"
      confirmLabel="Bu konumu kullan"
      onChange={(value) => console.log("Konum güncellendi:", value)}
      onConfirm={(value) => console.log("Onaylanan konum:", value)}
    />
  ),
};
