import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdaptiveNavigation, Avatar, Card, NavigationRail, Stack, Text, VStack } from "@wowsyler/ds-ui-native";

import { NAV_ITEMS } from "./_support/navItems";
import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/AdaptiveNavigation", component: AdaptiveNavigation, ...nativeMeta, args: { items: NAV_ITEMS, value: "home", onValueChange: () => undefined, children: null } } satisfies Meta<typeof AdaptiveNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Telefonda alt çubuk, tablette (kısa kenar ≥ 600) kenar rayı. */
export const Uyarlanabilir: Story = {
  render: () => {
    const [v, setV] = React.useState("home");
    return (
      <Stack gap="none" style={{ height: 560 }}>
        <AdaptiveNavigation items={NAV_ITEMS} value={v} onValueChange={setV} railHeader={<Avatar name="Glow Scan" size="sm" />}>
          <VStack padding="lg" gap="md">
            <Text variant="h2">{NAV_ITEMS.find((i) => i.value === v)?.label}</Text>
            <Card>
              <Text color="muted">İçerik alanı — gezinme cihaza göre yer değiştirir.</Text>
            </Card>
          </VStack>
        </AdaptiveNavigation>
      </Stack>
    );
  },
};

export const Ray: Story = {
  render: () => (
    <Stack gap="none" style={{ height: 420 }} direction="row">
      <NavigationRail items={NAV_ITEMS} value="scan" onValueChange={() => undefined} header={<Avatar name="Fisly" size="sm" />} />
    </Stack>
  ),
};
