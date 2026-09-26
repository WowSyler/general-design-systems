/**
 * React Native story desteği: Storybook toolbar'ındaki tema / mod / yön
 * global'lerini (preview.tsx) okuyup bileşenleri NativeThemeProvider ile sarar.
 * Bileşenler react-native-web üzerinden gerçek RN kodu olarak render edilir.
 */
import * as React from "react";
import type { Decorator } from "@storybook/react-vite";
import { NativeThemeProvider, VStack, useNativeTheme } from "@wowsyler/ds-ui-native";

function Surface({ children }: { children: React.ReactNode }) {
  const { theme } = useNativeTheme();
  return (
    <VStack
      gap="lg"
      style={{
        backgroundColor: theme.colors.background,
        // Web sarmalayıcısının (p-4) içinde tam genişlik kaplar.
        width: "100%",
        minHeight: 120,
      }}
    >
      {children}
    </VStack>
  );
}

export const withNativeTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as string) ?? "deploylens";
  const mode = (context.globals.mode as "light" | "dark") ?? "light";
  const direction = (context.globals.direction as "ltr" | "rtl") ?? "ltr";
  return (
    <NativeThemeProvider theme={theme} mode={mode} direction={direction}>
      <Surface>
        <Story />
      </Surface>
    </NativeThemeProvider>
  );
};

/** Story düzeyinde ortak parametreler. */
export const nativeParameters = {
  layout: "fullscreen",
  docs: { description: { component: "React Native bileşeni — react-native-web ile önizlenir." } },
} as const;
