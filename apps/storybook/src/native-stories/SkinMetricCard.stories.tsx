import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid, SkinMetricCard, Text } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/SkinMetricCard", component: SkinMetricCard, ...nativeMeta, args: { label: "Nem", score: 78, delta: 4 } } satisfies Meta<typeof SkinMetricCard>;
export default meta;

export const Analiz: StoryObj<typeof meta> = {
  render: () => (
    <Grid columns={{ base: 1, sm: 2, lg: 3 }}>
      <SkinMetricCard label="Nem" score={78} delta={4} icon={<Text>💧</Text>} hint="Nem dengen iyi, rutinine devam." />
      <SkinMetricCard label="Gözenek" score={52} delta={-2} icon={<Text>◌</Text>} hint="Haftada 2 kez BHA önerilir." />
      <SkinMetricCard label="Kızarıklık" score={34} delta={0} icon={<Text>●</Text>} hint="Hassas cilt ürünlerine geç." />
    </Grid>
  ),
};
