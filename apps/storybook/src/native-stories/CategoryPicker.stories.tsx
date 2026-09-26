import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CategoryPicker, Text, useNativeTheme } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/CategoryPicker", component: CategoryPicker, ...nativeMeta, args: { options: [], value: null, onValueChange: () => undefined } } satisfies Meta<typeof CategoryPicker>;
export default meta;

function Demo() {
  const { theme } = useNativeTheme();
  const c = theme.colors;
  const [v, setV] = React.useState<string | null>("food");
  const e = (s: string) => <Text style={{ fontSize: 18 }}>{s}</Text>;
  return (
    <CategoryPicker
      value={v}
      onValueChange={setV}
      options={[
        { value: "food", label: "Market", icon: e("🛒"), color: c.chart1 },
        { value: "transport", label: "Ulaşım", icon: e("🚌"), color: c.chart2 },
        { value: "bills", label: "Faturalar", icon: e("💡"), color: c.chart3 },
        { value: "fun", label: "Eğlence", icon: e("🎬"), color: c.chart4 },
        { value: "health", label: "Sağlık", icon: e("💊"), color: c.chart5 },
        { value: "rent", label: "Kira", color: c.chart1 },
        { value: "edu", label: "Eğitim", color: c.chart2 },
        { value: "other", label: "Diğer", disabled: true },
      ]}
    />
  );
}

export const Harcama: StoryObj<typeof meta> = { render: () => <Demo /> };
