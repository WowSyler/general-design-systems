import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  Rocket,
  Save,
  Trash2,
} from "lucide-react";

import {
  Button,
  LiveRegionAnnouncer,
  useAnnouncer,
  type LiveRegionAnnouncerHandle,
} from "@wowsyler/ds-ui";

const meta: Meta<typeof LiveRegionAnnouncer> = {
  title: "Primitives/Live Region Announcer",
  component: LiveRegionAnnouncer,
};

export default meta;
type Story = StoryObj<typeof LiveRegionAnnouncer>;

type LogTonu = "kibar" | "acil";
interface LogGirdisi {
  id: number;
  metin: string;
  ton: LogTonu;
  saat: string;
}

let sayac = 0;
function simdi(): string {
  return new Date(2026, 6, 14, 10, 24, 0).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** Duyurulari ekranda da gosteren gorsel gunluk (ekran okuyucu simulasyonu). */
function DuyuruGunlugu({ girdiler }: { girdiler: LogGirdisi[] }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Info className="size-3.5" aria-hidden="true" />
        Ekran okuyucuya iletilenler
      </div>
      {girdiler.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          Henüz duyuru yok. Bir işlem tetikleyin.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {girdiler.map((g) => (
            <li
              key={g.id}
              className="flex items-center gap-2 rounded-md bg-background px-2.5 py-1.5 text-sm shadow-sm animate-fade-up"
            >
              <span
                className={
                  g.ton === "acil"
                    ? "inline-flex size-2 shrink-0 rounded-full bg-destructive"
                    : "inline-flex size-2 shrink-0 rounded-full bg-success"
                }
                aria-hidden="true"
              />
              <span className="flex-1 text-foreground">{g.metin}</span>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {g.ton === "acil" ? "assertive" : "polite"}
              </span>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {g.saat}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** useAnnouncer hook'unu kullanan Fisly fatura paneli. */
function FaturaPaneli({
  onLog,
}: {
  onLog: (metin: string, ton: LogTonu) => void;
}) {
  const announcer = useAnnouncer();
  const [kaydediliyor, setKaydediliyor] = React.useState(false);

  const kaydet = () => {
    setKaydediliyor(true);
    const bilgi = "Fatura kaydediliyor…";
    announcer.announce(bilgi, { politeness: "polite" });
    onLog(bilgi, "kibar");
    window.setTimeout(() => {
      setKaydediliyor(false);
      const ok = "Fatura #2026-0148 kaydedildi.";
      announcer.announce(ok, { politeness: "polite" });
      onLog(ok, "kibar");
    }, 900);
  };

  const hata = () => {
    const mesaj = "Kaydetme başarısız: vergi numarası geçersiz.";
    announcer.announce(mesaj, { politeness: "assertive" });
    onLog(mesaj, "acil");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={kaydet} disabled={kaydediliyor}>
        {kaydediliyor ? (
          <Loader2 className="animate-spin" aria-hidden="true" />
        ) : (
          <Save aria-hidden="true" />
        )}
        {kaydediliyor ? "Kaydediliyor" : "Faturayı kaydet"}
      </Button>
      <Button variant="destructive" onClick={hata} disabled={kaydediliyor}>
        <AlertTriangle aria-hidden="true" />
        Hatalı kaydı dene
      </Button>
    </div>
  );
}

/**
 * Hook ile duyuru — Fisly fatura ekranı. useAnnouncer() ile alt bileşen,
 * başarı bilgisini kibar (polite), hatayı acil (assertive) bölgeye yazar.
 */
export const HookIleDuyuru: Story = {
  render: () => {
    const [girdiler, setGirdiler] = React.useState<LogGirdisi[]>([]);
    const log = (metin: string, ton: LogTonu) =>
      setGirdiler((onceki) =>
        [{ id: ++sayac, metin, ton, saat: simdi() }, ...onceki].slice(0, 5)
      );

    return (
      <LiveRegionAnnouncer defaultPoliteness="polite">
        <div className="flex w-[26rem] max-w-full flex-col gap-4">
          <FaturaPaneli onLog={log} />
          <DuyuruGunlugu girdiler={girdiler} />
        </div>
      </LiveRegionAnnouncer>
    );
  },
};

/**
 * Imperative ref API — DeployLens dağıtım durumu. Bileşene verilen ref
 * üzerinden announce() çağrılır; hook'a gerek kalmaz.
 */
export const ImperativeRefApi: Story = {
  render: () => {
    const ref = React.useRef<LiveRegionAnnouncerHandle | null>(null);
    const [girdiler, setGirdiler] = React.useState<LogGirdisi[]>([]);
    const log = (metin: string, ton: LogTonu) =>
      setGirdiler((onceki) =>
        [{ id: ++sayac, metin, ton, saat: simdi() }, ...onceki].slice(0, 5)
      );

    const duyur = (metin: string, ton: LogTonu) => {
      ref.current?.announce(metin, {
        politeness: ton === "acil" ? "assertive" : "polite",
      });
      log(metin, ton);
    };

    return (
      <LiveRegionAnnouncer ref={ref}>
        <div className="flex w-[26rem] max-w-full flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => duyur("Derleme başladı: api-gateway", "kibar")}
            >
              <Loader2 aria-hidden="true" />
              Derlemeyi başlat
            </Button>
            <Button
              onClick={() =>
                duyur("Dağıtım tamamlandı: sürüm v3.8.2 canlıda.", "kibar")
              }
            >
              <Rocket aria-hidden="true" />
              Dağıtımı bitir
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                duyur("Dağıtım geri alındı: sağlık kontrolü düştü.", "acil")
              }
            >
              <AlertTriangle aria-hidden="true" />
              Geri al
            </Button>
          </div>
          <DuyuruGunlugu girdiler={girdiler} />
        </div>
      </LiveRegionAnnouncer>
    );
  },
};

/**
 * Kibar vs. acil — GlowScan cilt analizi. Aynı mesajı force ile tekrar
 * duyurma ve iki nezaket seviyesinin farkını gösterir.
 */
export const KibarVeAcil: Story = {
  render: () => {
    const ref = React.useRef<LiveRegionAnnouncerHandle | null>(null);
    const [girdiler, setGirdiler] = React.useState<LogGirdisi[]>([]);
    const log = (metin: string, ton: LogTonu) =>
      setGirdiler((onceki) =>
        [{ id: ++sayac, metin, ton, saat: simdi() }, ...onceki].slice(0, 6)
      );

    return (
      <LiveRegionAnnouncer ref={ref} clearAfter={5000}>
        <div className="flex w-[26rem] max-w-full flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const m = "Analiz %72 tamamlandı.";
                ref.current?.announce(m, { politeness: "polite" });
                log(m, "kibar");
              }}
            >
              <Info aria-hidden="true" />
              Kibar bilgi
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const m = "Kritik: cihaz kamerası kapalı.";
                ref.current?.announce(m, { politeness: "assertive" });
                log(m, "acil");
              }}
            >
              <AlertTriangle aria-hidden="true" />
              Acil uyarı
            </Button>
            <Button
              onClick={() => {
                const m = "Cilt analizi tamamlandı.";
                ref.current?.announce(m, { politeness: "polite", force: true });
                log(m, "kibar");
              }}
            >
              <CheckCircle2 aria-hidden="true" />
              Aynı mesajı tekrarla
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                ref.current?.clear();
                setGirdiler([]);
              }}
            >
              <Trash2 aria-hidden="true" />
              Temizle
            </Button>
          </div>
          <DuyuruGunlugu girdiler={girdiler} />
          <p className="text-xs text-muted-foreground">
            Bölge {`clearAfter=5000`} ms sonra otomatik temizlenir. Aynı mesaj
            butonu, özdeş metni ekran okuyucuya yeniden seslendirtir.
          </p>
        </div>
      </LiveRegionAnnouncer>
    );
  },
};
