import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const items = [
  { value: "iade", title: "İade nasıl yapılır?", content: "Ürünü teslim aldıktan sonra 14 gün içinde uygulama üzerinden iade talebi oluşturabilirsin." },
  { value: "kargo", title: "Kargo ücreti ne kadar?", subtitle: "Tüm siparişler", content: "150 ₺ üzeri siparişlerde kargo ücretsizdir." },
  { value: "odeme", title: "Hangi ödeme yöntemleri var?", content: "Kredi kartı, banka kartı ve kapıda ödeme." },
];
const meta = { title: "Native/Accordion", component: Accordion, ...nativeMeta, args: { items } } satisfies Meta<typeof Accordion>;
export default meta;

export const Varyantlar: StoryObj<typeof meta> = {
  render: () => (
    <VStack gap="xl">
      <Accordion items={items} defaultValue={["kargo"]} />
      <Accordion items={items} type="multiple" variant="card" defaultValue={["iade", "odeme"]} />
    </VStack>
  ),
};
