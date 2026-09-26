import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const items = [
  { value: "all", label: "Tümü" },
  { value: "active", label: "Aktif" },
  { value: "past", label: "Geçmiş" },
  { value: "cancel", label: "İptal", disabled: true },
];
const meta = { title: "Native/Tabs", component: Tabs, ...nativeMeta, args: { items, value: "all", onValueChange: () => undefined } } satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Varyantlar: Story = {
  render: () => {
    const [v, setV] = React.useState("active");
    return (
      <VStack gap="lg">
        <Tabs items={items} value={v} onValueChange={setV} fullWidth />
        <Tabs items={items} value={v} onValueChange={setV} variant="solid" />
        <Tabs
          scrollable
          items={["Elbise", "Ceket", "Pantolon", "Ayakkabı", "Çanta", "Aksesuar", "Takı"].map((l) => ({ value: l, label: l }))}
          value="Ceket"
          onValueChange={() => undefined}
        />
      </VStack>
    );
  },
};
