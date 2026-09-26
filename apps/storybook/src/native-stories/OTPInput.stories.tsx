import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { OTPInput, Text, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/OTPInput", component: OTPInput, ...nativeMeta, args: { value: "", onChange: () => undefined } } satisfies Meta<typeof OTPInput>;
export default meta;

export const Dogrulama: StoryObj<typeof meta> = {
  render: () => {
    const [code, setCode] = React.useState("482");
    return (
      <VStack gap="lg">
        <Text variant="h3">Telefonuna gelen kodu gir</Text>
        <OTPInput value={code} onChange={setCode} />
        <OTPInput value="1234" onChange={() => undefined} length={4} error="Kod hatalı, tekrar dene." secure />
      </VStack>
    );
  },
};
