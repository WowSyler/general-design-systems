import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Toast } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Toast", component: Toast, ...nativeMeta, args: { visible: true, message: "Fiş kaydedildi.", title: "Başarılı", variant: "success" } } satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Varyantlar: Story = {
  render: () => (
    <Stack gap="none" style={{ height: 380 }}>
      <Toast visible position="top" offset={0} variant="success" title="Kaydedildi" message="Değişiklikleriniz kaydedildi." />
      <Toast visible position="top" offset={96} variant="error" title="Ödeme başarısız" message="Kartınız reddedildi, farklı bir kart deneyin." />
      <Toast visible position="top" offset={192} variant="warning" message="Bağlantı zayıf, eşitleme gecikebilir." />
      <Toast visible position="top" offset={272} variant="info" message="Yeni sürüm hazır." showClose={false} />
    </Stack>
  ),
};
