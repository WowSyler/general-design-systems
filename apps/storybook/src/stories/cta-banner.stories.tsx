import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, CtaBanner } from "@wowsyler/ds-ui";

const meta: Meta<typeof CtaBanner> = {
  title: "Marketing/CtaBanner",
  component: CtaBanner,
};

export default meta;
type Story = StoryObj<typeof CtaBanner>;

export const Ortali: Story = {
  args: {
    title: "Gardırobundaki her parça değer",
    description:
      "Giymediğin kıyafetleri Dolap'ta sat, yeni sezona bütçe ayır. İlan vermek tamamen ücretsiz.",
    actions: (
      <>
        <Button variant="secondary">Hemen Sat</Button>
        <Button
          variant="outline"
          className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          Nasıl Çalışır?
        </Button>
      </>
    ),
  },
};

export const SolaHizali: Story = {
  args: {
    align: "start",
    title: "Sezon sonu fırsatları başladı",
    description: "Seçili ürünlerde %60'a varan indirimler seni bekliyor.",
    actions: <Button variant="secondary">İndirimleri Keşfet</Button>,
  },
};
