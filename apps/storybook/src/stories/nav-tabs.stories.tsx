import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Activity,
  Bell,
  CreditCard,
  Gauge,
  Rocket,
  ScrollText,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";

import { NavTabs, NavTabsList, NavTabsPanel, NavTabsTab } from "@wowsyler/ds-ui";

const meta: Meta<typeof NavTabs> = {
  title: "Composites/NavTabs",
  component: NavTabs,
};

export default meta;
type Story = StoryObj<typeof NavTabs>;

/* -------------------------------------------------------------------------- */
/* Underline (yatay) — DeployLens dagitim detayi                              */
/* -------------------------------------------------------------------------- */

function UnderlineOrnek() {
  const [tab, setTab] = React.useState("dagitimlar");

  return (
    <div className="w-[560px] max-w-full">
      <NavTabs value={tab} onValueChange={setTab} variant="underline">
        <NavTabsList aria-label="Dağıtım detayı">
          <NavTabsTab value="dagitimlar" icon={<Rocket />} badge={12}>
            Dağıtımlar
          </NavTabsTab>
          <NavTabsTab value="kayitlar" icon={<ScrollText />} badge={3}>
            Kayıtlar
          </NavTabsTab>
          <NavTabsTab value="metrikler" icon={<Activity />}>
            Metrikler
          </NavTabsTab>
          <NavTabsTab value="ayarlar" icon={<SlidersHorizontal />} disabled>
            Ayarlar
          </NavTabsTab>
        </NavTabsList>

        <NavTabsPanel value="dagitimlar" className="pt-4">
          <p className="text-sm text-muted-foreground">
            Son 24 saatte <span className="font-semibold text-foreground">12</span>{" "}
            dağıtım tamamlandı. En son <span className="font-medium text-foreground">v2.8.1</span>{" "}
            sürümü <span className="text-success">başarıyla</span> yayına alındı.
          </p>
        </NavTabsPanel>
        <NavTabsPanel value="kayitlar" className="pt-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-warning">3</span> yeni uyarı kaydı var.
            Derleme günlükleri gerçek zamanlı olarak aktarılıyor.
          </p>
        </NavTabsPanel>
        <NavTabsPanel value="metrikler" className="pt-4">
          <p className="text-sm text-muted-foreground">
            P95 yanıt süresi <span className="font-semibold text-foreground">148 ms</span>,
            hata oranı <span className="font-semibold text-foreground">%0,12</span>.
          </p>
        </NavTabsPanel>
      </NavTabs>
    </div>
  );
}

export const UnderlineYatay: Story = {
  render: () => <UnderlineOrnek />,
};

/* -------------------------------------------------------------------------- */
/* Pill (segmentli) — GlowScan analiz gorunumu                                */
/* -------------------------------------------------------------------------- */

function PillOrnek() {
  const [tab, setTab] = React.useState("nem");

  return (
    <div className="w-[480px] max-w-full">
      <NavTabs value={tab} onValueChange={setTab} variant="pill">
        <NavTabsList aria-label="Cilt analizi">
          <NavTabsTab value="nem" icon={<Gauge />}>
            Nem
          </NavTabsTab>
          <NavTabsTab value="gozenek" icon={<Activity />} badge="Yeni">
            Gözenek
          </NavTabsTab>
          <NavTabsTab value="pigment" icon={<SlidersHorizontal />}>
            Pigment
          </NavTabsTab>
        </NavTabsList>

        <NavTabsPanel value="nem" className="pt-4">
          <p className="text-sm text-muted-foreground">
            Nem skoru <span className="font-semibold text-foreground">72/100</span>. Bir
            önceki taramaya göre <span className="text-success">+6 puan</span> iyileşme.
          </p>
        </NavTabsPanel>
        <NavTabsPanel value="gozenek" className="pt-4">
          <p className="text-sm text-muted-foreground">
            T bölgesinde gözenek yoğunluğu orta seviyede. Yeni yapay zekâ modeli daha
            hassas ölçüm sunuyor.
          </p>
        </NavTabsPanel>
        <NavTabsPanel value="pigment" className="pt-4">
          <p className="text-sm text-muted-foreground">
            Pigment dağılımı dengeli görünüyor; güneş koruması önerisi aktif.
          </p>
        </NavTabsPanel>
      </NavTabs>
    </div>
  );
}

export const PillSegmentli: Story = {
  render: () => <PillOrnek />,
};

