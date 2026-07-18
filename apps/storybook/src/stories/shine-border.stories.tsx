import type { Meta, StoryObj } from "@storybook/react";
import { Check, Sparkles } from "lucide-react";

import { Button, ShineBorder } from "@ds/ui";

const meta: Meta<typeof ShineBorder> = {
  title: "Iconic/ShineBorder",
  component: ShineBorder,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ShineBorder>;

const ozellikler = [
  "Sınırsız randevu ve hatırlatma",
  "Otomatik SMS onayı",
  "Çoklu personel takvimi",
  "Gelişmiş doluluk raporları",
];

export const OneCikanPlan: Story = {
  render: () => (
    <ShineBorder className="max-w-sm">
      <div className="flex items-center gap-2 text-primary">
        <Sparkles className="size-4" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          En çok tercih edilen
        </span>
      </div>
      <h3 className="mt-3 text-xl font-semibold text-card-foreground">
        Randevu Pro
      </h3>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-card-foreground">499 ₺</span>
        <span className="text-sm text-muted-foreground">/ ay</span>
      </div>
      <ul className="mt-5 space-y-2.5">
        {ozellikler.map((ozellik) => (
          <li
            key={ozellik}
            className="flex items-center gap-2 text-sm text-card-foreground"
          >
            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Check className="size-3.5" aria-hidden="true" />
            </span>
            {ozellik}
          </li>
        ))}
      </ul>
      <Button className="mt-6 w-full">Planı seç</Button>
    </ShineBorder>
  ),
};
