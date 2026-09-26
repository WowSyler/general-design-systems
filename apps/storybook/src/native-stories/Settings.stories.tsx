import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SettingsGroup, SettingsRow, Text, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Settings", component: SettingsGroup, ...nativeMeta, args: { children: null } } satisfies Meta<typeof SettingsGroup>;
export default meta;

const icon = (s: string) => <Text style={{ fontSize: 16 }}>{s}</Text>;

export const AyarlarEkrani: StoryObj<typeof meta> = {
  render: () => {
    const [push, setPush] = React.useState(true);
    const [bio, setBio] = React.useState(false);
    return (
      <VStack gap="xl">
        <SettingsGroup title="Hesap">
          <SettingsRow icon={icon("👤")} title="Profil" description="Ad, e-posta, telefon" onPress={() => undefined} />
          <SettingsRow icon={icon("🌐")} title="Dil" value="Türkçe" onPress={() => undefined} />
          <SettingsRow icon={icon("💳")} title="Abonelik" value="Premium" onPress={() => undefined} />
        </SettingsGroup>
        <SettingsGroup title="Güvenlik" footer="Face ID açıkken uygulama her açılışta kimlik doğrulaması ister.">
          <SettingsRow icon={icon("🔔")} title="Bildirimler" switchValue={push} onSwitchChange={setPush} />
          <SettingsRow icon={icon("🔒")} title="Face ID ile kilitle" switchValue={bio} onSwitchChange={setBio} />
        </SettingsGroup>
        <SettingsGroup>
          <SettingsRow title="Hesabı sil" destructive onPress={() => undefined} showChevron={false} />
        </SettingsGroup>
      </VStack>
    );
  },
};
