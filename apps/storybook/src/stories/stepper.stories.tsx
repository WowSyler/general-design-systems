import type { Meta, StoryObj } from "@storybook/react";

import { Steps, type StepItem } from "@ds/ui";

const meta: Meta<typeof Steps> = {
  title: "Composites/Steps",
  component: Steps,
};

export default meta;
type Story = StoryObj<typeof Steps>;

const onboardingSteps: StepItem[] = [
  {
    label: "İşletme Adı",
    description: "Salonunun adı ve iletişim bilgileri",
  },
  {
    label: "Modüller",
    description: "Randevu, hatırlatma ve ödeme modüllerini seç",
  },
  {
    label: "Saat Dilimi",
    description: "Çalışma saatlerini ve tatil günlerini belirle",
  },
  {
    label: "Özet",
    description: "Bilgileri kontrol et ve yayına al",
  },
];

export const Horizontal: Story = {
  args: {
    steps: onboardingSteps,
    current: 1,
    orientation: "horizontal",
    className: "max-w-3xl",
  },
};

export const Vertical: Story = {
  args: {
    steps: onboardingSteps,
    current: 1,
    orientation: "vertical",
  },
};

export const TamamlanmisAkis: Story = {
  args: {
    steps: onboardingSteps,
    current: 3,
    orientation: "horizontal",
    className: "max-w-3xl",
  },
};
