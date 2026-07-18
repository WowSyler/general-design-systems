import type { Meta, StoryObj } from "@storybook/react";

import { HeatCalendar } from "@ds/ui";

const meta: Meta<typeof HeatCalendar> = {
  title: "Data/HeatCalendar",
  component: HeatCalendar,
};

export default meta;
type Story = StoryObj<typeof HeatCalendar>;

/** 12 haftalik deterministik harcama yogunlugu deseni. */
const harcamaYogunlugu = Array.from({ length: 84 }, (_, i) => {
  const haftaninGunu = i % 7;
  if (haftaninGunu === 6) return 0; // Pazar: harcama yok
  if (haftaninGunu === 5) return 4; // Cumartesi: market alışverişi
  return (i * 5 + 3) % 5;
});

export const HarcamaYogunlugu: Story = {
  args: {
    values: harcamaYogunlugu,
    label: "Son 12 haftadaki fiş yoğunluğu",
  },
};

export const SonSekizHafta: Story = {
  args: {
    values: harcamaYogunlugu.slice(0, 56),
    weeks: 8,
    label: "Son 8 hafta",
  },
};

export const EtiketsizIzgara: Story = {
  args: {
    values: harcamaYogunlugu,
  },
};
