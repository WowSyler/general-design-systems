import type { Meta, StoryObj } from "@storybook/react-vite";

import { SocialAuthButtons } from "@wowsyler/ds-ui";

const meta: Meta<typeof SocialAuthButtons> = {
  title: "Composites/SocialAuthButtons",
  component: SocialAuthButtons,
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
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
