import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, Card, ListRow } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/ListRow", component: ListRow, ...nativeMeta, args: { title: "Market", subtitle: "Bugün · 14:20", value: "-₺342,50", showChevron: true, onPress: () => undefined } } satisfies Meta<typeof ListRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Varsayilan: Story = {};

export const Liste: Story = {
  render: () => {
    const [dark, setDark] = React.useState(true);
    return (
      <Card style={{ padding: 0 }}>
        <ListRow bordered left={<Avatar name="Ayşe Kaya" size="sm" />} title="Ayşe Kaya" subtitle="Cilt bakım danışanı" showChevron onPress={() => undefined} />
        <ListRow bordered title="Maaş" subtitle="1 Eyl" value="+₺45.000" valueSubtitle="Gelir" />
        {/* Satırın tamamı anahtarı çevirir. */}
        <ListRow title="Karanlık mod" switchValue={dark} onSwitchChange={setDark} />
      </Card>
    );
  },
};
