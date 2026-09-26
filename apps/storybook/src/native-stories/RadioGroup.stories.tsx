import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup, Text, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/RadioGroup", component: RadioGroup, ...nativeMeta, args: { options: [], value: null, onValueChange: () => undefined } } satisfies Meta<typeof RadioGroup>;
export default meta;

export const Varyantlar: StoryObj<typeof meta> = {
  render: () => {
    const [v, setV] = React.useState<string | null>("std");
    const [p, setP] = React.useState<string | null>("year");
    return (
      <VStack gap="xl">
        <RadioGroup
          accessibilityLabel="Teslimat"
          options={[
            { value: "std", label: "Standart teslimat", description: "3-5 iş günü" },
            { value: "exp", label: "Hızlı teslimat", description: "Ertesi gün" },
            { value: "store", label: "Mağazadan teslim", disabled: true },
          ]}
          value={v}
          onValueChange={setV}
        />
        <RadioGroup
          variant="card"
          accessibilityLabel="Plan"
          options={[
            { value: "month", label: "Aylık", description: "İstediğin zaman iptal", trailing: <Text variant="bodyMedium">₺99</Text> },
            { value: "year", label: "Yıllık", description: "2 ay bedava", trailing: <Text variant="bodyMedium">₺990</Text> },
          ]}
          value={p}
          onValueChange={setP}
        />
      </VStack>
    );
  },
};
