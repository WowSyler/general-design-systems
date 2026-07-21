import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { QuantityStepper } from "@ds/ui";

const meta: Meta<typeof QuantityStepper> = {
  title: "Commerce/QuantityStepper",
  component: QuantityStepper,
};

export default meta;
type Story = StoryObj<typeof QuantityStepper>;

function KontrolluStepper(props: {
  initial?: number;
  min?: number;
  max?: number;
}) {
  const [value, setValue] = React.useState(props.initial ?? 1);
  return (
    <QuantityStepper
      value={value}
      onValueChange={setValue}
      min={props.min}
      max={props.max}
    />
  );
}

export const Varsayilan: Story = {
  render: () => <KontrolluStepper />,
};

export const MaksimumStoklu: Story = {
  render: () => <KontrolluStepper initial={3} max={5} />,
};

export const DevreDisi: Story = {
  args: {
    value: 2,
    onValueChange: () => {},
    disabled: true,
  },
};
