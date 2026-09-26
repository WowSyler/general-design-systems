import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { CommentThread, CommentThreadItem } from "@wowsyler/ds-ui";

const meta: Meta<typeof CommentThread> = {
  title: "Composites/CommentThread",
  component: CommentThread,
};

export default meta;
type Story = StoryObj<typeof CommentThread>;

type Comment = React.ComponentProps<typeof CommentThread>["comments"][number];

/** Dolap ürün ilanı altındaki iç içe yorum dizisi: doğrulanmış satıcı, sabitlenmiş yanıt, beğeni ve gizli yanıtlar. */
const ilanYorumlari: Comment[] = [
  {
    id: "c1",
    author: {
      name: "Selin Aksoy",
      handle: "@selin.vintage",
      fallback: "SA",
      verified: true,
    },
    timestamp: "3 saat önce",
    content:
      "Bu vintage deri ceketi hâlâ satıyor musunuz? Beden M olarak belirtilmiş ama omuz genişliğini paylaşabilir misiniz?",
    likeCount: 12,
    pinned: true,
    replies: [
      {
        id: "c1r1",
        author: { name: "Kerem Doğan", handle: "@keremin.dolabi", fallback: "KD" },
        timestamp: "2 saat önce",
        content:
          "Merhaba Selin, evet hâlâ mevcut! Omuz genişliği 44 cm, kol boyu 62 cm. Detaylı ölçüleri açıklamaya ekledim.",
        likeCount: 4,
        liked: true,
        replies: [
          {
            id: "c1r1r1",
            author: {
              name: "Selin Aksoy",
              handle: "@selin.vintage",
              fallback: "SA",
              verified: true,
            },
            timestamp: "1 saat önce",
            content: "Harika, teşekkürler! Sepete ekliyorum, kargoyu bugün alabilir miyim?",
            likeCount: 1,
          },
        ],
      },
    ],
  },
  {
    id: "c2",
    author: { name: "Ece Yıldırım", handle: "@ecenin.gardirobu", fallback: "EY" },
    timestamp: "5 saat önce",
    content: "Rengi fotoğraftaki gibi mi yoksa daha açık ton mu? Gün ışığında bir kare atabilir misiniz?",
    likeCount: 7,
    hiddenReplyCount: 3,
  },
];

export const IlanYorumDizisi: Story = {
  render: () => (
    <div className="w-[34rem] max-w-full">
      <CommentThread
        comments={ilanYorumlari}
        onReply={() => {}}
        onLike={() => {}}
        onShowReplies={() => {}}
      />
    </div>
  ),
};

/** Aksiyonsuz, salt okunur görünüm: yalnızca avatar, isim, zaman ve metin (Yanıtla/Beğen gizli). */
export const SaltOkunur: Story = {
  render: () => (
    <div className="w-[34rem] max-w-full">
      <CommentThread
        comments={[
          {
            id: "r1",
            author: { name: "Merve Kaya", fallback: "MK" },
            timestamp: "Dün",
            content: "Ürün açıklamadaki gibi geldi, satıcı çok ilgiliydi. Teşekkürler!",
          },
          {
            id: "r2",
            author: { name: "Burak Şen", handle: "@burak.thrift", fallback: "BŞ", verified: true },
            timestamp: "2 gün önce",
            content: "Kargolama hızlı ve paketleme özenliydi. Gönül rahatlığıyla alışveriş yapabilirsiniz.",
          },
        ]}
      />
    </div>
  ),
};

/** Tek yorum: CommentThreadItem doğrudan özel kompozisyonda kullanılır. */
export const TekYorum: Story = {
  render: () => (
    <div className="w-[30rem] max-w-full">
      <CommentThreadItem
        comment={{
          id: "single",
          author: {
            name: "Deniz Arslan",
            handle: "@deniz.closet",
            fallback: "DA",
            verified: true,
          },
          timestamp: "Az önce",
          content: "İkinci ürünü de alırsam kombine kargo indirimi yapabilir misiniz?",
          likeCount: 3,
          liked: true,
        }}
        onReply={() => {}}
        onLike={() => {}}
      />
    </div>
  ),
};
