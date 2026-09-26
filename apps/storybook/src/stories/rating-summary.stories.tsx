import type { Meta, StoryObj } from "@storybook/react-vite";

import { RatingSummary } from "@wowsyler/ds-ui";

const meta: Meta<typeof RatingSummary> = {
  title: "Composites/RatingSummary",
  component: RatingSummary,
};

export default meta;
type Story = StoryObj<typeof RatingSummary>;

export const DolapUrun: Story = {
  args: {
    average: 4.6,
    distribution: [842, 214, 61, 18, 27],
    reviewLabel: "ürün yorumu",
    className: "max-w-md",
  },
};

export const RandevuIsletme: Story = {
  args: {
    average: 4.8,
    distribution: [1203, 156, 34, 9, 12],
    reviewLabel: "müşteri değerlendirmesi",
    className: "max-w-md",
  },
};

export const DusukPuanliUrun: Story = {
  args: {
    average: 2.9,
    total: 148,
    distribution: [18, 22, 31, 39, 38],
    reviewLabel: "değerlendirme",
    className: "max-w-md",
  },
};

export const Yukleniyor: Story = {
  args: {
    average: 0,
    distribution: [0, 0, 0, 0, 0],
    loading: true,
    className: "max-w-md",
  },
};
