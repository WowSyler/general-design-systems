import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CheckCircle2,
  Clock,
  Loader2,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { StatusBadge } from "@ds/ui";

const meta: Meta<typeof StatusBadge> = {
  title: "Primitives/StatusBadge",
  component: StatusBadge,
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Varsayilan: Story = {
  args: {
    label: "Beklemede",
    variant: "neutral",
  },
};

export const Varyantlar: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge label="Başarılı" variant="success" />
      <StatusBadge label="Uyarı" variant="warning" />
      <StatusBadge label="Başarısız" variant="destructive" />
      <StatusBadge label="Bilgi" variant="info" />
      <StatusBadge label="Taslak" variant="neutral" />
      <StatusBadge label="Çalışıyor" variant="running" />
    </div>
  ),
};

export const Ikonlu: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge label="Yayında" variant="success" icon={<CheckCircle2 />} />
      <StatusBadge label="Zaman aşımı" variant="warning" icon={<Clock />} />
      <StatusBadge
        label="Geri alındı"
        variant="destructive"
        icon={<RotateCcw />}
      />
    </div>
  ),
};

/** DeployLens — dağıtım (deploy) hattındaki build durumları. */
export const DeployLensBuildDurumu: Story = {
  render: () => {
    const buildler = [
      {
        dal: "main",
        commit: "a3f92c1",
        durum: "success" as const,
        etiket: "Yayında",
      },
      {
        dal: "feat/checkout",
        commit: "7b1e0d4",
        durum: "running" as const,
        etiket: "Derleniyor",
      },
      {
        dal: "fix/auth",
        commit: "c92aa08",
        durum: "destructive" as const,
        etiket: "Hata",
      },
      {
        dal: "chore/deps",
        commit: "0f4d1ab",
        durum: "warning" as const,
        etiket: "Kararsız",
      },
    ];

    return (
      <div className="w-96 divide-y divide-border rounded-lg border">
        {buildler.map((b) => (
          <div
            key={b.commit}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{b.dal}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {b.commit}
              </p>
            </div>
            <StatusBadge
              label={b.etiket}
              variant={b.durum}
              icon={
                b.durum === "running" ? (
                  <Loader2 className="animate-spin" />
                ) : undefined
              }
            />
          </div>
        ))}
      </div>
    );
  },
};

/** Dolap — ikinci el sipariş akışındaki durumlar. */
export const DolapSiparisDurumu: Story = {
  render: () => {
    const siparisler = [
      { no: "#DLP-4821", urun: "Vintage denim ceket", durum: "success" as const, etiket: "Teslim edildi" },
      { no: "#DLP-4822", urun: "Oversize triko kazak", durum: "running" as const, etiket: "Kargoda" },
      { no: "#DLP-4823", urun: "Keten yazlık gömlek", durum: "info" as const, etiket: "Hazırlanıyor" },
      { no: "#DLP-4824", urun: "Deri omuz çantası", durum: "destructive" as const, etiket: "İptal edildi" },
    ];

    return (
      <div className="w-[26rem] space-y-2">
        {siparisler.map((s) => (
          <div
            key={s.no}
            className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{s.urun}</p>
              <p className="font-mono text-xs text-muted-foreground">{s.no}</p>
            </div>
            <StatusBadge label={s.etiket} variant={s.durum} />
          </div>
        ))}
      </div>
    );
  },
};

/** Randevu — randevu durum etiketleri (ikonlu). */
export const RandevuDurumu: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge label="Onaylandı" variant="success" icon={<CheckCircle2 />} />
      <StatusBadge label="Onay bekliyor" variant="warning" icon={<Clock />} />
      <StatusBadge label="İptal edildi" variant="destructive" icon={<XCircle />} />
      <StatusBadge label="Tamamlandı" variant="neutral" icon={<CheckCircle2 />} />
    </div>
  ),
};
