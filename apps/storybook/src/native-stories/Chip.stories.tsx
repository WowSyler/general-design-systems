import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip, HStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Chip", component: Chip, ...nativeMeta, args: { label: "Elbise" } } satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Filtreler: Story = {
  render: () => {
    const all = ["Tümü", "Elbise", "Ceket", "Ayakkabı", "Çanta", "Aksesuar"];
    const [sel, setSel] = React.useState("Elbise");
    return (
      <HStack gap="sm" wrap>
        {all.map((c) => (
          <Chip key={c} label={c} selected={sel === c} onPress={() => setSel(c)} />
        ))}
      </HStack>
    );
  },
};
