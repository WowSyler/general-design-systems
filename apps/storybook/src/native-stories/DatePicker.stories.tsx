import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, Card, DatePicker, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const TODAY = new Date(2026, 8, 22);
const meta = { title: "Native/DatePicker", component: DatePicker, ...nativeMeta, args: { value: null, onChange: () => undefined, label: "Randevu tarihi" } } satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TetikVeTakvim: Story = {
  render: () => {
    const [d, setD] = React.useState<Date | null>(new Date(2026, 8, 24));
    return (
      <VStack gap="lg">
        <DatePicker label="Randevu tarihi" value={d} onChange={setD} today={TODAY} minDate={TODAY} />
        <DatePicker label="Doğum tarihi" value={null} onChange={() => undefined} error="Tarih zorunlu" />
        {/* Dar yatay iç boşluk: 7 sütun × 44pt = 308pt; 360pt ekranda hücreler ≥ 44pt kalır. */}
        <Card style={{ paddingHorizontal: 8 }}>
          <Calendar
            value={d}
            onChange={setD}
            today={TODAY}
            minDate={new Date(2026, 8, 10)}
            isDateDisabled={(x) => x.getDay() === 0}
          />
        </Card>
      </VStack>
    );
  },
};

export const Calendar_: Story = {
  name: "Calendar (Pazar kapalı)",
  render: () => {
    const [d, setD] = React.useState<Date | null>(TODAY);
    return <Calendar value={d} onChange={setD} today={TODAY} isDateDisabled={(x) => x.getDay() === 0} />;
  },
};
