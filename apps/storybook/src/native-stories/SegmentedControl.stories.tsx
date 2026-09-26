import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SegmentedControl, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const items = [
  { value: "day", label: "Gün" },
  { value: "week", label: "Hafta" },
  { value: "month", label: "Ay" },
];
const meta = { title: "Native/SegmentedControl", component: SegmentedControl, ...nativeMeta, args: { items, value: "week", onValueChange: () => undefined } } satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Etkilesimli: Story = {
  render: () => {
    const [v, setV] = React.useState("week");
    const [s, setS] = React.useState("list");
    return (
      <VStack gap="lg">
        <SegmentedControl items={items} value={v} onValueChange={setV} accessibilityLabel="Dönem" />
        <SegmentedControl size="sm" items={[{ value: "list", label: "Liste" }, { value: "grid", label: "Izgara" }]} value={s} onValueChange={setS} />
      </VStack>
    );
  },
};
