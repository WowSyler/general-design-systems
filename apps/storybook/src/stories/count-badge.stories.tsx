import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Inbox, Mail, ShoppingCart } from "lucide-react";

import { BadgeOverlay, Button, CountBadge, DotBadge } from "@ds/ui";

const meta: Meta<typeof CountBadge> = {
  title: "Primitives/CountBadge",
  component: CountBadge,
};

export default meta;
type Story = StoryObj<typeof CountBadge>;

export const Varsayilan: Story = {
  args: {
    count: 5,
    variant: "destructive",
    size: "md",
  },
};

/** Renk varyantlari, boyutlar ve ust sinir (max) davranisi. */
export const Varyantlar: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <CountBadge count={3} variant="primary" />
        <CountBadge count={7} variant="destructive" />
        <CountBadge count={12} variant="success" />
      </div>
      <div className="flex items-center gap-3">
        <CountBadge count={8} size="sm" />
        <CountBadge count={8} size="md" />
        <CountBadge count={8} size="lg" />
      </div>
      <div className="flex items-center gap-3">
        <CountBadge count={99} variant="primary" />
        <CountBadge count={128} variant="primary" />
        <CountBadge count={2400} max={999} variant="destructive" />
      </div>
    </div>
  ),
};

/** DotBadge — yalnizca renkli nokta; canli durum icin nabiz (pulse). */
export const Nokta: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <DotBadge variant="primary" />
      <DotBadge variant="destructive" />
      <DotBadge variant="success" />
      <DotBadge variant="destructive" pulse srLabel="Yeni bildirim" />
      <DotBadge variant="success" size="lg" />
    </div>
  ),
};

/** Dolap — sepet ikonunun kosesine binen urun adedi sayaci. */
export const DolapSepetSayaci: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <BadgeOverlay badge={<CountBadge count={3} variant="primary" size="sm" />}>
        <Button variant="outline" size="icon" aria-label="Sepet (3 urun)">
          <ShoppingCart className="size-5" />
        </Button>
      </BadgeOverlay>

      <BadgeOverlay badge={<CountBadge count={128} variant="destructive" />}>
        <Button variant="ghost" size="icon" aria-label="Gelen kutusu">
          <Inbox className="size-5" />
        </Button>
      </BadgeOverlay>

      <BadgeOverlay badge={<CountBadge count={0} showZero variant="success" size="sm" />}>
        <Button variant="secondary" size="icon" aria-label="Mesajlar">
          <Mail className="size-5" />
        </Button>
      </BadgeOverlay>
    </div>
  ),
};

/** DeployLens — zil ikonuna binen okunmamis bildirim noktasi (pulse). */
export const DeployLensBildirimNoktasi: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <BadgeOverlay
        badge={<DotBadge variant="destructive" pulse srLabel="Okunmamis bildirim" />}
      >
        <Button variant="ghost" size="icon" aria-label="Bildirimler">
          <Bell className="size-5" />
        </Button>
      </BadgeOverlay>

      <BadgeOverlay
        position="top-left"
        badge={<DotBadge variant="success" srLabel="Cevrimici" />}
      >
        <Button variant="outline" size="icon" aria-label="Profil durumu">
          <Mail className="size-5" />
        </Button>
      </BadgeOverlay>
    </div>
  ),
};
