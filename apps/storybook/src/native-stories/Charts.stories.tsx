import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart, DonutChart, LineChart, ProgressRing, Sparkline } from "@wowsyler/ds-ui-native/charts";
import { Card, Grid, HStack, Text, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Charts", component: DonutChart, ...nativeMeta, args: { data: [] } } satisfies Meta<typeof DonutChart>;
export default meta;
type Story = StoryObj<typeof meta>;

const SPEND = [
  { label: "Market", value: 3420 },
  { label: "Ulaşım", value: 1250 },
  { label: "Faturalar", value: 2100 },
  { label: "Eğlence", value: 980 },
  { label: "Diğer", value: 670 },
];

export const Donut: Story = {
  render: () => (
    <Card>
      <DonutChart data={SPEND} centerValue="₺8.420" centerLabel="Toplam" accessibilityLabel="Eylül harcama dağılımı" />
    </Card>
  ),
};

export const Panel: Story = {
  render: () => (
    <Grid columns={{ base: 1, md: 2 }}>
      <Card>
        <VStack gap="md">
          <Text variant="h3">Aylık harcama</Text>
          <BarChart
            highlightIndex={5}
            showValues
            formatValue={(v) => `${Math.round(v / 1000)}B`}
            data={["Nis", "May", "Haz", "Tem", "Ağu", "Eyl"].map((l, i) => ({ label: l, value: [6200, 7100, 5400, 8800, 7600, 8420][i]! }))}
          />
        </VStack>
      </Card>
      <Card>
        <VStack gap="md">
          <Text variant="h3">Cilt skoru trendi</Text>
          <LineChart data={["1 Eyl", "8 Eyl", "15 Eyl", "22 Eyl"].map((l, i) => ({ label: l, value: [61, 64, 70, 76][i]! }))} />
        </VStack>
      </Card>
      <Card>
        <HStack gap="lg" justify="space-around">
          <ProgressRing value={76} label="Genel skor" />
          <ProgressRing value={42} tone="warning" size={96} label="Hedef" />
        </HStack>
      </Card>
      <Card>
        <HStack gap="md" justify="space-between">
          <VStack gap="xs">
            <Text variant="caption">Bu hafta</Text>
            <Text variant="h2">₺2.140</Text>
          </VStack>
          <Sparkline data={[320, 280, 410, 300, 260, 350, 220]} trendColor width={120} height={40} />
        </HStack>
      </Card>
    </Grid>
  ),
};
