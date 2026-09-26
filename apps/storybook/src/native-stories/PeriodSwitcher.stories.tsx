import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PeriodSwitcher } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const meta = { title: "Native/PeriodSwitcher", component: PeriodSwitcher, ...nativeMeta, args: { label: "Eylül 2026", onPrev: () => undefined, onNext: () => undefined } } satisfies Meta<typeof PeriodSwitcher>;
export default meta;

export const Etkilesimli: StoryObj<typeof meta> = {
  render: () => {
    const [m, setM] = React.useState(8);
    const [g, setG] = React.useState("month");
    return (
      <PeriodSwitcher
        label={`${MONTHS[m]} 2026`}
        caption={`1–${new Date(2026, m + 1, 0).getDate()} ${MONTHS[m]!.slice(0, 3)}`}
        onPrev={() => setM((x) => Math.max(0, x - 1))}
        onNext={() => setM((x) => Math.min(8, x + 1))}
        canNext={m < 8}
        granularities={[
          { value: "week", label: "Hafta" },
          { value: "month", label: "Ay" },
          { value: "year", label: "Yıl" },
        ]}
        granularity={g}
        onGranularityChange={setG}
      />
    );
  },
};
