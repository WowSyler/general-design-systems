import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Input, KeyboardAwareScreen, Stack, TextArea } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/KeyboardAwareScreen", component: KeyboardAwareScreen, ...nativeMeta } satisfies Meta<typeof KeyboardAwareScreen>;
export default meta;

export const Form: StoryObj<typeof meta> = {
  render: () => (
    <Stack gap="none" style={{ height: 520 }}>
      <KeyboardAwareScreen edges={[]} footer={<Button title="Devam" fullWidth />}>
        <Input label="Adres başlığı" placeholder="Ev, iş…" />
        <Input label="İl / İlçe" placeholder="İstanbul / Kadıköy" />
        <TextArea label="Açık adres" minRows={4} />
      </KeyboardAwareScreen>
    </Stack>
  ),
};
