import type { Meta, StoryObj } from "@storybook/react";

import { SocialAuthButtons } from "@ds/ui";

const meta: Meta<typeof SocialAuthButtons> = {
  title: "Composites/SocialAuthButtons",
  component: SocialAuthButtons,
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SocialAuthButtons>;

export const DikeyDizilim: Story = {
  args: {
    providers: ["google", "apple"],
    layout: "stack",
  },
};

export const YatayDizilim: Story = {
  args: {
    providers: ["google", "apple"],
    layout: "row",
  },
};

export const SadeceGoogle: Story = {
  args: {
    providers: ["google"],
  },
};