/* -------------------------------------------------------------------------- */
/* Dikey ayarlar rail + underline yatay icerik (spec ornegi)                  */
/* -------------------------------------------------------------------------- */

function DikeyAyarlarOrnek() {
  const [bolum, setBolum] = React.useState("profil");

  return (
    <div className="w-[600px] max-w-full">
      <NavTabs
        value={bolum}
        onValueChange={setBolum}
        variant="underline"
        orientation="vertical"
      >
        <NavTabsList aria-label="Hesap ayarları" className="w-32 shrink-0 sm:w-44">
          <NavTabsTab value="profil" icon={<UserRound />}>
            Profil
          </NavTabsTab>
          <NavTabsTab value="bildirimler" icon={<Bell />} badge={5}>
            Bildirimler
          </NavTabsTab>
          <NavTabsTab value="odeme" icon={<CreditCard />}>
            Ödeme
          </NavTabsTab>
          <NavTabsTab value="guvenlik" icon={<ShieldCheck />}>
            Güvenlik
          </NavTabsTab>
        </NavTabsList>

        <NavTabsPanel value="profil">
          <h3 className="text-sm font-semibold text-foreground">Profil bilgileri</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Fisly hesabınızın görünen adını ve iletişim e-postasını buradan
            güncelleyebilirsiniz.
          </p>
        </NavTabsPanel>
        <NavTabsPanel value="bildirimler">
          <h3 className="text-sm font-semibold text-foreground">Bildirim tercihleri</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Okunmamış <span className="font-semibold text-foreground">5</span> tercih
            değişikliği bekliyor. Fatura hatırlatmaları e-posta ile gönderilir.
          </p>
        </NavTabsPanel>
        <NavTabsPanel value="odeme">
          <h3 className="text-sm font-semibold text-foreground">Ödeme yöntemi</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Kayıtlı kart: <span className="font-medium text-foreground">•••• 4821</span>.
            Bir sonraki tahsilat 1 Ağustos 2026 tarihinde yapılacak.
          </p>
        </NavTabsPanel>
        <NavTabsPanel value="guvenlik">
          <h3 className="text-sm font-semibold text-foreground">Güvenlik</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            İki adımlı doğrulama <span className="text-success">etkin</span>. Son giriş:
            19 Temmuz 2026, İstanbul.
          </p>
        </NavTabsPanel>
      </NavTabs>
    </div>
  );
}

export const DikeyAyarlar: Story = {
  render: () => <DikeyAyarlarOrnek />,
};

/* -------------------------------------------------------------------------- */
/* Enclosed (klasor) — items prop ile veri odakli                             */
/* -------------------------------------------------------------------------- */

type NavTabsItems = React.ComponentProps<typeof NavTabsList>["items"];

function EnclosedOrnek() {
  const [tab, setTab] = React.useState("tumu");

  const sekmeler: NavTabsItems = [
    { value: "tumu", label: "Tümü", icon: <ScrollText />, badge: 48 },
    { value: "aktif", label: "Aktif", icon: <Rocket />, badge: 9 },
    { value: "arsiv", label: "Arşiv", icon: <SlidersHorizontal /> },
  ];

  return (
    <div className="w-[520px] max-w-full">
      <NavTabs value={tab} onValueChange={setTab} variant="enclosed">
        <NavTabsList aria-label="Randevu listesi" items={sekmeler} />

        <NavTabsPanel
          value="tumu"
          className="rounded-b-lg rounded-tr-lg border border-t-0 border-border p-4"
        >
          <p className="text-sm text-muted-foreground">
            Toplam <span className="font-semibold text-foreground">48</span> randevu.
            Bugün <span className="font-medium text-foreground">7</span> yeni talep geldi.
          </p>
        </NavTabsPanel>
        <NavTabsPanel
          value="aktif"
          className="rounded-b-lg rounded-tr-lg border border-t-0 border-border p-4"
        >
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">9</span> aktif randevu
            onay bekliyor.
          </p>
        </NavTabsPanel>
        <NavTabsPanel
          value="arsiv"
          className="rounded-b-lg rounded-tr-lg border border-t-0 border-border p-4"
        >
          <p className="text-sm text-muted-foreground">
            Arşivlenen randevular 12 ay boyunca saklanır.
          </p>
        </NavTabsPanel>
      </NavTabs>
    </div>
  );
}

export const EnclosedKlasor: Story = {
  render: () => <EnclosedOrnek />,
};
