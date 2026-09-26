import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppBar, Header, IconButton, SectionHeader, Text, TextButton, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Header", component: Header, ...nativeMeta, args: { title: "Siparişlerim" } } satisfies Meta<typeof Header>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Varyantlar: Story = {
  render: () => (
    <VStack gap="lg">
      <Header
        title="Siparişlerim"
        subtitle="3 aktif sipariş"
        onBack={() => undefined}
        actions={<IconButton accessibilityLabel="Ara" icon={({ color }) => <Text style={{ color, fontSize: 18 }}>⌕</Text>} />}
      />
      <AppBar title="Profil" centerTitle onBack={() => undefined} variant="transparent" />
      <AppBar title="Premium" variant="primary" large />
      <SectionHeader title="Son işlemler" description="Bu ay 42 işlem" action={<TextButton title="Tümü" size="sm" />} />
      <SectionHeader variant="overline" title="Hesap ayarları" />
    </VStack>
  ),
};
