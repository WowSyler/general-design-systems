import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreditCard, LogOut, Settings, User } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@wowsyler/ds-ui";

const meta: Meta<typeof DropdownMenu> = {
  title: "Primitives/DropdownMenu",
  component: DropdownMenu,
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

const UserMenuBody = () => (
  <DropdownMenuContent className="w-56 max-w-full" align="start">
    <DropdownMenuLabel>
      <div className="flex flex-col">
        <span>Merve Aydın</span>
        <span className="text-xs font-normal text-muted-foreground">
          merve@deploylens.dev
        </span>
      </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <User className="mr-2 size-4" /> Profil
      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <CreditCard className="mr-2 size-4" /> Abonelik
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Settings className="mr-2 size-4" /> Ayarlar
      <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <LogOut className="mr-2 size-4" /> Çıkış yap
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
);

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <Avatar className="size-7">
            <AvatarFallback>MA</AvatarFallback>
          </Avatar>
          Merve Aydın
        </Button>
      </DropdownMenuTrigger>
      <UserMenuBody />
    </DropdownMenu>
  ),
};

export const Open: Story = {
  render: () => (
    <div className="flex min-h-[320px] items-start justify-center pt-4">
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <Avatar className="size-7">
              <AvatarFallback>MA</AvatarFallback>
            </Avatar>
            Merve Aydın
          </Button>
        </DropdownMenuTrigger>
        <UserMenuBody />
      </DropdownMenu>
    </div>
  ),
};
