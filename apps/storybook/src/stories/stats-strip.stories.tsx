import type { Meta, StoryObj } from "@storybook/react";

import { StatsStrip } from "@ds/ui";

const meta: Meta<typeof StatsStrip> = {
  title: "Marketing/StatsStrip",
  component: StatsStrip,
};

export default meta;
type Story = StoryObj<typeof StatsStrip>;

export const Sade: Story = {
  args: {
    items: [
      { value: "1.200+", label: "Aktif salon" },
      { value: "850K", label: "Tamamlanan randevu" },
      { value: "%97", label: "Müşteri memnuniyeti" },
    ],
    className: "max-w-3xl",
  },
};

export const Gradyan: Story = {
  args: {
    variant: "gradient",
    items: [
      { value: "2,4M", label: "Analiz edilen selfie" },
      { value: "10", label: "Cilt metriği" },
      { value: "12 sn", label: "Ortalama rapor süresi" },
      { value: "4,8★", label: "Mağaza puanı" },
    ],
    className: "max-w-4xl",
  },
};
