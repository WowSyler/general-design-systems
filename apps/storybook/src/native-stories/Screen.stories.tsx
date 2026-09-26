import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, Header, Screen, StatCard, Stack, Text } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Screen", component: Screen, ...nativeMeta } satisfies Meta<typeof Screen>;
export default meta;

/** Tablette içerik 720pt ile sınırlanıp ortalanır. */
export const Ekran: StoryObj<typeof meta> = {
  render: () => (
    <Stack gap="none" style={{ height: 640 }}>
      <Header title="Özet" subtitle="Eylül 2026" />
      <Screen scroll edges={[]}>
        <StatCard label="Net" value="₺14.360" delta={{ value: "+%8", trend: "up" }} />
        <Card>
          <Text variant="h3">Screen</Text>
          <Text color="muted">Güvenli alan + kaydırma + tablette ortalanmış içerik genişliği.</Text>
        </Card>
      </Screen>
    </Stack>
  ),
};
