import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, ErrorState, LoadingState, Spinner, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/LoadingErrorState", component: LoadingState, ...nativeMeta } satisfies Meta<typeof LoadingState>;
export default meta;

export const Durumlar: StoryObj<typeof meta> = {
  render: () => (
    <VStack gap="lg">
      <Spinner label="Kaydediliyor…" />
      <Card>
        <LoadingState message="Analiz sonuçları yükleniyor…" />
      </Card>
      <Card>
        <LoadingState skeleton lines={3} />
      </Card>
      <Card>
        <ErrorState onRetry={() => undefined} />
      </Card>
    </VStack>
  ),
};
