import type { Meta, StoryObj } from "@storybook/react-vite";
import { MetricBar, ProgressBar, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/MetricBar", component: MetricBar, ...nativeMeta, args: { label: "Nem", value: 68 } } satisfies Meta<typeof MetricBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Varsayilan: Story = {};

export const Tonlar: Story = {
  render: () => (
    <VStack gap="lg">
      <MetricBar label="Nem" value={82} tone="success" />
      <MetricBar label="Gözenek" value={54} tone="warning" />
      <MetricBar label="Kızarıklık" value={31} tone="destructive" />
      <ProgressBar label="Profil tamamlama" value={60} showValue />
      <ProgressBar value={35} size="sm" tone="info" />
      <ProgressBar value={90} size="lg" tone="success" />
    </VStack>
  ),
};
