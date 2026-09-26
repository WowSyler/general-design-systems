import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarGroup, HStack, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Avatar", component: Avatar, ...nativeMeta, args: { name: "Ozan Küçük" } } satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Varsayilan: Story = {};

export const BoyutVeDurum: Story = {
  render: () => (
    <VStack gap="lg">
      <HStack gap="md">
        <Avatar name="Ayşe Kaya" size="sm" presence="online" />
        <Avatar name="Mehmet Demir" size="md" presence="away" />
        <Avatar name="Zeynep" size="lg" presence="busy" shape="rounded" />
        <Avatar name="Can Er" size="xl" presence="offline" />
      </HStack>
      <AvatarGroup
        max={4}
        items={[{ name: "Ali Veli" }, { name: "Ayşe Kaya" }, { name: "Can Er" }, { name: "Deniz Su" }, { name: "Ece Tan" }, { name: "Fatih Ak" }]}
      />
    </VStack>
  ),
};
