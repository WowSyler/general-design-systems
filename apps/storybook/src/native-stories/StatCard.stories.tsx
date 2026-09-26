import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid, StatCard } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/StatCard", component: StatCard, ...nativeMeta, args: { label: "Bu ay gelir", value: "₺42.500", delta: { value: "+%12", trend: "up" } } } satisfies Meta<typeof StatCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Varsayilan: Story = {};

export const Izgara: Story = {
  render: () => (
    <Grid columns={{ base: 2, md: 4 }}>
      <StatCard label="Gelir" value="₺42.500" delta={{ value: "+%12", trend: "up" }} />
      <StatCard label="Gider" value="₺28.140" delta={{ value: "+%4", trend: "down" }} />
      <StatCard label="Tasarruf" value="₺14.360" delta={{ value: "%0", trend: "neutral" }} />
      <StatCard label="İşlem" value="186" />
    </Grid>
  ),
};
