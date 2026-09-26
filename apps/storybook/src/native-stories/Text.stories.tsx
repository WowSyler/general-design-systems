import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Text", component: Text, ...nativeMeta, args: { children: "Merhaba dünya" } } satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Varsayilan: Story = {};

export const Tipografi: Story = {
  render: () => (
    <VStack gap="sm">
      <Text variant="h1">Başlık 1 — Hesap özeti</Text>
      <Text variant="h2">Başlık 2 — Bu ay</Text>
      <Text variant="h3">Başlık 3 — Kategoriler</Text>
      <Text variant="bodyMedium">Gövde orta: Son işlemleriniz aşağıda listelenir.</Text>
      <Text>Gövde: Harcamalarınızı kategori bazında takip edin, bütçenizi aşmayın.</Text>
      <Text variant="caption">Açıklama: 22 Eylül 2026 güncellendi</Text>
      <Text variant="overline">Üst etiket</Text>
      <Text color="primary">Birincil renk</Text>
      <Text color="success">Başarılı · Text color="success"</Text>
      <Text color="destructive">Hata · Text color="destructive"</Text>
    </VStack>
  ),
};
