import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, HStack, SkeletonBlock, SkeletonText, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Skeleton", component: SkeletonBlock, ...nativeMeta } satisfies Meta<typeof SkeletonBlock>;
export default meta;

export const KartIskeleti: StoryObj<typeof meta> = {
  render: () => (
    <Card>
      <HStack gap="md">
        <SkeletonBlock width={48} height={48} radius="pill" />
        <VStack gap="xs" fill>
          <SkeletonBlock width="60%" height={14} />
          <SkeletonBlock width="40%" height={12} />
        </VStack>
      </HStack>
      <SkeletonText lines={3} style={{ marginTop: 16 }} />
    </Card>
  ),
};
