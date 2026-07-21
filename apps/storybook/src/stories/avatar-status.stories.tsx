import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { AvatarStatus } from "@ds/ui";

const meta: Meta<typeof AvatarStatus> = {
  title: "Composites/AvatarStatus",
  component: AvatarStatus,
};

export default meta;
type Story = StoryObj<typeof AvatarStatus>;

type Presence = React.ComponentProps<typeof AvatarStatus>["status"];
type Shape = React.ComponentProps<typeof AvatarStatus>["shape"];
type Size = React.ComponentProps<typeof AvatarStatus>["size"];

const saticilar: {
  ad: string;
  bas: string;
  durum: Presence;
  son: string;
}[] = [
  { ad: "Selin Aksoy", bas: "SA", durum: "online", son: "Şimdi aktif" },
  { ad: "Kerem Doğan", bas: "KD", durum: "busy", son: "Kargoya veriyor" },
  { ad: "Ece Yıldırım", bas: "EY", durum: "away", son: "5 dk önce" },
  { ad: "Barış Şahin", bas: "BŞ", durum: "offline", son: "Dün 22:14" },
];

const durumEtiket: Record<NonNullable<Presence>, string> = {
  online: "Çevrimiçi",
  busy: "Meşgul",
  away: "Uzakta",
  offline: "Çevrimdışı",
};

/** Dolap mesajlaşma listesi: satıcıların anlık mevcudiyet durumu. */
export const DolapSaticiDurumu: Story = {
  render: () => (
    <ul className="w-80 divide-y divide-border rounded-xl border border-border bg-card">
      {saticilar.map((s) => (
        <li key={s.ad} className="flex items-center gap-3 p-3">
          <AvatarStatus
            fallback={s.bas}
            name={s.ad}
            status={s.durum}
            statusLabel={durumEtiket[s.durum!]}
            pulse={s.durum === "online"}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {s.ad}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {durumEtiket[s.durum!]} · {s.son}
            </p>
          </div>
        </li>
      ))}
    </ul>
  ),
};

/** Randevu uzman kartı: çevrimiçi danışman büyük boyda kare avatarla. */
export const RandevuUzmanKarti: Story = {
  render: () => (
    <div className="flex w-80 items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <AvatarStatus
        fallback="DE"
        name="Dr. Deniz Erdem"
        status="online"
        shape="rounded"
        size="xl"
        pulse
      />
      <div className="min-w-0">
        <p className="text-base font-semibold text-foreground">
          Dr. Deniz Erdem
        </p>
        <p className="text-sm text-muted-foreground">Klinik Psikolog</p>
        <p className="mt-1 text-xs font-medium text-success">
          Görüşmeye hazır
        </p>
      </div>
    </div>
  ),
};

/** Tüm boyut ve şekil varyantları bir arada. */
export const BoyutVeSekiller: Story = {
  render: () => {
    const boyutlar: Size[] = ["xs", "sm", "md", "lg", "xl", "2xl"];
    const sekiller: { shape: Shape; bas: string; durum: Presence }[] = [
      { shape: "circle", bas: "OK", durum: "online" },
      { shape: "rounded", bas: "MA", durum: "away" },
      { shape: "square", bas: "ZT", durum: "busy" },
    ];
    return (
      <div className="space-y-8">
        <div className="flex items-end gap-4">
          {boyutlar.map((b) => (
            <div key={b} className="flex flex-col items-center gap-2">
              <AvatarStatus fallback="OK" name="Ozan Küçük" status="online" size={b} />
              <span className="text-xs text-muted-foreground">{b}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6">
          {sekiller.map((s) => (
            <div key={s.shape} className="flex flex-col items-center gap-2">
              <AvatarStatus
                fallback={s.bas}
                status={s.durum}
                shape={s.shape}
                size="xl"
              />
              <span className="text-xs text-muted-foreground">{s.shape}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
