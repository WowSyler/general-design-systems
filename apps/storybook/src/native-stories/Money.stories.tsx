import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CurrencyInput, MoneyText, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/MoneyText", component: MoneyText, ...nativeMeta, args: { amount: 1250.5 } } satisfies Meta<typeof MoneyText>;
export default meta;

export const TutarVeGiris: StoryObj<typeof meta> = {
  render: () => {
    const [v, setV] = React.useState<number | null>(1250.75);
    return (
      <VStack gap="md">
        <MoneyText amount={42500} size="xl" />
        <MoneyText amount={-342.5} signed colorize size="lg" />
        <MoneyText amount={1800} signed colorize />
        <MoneyText amount={99.9} currency="EUR" tone="muted" size="sm" />
        <CurrencyInput label="Tutar" value={v} onChangeValue={setV} helperText={`Sayı değeri: ${v ?? "—"}`} />
      </VStack>
    );
  },
};
