# @wowsyler/ds-ui-native

React Native bileşen kütüphanesi. `@wowsyler/ds-tokens` temalarını kullanır (5 proje × light/dark). Stiller token + `StyleSheet` ile yazılır; NativeWind, reanimated ve gesture-handler gerekmez.

- **~80 bileşen**: form, geri bildirim, yerleşim, gezinme, domain (Fisly, Dolap, GlowScan) ve `./charts`
- **Tablet desteği**: `useBreakpoint`, `Grid`, `Screen` içeriği 720pt'de ortalar, `Sheet`/`ConfirmDialog`/`Select` tablette ortada kart olarak açılır, `AdaptiveNavigation` telefonda BottomNav, tablette NavigationRail gösterir
- **Erişilebilirlik**: rol ve durum bilgisi, en az 44pt dokunma hedefi, `maxFontSizeMultiplier` 1.6, "hareketi azalt" tercihine uyum
- **RTL**: yerleşim start/end ile yapılır, yön okları aynalanır, `useIsRTL()` ile yön okunabilir

## Kurulum

```bash
pnpm add @wowsyler/ds-ui-native @wowsyler/ds-tokens react-native-safe-area-context
# Grafikler için (opsiyonel):
pnpm add react-native-svg
```

Peer bağımlılıklar: `react >= 18`, `react-native >= 0.76`, `react-native-safe-area-context >= 4.12`. `react-native-svg >= 13` yalnızca `@wowsyler/ds-ui-native/charts` kullanılıyorsa gerekir.

Metro, `react-native` alanı üzerinden doğrudan TypeScript kaynağını (`src/`) okur. Diğer araçlar derlenmiş `dist/` klasörünü (ESM ve `.d.ts`) kullanır.

## Kullanım

```tsx
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeThemeProvider, Screen, Header, Button, TransactionRow } from "@wowsyler/ds-ui-native";
import { DonutChart } from "@wowsyler/ds-ui-native/charts";

export function App() {
  return (
    <SafeAreaProvider>
      <NativeThemeProvider
        theme="fisly"
        mode="system"
        // Opsiyonel: yüklü fontlar (expo-google-fonts adları, ağırlık haritası)
        fonts={{ body: { regular: "Archivo_400Regular", semibold: "Archivo_600SemiBold", bold: "Archivo_700Bold" } }}
      >
        <Screen scroll>
          <Header title="Özet" />
          <DonutChart data={[{ label: "Market", value: 3420 }, { label: "Ulaşım", value: 1250 }]} />
          <TransactionRow title="Migros" subtitle="22 Eyl · Market" amount={-342.5} />
          <Button title="Fiş tara" fullWidth />
        </Screen>
      </NativeThemeProvider>
    </SafeAreaProvider>
  );
}
```

`SafeAreaProvider` kullanılmıyorsa bileşenler güvenli alan boşluğunu 0 kabul eder. Bu durumda `Screen` native'de yerleşik `SafeAreaView`'a geçer.

## Bileşenler

| Grup | Bileşenler |
|---|---|
| Temel | Text, Button, IconButton, TextButton/Link, Card, Badge, Chip, StatusChip, ScoreBadge, Avatar, AvatarGroup, Divider, Spinner |
| Form | Input, TextArea, PasswordInput, SearchBar, OTPInput, FormField, Checkbox, RadioGroup, ToggleSwitch, Select, Slider, QuantityStepper, Calendar, DatePicker, TimeSlotPicker, NumericKeypad, CategoryPicker, CurrencyInput, SegmentedControl |
| Geri bildirim | Banner, OfflineBanner, Toast, LoadingState, ErrorState, EmptyState, SkeletonBlock/SkeletonText, ProgressBar, MetricBar, ConfirmDialog, ModalDialog, Sheet |
| Yerleşim | Screen, KeyboardAwareScreen, Stack/HStack/VStack, Grid, Container, Header/AppBar, SectionHeader, Accordion, SettingsGroup/SettingsRow, ListRow, SwipeableRow |
| Gezinme | BottomNav, NavigationRail, AdaptiveNavigation, Tabs |
| Domain | TransactionRow, PeriodSwitcher, BudgetBar, MoneyText (Fisly) · ProductCard, PriceTag, Rating (Dolap) · SkinMetricCard, StatCard (GlowScan) |
| Grafik (`/charts`) | DonutChart, ProgressRing, BarChart, LineChart, Sparkline |
| Hook'lar | useNativeTheme, useIsRTL, useBreakpoint, useResponsiveValue, Show/Hide, useReducedMotion, useSafeInsets |

## Geliştirme

```bash
pnpm --filter @wowsyler/ds-ui-native typecheck
pnpm --filter @wowsyler/ds-ui-native test    # vitest + jsdom + react-native-web
pnpm --filter @wowsyler/ds-ui-native build   # dist/
pnpm storybook                      # Native/* story'leri (react-native-web)
```
