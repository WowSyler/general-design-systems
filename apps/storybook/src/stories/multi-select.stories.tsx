import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { MultiSelect } from "@ds/ui";

const meta: Meta<typeof MultiSelect> = {
  title: "Primitives/MultiSelect",
  component: MultiSelect,
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

type MultiSelectOption = React.ComponentProps<typeof MultiSelect>["options"][number];

const etiketler: MultiSelectOption[] = [
  { value: "vintage", label: "Vintage" },
  { value: "az-giyildi", label: "Az Giyildi" },
  { value: "sifir-etiketli", label: "Sıfır Etiketli" },
  { value: "yazlik", label: "Yazlık" },
  { value: "kislik", label: "Kışlık" },
  { value: "unisex", label: "Unisex" },
  { value: "el-yapimi", label: "El Yapımı" },
];

const ortamlar: MultiSelectOption[] = [
  { value: "production", label: "Production — eu-central-1" },
  { value: "staging", label: "Staging — eu-west-1" },
  { value: "preview", label: "Preview — pr-482" },
  { value: "development", label: "Development — lokal" },
];

const kategoriler: MultiSelectOption[] = [
  { value: "market", label: "Market" },
  { value: "faturalar", label: "Faturalar" },
  { value: "ulasim", label: "Ulaşım" },
  { value: "yeme-icme", label: "Yeme & İçme" },
  { value: "eglence", label: "Eğlence" },
  { value: "saglik", label: "Sağlık" },
  { value: "abonelikler", label: "Abonelikler" },
];

export const DolapEtiketleri: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>(["vintage", "az-giyildi"]);
    return (
      <div className="w-80">
        <MultiSelect
          options={etiketler}
          value={value}
          onValueChange={setValue}
          creatable
          placeholder="Etiket seçin veya ekleyin…"
          searchPlaceholder="Etiket ara ya da yaz…"
          emptyMessage="Etiket bulunamadı. Yazıp ekleyebilirsiniz."
          createLabel={(query) => `"${query}" etiketini oluştur`}
        />
      </div>
    );
  },
};

export const DeployLensOrtamlari: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>(["production", "staging"]);
    return (
      <div className="flex h-80 w-80 flex-col">
        <MultiSelect
          defaultOpen
          options={ortamlar}
          value={value}
          onValueChange={setValue}
          maxItems={3}
          placeholder="Dağıtılacak ortamları seçin…"
          searchPlaceholder="Ortam ara…"
          emptyMessage="Ortam bulunamadı."
        />
      </div>
    );
  },
};

export const FislyKategoriFiltresi: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>([]);
    return (
      <div className="flex w-80 flex-col gap-4">
        <MultiSelect
          options={kategoriler}
          value={value}
          onValueChange={setValue}
          placeholder="Kategoriye göre filtrele…"
          searchPlaceholder="Kategori ara…"
          emptyMessage="Kategori bulunamadı."
        />
        <p className="text-xs text-muted-foreground tabular-nums">
          {value.length > 0
            ? `${value.length} kategori seçili`
            : "Tüm harcamalar gösteriliyor"}
        </p>
      </div>
    );
  },
};
