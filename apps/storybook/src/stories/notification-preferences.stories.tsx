import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Mail, MessageSquare, Slack, Smartphone } from "lucide-react";

import { NotificationPreferences } from "@wowsyler/ds-ui";

const meta: Meta<typeof NotificationPreferences> = {
  title: "Composites/NotificationPreferences",
  component: NotificationPreferences,
};

export default meta;
type Story = StoryObj<typeof NotificationPreferences>;

type PrefValue = React.ComponentProps<typeof NotificationPreferences>["value"];
type Channels = React.ComponentProps<typeof NotificationPreferences>["channels"];
type Sections = React.ComponentProps<typeof NotificationPreferences>["sections"];

/* ------------------------------- Randevu -------------------------------- */

const randevuKanallari: Channels = [
  { id: "email", label: "E-posta", icon: <Mail className="size-4" />, srLabel: "E-posta" },
  { id: "push", label: "Push", icon: <Bell className="size-4" />, srLabel: "Anlık bildirim" },
  { id: "sms", label: "SMS", icon: <MessageSquare className="size-4" />, srLabel: "SMS" },
];

const randevuBolumleri: Sections = [
  {
    id: "randevular",
    title: "Randevular",
    description: "Yaklaşan ve değişen randevularınla ilgili bilgilendirmeler.",
    rows: [
      {
        id: "hatirlatma",
        label: "Randevu hatırlatma",
        description: "Randevudan 24 saat ve 1 saat önce hatırlatırız.",
      },
      {
        id: "onay",
        label: "Randevu onayı",
        description: "İşletme randevunu onayladığında bildirilir.",
      },
      {
        id: "degisiklik",
        label: "İptal ve değişiklik",
        description: "Saat değişikliği veya iptal durumunda anında haber ver.",
      },
    ],
  },
  {
    id: "pazarlama",
    title: "Kampanyalar",
    description: "Fırsatlar ve yeni hizmet duyuruları.",
    rows: [
      {
        id: "kampanya",
        label: "İndirim kampanyaları",
        description: "Sık gittiğin işletmelerden özel teklifler.",
      },
      {
        id: "yeni-hizmet",
        label: "Yeni hizmetler",
        // SMS ile pazarlama mesaji gonderilmez.
        disabledChannels: ["sms"],
      },
    ],
  },
  {
    id: "guvenlik",
    title: "Hesap ve güvenlik",
    rows: [
      {
        id: "oturum",
        label: "Oturum açma uyarısı",
        description: "Yeni bir cihazdan giriş yapıldığında bildir.",
      },
      {
        id: "sifre",
        label: "Şifre değişikliği",
        description: "Güvenlik amaçlı bu bildirim kapatılamaz.",
        // Kritik guvenlik bildirimi push ile de gonderilmez, sadece dogrulanmis kanallar.
        disabledChannels: ["push"],
      },
    ],
  },
];

function RandevuOrnek() {
  const [value, setValue] = React.useState<PrefValue>({
    hatirlatma: { email: true, push: true, sms: true },
    onay: { email: true, push: true, sms: false },
    degisiklik: { email: true, push: true, sms: true },
    kampanya: { email: true, push: false, sms: false },
    "yeni-hizmet": { email: false, push: false },
    oturum: { email: true, push: true, sms: true },
    sifre: { email: true, sms: true },
  });

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Bildirim tercihleri</h2>
        <p className="text-sm text-muted-foreground">
          Randevu uygulamasından hangi bilgilendirmeleri nereden alacağını seç.
        </p>
      </div>
      <NotificationPreferences
        channels={randevuKanallari}
        sections={randevuBolumleri}
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}

export const RandevuTercihleri: Story = {
  render: () => <RandevuOrnek />,
};

/* ------------------------------- GlowScan ------------------------------- */

const glowScanKanallari: Channels = [
  { id: "email", label: "E-posta", icon: <Mail className="size-4" />, srLabel: "E-posta" },
  { id: "push", label: "Push", icon: <Smartphone className="size-4" />, srLabel: "Anlık bildirim" },
];

