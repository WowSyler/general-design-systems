import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { MonthYearPicker, type MonthYearPickerValue } from "@wowsyler/ds-ui";

const meta: Meta<typeof MonthYearPicker> = {
  title: "Primitives/MonthYearPicker",
  component: MonthYearPicker,
};

export default meta;
type Story = StoryObj<typeof MonthYearPicker>;

export const FislyAylikRapor: Story = {
  render: () => {
    const [donem, setDonem] = React.useState<MonthYearPickerValue>({
      year: 2026,
      month: 6, // Temmuz
    });
    return (
      <div className="w-72 max-w-full space-y-2">
        <label className="text-sm font-medium text-foreground">
          Rapor dönemi
        </label>
        <MonthYearPicker value={donem} onValueChange={setDonem} />
        <p className="text-xs text-muted-foreground tabular-nums">
          Fisly seçili dönem: {donem.month + 1}/{donem.year}
        </p>
      </div>
    );
  },
};

export const AcikGrid: Story = {
  render: () => (
    <div className="flex h-96 w-72 max-w-full flex-col">
      <MonthYearPicker
        defaultOpen
        defaultValue={{ year: 2026, month: 6 }}
        minYear={2023}
        maxYear={2027}
      />
    </div>
  ),
};

export const BosVeDevreDisi: Story = {
  render: () => (
    <div className="flex w-72 max-w-full flex-col gap-4">
      <MonthYearPicker placeholder="Dönem seçin…" />
      <MonthYearPicker
        placeholder="Önce şube seçin"
        defaultValue={{ year: 2026, month: 2 }}
        disabled
      />
    </div>
  ),
};
