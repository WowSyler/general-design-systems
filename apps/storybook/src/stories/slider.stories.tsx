import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Label, Slider } from "@ds/ui";

const meta: Meta<typeof Slider> = {
  title: "Primitives/Slider",
  component: Slider,
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => (
    <Slider defaultValue={[40]} max={100} step={1} className="w-[320px]" />
  ),
};

export const WithValue: Story = {
  name: "Değer Göstergeli (Fark Eşiği)",
  render: function Render() {
    const [value, setValue] = React.useState([15]);
    return (
      <div className="grid w-[320px] gap-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="esik">Piksel fark eşiği</Label>
          <span className="text-sm font-medium tabular-nums">%{value[0]}</span>
        </div>
        <Slider
          id="esik"
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
        />
        <p className="text-xs text-muted-foreground">
          DeployLens bu eşiğin üzerindeki görsel farkları hata sayar.
        </p>
      </div>
    );
  },
};

export const Range: Story = {
  name: "Aralık (Fiyat Filtresi)",
  render: () => (
    <div className="grid w-[320px] gap-3">
      <Label>Randevu fiyat aralığı (₺)</Label>
      <Slider defaultValue={[250, 750]} min={0} max={1500} step={50} />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Slider defaultValue={[60]} max={100} disabled className="w-[320px]" />
  ),
};
