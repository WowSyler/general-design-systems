import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LayoutGrid, List } from "lucide-react";

import { SegmentedControl } from "@ds/ui";

const meta: Meta<typeof SegmentedControl> = {
  title: "Iconic/SegmentedControl",
  component: SegmentedControl,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

/** Dolap ürün listesi görünüm seçici (Izgara / Liste). */
export const DolapGorunum: Story = {
  render: function DolapRender() {
    const [gorunum, setGorunum] = React.useState("izgara");
    return (
      <SegmentedControl
        value={gorunum}
        onValueChange={setGorunum}
        options={[
          { value: "izgara", label: "Izgara", icon: <LayoutGrid /> },
          { value: "liste", label: "Liste", icon: <List /> },
        ]}
      />
    );
  },
};

/** Fisly dashboard dönem seçici (Ay / Çeyrek / Yıl). */
export const FislyDonem: Story = {
  render: function FislyRender() {
    const [donem, setDonem] = React.useState("ay");
    return (
      <SegmentedControl
        value={donem}
        onValueChange={setDonem}
        options={[
          { value: "ay", label: "Ay" },
          { value: "ceyrek", label: "Çeyrek" },
          { value: "yil", label: "Yıl" },
        ]}
      />
    );
  },
};
