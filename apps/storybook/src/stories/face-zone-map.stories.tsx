import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { FaceZoneMap } from "@wowsyler/ds-ui";

const meta: Meta<typeof FaceZoneMap> = {
  title: "Composites/Face Zone Map",
  component: FaceZoneMap,
};
export default meta;

type Story = StoryObj<typeof FaceZoneMap>;

type Zones = React.ComponentProps<typeof FaceZoneMap>["zones"];
type ZoneId = NonNullable<
  React.ComponentProps<typeof FaceZoneMap>["selectedZoneId"]
>;

const glowScanZones: Zones = [
  {
    id: "alin",
    score: 72,
    description:
      "Alin bolgesinde hafif yaglanma ve birkac komedon var. T-bolgesi icin haftada iki kez killi maske onerilir.",
  },
  {
    id: "goz-cevresi",
    score: 58,
    status: "dikkat",
    description:
      "Goz cevresinde kuruluk ve ince cizgiler belirgin. Nemlendirici ve gunes koruyucu kullanimi artirilmali.",
  },
  {
    id: "burun",
    score: 64,
    description:
      "Burun uzerinde genislemis gozenekler ve orta yogunlukta siyah nokta gozlemlendi.",
  },
  {
    id: "sol-yanak",
    score: 86,
    description: "Sol yanak nem dengesi iyi, gozenek gorunumu minimal.",
  },
  {
    id: "sag-yanak",
    score: 81,
    description:
      "Sag yanakta hafif kizariklik disinda cilt tonu dengeli gorunuyor.",
  },
  {
    id: "cene",
    score: 47,
    description:
      "Cene ve cene hattinda hormonal kaynakli aktif sivilceler tespit edildi. Nokta bakim urunu onerilir.",
  },
];

export const GenelAnaliz: Story = {
  render: () => (
    <div className="max-w-2xl">
      <FaceZoneMap
        title="GlowScan Bolgesel Cilt Analizi"
        zones={glowScanZones}
        selectedZoneId="cene"
      />
    </div>
  ),
};

export const Etkilesimli: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<ZoneId>("burun");
    return (
      <div className="max-w-2xl">
        <FaceZoneMap
          title="Bolgeye tiklayarak detaylari inceleyin"
          zones={glowScanZones}
          selectedZoneId={selected}
          onZoneSelect={setSelected}
        />
      </div>
    );
  },
};

export const BakimSonrasi: Story = {
  render: () => {
    const zones: Zones = [
      {
        id: "alin",
        score: 88,
        description: "Dort haftalik rutin sonrasi alin bolgesi tamamen dengelendi.",
      },
      { id: "goz-cevresi", score: 79, description: "Kuruluk azaldi, ince cizgiler belirsizlesti." },
      { id: "burun", score: 83, description: "Gozenek gorunumu ve siyah noktalar gozle gorulur sekilde iyilesti." },
      { id: "sol-yanak", score: 92, description: "Nem dengesi ve cilt tonu ideal seviyede." },
      { id: "sag-yanak", score: 90, description: "Kizariklik kayboldu, cilt tonu esitlendi." },
      { id: "cene", score: 74, description: "Aktif sivilceler geriledi, hafif iz takibi surdurulmeli." },
    ];
    return (
      <div className="max-w-2xl">
        <FaceZoneMap
          title="Bakim Sonrasi Ilerleme"
          zones={zones}
          selectedZoneId="sol-yanak"
        />
      </div>
    );
  },
};
