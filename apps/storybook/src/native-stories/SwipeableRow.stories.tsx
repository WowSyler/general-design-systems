import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, SwipeableRow, Text, TransactionRow } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/SwipeableRow", component: SwipeableRow, ...nativeMeta, args: { actions: [], children: null } } satisfies Meta<typeof SwipeableRow>;
export default meta;

/** Satırı başa doğru kaydır (LTR: sola) → eylemler açılır. Ekran okuyucuda eylemler menüsünden erişilir. */
export const Islemler: StoryObj<typeof meta> = {
  render: () => (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      {["Migros", "Shell", "Netflix"].map((t, i) => (
        <SwipeableRow
          key={t}
          actions={[
            { key: "edit", label: "Düzenle", tone: "neutral", icon: <Text>✎</Text>, onPress: () => undefined },
            { key: "delete", label: "Sil", tone: "destructive", icon: <Text style={{ color: "white" }}>✕</Text>, onPress: () => undefined },
          ]}
        >
          <TransactionRow title={t} subtitle="22 Eyl" amount={-(120 + i * 85.5)} />
        </SwipeableRow>
      ))}
    </Card>
  ),
};
