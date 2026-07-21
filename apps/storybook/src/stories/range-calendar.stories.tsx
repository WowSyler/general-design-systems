import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { RangeCalendar } from "@ds/ui";

type RangeValue = React.ComponentProps<typeof RangeCalendar>["value"];

/** İki tarih arasındaki (dahil) gün sayısı — date-fns'siz. */
function gunFarki(from: Date, to: Date): number {
  const gun = 1000 * 60 * 60 * 24;
  return Math.round((to.getTime() - from.getTime()) / gun) + 1;
}

const meta: Meta<typeof RangeCalendar> = {
  title: "Primitives/Range Calendar",
  component: RangeCalendar,
};

export default meta;
type Story = StoryObj<typeof RangeCalendar>;

/**
 * Randevu rezervasyon ekranına gömülü inline aralık takvimi: müşteri konaklama
 * gibi çok günlü bir hizmet için giriş–çıkış tarihini iki ay yan yana görerek
 * seçer. Seçilen aralık vurgulanır, alt bilgi şeridi gün sayısını özetler.
 */
export const RandevuRezervasyon: Story = {
  render: function Render() {
    const [aralik, setAralik] = React.useState<RangeValue>({
      from: new Date(2026, 6, 20),
      to: new Date(2026, 6, 24),
    });

    return (
      <div className="flex flex-col items-start gap-3">
        <span className="text-sm font-medium text-foreground">
          Rezervasyon tarihleri
        </span>
        <RangeCalendar
          value={aralik}
          onValueChange={setAralik}
          defaultMonth={new Date(2026, 6, 1)}
        />
        <p className="text-sm text-muted-foreground">
          {aralik?.from && aralik.to
            ? `${aralik.from.toLocaleDateString("tr-TR")} – ${aralik.to.toLocaleDateString(
                "tr-TR"
              )} arası rezervasyon oluşturulacak.`
            : "Lütfen giriş ve çıkış tarihini seçin."}
        </p>
      </div>
    );
  },
};

/**
 * Fisly rapor dönemi seçimi: gelecek tarihler kapatılır (yalnızca geçmiş ve
 * bugüne kadar rapor alınabilir) ve gelir grafiğinin dönemi bu aralıktan
 * beslenir. Alt bilgi kapalı tutulup özet dışarıda gösterilir.
 */
export const FislyRaporDonemi: Story = {
  render: function Render() {
    const [donem, setDonem] = React.useState<RangeValue>({
      from: new Date(2026, 5, 1),
      to: new Date(2026, 5, 30),
    });

    const gunSayisi =
      donem?.from && donem.to
        ? gunFarki(donem.from, donem.to)
        : 0;

    return (
      <div className="flex flex-col items-start gap-3">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-foreground">
            Rapor dönemi
          </span>
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
            {gunSayisi > 0 ? `${gunSayisi} günlük dönem` : "Dönem seçilmedi"}
          </span>
        </div>
        <RangeCalendar
          value={donem}
          onValueChange={setDonem}
          defaultMonth={new Date(2026, 5, 1)}
          disabled={{ after: new Date(2026, 6, 19) }}
          showFooter={false}
        />
        <p className="max-w-md text-sm text-muted-foreground">
          Gelecek tarihler devre dışıdır; muhasebe raporu yalnızca kapanmış
          günler için oluşturulabilir.
        </p>
      </div>
    );
  },
};

/**
 * GlowScan cilt analizi kampanyası: geçmiş tarihler kapatılır ve en fazla 7
 * günlük bir kampanya penceresi seçilebilir (max=7). Kısıtlar takvim üzerinde
 * doğrudan uygulanır, kullanıcı sınırı aşan seçim yapamaz.
 */
export const GlowScanKampanyaPenceresi: Story = {
  render: function Render() {
    const [pencere, setPencere] = React.useState<RangeValue>();

    return (
      <div className="flex flex-col items-start gap-3">
        <span className="text-sm font-medium text-foreground">
          Kampanya penceresi (en fazla 7 gün)
        </span>
        <RangeCalendar
          value={pencere}
          onValueChange={setPencere}
          defaultMonth={new Date(2026, 6, 1)}
          disabled={{ before: new Date(2026, 6, 19) }}
          max={7}
        />
        <p className="max-w-md text-sm text-muted-foreground">
          {pencere?.from
            ? "Kampanya süresi 7 günü aşamaz; daha uzun bir aralık otomatik olarak sınırlandırılır."
            : "Başlangıç günü bugün veya sonrası olmalıdır."}
        </p>
      </div>
    );
  },
};
