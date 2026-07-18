# desing-systems

5 projeye hizmet eden merkezi tasarım sistemi monorepo'su: tek semantik token
şeması, proje başına tema (light + dark), shadcn tabanlı web bileşen havuzu,
React Native bileşen paketi ve Storybook kataloğu.

## Temalar

| Tema | Proje | Kimlik |
|---|---|---|
| `deploylens` | browser-compare | Marka mavisi #0B5CFF, nötr gri eksen |
| `dolap` | myDolapApp (web+mobil) | Violet #7C3AED, zinc nötrler |
| `randevu` | appointment-global | Indigo #4F46E5, zinc nötrler |
| `glowscan` | face-analizy-app | Gül/leylak #B34F82, krem zemin, serif tipografi |
| `fisly` | gider-gelir-takibi-app | Zümrüt #047857/#10B981, slate nötrler |

## Paketler

- **`@ds/tokens`** — tek doğruluk kaynağı. Çıktılar: tema başına CSS custom
  properties (`dist/css/*.css`), Tailwind v3 preset (`/tailwind-preset`),
  Tailwind v4 köprüsü (`css/v4-bridge.css`), RN tema objeleri (`/native`).
- **`@ds/ui`** — web bileşen havuzu (React + Tailwind v3). 39 shadcn primitifi,
  9 layout bileşeni, 16 kompozit, çoklu-tema `DsThemeProvider`.
- **`@ds/ui-native`** — React Native bileşenleri (token + StyleSheet,
  NativeWind bağımlılığı yok). `NativeThemeProvider` + temel primitifler.
- **`apps/storybook`** — katalog: 5 tema × light/dark × responsive viewport.

## Kullanım (web, Tailwind v3)

```ts
// tailwind.config.ts
import { dsPreset } from "@ds/tokens/tailwind-preset";
export default { presets: [dsPreset], darkMode: "class", ... };
```

```tsx
import "@ds/tokens/css/themes.css";
import { DsThemeProvider, Button } from "@ds/ui";

<DsThemeProvider defaultTheme="dolap" defaultMode="system">
  <Button>Kaydet</Button>
</DsThemeProvider>
```

Tailwind v4 projeleri (Randevu admin): `@import "tailwindcss";` sonrasında
`@ds/tokens/css/v4-bridge.css` ve `themes.css` import edilir.

## Kullanım (React Native)

```tsx
import { NativeThemeProvider, Button, useNativeTheme } from "@ds/ui-native";
import { getTheme } from "@ds/tokens/native";

<NativeThemeProvider theme="fisly" mode="system">
  <Button title="Kaydet" onPress={...} />
</NativeThemeProvider>
```

## Komutlar

```bash
pnpm build        # tüm paketleri derle (turbo)
pnpm storybook    # kataloğu aç (localhost:6006)
```

## Yeni proje teması ekleme

1. `packages/tokens/src/themes/<ad>.ts` — `ThemeDefinition` doldur
2. `themes/index.ts` kaydına ekle
3. `pnpm build` — CSS/preset/native çıktıları otomatik üretilir
