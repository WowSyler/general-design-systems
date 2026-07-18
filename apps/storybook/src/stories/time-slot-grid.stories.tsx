import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { TimeSlotGrid, type TimeSlot } from "@ds/ui";

const meta: Meta<typeof TimeSlotGrid> = {
  title: "Composites/TimeSlotGrid",
  component: TimeSlotGrid,
};

export default meta;
type Story = StoryObj<typeof TimeSlotGrid>;

const doluSaatler = new Set(["10:00", "11:30", "13:00", "13:30", "15:00"]);

function buildSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let minutes = 9 * 60; minutes <= 17 * 60 + 30; minutes += 30) {
    const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
    const minute = String(minutes % 60).padStart(2, "0");
    const label = `${hour}:${minute}`;
    slots.push({
      id: label,
      label,
      disabled: doluSaatler.has(label),
    });
  }
  return slots;
}

const slots = buildSlots();

function InteraktifOrnek() {
  const [selected, setSelected] = React.useState<string | undefined>("14:00");

  return (
    <div className="max-w-xl space-y-3">
      <TimeSlotGrid
        slots={slots}
        value={selected}
        onValueChange={setSelected}
        columns={4}
      />
      <p className="text-sm text-muted-foreground">
        Seçilen saat: {selected ?? "henüz seçilmedi"}
      </p>
    </div>
  );
}

export const InteraktifSecim: Story = {
  render: () => <InteraktifOrnek />,
};

export const AltiKolon: Story = {
  render: () => (
    <TimeSlotGrid slots={slots} value="09:30" columns={6} className="max-w-2xl" />
  ),
};

export const Loading: Story = {
  args: {
    slots: [],
    loading: true,
    columns: 4,
    className: "max-w-xl",
  },
};

export const BosDurum: Story = {
  args: {
    slots: [],
    emptyMessage: "Bu tarihte uygun randevu saati kalmadı. Lütfen başka bir gün seçin.",
    className: "max-w-xl",
  },
};
