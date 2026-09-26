import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Camera, ImageIcon, MonitorPlay, ScanLine } from "lucide-react";

import { AspectRatio } from "@wowsyler/ds-ui";

const meta: Meta<typeof AspectRatio> = {
  title: "Layout/AspectRatio",
  component: AspectRatio,
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

/** Gorsel yerine kullanilan tema-agnostik yer tutucu icerik. */
const Placeholder = ({
  label,
  icon,
}: {
  label: string;
  icon: ReactNode;
}) => (
  <div className="flex size-full flex-col items-center justify-center gap-2 bg-brand-gradient text-primary-foreground">
    <div className="rounded-full bg-background/20 p-3 backdrop-blur-sm" aria-hidden="true">
      {icon}
    </div>
    <span className="px-4 text-center text-sm font-medium">{label}</span>
  </div>
);

export const Default: Story = {
  render: () => (
    <div className="max-w-xl">
      <AspectRatio ratio={16 / 9}>
        <Placeholder
          label="DeployLens dağıtım ekran görüntüsü — 16:9"
          icon={<MonitorPlay className="size-6" />}
        />
      </AspectRatio>
      <p className="mt-3 text-sm text-muted-foreground">
        Çerçeve oranı sabit kalır; içerik yüklenirken düzen kaymaz (CLS = 0).
      </p>
    </div>
  ),
};

export const Oranlar: Story = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-2 gap-6 lg:grid-cols-4">
      <div className="space-y-2">
        <AspectRatio ratio={16 / 9}>
          <Placeholder label="16:9" icon={<MonitorPlay className="size-6" />} />
        </AspectRatio>
        <p className="text-center text-xs text-muted-foreground">Geniş — video</p>
      </div>
      <div className="space-y-2">
        <AspectRatio ratio="4/3">
          <Placeholder label="4:3" icon={<ImageIcon className="size-6" />} />
        </AspectRatio>
        <p className="text-center text-xs text-muted-foreground">Klasik görsel</p>
      </div>
      <div className="space-y-2">
        <AspectRatio ratio={1}>
          <Placeholder label="1:1" icon={<ScanLine className="size-6" />} />
        </AspectRatio>
        <p className="text-center text-xs text-muted-foreground">Kare — GlowScan</p>
      </div>
      <div className="space-y-2">
        <AspectRatio ratio="3/4">
          <Placeholder label="3:4" icon={<Camera className="size-6" />} />
        </AspectRatio>
        <p className="text-center text-xs text-muted-foreground">Dikey — Dolap</p>
      </div>
    </div>
  ),
};

export const UrunGaleriKaresi: Story = {
  render: () => (
    <div className="grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
      {[
        "Vintage kot ceket",
        "Krem triko kazak",
        "Deri omuz çantası",
        "Keten yazlık gömlek",
        "Süet bilekli bot",
        "İpek desenli fular",
      ].map((urun, i) => (
        <figure key={urun} className="space-y-2">
          <AspectRatio ratio="3/4" rounded="xl" className="shadow-md ring-1 ring-border">
            <Placeholder
              label={`Dolap ürünü ${i + 1}`}
              icon={<Camera className="size-5" />}
            />
          </AspectRatio>
          <figcaption className="truncate text-xs font-medium text-foreground">
            {urun}
          </figcaption>
        </figure>
      ))}
    </div>
  ),
};

export const TaramaKaresi: Story = {
  render: () => (
    <div className="max-w-sm">
      <AspectRatio ratio={1} rounded="2xl" className="ring-1 ring-border">
        <Placeholder
          label="GlowScan cilt tarama karesi — 1:1"
          icon={<ScanLine className="size-7" />}
        />
      </AspectRatio>
      <p className="mt-3 text-sm text-muted-foreground">
        Kamera önizlemesi her cihazda kare kalır; analiz kadrajı sabittir.
      </p>
    </div>
  ),
};
