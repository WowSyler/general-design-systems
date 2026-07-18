import type { Meta, StoryObj } from "@storybook/react";

import { Button, PromoBanner } from "@ds/ui";

const meta: Meta<typeof PromoBanner> = {
  title: "Marketing/PromoBanner",
  component: PromoBanner,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof PromoBanner>;

export const Kampanya: Story = {
  args: {
    message:
      "Yaz kampanyası: Randevu Pro'ya yıllık geçişte 2 ay hediye! 31 Temmuz'a kadar geçerli.",
    action: (
      <Button
        size="sm"
        variant="secondary"
        className="h-7 rounded-full px-3 text-xs"
      >
        Hemen Geç
      </Button>
    ),
    onDismiss: () => {
      console.log("Kampanya bandı kapatıldı");
    },
  },
};

export const SadeDuyuru: Story = {
  args: {
    message: "GlowScan v2 yayında: yeni gözenek analizi ve haftalık gelişim grafiği.",
  },
};
