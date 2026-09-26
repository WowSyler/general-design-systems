import type { Meta, StoryObj } from "@storybook/react-vite";
import { Camera, ScanLine } from "lucide-react";

import { Fab } from "@wowsyler/ds-ui";

const meta: Meta<typeof Fab> = {
  title: "Composites/Fab",
  component: Fab,
};

export default meta;
type Story = StoryObj<typeof Fab>;

export const FisTarama: Story = {
  args: {
    icon: <ScanLine className="size-6" />,
    "aria-label": "Fiş tara",
  },
};

export const GenisletilmisFab: Story = {
  args: {
    icon: <ScanLine className="size-6" />,
    label: "Fiş Tara",
  },
};

export const VarsayilanArtiIkonu: Story = {
  args: {
    "aria-label": "Yeni kayıt ekle",
  },
};

export const SabitKonumlu: Story = {
  render: () => (
    <div className="relative h-64 w-96 max-w-full overflow-hidden rounded-lg border bg-muted/30 p-4">
      <p className="text-sm text-muted-foreground">
        Fisly ana ekranı — sağ altta sabit fiş tarama butonu. (Önizlemede
        konteyner içinde mutlak konumlandırıldı.)
      </p>
      <Fab
        icon={<Camera className="size-6" />}
        label="Fiş Tara"
        position="static"
        className="absolute bottom-6 right-6"
      />
    </div>
  ),
};
