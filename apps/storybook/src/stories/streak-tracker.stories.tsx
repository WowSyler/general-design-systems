import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { StreakTracker } from "@wowsyler/ds-ui";

type StreakTrackerDay = React.ComponentProps<typeof StreakTracker>["days"];

const meta: Meta<typeof StreakTracker> = {
  title: "Composites/StreakTracker",
  component: StreakTracker,
};

export default meta;
type Story = StoryObj<typeof StreakTracker>;

const sonYediGun: StreakTrackerDay = [
  { completed: true, label: "Pzt" },
  { completed: true, label: "Sal" },
  { completed: true, label: "Çar" },
  { completed: false, label: "Per" },
  { completed: true, label: "Cum" },
  { completed: true, label: "Cmt" },
  { completed: true, label: "Bug", today: true },
];

export const GlowScanRutin: Story = {
  args: {
    title: "GlowScan · Bakım rutini",
    currentStreak: 12,
    longestStreak: 34,
    days: sonYediGun,
    tone: "primary",
  },
};

export const FislyGunlukGiris: Story = {
  args: {
    title: "Fisly · Günlük giriş",
    currentStreak: 5,
    longestStreak: 21,
    unit: "gün",
    shape: "square",
    tone: "success",
    days: [
      { completed: true, label: "P" },
      { completed: true, label: "S" },
      { completed: false, label: "Ç" },
      { completed: true, label: "P" },
      { completed: true, label: "C" },
      { completed: true, label: "C" },
      { completed: true, label: "P", today: true },
    ],
  },
};

export const YeniBaslayan: Story = {
  args: {
    title: "GlowScan · Nem takibi",
    currentStreak: 1,
    longestStreak: 8,
    tone: "warning",
    days: [
      { completed: false, label: "Pzt" },
      { completed: false, label: "Sal" },
      { completed: false, label: "Çar" },
      { completed: false, label: "Per" },
      { completed: false, label: "Cum" },
      { completed: false, label: "Cmt" },
      { completed: true, label: "Bug", today: true },
    ],
  },
};

export const SeriKoparildi: Story = {
  args: {
    title: "Fisly · Bütçe kaydı",
    currentStreak: 0,
    longestStreak: 47,
    shape: "square",
    tone: "warning",
    message: "Serin koptu ama sorun değil, bugün yeniden başlayabilirsin.",
    days: [
      { completed: true, label: "Pzt" },
      { completed: true, label: "Sal" },
      { completed: false, label: "Çar" },
      { completed: false, label: "Per" },
      { completed: false, label: "Cum" },
      { completed: false, label: "Cmt" },
      { completed: false, label: "Bug", today: true },
    ],
  },
};

export const SeriListesi: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
      <StreakTracker
        title="GlowScan · Sabah rutini"
        currentStreak={28}
        longestStreak={28}
        tone="success"
        days={sonYediGun}
      />
      <StreakTracker
        title="Fisly · Harcama günlüğü"
        currentStreak={3}
        longestStreak={19}
        shape="square"
        days={[
          { completed: false, label: "Pzt" },
          { completed: false, label: "Sal" },
          { completed: false, label: "Çar" },
          { completed: false, label: "Per" },
          { completed: true, label: "Cum" },
          { completed: true, label: "Cmt" },
          { completed: true, label: "Bug", today: true },
        ]}
      />
    </div>
  ),
};
