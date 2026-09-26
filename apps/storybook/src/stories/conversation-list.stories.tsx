import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { ConversationList, ConversationListItem } from "@wowsyler/ds-ui";

const meta: Meta<typeof ConversationList> = {
  title: "Composites/Conversation List",
  component: ConversationList,
};

export default meta;
type Story = StoryObj<typeof ConversationList>;

type Presence = React.ComponentProps<typeof ConversationListItem>["status"];

type Konusma = {
  id: string;
  ad: string;
  bas: string;
  durum: Presence;
  onizleme: string;
  zaman: string;
  okunmamis?: number;
  giden?: boolean;
  urun?: string;
  urunAlt?: string;
};

/** Dolap mesajlari: her konusma bir ilanla eslesir, urun kucukresmi sagda. */
export const DolapMesajlari: Story = {
  render: () => {
    const konusmalar: Konusma[] = [
      {
        id: "1",
        ad: "Selin Aksoy",
        bas: "SA",
        durum: "online",
        onizleme: "Ceket hâlâ satılık mı? Bugün alabilirim 😊",
        zaman: "14:32",
        okunmamis: 3,
        urun: "https://picsum.photos/seed/dolap-ceket/120",
        urunAlt: "Vintage deri ceket",
      },
      {
        id: "2",
        ad: "Kerem Doğan",
        bas: "KD",
        durum: "busy",
        onizleme: "Sen: Kargoyu bugün veriyorum, takip no'yu atarım.",
        zaman: "13:05",
        giden: true,
        urun: "https://picsum.photos/seed/dolap-ayakkabi/120",
        urunAlt: "Spor ayakkabı",
      },
      {
        id: "3",
        ad: "Ece Yıldırım",
        bas: "EY",
        durum: "away",
        onizleme: "Pazarlık payı var mı acaba? 250'ye olur mu?",
        zaman: "Dün",
        okunmamis: 1,
        urun: "https://picsum.photos/seed/dolap-canta/120",
        urunAlt: "El çantası",
      },
      {
        id: "4",
        ad: "Barış Şahin",
        bas: "BŞ",
        durum: "offline",
        onizleme: "Sen: Teşekkürler, iyi günlerde kullanın!",
        zaman: "Pzt",
        giden: true,
        urun: "https://picsum.photos/seed/dolap-gomlek/120",
        urunAlt: "Keten gömlek",
      },
    ];

    return (
      <ConversationList className="w-96 max-w-full">
        {konusmalar.map((k) => (
          <ConversationListItem
            key={k.id}
            name={k.ad}
            avatarFallback={k.bas}
            status={k.durum}
            preview={k.onizleme}
            time={k.zaman}
            unreadCount={k.okunmamis}
            outgoing={k.giden}
            productImageSrc={k.urun}
            productImageAlt={k.urunAlt}
          />
        ))}
      </ConversationList>
    );
  },
};

/** Aktif konusma vurgusu: seçili satır sol çubuk ve bg-accent ile öne çıkar. */
export const AktifKonusma: Story = {
  render: () => {
    const konusmalar: Konusma[] = [
      {
        id: "1",
        ad: "Destek Ekibi",
        bas: "DE",
        durum: "online",
        onizleme: "Merhaba! Size nasıl yardımcı olabiliriz?",
        zaman: "09:41",
        okunmamis: 2,
      },
      {
        id: "2",
        ad: "Zeynep Arslan",
        bas: "ZA",
        durum: "online",
        onizleme: "Randevumu yarına alabilir miyiz?",
        zaman: "09:12",
      },
      {
        id: "3",
        ad: "Mert Aydın",
        bas: "MA",
        durum: "away",
        onizleme: "Sen: Tabii, saat 15:00 uygun mu?",
        zaman: "Dün",
        giden: true,
      },
      {
        id: "4",
        ad: "Dr. Deniz Erdem",
        bas: "DE",
        durum: "offline",
        onizleme: "Kontrol sonuçlarınız hazır oldu.",
        zaman: "Sal",
      },
    ];

    return (
      <ConversationList className="w-96 max-w-full">
        {konusmalar.map((k, i) => (
          <ConversationListItem
            key={k.id}
            name={k.ad}
            avatarFallback={k.bas}
            status={k.durum}
            preview={k.onizleme}
            time={k.zaman}
            unreadCount={k.okunmamis}
            outgoing={k.giden}
            active={i === 1}
          />
        ))}
      </ConversationList>
    );
  },
};

/** Genel sohbet: ürün küçükresmi olmadan, yoğun okunmamış sayaçlı liste. */
export const GenelSohbet: Story = {
  render: () => {
    const konusmalar: Konusma[] = [
      {
        id: "1",
        ad: "Proje Ekibi",
        bas: "PE",
        durum: "online",
        onizleme: "Ahmet: Sunumu paylaştım, göz atabilir misiniz?",
        zaman: "11:58",
        okunmamis: 128,
      },
      {
        id: "2",
        ad: "Elif Kaya",
        bas: "EK",
        durum: "busy",
        onizleme: "Toplantıyı 30 dakika erteleyebilir miyiz?",
        zaman: "11:20",
        okunmamis: 5,
      },
      {
        id: "3",
        ad: "Can Öztürk",
        bas: "CÖ",
        durum: "away",
        onizleme: "Sen: Dosyayı az önce yükledim 👍",
        zaman: "10:47",
        giden: true,
      },
      {
        id: "4",
        ad: "Tasarım Kanalı",
        bas: "TK",
        durum: "offline",
        onizleme: "Yeni ikon seti incelemeye hazır.",
        zaman: "Çrş",
      },
    ];

    return (
      <ConversationList className="w-96 max-w-full">
        {konusmalar.map((k) => (
          <ConversationListItem
            key={k.id}
            name={k.ad}
            avatarFallback={k.bas}
            status={k.durum}
            preview={k.onizleme}
            time={k.zaman}
            unreadCount={k.okunmamis}
            outgoing={k.giden}
          />
        ))}
      </ConversationList>
    );
  },
};
