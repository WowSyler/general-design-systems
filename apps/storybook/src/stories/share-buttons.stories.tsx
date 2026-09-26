import type { Meta, StoryObj } from "@storybook/react-vite";

import { ShareButtons } from "@wowsyler/ds-ui";

const meta: Meta<typeof ShareButtons> = {
  title: "Composites/ShareButtons",
  component: ShareButtons,
  decorators: [
    (Story) => (
      <div className="max-w-md p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ShareButtons>;

export const SonucuPaylas: Story = {
  args: {
    url: "https://glowscan.app/sonuc/8f3ac91",
    text: "GlowScan cilt analizim hazir: nem %72, gozenek skoru 84. Sen de dene!",
    heading: "Sonucu paylas",
  },
};

export const EtiketliButonlar: Story = {
  args: {
    url: "https://dolap.app/urun/vintage-deri-ceket-450",
    text: "Vintage deri ceket - 450 TL. Dolap'ta gordum, bayildim!",
    emailSubject: "Dolap'ta bir urun sana ozel",
    showLabels: true,
    heading: "Bu urunu paylas",
  },
};

export const SecilenPlatformlerHap: Story = {
  args: {
    url: "https://glowscan.app/rutin/yaz-parlakligi",
    text: "Yaz parlakligi rutinimi GlowScan ile olusturdum.",
    platforms: ["whatsapp", "x", "copy"],
    shape: "pill",
    size: "lg",
    showHeading: false,
  },
};
