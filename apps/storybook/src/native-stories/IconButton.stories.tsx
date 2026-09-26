import type { Meta, StoryObj } from "@storybook/react-vite";
import { HStack, IconButton, Link, Text, TextButton, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/IconButton", component: IconButton, ...nativeMeta, args: { accessibilityLabel: "Favori", icon: ({ color }) => <Text style={{ color, fontSize: 18 }}>♥</Text> } } satisfies Meta<typeof IconButton>;
export default meta;

const heart = ({ color }: { color: string }) => <Text style={{ color, fontSize: 18 }}>♥</Text>;

export const VaryantlarVeMetinButonlari: StoryObj<typeof meta> = {
  render: () => (
    <VStack gap="lg">
      <HStack gap="sm" wrap>
        <IconButton accessibilityLabel="Hayalet" icon={heart} />
        <IconButton accessibilityLabel="Yumuşak" variant="soft" icon={heart} />
        <IconButton accessibilityLabel="Dolu" variant="solid" icon={heart} />
        <IconButton accessibilityLabel="Çerçeveli" variant="outline" icon={heart} />
        <IconButton accessibilityLabel="Sil" variant="soft" destructive icon={({ color }) => <Text style={{ color, fontSize: 16 }}>✕</Text>} />
        <IconButton accessibilityLabel="Seçili" selected icon={heart} />
        <IconButton accessibilityLabel="Küçük" size="sm" icon={heart} />
        <IconButton accessibilityLabel="Büyük" size="lg" variant="solid" icon={heart} />
      </HStack>
      <HStack gap="lg" wrap>
        <TextButton title="Şifremi unuttum" />
        <TextButton title="Vazgeç" tone="muted" />
        <TextButton title="Hesabı sil" tone="destructive" />
        <Link title="Gizlilik politikası" />
      </HStack>
    </VStack>
  ),
};
