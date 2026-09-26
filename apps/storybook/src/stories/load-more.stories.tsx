import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { LoadMore } from "@wowsyler/ds-ui";
import { Package } from "lucide-react";

const meta: Meta<typeof LoadMore> = {
  title: "Composites/LoadMore",
  component: LoadMore,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof LoadMore>;

const TOPLAM = 128;
const SAYFA = 24;

/** Dolap urun akisi: her tiklamada yeni sayfa "yuklenir" (simule gecikme). */
export const DolapUrunAkisi: Story = {
  render: () => {
    const [yuklenen, setYuklenen] = React.useState(SAYFA);
    const [yukleniyor, setYukleniyor] = React.useState(false);

    const dahaFazla = () => {
      setYukleniyor(true);
      window.setTimeout(() => {
        setYuklenen((n) => Math.min(TOPLAM, n + SAYFA));
        setYukleniyor(false);
      }, 1100);
    };

    return (
      <div className="w-80 max-w-full space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: yuklenen }).slice(0, 9).map((_, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-lg border border-border bg-card text-muted-foreground"
            >
              <Package className="size-5" aria-hidden="true" />
            </div>
          ))}
        </div>
        <LoadMore
          loaded={yuklenen}
          total={TOPLAM}
          loading={yukleniyor}
          onLoadMore={dahaFazla}
          showProgress
        />
      </div>
    );
  },
};

/** Yeni sayfa istegi surerken pasif Spinner durumu. */
export const YukleniyorDurumu: Story = {
  args: {
    loaded: 48,
    total: TOPLAM,
    loading: true,
    showProgress: true,
  },
};

/** DeployLens dagitim gunlugu: tum kayitlar getirildi, pasif "Tumu yuklendi". */
export const TumuYuklendi: Story = {
  args: {
    loaded: 342,
    total: 342,
    hasMore: false,
    showProgress: true,
    formatCount: (loaded: number, total: number) =>
      `${loaded.toLocaleString("tr-TR")} / ${total.toLocaleString("tr-TR")} günlük satırı`,
  },
};
