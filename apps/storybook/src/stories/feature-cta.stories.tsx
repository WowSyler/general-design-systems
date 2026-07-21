import type { Meta, StoryObj } from "@storybook/react-vite";
import { Camera, Sparkles } from "lucide-react";

import { FeatureCta } from "@ds/ui";

const meta: Meta<typeof FeatureCta> = {
  title: "Composites/FeatureCta",
  component: FeatureCta,
};

export default meta;
type Story = StoryObj<typeof FeatureCta>;

export const AnaliziBaslat: Story = {
  args: {
    icon: <Sparkles className="size-6" aria-hidden="true" />,
    overline: "GlowScan AI",
    title: "Analizi Başlat",
    description:
      "Selfie çek, 10 metrikte cilt raporunu saniyeler içinde al.",
    onClick: () => {
      console.log("Analiz akışı başlatıldı");
    },
    className: "max-w-md",
  },
};

export const StatikKart: Story = {
  args: {
    icon: <Camera className="size-6" aria-hidden="true" />,
    title: "Haftalık Karşılaştırma",
    description:
      "Geçen haftaki analizinle bugünü yan yana gör, gelişimini takip et.",
    className: "max-w-md",
  },
};
