import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimeSlotPicker } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/TimeSlotPicker", component: TimeSlotPicker, ...nativeMeta, args: { value: null, onValueChange: () => undefined } } satisfies Meta<typeof TimeSlotPicker>;
export default meta;

const mk = (times: string[], busy: string[] = []) => times.map((t) => ({ value: t, disabled: busy.includes(t) }));

export const Randevu: StoryObj<typeof meta> = {
  render: () => {
    const [v, setV] = React.useState<string | null>("10:30");
    return (
      <TimeSlotPicker
        value={v}
        onValueChange={setV}
        sections={[
          { title: "Sabah", slots: mk(["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"], ["09:30", "11:00"]) },
          { title: "Öğleden sonra", slots: mk(["13:00", "13:30", "14:00", "15:00", "16:30"], ["14:00"]) },
        ]}
      />
    );
  },
};

export const Bos: StoryObj<typeof meta> = { args: { slots: [] } };
