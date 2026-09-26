import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkinMetricCard } from "@wowsyler/ds-ui";
import { Droplets, Grid2x2, Sun, Waves } from "lucide-react";

const meta: Meta<typeof SkinMetricCard> = {
  title: "Composites/SkinMetricCard",
  component: SkinMetricCard,
};
export default meta;

type Story = StoryObj<typeof SkinMetricCard>;

/** Tek metrik: halka gostergeli, önceki analize göre artış trendiyle. */
export const Nem: Story = {
  render: () => (
    <div className="w-80 max-w-full">
      <SkinMetricCard
        label="Nem"
        value={82}
        status="good"
        icon={<Droplets className="size-4" />}
        delta={{ direction: "up", value: "+6" }}
      />
    </div>
  ),
};

/** GlowScan analiz paneli: dört metrik, farklı durum ve trendlerle. */
export const AnalizPaneli: Story = {
  render: () => (
    <div className="grid w-[680px] max-w-full grid-cols-2 gap-4">
      <SkinMetricCard
        label="Nem"
        value={82}
        status="good"
        icon={<Droplets className="size-4" />}
        delta={{ direction: "up", value: "+6" }}
      />
      <SkinMetricCard
        label="Gözenek"
        value={41}
        status="attention"
        icon={<Grid2x2 className="size-4" />}
        delta={{ direction: "up", value: "+9", invertColors: true }}
      />
      <SkinMetricCard
        label="Kırışıklık"
        value={63}
        status="fair"
        icon={<Waves className="size-4" />}
        delta={{ direction: "flat", value: "0" }}
      />
      <SkinMetricCard
        label="Parlaklık"
        value={74}
        status="good"
        icon={<Sun className="size-4" />}
        delta={{ direction: "up", value: "+3" }}
      />
    </div>
  ),
};

/** Bar gösterge varyantı — kompakt liste yerleşimleri için. */
export const BarGosterge: Story = {
  render: () => (
    <div className="grid w-80 max-w-full gap-4">
      <SkinMetricCard
        label="Nem"
        value={82}
        status="good"
        visual="bar"
        icon={<Droplets className="size-4" />}
        delta={{ direction: "up", value: "+6" }}
      />
      <SkinMetricCard
        label="Gözenek"
        value={41}
        status="attention"
        visual="bar"
        icon={<Grid2x2 className="size-4" />}
      />
    </div>
  ),
};

/** Yüklenme durumu — analiz sonuçları beklenirken. */
export const Yukleniyor: Story = {
  render: () => (
    <div className="w-80 max-w-full">
      <SkinMetricCard label="Nem" value={0} status="good" loading />
    </div>
  ),
};
