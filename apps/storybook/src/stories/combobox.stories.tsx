import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Combobox } from "@wowsyler/ds-ui";

const meta: Meta<typeof Combobox> = {
  title: "Primitives/Combobox",
  component: Combobox,
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const ortamlar = [
  { value: "production", label: "Production — eu-central-1" },
  { value: "staging", label: "Staging — eu-west-1" },
  { value: "preview", label: "Preview — pr-482" },
  { value: "development", label: "Development — lokal" },
];

const hizmetler = [
  { value: "sac-kesimi", label: "Saç Kesimi (45 dk)" },
  { value: "sakal-tirasi", label: "Sakal Tıraşı (20 dk)" },
  { value: "cilt-bakimi", label: "Cilt Bakımı (60 dk)" },
  { value: "manikur", label: "Manikür (40 dk)" },
  { value: "pedikur", label: "Pedikür (40 dk)" },
];

export const OrtamSecici: Story = {
  render: () => {
    const [value, setValue] = React.useState("production");
    return (
      <div className="w-72 max-w-full">
        <Combobox
          options={ortamlar}
          value={value}
          onValueChange={setValue}
          placeholder="Ortam seçin…"
          searchPlaceholder="Ortam ara…"
          emptyMessage="Ortam bulunamadı."
        />
      </div>
    );
  },
};

export const AcikListe: Story = {
  render: () => (
    <div className="flex h-80 w-72 max-w-full flex-col">
      <Combobox
        defaultOpen
        options={hizmetler}
        placeholder="Hizmet seçin…"
        searchPlaceholder="Hizmet ara…"
        emptyMessage="Bu isimde bir hizmet yok."
      />
    </div>
  ),
};

export const BosVeDevreDisi: Story = {
  render: () => (
    <div className="flex w-72 max-w-full flex-col gap-4">
      <Combobox
        options={hizmetler}
        placeholder="Hizmet seçin…"
        searchPlaceholder="Hizmet ara…"
      />
      <Combobox
        options={hizmetler}
        placeholder="Önce şube seçin"
        disabled
      />
    </div>
  ),
};
