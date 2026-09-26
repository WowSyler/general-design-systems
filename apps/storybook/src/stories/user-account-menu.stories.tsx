import type { Meta, StoryObj } from "@storybook/react-vite";

import { UserAccountMenu } from "@wowsyler/ds-ui";

const meta: Meta<typeof UserAccountMenu> = {
  title: "Composites/UserAccountMenu",
  component: UserAccountMenu,
};

export default meta;
type Story = StoryObj<typeof UserAccountMenu>;

export const TamVaryant: Story = {
  args: {
    variant: "full",
    user: {
      name: "Elif Yıldırım",
      email: "elif.yildirim@deploylens.io",
      role: "Yönetici",
    },
    defaultOpen: true,
  },
};

export const KompaktVaryant: Story = {
  args: {
    variant: "compact",
    user: {
      name: "Mert Kavas",
      email: "mert@dolap.app",
      initials: "MK",
    },
  },
};

export const RandevuHesabi: Story = {
  render: () => (
    <div className="flex min-h-72 items-start justify-end p-6">
      <UserAccountMenu
        variant="full"
        user={{
          name: "Zeynep Aksu",
          email: "zeynep.aksu@randevu.co",
          role: "İşletme Sahibi",
        }}
        signOutLabel="Oturumu kapat"
        onProfileSelect={() => console.log("Profil")}
        onSettingsSelect={() => console.log("Ayarlar")}
        onThemeSelect={() => console.log("Tema")}
        onShortcutsSelect={() => console.log("Klavye kısayolları")}
        onSignOut={() => console.log("Çıkış")}
        defaultOpen
      />
    </div>
  ),
};
