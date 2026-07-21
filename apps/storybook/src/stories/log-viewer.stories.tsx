import type { Meta, StoryObj } from "@storybook/react-vite";

import { LogViewer } from "@ds/ui";

type LogEntry = React.ComponentProps<typeof LogViewer>["entries"][number];

const meta: Meta<typeof LogViewer> = {
  title: "Composites/LogViewer",
  component: LogViewer,
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LogViewer>;

const dagitimKayitlari: LogEntry[] = [
  { timestamp: "10:24:31", level: "info", source: "build", message: "Dağıtım başlatıldı: üretim ortamı, sürüm v2.8.1" },
  { timestamp: "10:24:31", level: "debug", source: "build", message: "Ortam değişkenleri yüklendi (37 anahtar), önbellek anahtarı fra1-8f3a" },
  { timestamp: "10:24:33", level: "info", source: "build", message: "Bağımlılıklar çözümleniyor: 428 paket, 12 yeni sürüm" },
  { timestamp: "10:24:48", level: "info", source: "build", message: "Derleme adımı çalıştırılıyor: next build" },
  { timestamp: "10:25:02", level: "warn", source: "build", message: "Kullanımdan kaldırılan API tespit edildi: getServerSideProps önbelleği" },
  { timestamp: "10:25:19", level: "debug", source: "build", message: "Statik sayfalar oluşturuluyor (24/24)" },
  { timestamp: "10:25:24", level: "info", source: "build", message: "Görüntü optimizasyonu tamamlandı, 1.2 MB kazanıldı" },
  { timestamp: "10:25:31", level: "error", source: "runtime", message: "Ortam sırrı bulunamadı: STRIPE_SECRET_KEY (bölge: ist1)" },
  { timestamp: "10:25:33", level: "warn", source: "health", message: "Yeniden deneme 1/3: sağlık kontrolü 503 döndürdü" },
  { timestamp: "10:25:41", level: "info", source: "health", message: "Sağlık kontrolü başarılı: /api/health 200 (142 ms)" },
  { timestamp: "10:25:44", level: "info", source: "router", message: "Trafik yeni sürüme yönlendiriliyor: kanarya %10" },
  { timestamp: "10:25:46", level: "debug", source: "cdn", message: "CDN önbelleği geçersiz kılındı: 314 nesne" },
  { timestamp: "10:25:58", level: "warn", source: "runtime", message: "Bellek kullanımı yüksek: 812 MB / 1024 MB" },
  { timestamp: "10:26:12", level: "error", source: "router", message: "Dağıtım kısmen başarısız: 2 bölge zaman aşımına uğradı (ist1, fra1)" },
  { timestamp: "10:26:45", level: "info", source: "router", message: "Dağıtım tamamlandı: 3/5 bölge canlı, toplam süre 2dk 14sn" },
];

export const DagitimAkisi: Story = {
  render: () => (
    <LogViewer
      title="deploylens • üretim-dağıtım • v2.8.1"
      live
      entries={dagitimKayitlari}
    />
  ),
};

export const SorunGiderme: Story = {
  render: () => (
    <LogViewer
      title="deploylens • uyarı ve hatalar"
      entries={dagitimKayitlari}
      defaultLevels={["warn", "error"]}
      emptyMessage="Seçili seviyelerde kayıt yok."
    />
  ),
};

export const SatirSarmaVeAyiklama: Story = {
  render: () => (
    <LogViewer
      title="deploylens • ayrıntılı günlük"
      defaultWrap
      viewportClassName="max-h-96"
      entries={[
        { timestamp: "11:02:07", level: "debug", source: "runtime", message: "İstek izi: GET /api/projeler/8f3a21/dağıtımlar?limit=20&durum=canlı — çözümleyici zinciri: kimlik → oran-sınırı → önbellek → işleyici" },
        { timestamp: "11:02:07", level: "info", source: "runtime", message: "Yanıt 200 döndü (38 ms), önbellek isabeti: HIT" },
        { timestamp: "11:02:09", level: "error", source: "runtime", message: "Yakalanmayan istisna: TypeError: 'undefined' üzerinde 'bolge' özelliği okunamıyor — deployHandler.ts:214 → mapRegions() → normalize() çağrı yığınında oluştu, istek kimliği req_9c2f" },
        { timestamp: "11:02:10", level: "warn", source: "runtime", message: "Devre kesici açıldı: ist1 bölgesi için 5 ardışık hata, 30 sn boyunca istekler fra1 bölgesine yönlendirilecek" },
        { timestamp: "11:02:41", level: "info", source: "health", message: "Devre kesici kapandı: ist1 bölgesi sağlıklı, normal yönlendirme geri yüklendi" },
      ]}
    />
  ),
};
