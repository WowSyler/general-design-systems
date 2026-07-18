import type { Meta, StoryObj } from "@storybook/react";

import { StatRing } from "@ds/ui";

const meta: Meta<typeof StatRing> = {
  title: "Iconic/StatRing",
  component: StatRing,
};

export default meta;
type Story = StoryObj<typeof StatRing>;

/** GlowScan cilt sağlığı skoru. */
export const GlowScanCiltSkoru: Story = {
  args: {
    value: 84,
    caption: "Cilt Sağlığı",
  },
};

/** Fisly bütçe kullanımı. */
export const FislyButceKullanimi: Story = {
  args: {
    value: 62,
    size: 160,
    caption: "Bütçe kullanımı",
  },
};

/** Özel merkez etiketi. */
export const OzelEtiket: Story = {
  args: {
    value: 91,
    label: (
      <span className="flex flex-col items-center leading-none">
        <span className="font-display text-3xl font-bold tabular-nums">A+</span>
        <span className="mt-1 text-[10px] font-medium text-muted-foreground">
          Performans
        </span>
      </span>
    ),
    caption: "GlowScan raporu",
  },
};

/** İkili karşılaştırma. */
export const IkiliGosterim: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <StatRing value={84} caption="Cilt Sağlığı" />
      <StatRing value={62} caption="Nem dengesi" />
    </div>
  ),
};
