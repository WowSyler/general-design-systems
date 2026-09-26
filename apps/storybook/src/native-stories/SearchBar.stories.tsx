import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton, SearchBar, Text, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/SearchBar", component: SearchBar, ...nativeMeta, args: { value: "", onChangeText: () => undefined } } satisfies Meta<typeof SearchBar>;
export default meta;

export const Etkilesimli: StoryObj<typeof meta> = {
  render: () => {
    const [q, setQ] = React.useState("keten gömlek");
    const [q2, setQ2] = React.useState("");
    return (
      <VStack gap="lg">
        <SearchBar value={q} onChangeText={setQ} placeholder="Ürün, marka ara" onCancel={() => setQ("")} />
        <SearchBar
          value={q2}
          onChangeText={setQ2}
          placeholder="Danışan ara"
          trailing={<IconButton accessibilityLabel="Filtrele" variant="outline" icon={({ color }) => <Text style={{ color }}>☰</Text>} />}
        />
      </VStack>
    );
  },
};
