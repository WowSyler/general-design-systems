import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Archive, Download, Trash2 } from "lucide-react";

import { BulkActionBar, Button, Checkbox } from "@ds/ui";

const meta: Meta<typeof BulkActionBar> = {
  title: "Composites/BulkActionBar",
  component: BulkActionBar,
};

export default meta;
type Story = StoryObj<typeof BulkActionBar>;

/** DeployLens dagitim listesinde statik onizleme: 3 secili kayit. */
export const Varsayilan: Story = {
  args: {
    count: 3,
    position: "static",
    forceVisible: true,
    actions: [
      { id: "archive", label: "Arsivle", icon: <Archive className="size-3.5" /> },
      { id: "export", label: "Disa aktar", icon: <Download className="size-3.5" /> },
      {
        id: "delete",
        label: "Sil",
        icon: <Trash2 className="size-3.5" />,
        variant: "destructive",
      },
    ],
  },
};

/** Fisly fis arsivi: tonlu (primary) varyant, tek toplu aksiyon. */
export const PrimaryTon: Story = {
  args: {
    count: 12,
    position: "static",
    tone: "primary",
    forceVisible: true,
    countLabel: (n) => `${n} fis secildi`,
    actions: [
      { id: "export", label: "Dise aktar", icon: <Download className="size-3.5" /> },
    ],
  },
};

/**
 * Dolap urun listesi: gercek secim akisi. Satirlari isaretleyin,
 * cubuk alttan animate-fade-up ile belirir; X veya Escape ile temizlenir.
 */
export const CanliSecimAkisi: Story = {
  render: () => {
    const urunler = [
      "Yun Kazak — Bej",
      "Deri Ceket — Siyah",
      "Keten Gomlek — Mavi",
      "Kot Pantolon — Lacivert",
      "Triko Elbise — Bordo",
    ];
    const [secili, setSecili] = React.useState<Set<string>>(new Set());

    const toggle = (ad: string) =>
      setSecili((onceki) => {
        const sonraki = new Set(onceki);
        if (sonraki.has(ad)) sonraki.delete(ad);
        else sonraki.add(ad);
        return sonraki;
      });

    return (
      <div className="relative mx-auto min-h-[26rem] w-full max-w-lg rounded-xl border border-border bg-background p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Dolap urunlerim</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSecili(new Set(urunler))}
          >
            Tumunu sec
          </Button>
        </div>

        <ul className="space-y-1.5">
          {urunler.map((ad) => {
            const isaretli = secili.has(ad);
            return (
              <li key={ad}>
                <label
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card px-3 py-2.5 text-sm text-card-foreground transition-all duration-200 hover:border-ring/50 hover:bg-accent/50 has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5"
                >
                  <Checkbox
                    checked={isaretli}
                    onCheckedChange={() => toggle(ad)}
                    aria-label={`${ad} sec`}
                  />
                  <span className="font-medium">{ad}</span>
                </label>
              </li>
            );
          })}
        </ul>

        <BulkActionBar
          position="sticky"
          count={secili.size}
          onClearSelection={() => setSecili(new Set())}
          countLabel={(n) => `${n} urun secildi`}
          actions={[
            {
              id: "archive",
              label: "Arsivle",
              icon: <Archive className="size-3.5" />,
            },
            {
              id: "export",
              label: "Disa aktar",
              icon: <Download className="size-3.5" />,
            },
            {
              id: "delete",
              label: "Sil",
              icon: <Trash2 className="size-3.5" />,
              variant: "destructive",
            },
          ]}
        />
      </div>
    );
  },
};
