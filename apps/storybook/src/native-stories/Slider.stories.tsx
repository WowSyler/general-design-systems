import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider, VStack, formatMoney } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Slider", component: Slider, ...nativeMeta, args: { value: 40, onValueChange: () => undefined, label: "Ses" } } satisfies Meta<typeof Slider>;
export default meta;

export const Etkilesimli: StoryObj<typeof meta> = {
  render: () => {
    const [budget, setBudget] = React.useState(3000);
    const [n, setN] = React.useState(40);
    return (
      <VStack gap="xl">
        <Slider label="Aylık market bütçesi" value={budget} min={0} max={10000} step={250} showValue formatValue={(v) => formatMoney(v, "TRY", "tr-TR", 0)} onValueChange={setBudget} />
        <Slider label="Yoğunluk" value={n} onValueChange={setN} showValue />
        <Slider label="Devre dışı" value={70} disabled onValueChange={() => undefined} />
      </VStack>
    );
  },
};
