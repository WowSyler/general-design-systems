import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { ColorSwatches } from "@ds/ui";

const meta: Meta<typeof ColorSwatches> = {
  title: "Primitives/ColorSwatches",
  component: ColorSwatches,
};

export default meta;
type Story = StoryObj<typeof ColorSwatches>;

const kiyafetRenkleri = [
  { value: "#1c1c1e", label: "Siyah" },
  { value: "#f5f0e8", label: "Krem" },
  { value: "#7c3f2b", label: "Kiremit" },
  { value: "#2f4a3c", label: "Çam Yeşili" },
  { value: "#31427a", label: "Lacivert" },
  { value: "#b0555f", label: "Gül Kurusu" },
  { value: "#c9a24b", label: "Hardal" },
];

export const GardirobFiltresi: Story = {
  render: () => {
    const [secili, setSecili] = React.useState<string[]>([
      "#1c1c1e",
      "#2f4a3c",
    ]);
    const toggle = (value: string) =>
      setSecili((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    return (
      <div className="flex w-96 flex-col gap-3">
        <p className="text-sm font-medium text-foreground">
          Kıyafet rengine göre filtrele
        </p>
        <ColorSwatches
          colors={kiyafetRenkleri}
          selected={secili}
          onToggle={toggle}
        />
        <p className="text-xs text-muted-foreground">
          {secili.length} renk seçili — kombin önerileri bu renklerle sınırlanır.
        </p>
      </div>
    );
  },
};

export const KucukBoy: Story = {
  args: {
    colors: kiyafetRenkleri.slice(0, 5),
    selected: ["#f5f0e8"],
    size: "sm",
  },
};

export const SecimsizDurum: Story = {
  args: {
    colors: kiyafetRenkleri,
    selected: [],
  },
};
