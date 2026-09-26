import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleSwitch, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/ToggleSwitch", component: ToggleSwitch, ...nativeMeta, args: { value: true, onValueChange: () => undefined, label: "Bildirimler" } } satisfies Meta<typeof ToggleSwitch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Varsayilan: Story = {};

export const Etkilesimli: Story = {
  render: () => {
    const [a, setA] = React.useState(true);
    const [b, setB] = React.useState(false);
    return (
      <VStack gap="sm">
        <ToggleSwitch value={a} onValueChange={setA} label="Anlık bildirimler" />
        <ToggleSwitch value={b} onValueChange={setB} label="Etiket sonda" labelPosition="end" />
        <ToggleSwitch value onValueChange={() => undefined} label="Devre dışı" disabled />
      </VStack>
    );
  },
};
