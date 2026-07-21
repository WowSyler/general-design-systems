import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CalendarCheck,
  CalendarDays,
  LayoutDashboard,
  Scissors,
  Settings,
  Users,
} from "lucide-react";

import {
  Separator,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@ds/ui";

const meta: Meta<typeof Sidebar> = {
  title: "Primitives/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const navItems = [
  { title: "Panel", icon: LayoutDashboard, active: true, badge: undefined },
  { title: "Rezervasyonlar", icon: CalendarDays, active: false, badge: "12" },
  { title: "Hizmetler", icon: Scissors, active: false, badge: undefined },
  { title: "Kaynaklar", icon: Users, active: false, badge: undefined },
  { title: "Ayarlar", icon: Settings, active: false, badge: undefined },
];

function RandevuSidebarDemo({
  collapsible,
  defaultOpen,
}: {
  collapsible?: "offcanvas" | "icon" | "none";
  defaultOpen?: boolean;
}) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar collapsible={collapsible}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <CalendarCheck className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Randevu</span>
                  <span className="text-xs text-muted-foreground">
                    Salon Admin
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Yönetim</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.active} tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.badge ? (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Panel</span>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Bugünkü randevular</p>
              <p className="text-2xl font-semibold">18</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Doluluk oranı</p>
              <p className="text-2xl font-semibold">%86</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Bekleyen onay</p>
              <p className="text-2xl font-semibold">4</p>
            </div>
          </div>
          <div className="min-h-64 flex-1 rounded-xl border border-dashed" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const Default: Story = {
  render: () => <RandevuSidebarDemo />,
};

export const IconCollapsed: Story = {
  render: () => <RandevuSidebarDemo collapsible="icon" defaultOpen={false} />,
};
