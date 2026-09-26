import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { RatingInput } from "@wowsyler/ds-ui";

const meta: Meta<typeof RatingInput> = {
  title: "Commerce/RatingInput",
  component: RatingInput,
};

export default meta;
type Story = StoryObj<typeof RatingInput>;

type RatingInputSize = React.ComponentProps<typeof RatingInput>["size"];

function KontrolluPuanlama(props: {
  initial?: number;
  max?: number;
  allowHalf?: boolean;
  size?: RatingInputSize;
  label?: string;
}) {
  const [value, setValue] = React.useState(props.initial ?? 0);
  return (
    <div className="flex flex-col gap-2">
      <RatingInput
        value={value}
        onValueChange={setValue}
        max={props.max}
        allowHalf={props.allowHalf}
        size={props.size}
        aria-label={props.label ?? "Puanlama"}
      />
      <p className="text-sm text-muted-foreground">
        Seçilen puan:{" "}
        <span className="font-medium tabular-nums text-foreground">
          {value.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}
        </span>{" "}
        / {props.max ?? 5}
      </p>
    </div>
  );
}

export const Varsayilan: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">Bu ürünü değerlendirin</span>
      <KontrolluPuanlama label="Dolap ürün puanı" />
      <p className="mt-1 text-xs text-muted-foreground">
        Yıldızlara tıklayın veya ok tuşlarıyla puanı değiştirin.
      </p>
    </div>
  ),
};

export const YarimYildiz: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">Uzmanı puanlayın</span>
      <KontrolluPuanlama
        initial={3.5}
        allowHalf
        size="lg"
        label="Randevu uzman puanı"
      />
      <p className="mt-1 text-xs text-muted-foreground">
        Yıldızın sol yarısı 0,5 puan ekler; yarım puanlama açıktır.
      </p>
    </div>
  ),
};

export const Boyutlar: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <KontrolluPuanlama initial={4} size="sm" label="Küçük puanlama" />
      <KontrolluPuanlama initial={4} size="md" label="Orta puanlama" />
      <KontrolluPuanlama initial={4} size="lg" label="Büyük puanlama" />
    </div>
  ),
};

export const SaltGosterim: Story = {
  args: {
    value: 4.5,
    allowHalf: true,
    readOnly: true,
    "aria-label": "GlowScan memnuniyet puanı",
  },
};
