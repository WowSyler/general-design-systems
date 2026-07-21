import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarCheck, Receipt, Sparkles, XCircle } from "lucide-react";

import { ActivityFeed } from "@ds/ui";

const meta: Meta<typeof ActivityFeed> = {
  title: "Data/ActivityFeed",
  component: ActivityFeed,
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ActivityFeed>;

export const FislyEtkinlikleri: Story = {
  args: {
    items: [
      {
        icon: <Receipt className="size-4" />,
        title: "Yeni fiş eklendi",
        description: "Migros — ₺342,80 tutarında market fişi tarandı.",
        time: "2 dk önce",
        tone: "success",
      },
      {
        title: "Bütçe uyarısı",
        description: "Yemek kategorisinde aylık limitin %85'ine ulaşıldı.",
        time: "1 sa önce",
        tone: "warning",
      },
      {
        icon: <XCircle className="size-4" />,
        title: "Fiş okunamadı",
        description: "Fotoğraf bulanık; lütfen fişi yeniden tarayın.",
        time: "3 sa önce",
        tone: "destructive",
      },
      {
        title: "Aylık rapor hazır",
        description: "Haziran gider raporunuz görüntülenmeye hazır.",
        time: "Dün",
      },
    ],
  },
};

export const RandevuAkisi: Story = {
  args: {
    items: [
      {
        icon: <CalendarCheck className="size-4" />,
        title: "Randevu onaylandı",
        description: "Ayşe Yılmaz — Saç kesimi, 14:30.",
        time: "5 dk önce",
        tone: "success",
      },
      {
        icon: <Sparkles className="size-4" />,
        title: "Yeni değerlendirme",
        description: "Elif K. salonunuza 5 yıldız verdi.",
        time: "42 dk önce",
      },
      {
        title: "Randevu iptal edildi",
        description: "Mehmet D. yarınki 11:00 randevusunu iptal etti.",
        time: "2 sa önce",
        tone: "destructive",
      },
    ],
  },
};
