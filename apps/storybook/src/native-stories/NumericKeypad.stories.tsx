import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoneyText, NumericKeypad, VStack, parseAmount } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/NumericKeypad", component: NumericKeypad, ...nativeMeta } satisfies Meta<typeof NumericKeypad>;
export default meta;

export const TutarGirisi: StoryObj<typeof meta> = {
  render: () => {
    const [v, setV] = React.useState("125,5");
    return (
      <VStack gap="xl" align="stretch" style={{ maxWidth: 420, alignSelf: "center", width: "100%" }}>
        <MoneyText amount={parseAmount(v) ?? 0} size="xl" style={{ textAlign: "center" }} />
        <NumericKeypad value={v} onChange={setV} maxLength={9} />
      </VStack>
    );
  },
};
