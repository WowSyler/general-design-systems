import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, HStack, VStack } from "@wowsyler/ds-ui-native";

import { nativeParameters, withNativeTheme } from "./_support/native";

const meta = {
  title: "Native/Button",
  component: Button,
  decorators: [withNativeTheme],
  parameters: nativeParameters,
  args: { title: "Kaydet" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Varsayilan: Story = {};

export const Varyantlar: Story = {
  render: () => (
    <VStack gap="md">
      <HStack gap="sm" wrap>
        <Button title="Birincil" />
        <Button title="İkincil" variant="secondary" />
        <Button title="Çerçeveli" variant="outline" />
        <Button title="Hayalet" variant="ghost" />
        <Button title="Sil" variant="destructive" />
      </HStack>
      <HStack gap="sm" wrap>
        <Button title="Küçük" size="sm" />
        <Button title="Orta" size="md" />
        <Button title="Büyük" size="lg" pill />
        <Button title="Yükleniyor" loading />
        <Button title="Devre dışı" disabled />
      </HStack>
      <Button title="Tam genişlik — Devam et" fullWidth size="lg" />
    </VStack>
  ),
};
