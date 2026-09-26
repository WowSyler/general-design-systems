import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { HStack, QuantityStepper } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/QuantityStepper", component: QuantityStepper, ...nativeMeta, args: { value: 1, onValueChange: () => undefined } } satisfies Meta<typeof QuantityStepper>;
export default meta;

export const Etkilesimli: StoryObj<typeof meta> = {
  render: () => {
    const [a, setA] = React.useState(1);
    const [b, setB] = React.useState(2);
    return (
      <HStack gap="lg" wrap>
        <QuantityStepper value={a} min={1} max={5} onValueChange={setA} />
        <QuantityStepper value={b} size="sm" onValueChange={setB} accessibilityLabel="Kişi sayısı" />
      </HStack>
    );
  },
};
