import type { Meta, StoryObj } from "@storybook/react-vite";
import { History, Home, ScanLine, Sparkles, User } from "lucide-react";

import { BottomNav } from "@ds/ui";

const meta: Meta<typeof BottomNav> = {
  title: "Composites/BottomNav",
  component: BottomNav,
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm rounded-xl border bg-background pt-10">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BottomNav>;

export const GlowScanGezinme: Story = {
  args: {
    items: [
      { icon: <Home className="size-5" />, label: "Ana Sayfa", active: true },
      { icon: <History className="size-5" />, label: "Geçmiş" },
      { icon: <Sparkles className="size-5" />, label: "Öneriler" },
      { icon: <User className="size-5" />, label: "Profil" },
    ],
    centerAction: <ScanLine className="size-6" />,
    centerActionLabel: "Cilt taraması başlat",
  },
};

export const OrtaButonsuz: Story = {
  args: {
    items: [
      { icon: <Home className="size-5" />, label: "Ana Sayfa" },
      { icon: <History className="size-5" />, label: "Geçmiş", active: true },
      { icon: <Sparkles className="size-5" />, label: "Öneriler" },
      { icon: <User className="size-5" />, label: "Profil" },
    ],
  },
};
