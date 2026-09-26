import type { Meta, StoryObj } from "@storybook/react-vite";
import { Camera, Receipt } from "lucide-react";

import { FileDropzone } from "@wowsyler/ds-ui";

const meta: Meta<typeof FileDropzone> = {
  title: "Composites/FileDropzone",
  component: FileDropzone,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FileDropzone>;

export const Varsayilan: Story = {
  args: {},
};

export const FisYukleme: Story = {
  args: {
    label: "Fişini buraya bırak veya tıkla",
    hint: "PNG, JPG veya PDF — en fazla 10 MB",
    icon: <Receipt className="size-6" />,
  },
};

export const CiltFotografi: Story = {
  args: {
    label: "Cilt fotoğrafını yükle",
    hint: "GlowScan analizi için iyi aydınlatılmış, net bir yüz fotoğrafı seç",
    icon: <Camera className="size-6" />,
  },
};
