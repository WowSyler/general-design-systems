import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Activity,
  BarChart3,
  Bell,
  Camera,
  History,
  LayoutDashboard,
  LogOut,
  Receipt,
  Rocket,
  ScrollText,
  Settings,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";

import { AdaptiveNavigation } from "@ds/ui";

const meta: Meta<typeof AdaptiveNavigation> = {
  title: "Composites/AdaptiveNavigation",
  component: AdaptiveNavigation,
};

export default meta;
type Story = StoryObj<typeof AdaptiveNavigation>;

type NavItems = React.ComponentProps<typeof AdaptiveNavigation>["items"];

/* -------------------------------------------------------------------------- */
/* Ust navigasyon (topbar) — DeployLens; lg altinda alt cubuga doner          */
/* -------------------------------------------------------------------------- */

function UstNavOrnek() {
  const [aktif, setAktif] = React.useState("dagitimlar");

  const ogeler: NavItems = [
    { id: "panel", icon: <LayoutDashboard />, label: "Panel" },
    { id: "dagitimlar", icon: <Rocket />, label: "Dağıtımlar", badge: 4 },
    { id: "kayitlar", icon: <ScrollText />, label: "Kayıtlar", badge: "9+" },
    { id: "metrikler", icon: <Activity />, label: "Metrikler" },
    { id: "ayarlar", icon: <Settings />, label: "Ayarlar", disabled: true },
  ];

  return (
    <div className="w-full">
      <AdaptiveNavigation
        aria-label="DeployLens ana gezinme"
        desktopVariant="topbar"
        value={aktif}
        onValueChange={setAktif}
        items={ogeler}
        brand={
          <span className="flex items-center gap-2 pr-3 font-display text-base font-semibold text-foreground">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Rocket className="size-4" aria-hidden="true" />
            </span>
            DeployLens
          </span>
        }
        actions={
          <>
            <button
              type="button"
              aria-label="Bildirimler"
              className="relative flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            >
              <Bell className="size-4" aria-hidden="true" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
            </button>
            <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
              OK
            </span>
          </>
        }
      />
      <div className="p-4 text-sm text-muted-foreground sm:p-6">
        <p>
          Seçili bölüm:{" "}
          <span className="font-semibold text-foreground">{aktif}</span>. Tuvali
          daraltın; <span className="font-medium text-foreground">lg</span> (1024px)
          altında bu üst çubuk otomatik olarak alt gezinme cubuğuna döner.
        </p>
      </div>
    </div>
  );
}

export const UstNavigasyon: Story = {
  render: () => <UstNavOrnek />,
};

/* -------------------------------------------------------------------------- */
/* Yan sidebar — Fisly yonetim paneli                                         */
/* -------------------------------------------------------------------------- */

function YanSidebarOrnek() {
  const [aktif, setAktif] = React.useState("faturalar");

  const ogeler: NavItems = [
    { id: "panel", icon: <LayoutDashboard />, label: "Panel" },
    { id: "faturalar", icon: <Receipt />, label: "Faturalar", badge: 12 },
    { id: "cuzdan", icon: <Wallet />, label: "Cüzdan" },
    { id: "raporlar", icon: <BarChart3 />, label: "Raporlar", badge: "Yeni" },
    { id: "ayarlar", icon: <Settings />, label: "Ayarlar" },
  ];

  return (
    <div className="flex h-[520px] max-w-full overflow-hidden rounded-xl border border-border bg-background">
      <AdaptiveNavigation
        aria-label="Fisly ana gezinme"
        desktopVariant="sidebar"
        value={aktif}
        onValueChange={setAktif}
        items={ogeler}
        brand={
          <span className="flex items-center gap-2 font-display text-base font-semibold text-sidebar-foreground">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Wallet className="size-4" aria-hidden="true" />
            </span>
            Fisly
          </span>
        }
        actions={
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
              AY
            </span>
            <span className="min-w-0 flex-1 truncate">
              <span className="block truncate font-medium">Ayşe Yılmaz</span>
              <span className="block truncate text-xs text-sidebar-foreground/60">
                Yönetici
              </span>
            </span>
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
          </button>
        }
      />
      <div className="min-w-0 flex-1 overflow-y-auto p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">
          {ogeler.find((o) => o.id === aktif)?.label}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Bu düzen <span className="font-medium text-foreground">lg</span> (1024px)
          ve üzeri ekranlarda dikey kenar çubuğu olarak görünür. Dar ekranlarda
          alt gezinme çubuğuna dönüşür.
        </p>
      </div>
    </div>
  );
}

export const YanSidebar: Story = {
  render: () => <YanSidebarOrnek />,
};

/* -------------------------------------------------------------------------- */
/* Mobil alt gezinme — GlowScan; yukseltilmis tarama eylemi                    */
/* -------------------------------------------------------------------------- */

function MobilAltOrnek() {
  const [aktif, setAktif] = React.useState("analizler");

  const ogeler: NavItems = [
    { id: "anasayfa", icon: <LayoutDashboard />, label: "Ana Sayfa" },
    { id: "analizler", icon: <Sparkles />, label: "Analizler" },
    { id: "gecmis", icon: <History />, label: "Geçmiş", badge: 3 },
    { id: "profil", icon: <User />, label: "Profil" },
  ];

  return (
    <div className="mx-auto flex h-[560px] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-lg">
      <div className="flex-1 overflow-y-auto p-5">
        <h1 className="font-display text-xl font-semibold text-foreground">
          GlowScan
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Seçili sekme:{" "}
          <span className="font-semibold text-foreground">{aktif}</span>. Ortadaki
          yükseltilmiş buton cilt taraması başlatır. Bu örnek mobil viewport ile
          alt gezinmeyi gösterir.
        </p>
      </div>
      <AdaptiveNavigation
        aria-label="GlowScan ana gezinme"
        value={aktif}
        onValueChange={setAktif}
        items={ogeler}
        mobileCenterAction={<Camera aria-hidden="true" />}
        mobileCenterActionLabel="Cilt taraması başlat"
      />
    </div>
  );
}

export const MobilAltGezinme: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
  },
  render: () => <MobilAltOrnek />,
};
