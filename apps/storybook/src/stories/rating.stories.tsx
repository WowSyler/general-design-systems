import type { Meta, StoryObj } from "@storybook/react";

import { Rating } from "@ds/ui";

const meta: Meta<typeof Rating> = {
  title: "Commerce/Rating",
  component: Rating,
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Varsayilan: Story = {
  args: {
    value: 4,
  },
};

export const DegerliVeKucuk: Story = {
  args: {
    value: 4.5,
    size: "sm",
    showValue: true,
  },
};

export const DusukPuan: Story = {
  args: {
    value: 2,
    showValue: true,
  },
};
