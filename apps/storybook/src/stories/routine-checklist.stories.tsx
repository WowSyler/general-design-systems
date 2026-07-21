import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Droplet,
  Sun,
  Pipette,
  Leaf,
  Moon,
  FlaskConical,
  Eye,
} from "lucide-react";

import { RoutineChecklist } from "@ds/ui";

const meta: Meta<typeof RoutineChecklist> = {
  title: "Composites/RoutineChecklist",
  component: RoutineChecklist,
};

export default meta;
type Story = StoryObj<typeof RoutineChecklist>;

type Step = React.ComponentProps<typeof RoutineChecklist>["steps"][number];

const gunlukRutin: Step[] = [
  {
    id: "temizleyici",
    name: "Nazik Jel Temizleyici",
    period: "AM",
    icon: <Droplet />,
    note: "Sabah cildini uyandır",
  },
  {
    id: "c-vitamini",
    name: "C Vitamini Serumu",
    period: "AM",
    icon: <Pipette />,
    note: "Antioksidan koruma",
  },
  {
    id: "nemlendirici-am",
    name: "Hafif Nemlendirici",
    period: "AM",
    icon: <Leaf />,
    note: "Nem bariyerini destekle",
  },
  {
    id: "gunes-kremi",
    name: "SPF 50 Güneş Kremi",
    period: "AM",
    icon: <Sun />,
    note: "GlowScan'in olmazsa olmazı",
  },
  {
    id: "makyaj-temizleyici",
    name: "Yağ Bazlı Makyaj Temizleyici",
    period: "PM",
    icon: <Droplet />,
    note: "Günün kirini çöz",
  },
  {
    id: "retinol",
    name: "Retinol Serumu",
    period: "PM",
    icon: <FlaskConical />,
    note: "Haftada 3 gün",
  },
  {
    id: "goz-kremi",
    name: "Göz Çevresi Kremi",
    period: "PM",
    icon: <Eye />,
    note: "İnce çizgilere destek",
  },
  {
    id: "gece-kremi",
    name: "Onarıcı Gece Kremi",
    period: "PM",
    icon: <Moon />,
    note: "Cildi geceye hazırla",
  },
];

export const GlowScanGunlukRutin: Story = {
  render: () => {
    const [done, setDone] = React.useState<string[]>([
      "temizleyici",
      "c-vitamini",
    ]);
    return (
      <div className="max-w-md">
        <RoutineChecklist
          title="Karma Cilt Rutini"
          description="GlowScan analizine göre kişiselleştirildi."
          steps={gunlukRutin}
          value={done}
          onValueChange={setDone}
        />
      </div>
    );
  },
};

export const SabahRutini: Story = {
  render: () => {
    const [done, setDone] = React.useState<string[]>(["temizleyici"]);
    return (
      <div className="max-w-md">
        <RoutineChecklist
          title="Sabah Rutini"
          description="Tek bölümlü kısa bakım akışı."
          steps={gunlukRutin.filter((step) => step.period === "AM")}
          value={done}
          onValueChange={setDone}
        />
      </div>
    );
  },
};

export const TumuTamamlandi: Story = {
  render: () => {
    const sabah = gunlukRutin.filter((step) => step.period === "AM");
    const [done, setDone] = React.useState<string[]>(
      sabah.map((step) => step.id),
    );
    return (
      <div className="max-w-md">
        <RoutineChecklist
          title="Bugünkü Rutin Tamamlandı"
          description="Cildin bugün tam bakımını aldı, harikasın."
          steps={sabah}
          value={done}
          onValueChange={setDone}
        />
      </div>
    );
  },
};
