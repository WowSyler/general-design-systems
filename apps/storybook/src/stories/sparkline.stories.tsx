import type { Meta, StoryObj } from "@storybook/react-vite";

import { Sparkline } from "@ds/ui";

const meta: Meta<typeof Sparkline> = {
  title: "Data/Sparkline",
  component: Sparkline,
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Sparkline>;

export const HaftalikGider: Story = {
  args: {
    data: [420, 380, 510, 460, 690, 540, 620],
  },
};

export const YukselisTrendi: Story = {
  args: {
    data: [12, 18, 15, 24, 28, 26, 35, 41],
    tone: "success",
  },
};

export const DususTrendi: Story = {
  args: {
    data: [96, 88, 91, 74, 69, 55, 48, 42],
    tone: "destructive",
    height: 32,
  },
};

export const UyariTonu: Story = {
  args: {
    data: [55, 62, 58, 71, 66, 78, 73, 84],
    tone: "warning",
    height: 48,
  },
};
