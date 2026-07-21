import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Label, Progress } from "@ds/ui";

const meta: Meta<typeof Progress> = {
  title: "Primitives/Progress",
  component: Progress,
  args: { value: 60 },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  render: (args) => <Progress {...args} className="w-[320px]" />,
};

export const WithLabel: Story = {
  name: "Etiketli (Fiş Tarama)",
  render: () => (
    <div className="grid w-[320px] gap-2">
      <div className="flex items-center justify-between">
        <Label>Fişler işleniyor</Label>
        <span className="text-sm text-muted-foreground tabular-nums">
          12 / 20
        </span>
      </div>
      <Progress value={60} />
    </div>
  ),
};

export const Animated: Story = {
  name: "Animasyonlu (Deploy Analizi)",
  render: function Render() {
    const [value, setValue] = React.useState(10);
    React.useEffect(() => {
      const timer = setInterval(
        () => setValue((v) => (v >= 100 ? 10 : v + 10)),
        800
      );
      return () => clearInterval(timer);
    }, []);
    return (
      <div className="grid w-[320px] gap-2">
        <Label>Ekran görüntüleri karşılaştırılıyor...</Label>
        <Progress value={value} />
      </div>
    );
  },
};
