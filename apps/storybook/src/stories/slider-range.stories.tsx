import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { SliderRange } from "@ds/ui";

const meta: Meta<typeof SliderRange> = {
  title: "Primitives/Slider Range",
  component: SliderRange,
};

export default meta;
type Story = StoryObj<typeof SliderRange>;

/** Dolap: ikinci el ürün aramasında fiyat aralığı filtresi (₺). */
export const FiyatAraligi: Story = {
  render: () => {
    const [aralik, setAralik] = React.useState<[number, number]>([250, 1200]);
    const bicimle = (v: number) => `${v.toLocaleString("tr-TR")} ₺`;
    return (
      <div className="w-80 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Fiyat aralığı
          </span>
          <span className="text-sm tabular-nums text-muted-foreground">
            {bicimle(aralik[0])} – {bicimle(aralik[1])}
          </span>
        </div>
        <SliderRange
          value={aralik}
          onValueChange={setAralik}
          min={0}
          max={5000}
          step={50}
          minStepsBetweenThumbs={2}
          formatValue={bicimle}
          showBubbles
        />
        <p className="text-xs text-muted-foreground">
          Bu aralıkta {aralik[1] > aralik[0] ? "1.482" : "0"} ürün listeleniyor.
        </p>
      </div>
    );
  },
};

/** Fisly: harcama listesini tutar aralığına göre süzme (baloncuksuz, sade). */
export const TutarAraligi: Story = {
  render: () => {
    const [aralik, setAralik] = React.useState<[number, number]>([1500, 12000]);
    const bicimle = (v: number) => `${v.toLocaleString("tr-TR")} ₺`;
    return (
      <div className="w-80 space-y-5">
        <div className="space-y-1">
          <span className="text-sm font-medium text-foreground">
            İşlem tutarı
          </span>
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {bicimle(aralik[0])}{" "}
            <span className="text-base font-normal text-muted-foreground">
              – {bicimle(aralik[1])}
            </span>
          </p>
        </div>
        <SliderRange
          value={aralik}
          onValueChange={setAralik}
          min={0}
          max={25000}
          step={500}
          formatValue={bicimle}
        />
      </div>
    );
  },
};

/** GlowScan: cilt analizi risk eşiği aralığı (%). Devre dışı örneği de içerir. */
export const EsikDegeri: Story = {
  render: () => {
    const [esik, setEsik] = React.useState<[number, number]>([35, 80]);
    const yuzde = (v: number) => `%${v}`;
    return (
      <div className="w-80 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Uyarı eşiği
            </span>
            <span className="text-sm tabular-nums text-muted-foreground">
              {yuzde(esik[0])} – {yuzde(esik[1])}
            </span>
          </div>
          <SliderRange
            value={esik}
            onValueChange={setEsik}
            min={0}
            max={100}
            step={5}
            formatValue={yuzde}
            showBubbles
          />
        </div>
        <div className="space-y-2 opacity-100">
          <span className="text-sm font-medium text-muted-foreground">
            Nem seviyesi (kilitli)
          </span>
          <SliderRange
            defaultValue={[20, 60]}
            min={0}
            max={100}
            step={5}
            formatValue={yuzde}
            disabled
          />
        </div>
      </div>
    );
  },
};
