import type { Meta, StoryObj } from "@storybook/react-vite";

import { CameraControls } from "@wowsyler/ds-ui";

const meta: Meta<typeof CameraControls> = {
  title: "Composites/CameraControls",
  component: CameraControls,
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border bg-background shadow-lg">
        <div className="flex h-72 items-center justify-center bg-muted/40 text-sm text-muted-foreground">
          Kamera önizlemesi
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CameraControls>;

export const GlowScanTarama: Story = {
  args: {
    captureLabel: "Cilt taraması için fotoğraf çek",
    galleryLabel: "Önceki taramaları aç",
    flipLabel: "Ön/arka kameraya geç",
    flash: "auto",
    timerSeconds: 3,
  },
};

export const DolapUrunFotografi: Story = {
  args: {
    captureLabel: "Ürün fotoğrafı çek",
    galleryLabel: "Galeriden fotoğraf seç",
    galleryThumbnail: (
      <div
        className="size-full bg-brand-gradient"
        aria-hidden="true"
      />
    ),
    flash: "off",
  },
};

export const SadeSurum: Story = {
  args: {
    captureLabel: "Fotoğraf çek",
  },
};

export const DevreDisi: Story = {
  args: {
    disabled: true,
    flash: "on",
    timerSeconds: 0,
  },
};
