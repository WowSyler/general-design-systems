import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CalendarCheck,
  CalendarPlus,
  Clock,
  LayoutDashboard,
  Scissors,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  Button,
  Grid,
  PageHeader,
  Section,
  SidebarShell,
  StatCard,
  cn,
} from "@wowsyler/ds-ui";

const meta: Meta<typeof SidebarShell> = {
  title: "Layout/SidebarShell",
  component: SidebarShell,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof SidebarShell>;

const navItems = [
  { label: "Panel", icon: LayoutDashboard, active: true },
  { label: "Rezervasyonlar", icon: CalendarCheck, active: false },
  { label: "Hizmetler", icon: Scissors, active: false },
  { label: "Çalışma Saatleri", icon: Clock, active: false },
  { label: "Marka", icon: Store, active: false },
];

const SidebarNav = () => (
  <div className="flex flex-col gap-1 p-3">
    <div className="mb-4 px-3 pt-3">
      <p className="text-sm font-semibold">Randevu</p>
      <p className="text-xs text-muted-foreground">İşletme Paneli</p>
    </div>
    {navItems.map((item) => (
      <button
        key={item.label}
        type="button"
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
          item.active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <item.icon className="size-4" />
        {item.label}
      </button>
    ))}
  </div>
);

export const Default: Story = {
  render: () => (
    <SidebarShell
      sidebar={<SidebarNav />}
      sidebarFooter={
        <div className="flex items-center gap-3 p-4">
          <Avatar className="size-8">
            <AvatarFallback>EA</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Elif Aydın</p>
            <p className="truncate text-xs text-muted-foreground">
              Salon sahibi
            </p>
          </div>
        </div>
      }
      header={
        <div className="flex w-full items-center justify-between">
          <p className="text-sm font-semibold">Kadıköy Kuaför Salonu</p>
          <Button size="sm">
            <CalendarPlus className="mr-2 size-4" /> Yeni Rezervasyon
          </Button>
        </div>
      }
    >
      <PageHeader
        title="Panel"
        description="Bugünkü rezervasyon durumu ve haftalık performans özeti."
        className="mb-6"
      />
      <Section title="Bugün" description="18 Temmuz 2026, Cumartesi">
        <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="md">
          <StatCard
            label="Bugünkü Randevu"
            value="12"
            delta={{ value: "%20", trend: "up" }}
            icon={<CalendarCheck className="size-4" />}
            footer="Geçen cumartesiye göre"
          />
          <StatCard
            label="Doluluk Oranı"
            value="%86"
            delta={{ value: "%5", trend: "up" }}
            icon={<TrendingUp className="size-4" />}
            footer="09:00 - 20:00 aralığı"
          />
          <StatCard
            label="Yeni Müşteri"
            value="4"
            delta={{ value: "0", trend: "neutral" }}
            icon={<Users className="size-4" />}
            footer="Bu hafta toplam 11"
          />
          <StatCard
            label="İptal"
            value="1"
            delta={{ value: "%50", trend: "down" }}
            icon={<Clock className="size-4" />}
            footer="Son 7 günde 3 iptal"
          />
        </Grid>
      </Section>
    </SidebarShell>
  ),
};

export const LoadingStats: Story = {
  render: () => (
    <SidebarShell
      sidebar={<SidebarNav />}
      header={
        <p className="text-sm font-semibold">Kadıköy Kuaför Salonu</p>
      }
    >
      <PageHeader title="Panel" className="mb-6" />
      <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="md">
        <StatCard label="Bugünkü Randevu" value="" loading />
        <StatCard label="Doluluk Oranı" value="" loading />
        <StatCard label="Yeni Müşteri" value="" loading />
        <StatCard label="İptal" value="" loading />
      </Grid>
    </SidebarShell>
  ),
};
