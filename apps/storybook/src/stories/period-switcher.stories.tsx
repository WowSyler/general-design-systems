import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { PeriodSwitcher } from "@wowsyler/ds-ui";

const meta: Meta<typeof PeriodSwitcher> = {
  title: "Composites/PeriodSwitcher",
  component: PeriodSwitcher,
};

export default meta;
type Story = StoryObj<typeof PeriodSwitcher>;

const aylar = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

function InteraktifOrnek() {
  const [segment, setSegment] = React.useState("ay");
  const [ayIndex, setAyIndex] = React.useState(6);
  const [ceyrekIndex, setCeyrekIndex] = React.useState(2);

  const isAy = segment === "ay";
  const periodLabel = isAy
    ? `${aylar[ayIndex]} 2026`
    : `${ceyrekIndex + 1}. Çeyrek 2026`;

  const handlePrevious = () => {
    if (isAy) {
      setAyIndex((i) => (i + 11) % 12);
    } else {
      setCeyrekIndex((i) => (i + 3) % 4);
    }
  };

  const handleNext = () => {
    if (isAy) {
      setAyIndex((i) => (i + 1) % 12);
    } else {
      setCeyrekIndex((i) => (i + 1) % 4);
    }
  };

  return (
    <PeriodSwitcher
      options={[
        { value: "ay", label: "Ay" },
        { value: "ceyrek", label: "Çeyrek" },
      ]}
      value={segment}
      onValueChange={setSegment}
      onPrevious={handlePrevious}
      onNext={handleNext}
      periodLabel={periodLabel}
    />
  );
}

export const Interaktif: Story = {
  render: () => <InteraktifOrnek />,
};

function SadeceSegmentOrnek() {
  const [value, setValue] = React.useState("ay");
  return (
    <PeriodSwitcher
      options={[
        { value: "hafta", label: "Hafta" },
        { value: "ay", label: "Ay" },
        { value: "yil", label: "Yıl" },
      ]}
      value={value}
      onValueChange={setValue}
    />
  );
}

export const SadeceSegmentler: Story = {
  render: () => <SadeceSegmentOrnek />,
};