function GlowScanOrnek() {
  const [value, setValue] = React.useState<PrefValue>({
    "analiz-hazir": { email: true, push: true },
    "haftalik-rapor": { email: true, push: false },
    "cilt-rutini": { email: false, push: true },
    "urun-onerisi": { email: true, push: false },
    guvenlik: { email: true, push: true },
  });

  return (
    <div className="max-w-xl">
      <NotificationPreferences
        channels={glowScanKanallari}
        rowHeaderLabel="Bildirim"
        sections={[
          {
            id: "cilt",
            title: "Cilt takibi",
            description: "GlowScan analiz sonuçların hazır olduğunda haber verelim.",
            rows: [
              {
                id: "analiz-hazir",
                label: "Analiz hazır",
                description: "Yeni cilt taraman işlendiğinde bildirilir.",
              },
              {
                id: "haftalik-rapor",
                label: "Haftalık rapor",
                description: "Cilt skorundaki değişimin özeti.",
              },
              {
                id: "cilt-rutini",
                label: "Rutin hatırlatıcı",
                description: "Günlük bakım adımların için nazik dürtme.",
              },
            ],
          },
          {
            id: "oneriler",
            title: "Öneriler",
            rows: [
              {
                id: "urun-onerisi",
                label: "Ürün önerileri",
                description: "Cilt tipine uygun kişisel öneriler.",
              },
            ],
          },
          {
            id: "hesap",
            title: "Güvenlik",
            rows: [
              {
                id: "guvenlik",
                label: "Güvenlik uyarıları",
                description: "Hesabınla ilgili önemli güvenlik olayları.",
              },
            ],
          },
        ]}
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}

export const GlowScanIkiKanal: Story = {
  render: () => <GlowScanOrnek />,
};

/* ------------------------------ DeployLens ------------------------------ */

const deployLensKanallari: Channels = [
  { id: "email", label: "E-posta", icon: <Mail className="size-4" />, srLabel: "E-posta" },
  { id: "push", label: "Push", icon: <Bell className="size-4" />, srLabel: "Anlık bildirim" },
  { id: "slack", label: "Slack", icon: <Slack className="size-4" />, srLabel: "Slack" },
];

function DeployLensOrnek() {
  const [value, setValue] = React.useState<PrefValue>({
    "dagitim-basarisiz": { email: true, push: true, slack: true },
    "dagitim-basarili": { email: false, push: false, slack: true },
    "kullanim-esigi": { email: true, push: true, slack: true },
    "erisim-uyarisi": { email: true, push: true },
  });

  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-sm text-muted-foreground">
        DeployLens ekip bildirimleri — kritik olayları Slack kanalına, günlük özetleri
        e-postaya yönlendir.
      </p>
      <NotificationPreferences
        channels={deployLensKanallari}
        rowHeaderLabel="Olay"
        caption="DeployLens dağıtım ve güvenlik bildirim tercihleri"
        sections={[
          {
            id: "dagitimlar",
            title: "Dağıtımlar",
            description: "Üretim ortamına yapılan her dağıtımın durumu.",
            rows: [
              {
                id: "dagitim-basarisiz",
                label: "Başarısız dağıtım",
                description: "Bir dağıtım hata verdiğinde derhal uyar.",
              },
              {
                id: "dagitim-basarili",
                label: "Başarılı dağıtım",
                description: "Yayına alınan sürümlerin özeti.",
              },
            ],
          },
          {
            id: "uyarilar",
            title: "İzleme uyarıları",
            rows: [
              {
                id: "kullanim-esigi",
                label: "Kullanım eşiği aşıldı",
                description: "CPU veya bellek eşiği aşıldığında haber ver.",
              },
              {
                id: "erisim-uyarisi",
                label: "Şüpheli erişim",
                description: "Olağandışı oturum açma girişimleri.",
                // Guvenlik uyarilari paylasimli Slack kanalina dusmez.
                disabledChannels: ["slack"],
              },
            ],
          },
        ]}
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}

export const DeployLensEkipBildirimleri: Story = {
  render: () => <DeployLensOrnek />,
};
