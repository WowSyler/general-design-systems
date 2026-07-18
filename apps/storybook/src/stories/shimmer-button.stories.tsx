import type { Meta, StoryObj } from "@storybook/react";
import { Sparkles, CalendarCheck } from "lucide-react";

import { ShimmerButton } from "@ds/ui";

const meta: Meta<typeof ShimmerButton> = {
  title: "Iconic/ShimmerButton",
  component: ShimmerButton,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ShimmerButton>;

/** GlowScan cilt analizini başlatan ana eylem butonu. */
export const GlowScanAnaliz: Story = {
  render: () => (
    <ShimmerButton leftIcon={<Sparkles />}>Analizi Başlat</ShimmerButton>
  ),
};

/** Randevu uygulamasının randevu alma çağrı butonu. */
export const RandevuAl: Story = {
  render: () => (
    <ShimmerButton rightIcon={<CalendarCheck />}>
      Hemen Randevu Al
    </ShimmerButton>
  ),
};
