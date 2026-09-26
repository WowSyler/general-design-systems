import type { Meta, StoryObj } from "@storybook/react-vite";

import { ThemeShowcase } from "@wowsyler/ds-ui";

const meta: Meta<typeof ThemeShowcase> = {
  title: "Foundations/ThemeShowcase",
  component: ThemeShowcase,
};

export default meta;
type Story = StoryObj<typeof ThemeShowcase>;

export const DeployLens: Story = {
  args: { theme: "deploylens", label: "DeployLens" },
};

export const Dolap: Story = {
  args: { theme: "dolap", label: "Dolap" },
};

export const Randevu: Story = {
  args: { theme: "randevu", label: "Randevu" },
};

export const GlowScan: Story = {
  args: { theme: "glowscan", label: "GlowScan" },
};

export const Fisly: Story = {
  args: { theme: "fisly", label: "Fisly" },
};
