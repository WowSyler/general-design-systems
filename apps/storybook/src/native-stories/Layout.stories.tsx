import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, Container, Grid, HStack, Hide, Show, Stack, Text, VStack, useBreakpoint } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Layout", component: Stack, ...nativeMeta } satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

function Box({ label }: { label: string }) {
  return (
    <Card elevation="none">
      <Text variant="bodyMedium">{label}</Text>
    </Card>
  );
}

function BreakpointInfo() {
  const bp = useBreakpoint();
  return (
    <Text variant="caption">
      {`${bp.width}×${bp.height} · kırılım: ${bp.breakpoint} · ${bp.isTablet ? "tablet" : "telefon"} · ${bp.isLandscape ? "yatay" : "dikey"}`}
    </Text>
  );
}

export const StackVeGrid: Story = {
  render: () => (
    <VStack gap="lg">
      <BreakpointInfo />
      <HStack gap="sm" wrap>
        <Box label="HStack 1" />
        <Box label="HStack 2" />
        <Box label="HStack 3" />
      </HStack>
      <Text variant="overline">Grid — base 1 · md 2 · lg 3</Text>
      <Grid>
        <Box label="Hücre A" />
        <Box label="Hücre B" />
        <Box label="Hücre C" />
      </Grid>
      <Text variant="overline">Grid — minItemWidth 140</Text>
      <Grid minItemWidth={140} gap="sm">
        {["1", "2", "3", "4", "5", "6"].map((n) => (
          <Box key={n} label={`Öğe ${n}`} />
        ))}
      </Grid>
    </VStack>
  ),
};

export const ContainerVeShowHide: Story = {
  render: () => (
    <Container size="sm" padded={false}>
      <VStack gap="md">
        <Show device="tablet">
          <Box label="Yalnızca tablette görünür" />
        </Show>
        <Hide device="tablet">
          <Box label="Yalnızca telefonda görünür" />
        </Hide>
        <Box label="Container size=sm (480pt)" />
      </VStack>
    </Container>
  ),
};
