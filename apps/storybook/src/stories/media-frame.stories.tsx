import type { Meta, StoryObj } from "@storybook/react-vite";

import { MediaFrame } from "@ds/ui";

const meta: Meta<typeof MediaFrame> = {
  title: "Composites/MediaFrame",
  component: MediaFrame,
};

export default meta;
type Story = StoryObj<typeof MediaFrame>;

export const TanitimVideosu: Story = {
  render: () => (
    <div className="w-[560px]">
      <MediaFrame
        play
        caption="DeployLens 2 dakikada: pipeline'dan production'a canlı izleme"
      />
    </div>
  ),
};

export const GenisBant: Story = {
  render: () => (
    <div className="w-[720px]">
      <MediaFrame
        aspect="wide"
        media={
          <div className="flex h-full w-full items-center justify-center bg-brand-gradient">
            <span className="text-lg font-semibold text-primary-foreground">
              GlowScan — Cilt analizini 30 saniyede gör
            </span>
          </div>
        }
        caption="Ana sayfa kahraman bandı önizlemesi"
      />
    </div>
  ),
};

export const KareOnizleme: Story = {
  render: () => (
    <div className="w-80">
      <MediaFrame
        aspect="square"
        play
        media={
          <div className="flex h-full w-full items-end bg-gradient-to-t from-foreground/60 to-transparent p-4">
            <span className="text-sm font-medium text-background">
              Dolap: Gardırop turu
            </span>
          </div>
        }
      />
    </div>
  ),
};
