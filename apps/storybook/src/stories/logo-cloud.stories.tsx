import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flower2, Scissors, Sparkles } from "lucide-react";

import { LogoCloud } from "@wowsyler/ds-ui";

const meta: Meta<typeof LogoCloud> = {
  title: "Marketing/LogoCloud",
  component: LogoCloud,
};

export default meta;
type Story = StoryObj<typeof LogoCloud>;

export const MetinLogolar: Story = {
  args: {
    items: [
      { name: "Ada Güzellik" },
      { name: "GlowLab" },
      { name: "Kaya Kuaför" },
      { name: "Demirtaş Kafe" },
      { name: "Nova Spa" },
      { name: "Lotus Estetik" },
    ],
    className: "max-w-3xl",
  },
};

export const IkonluLogolar: Story = {
  render: () => (
    <div className="max-w-3xl space-y-4 text-center">
      <p className="text-sm text-muted-foreground">
        Türkiye genelinde 1.200'den fazla salon Randevu'ya güveniyor
      </p>
      <LogoCloud
        items={[
          {
            name: "Lotus Estetik",
            logo: (
              <span className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                <Flower2 className="size-5" aria-hidden="true" /> Lotus Estetik
              </span>
            ),
          },
          {
            name: "Kaya Kuaför",
            logo: (
              <span className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                <Scissors className="size-5" aria-hidden="true" /> Kaya Kuaför
              </span>
            ),
          },
          {
            name: "GlowLab",
            logo: (
              <span className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                <Sparkles className="size-5" aria-hidden="true" /> GlowLab
              </span>
            ),
          },
          { name: "Nova Spa" },
          { name: "Ada Güzellik" },
        ]}
      />
    </div>
  ),
};
