import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BarChart3,
  CalendarDays,
  LayoutGrid,
  Search,
  Settings,
  Users,
} from "lucide-react";

import { TabletFrame } from "@ds/ui";

const meta: Meta<typeof TabletFrame> = {
  title: "Composites/TabletFrame",
  component: TabletFrame,
};

export default meta;
type Story = StoryObj<typeof TabletFrame>;

const navItems = [
  { icon: <LayoutGrid className="size-5" />, label: "Panel", active: true },
  { icon: <BarChart3 className="size-5" />, label: "Raporlar" },
  { icon: <Users className="size-5" />, label: "Ekip" },
  { icon: <CalendarDays className="size-5" />, label: "Takvim" },
  { icon: <Settings className="size-5" />, label: "Ayarlar" },
];

export const DikeyPanel: Story = {
  render: () => (
    <TabletFrame orientation="portrait">
      <header className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <p className="text-xs text-muted-foreground">Genel Bakış</p>
          <h2 className="text-lg font-semibold">Yönetim Paneli</h2>
        </div>
        <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Search className="size-4" />
        </span>
      </header>
      <div className="grid flex-1 grid-cols-2 gap-3 p-5">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Aktif Kullanıcı</p>
          <p className="mt-1 text-2xl font-semibold">12.480</p>
          <p className="text-xs text-success">%8 artış</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Gelir</p>
          <p className="mt-1 text-2xl font-semibold">₺84.2K</p>
          <p className="text-xs text-success">%3 artış</p>
        </div>
        <div className="col-span-2 rounded-xl border bg-card p-4">
          <p className="text-sm font-medium">Haftalık Etkinlik</p>
          <div className="mt-3 flex h-24 items-end gap-2">
            {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-primary/80"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </TabletFrame>
  ),
};

export const YatayGosterge: Story = {
  render: () => (
    <TabletFrame orientation="landscape">
      <div className="flex flex-1">
        <aside className="flex w-44 flex-col gap-1 border-r bg-muted/40 p-3">
          <p className="px-2 pb-2 text-xs font-medium text-muted-foreground">
            Menü
          </p>
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                item.active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </aside>
        <main className="flex-1 p-5">
          <h2 className="text-lg font-semibold">Satış Göstergesi</h2>
          <p className="text-sm text-muted-foreground">Son 30 gün</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {["Sipariş", "İade", "Ortalama"].map((label, i) => (
              <div key={label} className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-xl font-semibold">
                  {[3200, 148, "₺612"][i]}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </TabletFrame>
  ),
};

export const KucukDikey: Story = {
  render: () => (
    <TabletFrame orientation="portrait" size="sm">
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <LayoutGrid className="size-7" />
        </span>
        <h2 className="text-base font-semibold">Uygulama Önizlemesi</h2>
        <p className="text-xs text-muted-foreground">
          İçeriğiniz tablet ekran alanında akışkan biçimde ölçeklenir
        </p>
      </div>
    </TabletFrame>
  ),
};
