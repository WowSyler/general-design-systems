import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, Divider, Text, TransactionRow, useNativeTheme } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/TransactionRow", component: TransactionRow, ...nativeMeta, args: { title: "Migros", subtitle: "22 Eyl · Market", amount: -342.5 } } satisfies Meta<typeof TransactionRow>;
export default meta;

function List() {
  const { theme } = useNativeTheme();
  const c = theme.colors;
  return (
    <Card style={{ padding: 0 }}>
      <TransactionRow title="Maaş" subtitle="1 Eyl · Gelir" amount={45000} categoryColor={c.success} categoryIcon={<Text>💼</Text>} onPress={() => undefined} />
      <Divider inset />
      <TransactionRow title="Migros" subtitle="22 Eyl · Market" amount={-342.5} categoryColor={c.chart1} categoryIcon={<Text>🛒</Text>} onPress={() => undefined} />
      <Divider inset />
      <TransactionRow title="İstanbulkart" subtitle="21 Eyl · Ulaşım" amount={-150} categoryColor={c.chart2} onPress={() => undefined} />
      <Divider inset />
      <TransactionRow title="Kira" subtitle="Yarın · Planlı" amount={-18500} categoryColor={c.chart3} pending />
    </Card>
  );
}

export const Varsayilan: StoryObj<typeof meta> = {};
export const Liste: StoryObj<typeof meta> = { render: () => <List /> };
