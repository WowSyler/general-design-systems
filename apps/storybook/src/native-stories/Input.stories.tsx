import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Input", component: Input, ...nativeMeta, args: { label: "E-posta", placeholder: "ornek@alan.com" } } satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Varsayilan: Story = {};

export const Durumlar: Story = {
  render: () => {
    const [v, setV] = React.useState("ozan@");
    return (
      <VStack gap="lg">
        <Input label="Ad soyad" placeholder="Adınız" helperText="Faturada görünecek ad." />
        <Input label="E-posta" value={v} onChangeText={setV} error="Geçerli bir e-posta girin." />
        <Input label="Telefon" placeholder="5xx xxx xx xx" editable={false} helperText="Düzenlenemez" />
      </VStack>
    );
  },
};
