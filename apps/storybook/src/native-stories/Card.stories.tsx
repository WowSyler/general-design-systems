import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, Divider, HStack, Text, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Card", component: Card, ...nativeMeta } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Yukseltiler: Story = {
  render: () => (
    <VStack gap="lg">
      {(["none", "low", "medium"] as const).map((e) => (
        <Card key={e} elevation={e}>
          <Text variant="h3">elevation="{e}"</Text>
          <Text color="muted">Tema gölge rengiyle tonlu derinlik.</Text>
        </Card>
      ))}
    </VStack>
  ),
};

export const DividerIle: Story = {
  render: () => (
    <Card>
      <Text variant="bodyMedium">Sipariş #4821</Text>
      <Divider style={{ marginVertical: 12 }} />
      <HStack justify="space-between">
        <Text color="muted">Toplam</Text>
        <Text variant="bodyMedium">₺1.240,00</Text>
      </HStack>
      <Divider inset style={{ marginVertical: 12 }} />
      <Text variant="caption">Divider inset — başlangıç kenarından içeri</Text>
    </Card>
  ),
};
