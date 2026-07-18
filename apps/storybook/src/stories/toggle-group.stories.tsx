import type { Meta, StoryObj } from "@storybook/react";
import { LayoutGrid, List, Rows3 } from "lucide-react";
import * as React from "react";

import { ToggleGroup, ToggleGroupItem } from "@ds/ui";

const meta: Meta<typeof ToggleGroup> = {
  title: "Primitives/ToggleGroup",
  component: ToggleGroup,
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const Default: Story = {
  render: function Render() {
    const [gorunum, setGorunum] = React.useState("grid");

    return (
      <div className="flex flex-col items-center gap-3">
        <ToggleGroup
          type="single"
          value={gorunum}
          onValueChange={(value) => {
            if (value) setGorunum(value);
          }}
        >
          <ToggleGroupItem value="liste" aria-label="Liste görünümü">
            <List className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Izgara görünümü">
            <LayoutGrid className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="kompakt" aria-label="Kompakt görünüm">
            <Rows3 className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="text-sm text-muted-foreground">
          Gardırop görünümü: {gorunum}
        </p>
      </div>
    );
  },
};

export const Outline: Story = {
  render: () => (
    <ToggleGroup type="single" variant="outline" defaultValue="liste">
      <ToggleGroupItem value="liste" aria-label="Liste görünümü">
        <List className="mr-2 size-4" /> Liste
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Izgara görünümü">
        <LayoutGrid className="mr-2 size-4" /> Izgara
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};
