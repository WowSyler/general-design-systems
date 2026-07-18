import type { Meta, StoryObj } from "@storybook/react";
import { Heart, Star } from "lucide-react";

import { Toggle } from "@ds/ui";

const meta: Meta<typeof Toggle> = {
  title: "Primitives/Toggle",
  component: Toggle,
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Sadece favoriler">
      <Heart className="size-4" />
    </Toggle>
  ),
};

export const OutlineWithText: Story = {
  render: () => (
    <Toggle variant="outline" defaultPressed>
      <Star className="mr-2 size-4" /> Öne çıkanlar
    </Toggle>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Toggle size="sm" variant="outline" aria-label="Küçük">
        <Heart className="size-4" />
      </Toggle>
      <Toggle size="default" variant="outline" aria-label="Normal">
        <Heart className="size-4" />
      </Toggle>
      <Toggle size="lg" variant="outline" aria-label="Büyük">
        <Heart className="size-4" />
      </Toggle>
      <Toggle disabled variant="outline" aria-label="Devre dışı">
        <Heart className="size-4" />
      </Toggle>
    </div>
  ),
};
