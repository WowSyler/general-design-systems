import type { Meta, StoryObj } from "@storybook/react";
import { Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, ChatBubble, ChatList } from "@ds/ui";

const meta: Meta<typeof ChatBubble> = {
  title: "Composites/ChatBubble",
  component: ChatBubble,
};

export default meta;
type Story = StoryObj<typeof ChatBubble>;

const stilistAvatar = (
  <Avatar className="size-8">
    <AvatarFallback>
      <Sparkles className="size-4" />
    </AvatarFallback>
  </Avatar>
);

export const StilistSohbeti: Story = {
  render: () => (
    <ChatList className="max-w-md">
      <ChatBubble role="user" timestamp="14:02">
        Yarın iş görüşmem var, gardırobumdan nasıl bir kombin önerirsin?
      </ChatBubble>
      <ChatBubble role="assistant" avatar={stilistAvatar} timestamp="14:02">
        Harika bir fırsat! Lacivert blazer ceketinle beyaz gömleğini
        birleştirebilirsin. Alt için gri kumaş pantolonun çok şık durur.
      </ChatBubble>
      <ChatBubble role="user" timestamp="14:03">
        Ayakkabı olarak ne giymeliyim? Kahverengi loafer mı, siyah oxford mu?
      </ChatBubble>
      <ChatBubble role="assistant" avatar={stilistAvatar} timestamp="14:04">
        Gri pantolonla siyah oxford daha resmi ve dengeli bir görünüm sağlar.
        Kemerini de siyah seçersen kombin tamamlanır. Bol şans!
      </ChatBubble>
    </ChatList>
  ),
};

export const TekMesaj: Story = {
  args: {
    role: "assistant",
    avatar: stilistAvatar,
    timestamp: "09:15",
    children:
      "Günaydın! Bugün hava yağmurlu görünüyor, trençkotunu öneririm.",
  },
};
