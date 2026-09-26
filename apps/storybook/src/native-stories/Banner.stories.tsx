import type { Meta, StoryObj } from "@storybook/react-vite";
import { Banner, OfflineBanner, TextButton, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Banner", component: Banner, ...nativeMeta, args: { message: "Yeni özellik: fişleri otomatik kategorize ediyoruz." } } satisfies Meta<typeof Banner>;
export default meta;

export const Tonlar: StoryObj<typeof meta> = {
  render: () => (
    <VStack gap="md">
      <OfflineBanner />
      <Banner tone="info" title="Bilgi" message="Yeni özellik: fişleri otomatik kategorize ediyoruz." onDismiss={() => undefined} />
      <Banner tone="success" message="Ödemeniz alındı." />
      <Banner tone="warning" title="Bütçe uyarısı" message="Market bütçenin %85'ini kullandın." action={<TextButton title="Bütçeyi düzenle" size="sm" />} />
      <Banner tone="destructive" title="Ödeme başarısız" message="Kartınız reddedildi." />
      <Banner tone="neutral" message="Son eşitleme: 2 dk önce" />
    </VStack>
  ),
};
