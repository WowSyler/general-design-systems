import type { Meta, StoryObj } from "@storybook/react-vite";

import { FaceScanOverlay } from "@ds/ui";

const meta: Meta<typeof FaceScanOverlay> = {
  title: "Composites/Face Scan Overlay",
  component: FaceScanOverlay,
};
export default meta;

type Story = StoryObj<typeof FaceScanOverlay>;

/**
 * GlowScan yakalama ekraninin baslangic hali: kullanici yuzunu
 * ovale hizalamaya davet edilir.
 */
export const Hizalama: Story = {
  render: () => (
    <div className="w-[320px]">
      <FaceScanOverlay status="aligning" />
    </div>
  ),
};

/**
 * Analiz asamasi: tarama cizgisi ovalin icinde yukari-asagi suzulur,
 * durum metni "Analiz ediliyor..." olur ve ilerleme cubugu gorunur.
 */
export const AnalizEdiliyor: Story = {
  render: () => (
    <div className="w-[320px]">
      <FaceScanOverlay status="scanning" progress={62} />
    </div>
  ),
};

/**
 * Fotograf/kamera onizlemesi uzerine binen overlay. Arka plan gradyani
 * gercek bir kamera akisini temsil eder; cerceve ve durum metni her
 * zeminde okunur kalir.
 */
export const KameraUzerinde: Story = {
  render: () => (
    <div className="w-[320px]">
      <FaceScanOverlay
        status="scanning"
        progress={38}
        statusText="Cilt tonu ölçülüyor..."
        media={
          <div className="size-full bg-gradient-to-br from-chart-1/40 via-muted to-chart-4/40" />
        }
      />
    </div>
  ),
};

/**
 * Sonuc durumlari yan yana: basarili dogrulama (yesil) ve algilanamayan
 * yuz (kirmizi) hallerinin cerceve rengi ve ikonlariyla karsilastirmasi.
 */
export const Sonuclar: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <div className="w-[280px]">
        <FaceScanOverlay status="success" statusText="Cilt analizi hazır" />
      </div>
      <div className="w-[280px]">
        <FaceScanOverlay status="error" />
      </div>
    </div>
  ),
};
