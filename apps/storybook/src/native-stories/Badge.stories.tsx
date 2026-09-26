import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, HStack, ScoreBadge, StatusChip, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Badge", component: Badge, ...nativeMeta, args: { label: "Yeni" } } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Varsayilan: Story = {};

export const Tumu: Story = {
  render: () => (
    <VStack gap="md">
      <HStack gap="sm" wrap>
        {(["default", "secondary", "success", "warning", "info", "destructive"] as const).map((v) => (
          <Badge key={v} label={v} variant={v} />
        ))}
      </HStack>
      <HStack gap="sm" wrap>
        {(["default", "success", "warning", "info", "destructive"] as const).map((v) => (
          <Badge key={v} label={`${v} soft`} variant={v} soft />
        ))}
      </HStack>
      <HStack gap="sm" wrap>
        <ScoreBadge value={8.4} />
        <ScoreBadge value={72} max={100} />
      </HStack>
      <HStack gap="sm" wrap>
        <StatusChip label="Teslim edildi" tone="success" />
        <StatusChip label="Kargoda" tone="info" pulse />
        <StatusChip label="Bekliyor" tone="warning" />
        <StatusChip label="İptal" tone="destructive" />
        <StatusChip label="Taslak" tone="neutral" size="sm" />
      </HStack>
    </VStack>
  ),
};
