import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageOff } from "lucide-react";

import { FavoriteButton } from "@wowsyler/ds-ui";

const meta: Meta<typeof FavoriteButton> = {
  title: "Commerce/FavoriteButton",
  component: FavoriteButton,
};

export default meta;
type Story = StoryObj<typeof FavoriteButton>;

export const IkonVeSayac: Story = {
  render: () => {
    const [liked, setLiked] = React.useState(false);
    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Bu ürünü beğen</span>
        <FavoriteButton
          value={liked}
          onValueChange={setLiked}
          count={liked ? 349 : 348}
        />
        <p className="text-xs text-muted-foreground">
          Dolap ilanı beğeni sayısı{" "}
          <span className="tabular-nums text-foreground">
            {liked ? "1 artar" : "beklemede"}
          </span>
          .
        </p>
      </div>
    );
  },
};

export const KartUstuOverlay: Story = {
  render: () => (
    <div className="relative h-56 w-44 overflow-hidden rounded-xl border bg-muted shadow-sm">
      <div className="flex size-full items-center justify-center">
        <ImageOff aria-hidden className="size-8 text-muted-foreground/50" />
      </div>
      <FavoriteButton
        variant="overlay"
        defaultValue
        className="absolute right-2 top-2"
        aria-label="GlowScan cilt rutinini kaydet"
      />
      <div className="absolute inset-x-0 bottom-0 bg-background/85 p-3 backdrop-blur-sm">
        <p className="text-sm font-medium">Nemlendirici Serum</p>
        <p className="text-sm font-semibold tabular-nums">₺189,90</p>
      </div>
    </div>
  ),
};

export const DetayEtiketli: Story = {
  render: () => {
    const [liked, setLiked] = React.useState(false);
    return (
      <div className="flex flex-col gap-3">
        <FavoriteButton
          variant="detail"
          size="lg"
          value={liked}
          onValueChange={setLiked}
          count={liked ? 1281 : 1280}
        />
        <p className="text-xs text-muted-foreground">
          {liked
            ? "GlowScan rutini kaydedilenlere eklendi."
            : "Rutini kaydetmek için kalbe dokunun."}
        </p>
      </div>
    );
  },
};

export const Durumlar: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-1">
        <FavoriteButton defaultValue={false} count={12} />
        <span className="text-xs text-muted-foreground">Pasif</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <FavoriteButton defaultValue count={13} />
        <span className="text-xs text-muted-foreground">Beğenildi</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <FavoriteButton defaultValue disabled count={13} />
        <span className="text-xs text-muted-foreground">Devre dışı</span>
      </div>
    </div>
  ),
};
