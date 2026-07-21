import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageOff } from "lucide-react";

import { ConditionSelector, ConditionBadge, conditionOptions } from "@ds/ui";

const meta: Meta<typeof ConditionSelector> = {
  title: "Commerce/ConditionSelector",
  component: ConditionSelector,
};

export default meta;
type Story = StoryObj<typeof ConditionSelector>;

const guideMetni =
  "Dürüst durum seçimi, ilanının daha hızlı satılmasını sağlar. " +
  "Ürünün en belirgin kusurunu açıklamada mutlaka belirt.";

export const IlanDurumSecimi: Story = {
  render: () => {
    const [durum, setDurum] = React.useState("az-kullanilmis");
    const secili = conditionOptions.find((o) => o.value === durum);
    return (
      <div className="max-w-sm space-y-4">
        <ConditionSelector
          value={durum}
          onValueChange={setDurum}
          label="Ürünün durumu"
          guide={guideMetni}
        />
        <p className="text-sm text-muted-foreground">
          Seçilen durum:{" "}
          <span className="font-medium text-foreground">
            {secili?.label ?? "—"}
          </span>
        </p>
      </div>
    );
  },
};

export const KartUzerindeRozet: Story = {
  render: () => (
    <div className="grid max-w-md grid-cols-2 gap-4">
      {[
        {
          baslik: "Vintage kot ceket",
          fiyat: "₺450",
          durum: "yeni-etiketli",
        },
        {
          baslik: "Deri postal 39 numara",
          fiyat: "₺320",
          durum: "iyi",
        },
      ].map((urun) => (
        <div
          key={urun.baslik}
          className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm"
        >
          <div className="relative flex aspect-square items-center justify-center bg-muted">
            <ImageOff
              aria-hidden="true"
              className="size-8 text-muted-foreground/50"
            />
            <ConditionBadge
              value={urun.durum}
              className="absolute left-2 top-2 bg-card/90 backdrop-blur-sm"
            />
          </div>
          <div className="space-y-1 p-3">
            <p className="line-clamp-1 text-sm font-medium">{urun.baslik}</p>
            <p className="text-base font-semibold tabular-nums">{urun.fiyat}</p>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const TumDurumRozetleri: Story = {
  render: () => (
    <div className="flex max-w-xs flex-wrap gap-2">
      {conditionOptions.map((secenek) => (
        <ConditionBadge key={secenek.value} value={secenek.value} />
      ))}
    </div>
  ),
};

export const OzelSecenekler: Story = {
  render: () => {
    const [durum, setDurum] = React.useState("");
    const secenekler = [
      {
        value: "kutulu",
        label: "Kutulu ve faturalı",
        description: "Orijinal kutusu, faturası ve tüm aksesuarları mevcut.",
        tone: "success" as const,
      },
      {
        value: "kutusuz",
        label: "Kutusuz, çalışır",
        description: "Kutusu yok fakat cihaz sorunsuz çalışıyor.",
        tone: "info" as const,
      },
      {
        value: "arizali",
        label: "Arızalı / parça",
        description: "Çalışmıyor, yedek parça olarak değerlendirilebilir.",
        tone: "muted" as const,
      },
    ];
    return (
      <div className="max-w-sm">
        <ConditionSelector
          value={durum}
          onValueChange={setDurum}
          options={secenekler}
          label="Elektronik durum bilgisi"
          guide="Cihazın çalışma durumunu net belirtmek iade taleplerini azaltır."
        />
      </div>
    );
  },
};
