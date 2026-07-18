import type { Meta, StoryObj } from "@storybook/react";

import { CompareSlider } from "@ds/ui";

const meta: Meta<typeof CompareSlider> = {
  title: "Data/CompareSlider",
  component: CompareSlider,
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CompareSlider>;

const OncekiSurum = (
  <div className="flex h-64 flex-col gap-3 bg-destructive/10 p-6">
    <div className="h-8 w-2/3 rounded-md bg-destructive/20" />
    <div className="h-4 w-full rounded bg-muted" />
    <div className="h-4 w-5/6 rounded bg-muted" />
    <div className="mt-auto h-10 w-32 rounded-lg bg-destructive/25" />
  </div>
);

const YeniSurum = (
  <div className="flex h-64 flex-col gap-3 bg-success/10 p-6">
    <div className="h-8 w-1/2 rounded-md bg-success/25" />
    <div className="h-4 w-full rounded bg-muted" />
    <div className="h-4 w-4/6 rounded bg-muted" />
    <div className="mt-auto h-10 w-32 rounded-lg bg-primary" />
  </div>
);

export const GorselDiff: Story = {
  args: {
    before: OncekiSurum,
    after: YeniSurum,
    beforeLabel: "v2.3.1",
    afterLabel: "v2.4.0",
  },
};

export const SolaKaydirilmis: Story = {
  args: {
    before: OncekiSurum,
    after: YeniSurum,
    position: 30,
  },
};

export const SagaKaydirilmis: Story = {
  args: {
    before: OncekiSurum,
    after: YeniSurum,
    position: 72,
    beforeLabel: "Staging",
    afterLabel: "Production",
  },
};
