import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  WeekCalendar,
  type WeekCalendarDay,
  type WeekCalendarEvent,
} from "@ds/ui";

const meta: Meta<typeof WeekCalendar> = {
  title: "Composites/WeekCalendar",
  component: WeekCalendar,
};

export default meta;
type Story = StoryObj<typeof WeekCalendar>;

const days: WeekCalendarDay[] = [
  { key: "pzt", label: "Pzt 13" },
  { key: "sal", label: "Sal 14" },
  { key: "car", label: "Çar 15" },
  { key: "per", label: "Per 16" },
  { key: "cum", label: "Cum 17" },
  { key: "cmt", label: "Cmt 18" },
  { key: "paz", label: "Paz 19" },
];

const events: WeekCalendarEvent[] = [
  {
    id: "e1",
    dayKey: "pzt",
    startMinutes: 9 * 60 + 30,
    durationMinutes: 60,
    title: "Ayşe Yılmaz · Saç Kesimi",
    status: "completed",
  },
  {
    id: "e2",
    dayKey: "pzt",
    startMinutes: 14 * 60,
    durationMinutes: 90,
    title: "Elif Demir · Manikür + Pedikür",
    status: "completed",
  },
  {
    id: "e3",
    dayKey: "sal",
    startMinutes: 11 * 60,
    durationMinutes: 60,
    title: "Zeynep Kaya · Cilt Bakımı",
    status: "noshow",
  },
  {
    id: "e4",
    dayKey: "car",
    startMinutes: 10 * 60,
    durationMinutes: 120,
    title: "Merve Şahin · Saç Boyama",
    status: "confirmed",
  },
  {
    id: "e5",
    dayKey: "per",
    startMinutes: 13 * 60 + 30,
    durationMinutes: 60,
    title: "Selin Arslan · Kaş Tasarımı",
    status: "cancelled",
  },
  {
    id: "e6",
    dayKey: "cum",
    startMinutes: 9 * 60,
    durationMinutes: 90,
    title: "Deniz Koç · Keratin Bakımı",
    status: "confirmed",
  },
  {
    id: "e7",
    dayKey: "cmt",
    startMinutes: 15 * 60,
    durationMinutes: 60,
    title: "Buse Aydın · Saç Kesimi",
    status: "pending",
  },
  {
    id: "e8",
    dayKey: "cmt",
    startMinutes: 16 * 60 + 30,
    durationMinutes: 60,
    title: "İrem Çetin · Fön",
    status: "pending",
  },
];

export const HaftalikGorunum: Story = {
  args: {
    days,
    events,
    startHour: 9,
    endHour: 18,
    slotMinutes: 60,
  },
};

export const TiklanabilirRandevular: Story = {
  args: {
    days,
    events,
    startHour: 9,
    endHour: 18,
    slotMinutes: 60,
    onEventClick: (id: string) => {
      console.log("Randevu detayı:", id);
    },
  },
};

export const YarimSaatlikAralik: Story = {
  args: {
    days: days.slice(0, 5),
    events: events.filter((event) =>
      ["pzt", "sal", "car", "per", "cum"].includes(event.dayKey),
    ),
    startHour: 9,
    endHour: 16,
    slotMinutes: 30,
  },
};
