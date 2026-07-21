import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarFallback } from "@ds/ui";

const meta: Meta<typeof Avatar> = {
  title: "Primitives/Avatar",
  component: Avatar,
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>OK</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar className="size-8">
        <AvatarFallback className="text-xs">EY</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
      <Avatar className="size-14">
        <AvatarFallback className="text-lg">MK</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const EkipListesi: Story = {
  name: "Ekip Listesi",
  render: () => (
    <div className="grid gap-3">
      {[
        { ad: "Elif Yıldız", rol: "Kuaför — Salon Aura", bas: "EY" },
        { ad: "Mert Kaya", rol: "DeployLens — Frontend", bas: "MK" },
        { ad: "Zeynep Arslan", rol: "Fisly — Muhasebe", bas: "ZA" },
      ].map((kisi) => (
        <div key={kisi.ad} className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{kisi.bas}</AvatarFallback>
          </Avatar>
          <div className="grid">
            <span className="text-sm font-medium">{kisi.ad}</span>
            <span className="text-xs text-muted-foreground">{kisi.rol}</span>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Grup: Story = {
  name: "Üst Üste Grup",
  render: () => (
    <div className="flex -space-x-2">
      {["EY", "MK", "ZA", "+4"].map((bas) => (
        <Avatar key={bas} className="ring-2 ring-background">
          <AvatarFallback className="text-xs">{bas}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};
