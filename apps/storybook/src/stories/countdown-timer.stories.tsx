import type { Meta, StoryObj } from "@storybook/react-vite";

import { CountdownTimer } from "@ds/ui";
import { CalendarClock, Flame, Receipt } from "lucide-react";

const meta: Meta<typeof CountdownTimer> = {
  title: "Iconic/CountdownTimer",
  component: CountdownTimer,
};

export default meta;
type Story = StoryObj<typeof CountdownTimer>;

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Hedef tarihi "su andan itibaren" hesaplar ki geri sayim gercekten aksin. */
const inFuture = (ms: number) => new Date(Date.now() + ms);

/** Dolap flash kampanyasi — buyuk kutucuklar, gun/saat/dakika/saniye. */
export const DolapFlashKampanya: Story = {
  render: () => (
    <div className="space-y-3 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        Flash indirim bitmeden kap
      </p>
      <CountdownTimer
        to={inFuture(1 * DAY + 6 * HOUR + 42 * MINUTE + 18 * SECOND)}
        size="lg"
        onComplete={() => {}}
      />
    </div>
  ),
};

/** Randevu geri sayimi — kompakt inline rozet, "randevuna X kaldi". */
export const RandevuGeriSayim: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <span className="text-sm text-foreground">Randevunuza kalan süre:</span>
      <CountdownTimer
        variant="inline"
        hideDays
        to={inFuture(2 * HOUR + 15 * MINUTE + 40 * SECOND)}
      />
    </div>
  ),
};

/** Fisly banner — marka gradyanli bant, ikon + baslik + aciklama. */
export const FislyBanner: Story = {
  render: () => (
    <div className="max-w-2xl">
      <CountdownTimer
        variant="banner"
        size="sm"
        icon={<Receipt aria-hidden="true" />}
        title="e-Fatura beyan süresi"
        description="Dönem sonuna kadar tüm faturalarınızı gönderin"
        to={inFuture(3 * DAY + 4 * HOUR + 9 * MINUTE)}
      />
    </div>
  ),
};

/** GlowScan kampanya — az kalan, gun gizli, saat:dakika:saniye kutulari. */
export const SonKalanSaatler: Story = {
  render: () => (
    <CountdownTimer
      hideDays
      icon={<Flame aria-hidden="true" />}
      to={inFuture(3 * HOUR + 27 * MINUTE + 5 * SECOND)}
    />
  ),
};

/** Bitmis geri sayim — "Sona erdi" durumu (hedef gecmiste). */
export const SonaErdi: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <CountdownTimer to={inFuture(-1 * MINUTE)} onComplete={() => {}} />
      <CountdownTimer
        variant="banner"
        icon={<CalendarClock aria-hidden="true" />}
        title="Erken kayıt dönemi"
        description="Yeni dönem başvuruları yakında"
        completedLabel="Süre doldu"
        to={inFuture(-1 * DAY)}
      />
    </div>
  ),
};
