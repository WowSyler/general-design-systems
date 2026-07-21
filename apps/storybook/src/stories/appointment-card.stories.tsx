import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppointmentCard } from "@ds/ui";

const meta: Meta<typeof AppointmentCard> = {
  title: "Composites/AppointmentCard",
  component: AppointmentCard,
};

export default meta;
type Story = StoryObj<typeof AppointmentCard>;

export const Onaylandi: Story = {
  args: {
    date: new Date(2026, 6, 22, 14, 30),
    service: "Saç Kesimi & Fön",
    staffName: "Ayşe Yıldız",
    staffRole: "Kıdemli Kuaför",
    duration: "45 dk",
    location: "Kadıköy Şubesi",
    status: "confirmed",
    onReschedule: () => {},
    onCancel: () => {},
  },
};

export const Bekliyor: Story = {
  args: {
    date: new Date(2026, 6, 24, 10, 0),
    service: "Cilt Bakımı Seansı",
    staffName: "Zeynep Aksoy",
    staffRole: "Estetisyen",
    duration: "1 sa 15 dk",
    location: "Nişantaşı Şubesi",
    status: "pending",
    onReschedule: () => {},
    onCancel: () => {},
  },
};

export const Iptal: Story = {
  args: {
    date: new Date(2026, 6, 18, 16, 45),
    service: "Sakal Tıraşı & Şekillendirme",
    staffName: "Mehmet Kaya",
    staffRole: "Berber",
    duration: "30 dk",
    location: "Beşiktaş Şubesi",
    status: "cancelled",
  },
};

export const GunlukListe: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-3">
      <AppointmentCard
        date={new Date(2026, 6, 22, 9, 30)}
        service="Saç Kesimi & Fön"
        staffName="Ayşe Yıldız"
        staffRole="Kıdemli Kuaför"
        duration="45 dk"
        location="Kadıköy Şubesi"
        status="confirmed"
        onReschedule={() => {}}
        onCancel={() => {}}
      />
      <AppointmentCard
        date={new Date(2026, 6, 22, 11, 0)}
        service="Manikür & Kalıcı Oje"
        staffName="Elif Demir"
        staffRole="Tırnak Uzmanı"
        duration="1 sa"
        location="Kadıköy Şubesi"
        status="pending"
        onReschedule={() => {}}
        onCancel={() => {}}
      />
      <AppointmentCard
        date={new Date(2026, 6, 22, 13, 15)}
        service="Sakal Tıraşı & Şekillendirme"
        staffName="Mehmet Kaya"
        staffRole="Berber"
        duration="30 dk"
        location="Kadıköy Şubesi"
        status="cancelled"
      />
    </div>
  ),
};

export const Yukleniyor: Story = {
  args: {
    date: new Date(2026, 6, 22, 14, 30),
    service: "Saç Kesimi & Fön",
    staffName: "Ayşe Yıldız",
    duration: "45 dk",
    location: "Kadıköy Şubesi",
    status: "confirmed",
    loading: true,
  },
};
