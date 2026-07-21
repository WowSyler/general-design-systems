import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarDays } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@ds/ui";

const meta: Meta<typeof HoverCard> = {
  title: "Primitives/HoverCard",
  component: HoverCard,
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

const UserPreviewBody = () => (
  <HoverCardContent className="w-80">
    <div className="flex justify-between gap-4">
      <Avatar>
        <AvatarFallback>BD</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">Burak Demir</h4>
        <p className="text-sm">
          DeployLens platform ekibinde kıdemli geliştirici. Son 30 günde 42
          dağıtım karşılaştırması oluşturdu.
        </p>
        <div className="flex items-center pt-2">
          <CalendarDays className="mr-2 size-4 opacity-70" />
          <span className="text-xs text-muted-foreground">
            Mart 2024&apos;ten beri üye
          </span>
        </div>
      </div>
    </div>
  </HoverCardContent>
);

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@burakdemir</Button>
      </HoverCardTrigger>
      <UserPreviewBody />
    </HoverCard>
  ),
};

export const Open: Story = {
  render: () => (
    <div className="flex min-h-[280px] items-start justify-center pt-4">
      <HoverCard defaultOpen>
        <HoverCardTrigger asChild>
          <Button variant="link">@burakdemir</Button>
        </HoverCardTrigger>
        <UserPreviewBody />
      </HoverCard>
    </div>
  ),
};
