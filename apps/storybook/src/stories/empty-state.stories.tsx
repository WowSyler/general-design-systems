import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, Shirt } from "lucide-react";

import { Button, EmptyState } from "@wowsyler/ds-ui";

const meta: Meta<typeof EmptyState> = {
  title: "Composites/EmptyState",
  component: EmptyState,
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const HenuzKiyafetYok: Story = {
  args: {
    icon: <Shirt className="size-6" />,
    title: "Henüz kıyafet yok",
    description:
      "Gardırobunu oluşturmak için ilk kıyafetinin fotoğrafını ekle. Yapay zekâ stilistin kombin önerileri için kıyafetlerini tanısın.",
    action: (
      <Button>
        <Plus className="mr-2 size-4" /> Kıyafet Ekle
      </Button>
    ),
  },
};

export const SadeceBaslik: Story = {
  args: {
    title: "Henüz kombin oluşturulmadı",
  },
};
