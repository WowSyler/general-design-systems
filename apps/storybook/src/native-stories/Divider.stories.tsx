import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider, HStack, Text, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Divider", component: Divider, ...nativeMeta } satisfies Meta<typeof Divider>;
export default meta;
export const Yonler: StoryObj<typeof meta> = {
  render: () => (
    <VStack gap="md">
      <Text>Yatay</Text>
      <Divider />
      <HStack gap="md" style={{ height: 32 }}>
        <Text>Sol</Text>
        <Divider orientation="vertical" />
        <Text>Sağ</Text>
      </HStack>
    </VStack>
  ),
};
