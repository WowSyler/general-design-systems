import type { Meta, StoryObj } from "@storybook/react";
import { Bell, CalendarCheck, Star, XCircle } from "lucide-react";

import { NotificationItem, NotificationList } from "@ds/ui";

const meta: Meta<typeof NotificationList> = {
  title: "Composites/NotificationList",
  component: NotificationList,
};

export default meta;
type Story = StoryObj<typeof NotificationList>;

export const RandevuBildirimleri: Story = {
  render: () => (
    <NotificationList className="max-w-md">
      <NotificationItem
        icon={<CalendarCheck className="size-4" />}
        title="Randevunuz onaylandı"
        description="Ayşe Kuaför — yarın 14:30, saç kesimi ve fön."
        time="5 dk"
        unread
      />
      <NotificationItem
        icon={<Bell className="size-4" />}
        title="Randevu hatırlatması"
        description="Bugün 16:00'daki manikür randevunuza 2 saat kaldı."
        time="2 sa"
        unread
      />
      <NotificationItem
        icon={<Star className="size-4" />}
        title="Deneyiminizi değerlendirin"
        description="Geçen haftaki cilt bakımı randevunuz nasıldı?"
        time="1 g"
      />
      <NotificationItem
        icon={<XCircle className="size-4" />}
        title="Randevu iptal edildi"
        description="Berber Salih 12 Temmuz randevunuzu iptal etti."
        time="3 g"
      />
    </NotificationList>
  ),
};

export const TekBildirim: Story = {
  render: () => (
    <NotificationList className="max-w-md">
      <NotificationItem
        title="Aylık raporunuz hazır"
        description="Haziran gider özetinizi görüntüleyin."
        time="Şimdi"
        unread
      />
    </NotificationList>
  ),
};
