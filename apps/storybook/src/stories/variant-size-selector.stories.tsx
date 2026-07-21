import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check, ShoppingBag } from "lucide-react";

import { VariantSizeSelector } from "@ds/ui";

const meta: Meta<typeof VariantSizeSelector> = {
  title: "Commerce/VariantSizeSelector",
  component: VariantSizeSelector,
};

export default meta;
type Story = StoryObj<typeof VariantSizeSelector>;

type VariantValue = React.ComponentProps<
  typeof VariantSizeSelector
>["value"];
type SizeOption = NonNullable<
  React.ComponentProps<typeof VariantSizeSelector>["sizes"]
>[number];
type ColorOption = NonNullable<
  React.ComponentProps<typeof VariantSizeSelector>["colors"]
>[number];

const konfeksiyonBedenleri: SizeOption[] = [
  { value: "XS" },
  { value: "S" },
  { value: "M", lowStock: true },
  { value: "L" },
  { value: "XL", soldOut: true },
  { value: "XXL" },
];

const tekstilRenkleri: ColorOption[] = [
  { value: "antrasit", label: "Antrasit", swatch: "#2b2f36" },
  { value: "krem", label: "Krem", swatch: "#e7ddc9" },
  { value: "bordo", label: "Bordo", swatch: "#6d2233", lowStock: true },
  { value: "hakiyesil", label: "Haki Yeşil", swatch: "#4b5320" },
  { value: "ekru", label: "Ekru", swatch: "#d6c7b0", soldOut: true },
];

/** Kontrollu Dolap urun detay ornegi: secim + sepete ekle. */
function DolapUrunDetay() {
  const [value, setValue] = React.useState<VariantValue>({ color: "antrasit" });
  const hazir = Boolean(value?.size) && Boolean(value?.color);

  return (
    <div className="w-80 rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-4 flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Dolap
        </span>
        <h3 className="text-base font-semibold">Oversize Triko Kazak</h3>
        <span className="text-lg font-bold tabular-nums">449,90 ₺</span>
      </div>

      <VariantSizeSelector
        sizes={konfeksiyonBedenleri}
        colors={tekstilRenkleri}
        value={value}
        onValueChange={setValue}
      />

      <button
        type="button"
        disabled={!hazir}
        className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary bg-sheen text-sm font-medium text-primary-foreground shadow transition-all duration-200 hover:shadow-md hover:brightness-[1.06] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
      >
        <ShoppingBag className="size-4" aria-hidden="true" />
        {hazir ? "Sepete Ekle" : "Beden ve renk seçin"}
      </button>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Check className="size-3.5 text-success" aria-hidden="true" />
        {value?.size
          ? `${value.size} beden seçildi`
          : "Bedeninizi henüz seçmediniz"}
      </p>
    </div>
  );
}

export const Varsayilan: Story = {
  render: () => <DolapUrunDetay />,
};

export const NumerikBedenler: Story = {
  render: () => {
    const [value, setValue] = React.useState<VariantValue>({});
    const numerik: SizeOption[] = [
      { value: "36", soldOut: true },
      { value: "38" },
      { value: "40", lowStock: true },
      { value: "42" },
      { value: "44" },
    ];
    const denimRenkleri: ColorOption[] = [
      { value: "acikmavi", label: "Açık Mavi", swatch: "#7c9cb8" },
      { value: "koyumavi", label: "Koyu Mavi", swatch: "#2c3e57" },
      { value: "siyah", label: "Siyah", swatch: "#1b1b1f", lowStock: true },
    ];
    return (
      <div className="w-80">
        <VariantSizeSelector
          sizes={numerik}
          colors={denimRenkleri}
          sizeLabel="Beden (numara)"
          colorLabel="Yıkama"
          value={value}
          onValueChange={setValue}
        />
        <p className="mt-4 text-xs text-muted-foreground">
          Seçim: {value?.size ?? "-"} / {value?.color ?? "-"}
        </p>
      </div>
    );
  },
};

export const DevreDisi: Story = {
  args: {
    sizes: konfeksiyonBedenleri,
    colors: tekstilRenkleri,
    value: { size: "M", color: "bordo" },
    disabled: true,
  },
};
