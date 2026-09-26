import type { Meta, StoryObj } from "@storybook/react-vite";
import { BudgetBar, Card, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/BudgetBar", component: BudgetBar, ...nativeMeta, args: { label: "Market", spent: 2400, limit: 4000 } } satisfies Meta<typeof BudgetBar>;
export default meta;

export const Durumlar: StoryObj<typeof meta> = {
  render: () => (
    <Card>
      <VStack gap="lg">
        <BudgetBar label="Market" spent={2400} limit={4000} />
        <BudgetBar label="Eğlence" spent={1720} limit={2000} />
        <BudgetBar label="Ulaşım" spent={1380} limit={1200} />
      </VStack>
    </Card>
  ),
};
