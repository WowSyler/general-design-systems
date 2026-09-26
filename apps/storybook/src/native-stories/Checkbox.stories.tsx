import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, ToggleSwitch, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Checkbox", component: Checkbox, ...nativeMeta, args: { value: true, onValueChange: () => undefined, label: "Kampanyalardan haberdar et" } } satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Varsayilan: Story = {};

export const Etkilesimli: Story = {
  render: () => {
    const [a, setA] = React.useState(true);
    const [b, setB] = React.useState(false);
    return (
      <VStack gap="md">
        <Checkbox value={a} onValueChange={setA} label="Kullanım koşullarını kabul ediyorum" />
        <Checkbox value={b} onValueChange={setB} label="Küçük" size="sm" />
        <Checkbox value onValueChange={() => undefined} label="Devre dışı" disabled />
      </VStack>
    );
  },
};
