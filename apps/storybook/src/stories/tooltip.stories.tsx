import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarClock, Trash2 } from "lucide-react";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ds/ui";

const meta: Meta<typeof Tooltip> = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Üzerine gelin</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Randevuyu yeniden planla</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const IconButtons: Story = {
  name: "Simge Butonları",
  render: () => (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline" aria-label="Yeniden planla">
            <CalendarClock className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Randevuyu yeniden planla</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline" aria-label="Sil">
            <Trash2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Fişi kalıcı olarak sil</TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const Sides: Story = {
  name: "Yönler",
  render: () => (
    <div className="flex items-center gap-3">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm">
              {side}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>Kombin önerisi hazır</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};
