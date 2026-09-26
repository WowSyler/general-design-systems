import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const options = [
  { label: "Market", value: "market" },
  { label: "Ulaşım", value: "transport" },
  { label: "Faturalar", value: "bills" },
  { label: "Eğlence", value: "fun" },
  { label: "Kira (kilitli)", value: "rent", disabled: true },
];
const meta = { title: "Native/Select", component: Select, ...nativeMeta, args: { options, value: null, onValueChange: () => undefined, label: "Kategori" } } satisfies Meta<typeof Select>;
export default meta;

export const Etkilesimli: StoryObj<typeof meta> = {
  render: () => {
    const [v, setV] = React.useState<string | null>("transport");
    return (
      <VStack gap="lg">
        <Select label="Kategori" options={options} value={v} onValueChange={setV} />
        <Select label="Para birimi" placeholder="Seçin" options={[{ label: "TRY ₺", value: "TRY" }, { label: "EUR €", value: "EUR" }]} onValueChange={() => undefined} error="Para birimi zorunlu" />
      </VStack>
    );
  },
};
