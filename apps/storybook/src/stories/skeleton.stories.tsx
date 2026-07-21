import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton } from "@ds/ui";

const meta: Meta<typeof Skeleton> = {
  title: "Primitives/Skeleton",
  component: Skeleton,
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: () => <Skeleton className="h-4 w-[240px]" />,
};

export const KartIskeleti: Story = {
  name: "Kart İskeleti",
  render: () => (
    <div className="w-[320px] rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="grid gap-1.5">
          <Skeleton className="h-4 w-[140px]" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
      </div>
      <Skeleton className="mt-4 h-[120px] w-full rounded-lg" />
      <div className="mt-4 grid gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  ),
};

export const ListeIskeleti: Story = {
  name: "Liste İskeleti (Rezervasyonlar)",
  render: () => (
    <div className="grid w-[360px] gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-full" />
            <div className="grid gap-1.5">
              <Skeleton className="h-3.5 w-[120px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </div>
          <Skeleton className="h-6 w-[72px] rounded-md" />
        </div>
      ))}
    </div>
  ),
};
