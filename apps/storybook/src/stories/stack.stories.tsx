import type { Meta, StoryObj } from "@storybook/react-vite";

import { HStack, Stack, VStack } from "@wowsyler/ds-ui";

const meta: Meta<typeof Stack> = {
  title: "Layout/Stack",
  component: Stack,
};

export default meta;
type Story = StoryObj<typeof Stack>;

const Box = ({ label }: { label: string }) => (
  <div className="rounded-md bg-muted px-4 py-3 text-sm font-medium text-muted-foreground">
    {label}
  </div>
);

export const Vertical: Story = {
  render: () => (
    <VStack gap="md">
      <Box label="Fisly — Ocak gelirleri" />
      <Box label="Fisly — Ocak giderleri" />
      <Box label="Fisly — Net bakiye" />
    </VStack>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <HStack gap="md" wrap>
      <Box label="Gardırop" />
      <Box label="Kombinler" />
      <Box label="Lookbook" />
      <Box label="Stilist" />
    </HStack>
  ),
};

export const GapScale: Story = {
  render: () => (
    <VStack gap="xl">
      {(["none", "xs", "sm", "md", "lg", "xl"] as const).map((gap) => (
        <div key={gap}>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            gap=&quot;{gap}&quot;
          </p>
          <HStack gap={gap}>
            <Box label="Sabah" />
            <Box label="Öğle" />
            <Box label="Akşam" />
          </HStack>
        </div>
      ))}
    </VStack>
  ),
};

export const AlignAndJustify: Story = {
  render: () => (
    <VStack gap="lg">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          justify=&quot;between&quot; + align=&quot;center&quot; — Randevu üst çubuğu
        </p>
        <HStack
          justify="between"
          align="center"
          className="rounded-lg border border-border p-4"
        >
          <Box label="Kadıköy Kuaför Salonu" />
          <Box label="Bugün 12 randevu" />
        </HStack>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          justify=&quot;center&quot; — GlowScan analiz özeti
        </p>
        <HStack
          justify="center"
          gap="sm"
          className="rounded-lg border border-border p-4"
        >
          <Box label="Nem: 62" />
          <Box label="Elastikiyet: 71" />
          <Box label="Skor: 78" />
        </HStack>
      </div>
    </VStack>
  ),
};
