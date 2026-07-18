import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Calendar } from "@ds/ui";

const meta: Meta<typeof Calendar> = {
  title: "Primitives/Calendar",
  component: Calendar,
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: function Render() {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(2026, 6, 18)
    );

    return (
      <div className="flex flex-col items-center gap-3">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={new Date(2026, 6, 1)}
          className="rounded-md border"
        />
        <p className="text-sm text-muted-foreground">
          Randevu tarihi:{" "}
          {date ? date.toLocaleDateString("tr-TR") : "Henüz seçilmedi"}
        </p>
      </div>
    );
  },
};

export const HaftaSonuKapali: Story = {
  render: function Render() {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(2026, 6, 20)
    );

    return (
      <div className="flex flex-col items-center gap-3">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={new Date(2026, 6, 1)}
          disabled={{ dayOfWeek: [0, 6] }}
          className="rounded-md border"
        />
        <p className="text-sm text-muted-foreground">
          Salon hafta sonları kapalıdır; yalnızca hafta içi randevu
          alınabilir.
        </p>
      </div>
    );
  },
};

export const DropdownBaslik: Story = {
  render: function Render() {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(2026, 6, 18)
    );

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={new Date(2026, 6, 1)}
        captionLayout="dropdown"
        startMonth={new Date(2025, 0, 1)}
        endMonth={new Date(2027, 11, 31)}
        className="rounded-md border"
      />
    );
  },
};
