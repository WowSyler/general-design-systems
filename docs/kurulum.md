# Kurulum ve kullanım

Tasarım sistemi üç paket olarak **GitHub Packages** üzerinden dağıtılır. Üçü
her zaman **aynı sürümle** yayınlanır.

| Paket | İçerik | Kimler kullanır |
|---|---|---|
| `@wowsyler/ds-tokens` | Temalar (5 proje × light/dark), CSS değişkenleri, Tailwind v3 preset'i, Tailwind v4 köprüsü, fontlar, React Native tema objeleri | Hepsi (diğer iki paket bağımlılık olarak getirir) |
| `@wowsyler/ds-ui` | React web bileşenleri (Radix + Tailwind), `DsThemeProvider`, hazır `styles.css` | Next.js / Vite web uygulamaları |
| `@wowsyler/ds-ui-native` | React Native bileşenleri (StyleSheet, NativeWind yok), `NativeThemeProvider`, `./charts` | Expo / React Native uygulamaları |

İçindekiler:

- [1. Registry erişimi (.npmrc + token)](#1-registry-erişimi-npmrc--token)
- [2. CI / Coolify / EAS'te token](#2-ci--coolify--eas-te-token)
- [3. Next.js (App Router)](#3-nextjs-app-router)
- [4. Vite + React](#4-vite--react)
- [5. Tailwind v3 preset'i (kendi Tailwind derlemeniz varsa)](#5-tailwind-v3-preseti-kendi-tailwind-derlemeniz-varsa)
- [6. Tailwind v4 projeleri](#6-tailwind-v4-projeleri)
- [7. Expo / React Native](#7-expo--react-native)
- [8. Tema, karanlık mod ve RTL](#8-tema-karanlık-mod-ve-rtl)
- [9. Sürüm yükseltme ve yayın](#9-sürüm-yükseltme-ve-yayın)
- [Sık karşılaşılan sorunlar](#sık-karşılaşılan-sorunlar)

---

## 1. Registry erişimi (.npmrc + token)

GitHub Packages'taki npm paketleri, repo herkese açık olsa bile **kimlik
doğrulamalı** kurulur.

1. GitHub → **Settings → Developer settings → Personal access tokens →
   Tokens (classic)** → yeni token, yalnızca **`read:packages`** yetkisi.
   (GitHub Packages npm registry'si fine-grained token'ları desteklemez.)
2. Token'ı ortam değişkeni olarak tanımlayın — dosyaya **yazmayın**:

   ```bash
   # ~/.zshrc veya ~/.bashrc
   export NPM_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
   ```

3. Tüketen projenin köküne `.npmrc` ekleyin (bu dosya commit'lenebilir, token
   içermez):

   ```ini
   @wowsyler:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NPM_TOKEN}
   ```

4. Kurulum:

   ```bash
   pnpm add @wowsyler/ds-ui @wowsyler/ds-tokens          # web
   pnpm add @wowsyler/ds-ui-native @wowsyler/ds-tokens   # React Native
   ```

   npm ve yarn da aynı `.npmrc` ile çalışır.

## 2. CI / Coolify / EAS'te token

Kurulumun yapıldığı her ortamda `NPM_TOKEN` tanımlı olmalıdır.

- **GitHub Actions:** `read:packages` yetkili PAT'ı repo secret'ı (`NPM_TOKEN`)
  olarak ekleyin. Alternatif: paket sayfasında *Package settings → Manage
  Actions access* bölümüne tüketen repoyu ekleyip `secrets.GITHUB_TOKEN`
  kullanmak.

  ```yaml
  - run: pnpm install --frozen-lockfile
    env:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
  ```

- **Coolify:** uygulamanın *Environment Variables* bölümüne `NPM_TOKEN` ekleyin
  ve **"Build Variable"** olarak işaretleyin (kurulum build sırasında yapılır).
  Dockerfile ile derleniyorsa token'ı build argümanı olarak alın ve imaja
  sızdırmayın:

  ```dockerfile
  FROM node:22-alpine AS deps
  ARG NPM_TOKEN
  WORKDIR /app
  COPY package.json pnpm-lock.yaml .npmrc ./
  RUN corepack enable && NPM_TOKEN=$NPM_TOKEN pnpm install --frozen-lockfile
  # Sonraki aşamalara yalnızca node_modules kopyalanır; .npmrc zaten token içermez.
  ```

- **EAS Build (Expo):** `eas env:create --name NPM_TOKEN --value ghp_… --visibility secret`
  (veya EAS panelinde *Environment variables*). `.npmrc` repoda olduğu sürece
  EAS kurulumda otomatik kullanır.

## 3. Next.js (App Router)

En hızlı yol: hazır, kendi kendine yeterli CSS.

```tsx
// app/layout.tsx
import type { ReactNode } from "react";
import { DsThemeProvider } from "@wowsyler/ds-ui";
import "@wowsyler/ds-tokens/fonts.css";   // tema fontları (yerel woff2)
import "@wowsyler/ds-ui/styles.css";      // tema değişkenleri + tüm bileşen stilleri

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // Sunucuda tema sınıfını da verin: ilk boyamada renk sıçraması olmaz
    <html lang="tr" className="theme-randevu" suppressHydrationWarning>
      <body>
        <DsThemeProvider defaultTheme="randevu" defaultMode="system">
          {children}
        </DsThemeProvider>
      </body>
    </html>
  );
}
```

```js
// next.config.mjs — ÖNERİLİR
export default {
  experimental: {
    // Barrel import'larını ({ Button } from "@wowsyler/ds-ui") doğrudan modüle çevirir.
    // Olmadan tek bir bileşen bile tüm client modüllerini sayfaya taşır
    // (ölçüm: ~400 kB → ~148 kB First Load JS).
    optimizePackageImports: ["@wowsyler/ds-ui"],
  },
};
```

**Server / client sınırı.** Paket dosya başına ESM olarak derlenir; hook, olay
işleyicisi ya da Radix kullanan her modül kendi `"use client"` direktifini
taşır. Bu yüzden:

- Server component'lerde bileşenleri doğrudan kullanabilirsiniz
  (`<Card>`, `<Button>`, `<StatCard>` …) — interaktif olanlar otomatik olarak
  client sınırı olur.
- `cn()`, `buttonVariants()`, `badgeVariants()` gibi saf yardımcılar server'da
  **çağrılabilir**.
- `useDsTheme`, `useBreakpoint` gibi hook'lar yalnızca `"use client"`
  dosyalarında kullanılır (React kuralı).

## 4. Vite + React

İki seçenek var:

- **Hazır CSS** (Tailwind kullanmıyorsanız): `main.tsx`'te
  `import "@wowsyler/ds-tokens/fonts.css"; import "@wowsyler/ds-ui/styles.css";`
- **Kendi Tailwind v3 derlemeniz varsa:** bir sonraki bölümdeki preset'i
  kullanın ve `styles.css`'i **import etmeyin** (Tailwind temel stilleri iki
  kez yüklenir).

```tsx
// main.tsx
import { createRoot } from "react-dom/client";
import { DsThemeProvider, Button } from "@wowsyler/ds-ui";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <DsThemeProvider defaultTheme="dolap" defaultMode="system">
    <Button>Kaydet</Button>
  </DsThemeProvider>,
);
```

## 5. Tailwind v3 preset'i (kendi Tailwind derlemeniz varsa)

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";
import dsUiPreset, { dsUiContent } from "@wowsyler/ds-ui/tailwind-preset";

export default {
  presets: [dsUiPreset],
  // dsUiContent: paketin derlenmiş bileşenleri — bileşen sınıfları CSS'e girsin
  content: ["./index.html", "./src/**/*.{ts,tsx}", dsUiContent],
} satisfies Config;
```

```css
/* src/index.css */
@import "@wowsyler/ds-tokens/fonts.css";
@import "@wowsyler/ds-tokens/css/themes.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

`dsUiPreset` şunları içerir: tüm semantik renkler (`bg-primary`,
`text-muted-foreground`, `bg-chart-1` …), tema yarıçapları ve fontları,
animasyonlar (`tailwindcss-animate` dahil), giriş cihazı variant'ları
(`pointer-coarse:`, `pointer-fine:`, `hover-none:`, `hover-hover:`) ve
`touch-hitbox` utility'si (dokunmatik cihazlarda görseli değiştirmeden ≥44px
dokunma alanı). Yalnızca tokenları isteyen projeler
`import { dsPreset } from "@wowsyler/ds-tokens/tailwind-preset"` kullanabilir.

Kendi kodunuzda da **yalnızca semantik sınıfları** kullanın (`bg-primary`,
`border-border`); ham renk (`bg-violet-600`) tema değişince uyum sağlamaz.

## 6. Tailwind v4 projeleri

Bileşen stilleri Tailwind v3 ile önceden derlenmiştir; v4 projelerinde:

```css
/* app.css */
@import "tailwindcss";
@import "@wowsyler/ds-tokens/css/v4-bridge.css";  /* bg-primary vb. utility'leri DS değişkenlerine bağlar */
@import "@wowsyler/ds-tokens/fonts.css";
@import "@wowsyler/ds-ui/styles.css";             /* DS bileşenlerinin stilleri + tema değişkenleri */
```

- Kendi yazdığınız utility'ler (`bg-primary`, `rounded-lg`, `font-sans` …) v4
  köprüsüyle DS temasına bağlanır.
- DS bileşenlerinin sınıfları `styles.css`'ten gelir; v4'ün bunları yeniden
  üretmesi gerekmez.
- v4'te `pointer-coarse:` yerleşiktir; `hover-none:` gerekiyorsa:
  `@custom-variant hover-none (@media (hover: none));`

## 7. Expo / React Native

```bash
pnpm add @wowsyler/ds-ui-native @wowsyler/ds-tokens react-native-safe-area-context
# Grafikler (./charts) kullanılacaksa:
npx expo install react-native-svg
```

```tsx
import { NativeThemeProvider, Screen, Button, ListRow, useBreakpoint } from "@wowsyler/ds-ui-native";
import { DonutChart } from "@wowsyler/ds-ui-native/charts"; // yalnızca react-native-svg kuruluysa

export default function App() {
  return (
    <NativeThemeProvider
      theme="fisly"
      mode="system"
      // İsteğe bağlı: expo-font ile yüklenen aileler (tek ad ya da ağırlık haritası)
      fonts={{
        body: { regular: "Inter_400Regular", medium: "Inter_500Medium", bold: "Inter_700Bold" },
        heading: "PlayfairDisplay_700Bold",
      }}
    >
      <Screen>
        <Button title="Kaydet" onPress={() => {}} />
      </Screen>
    </NativeThemeProvider>
  );
}
```

- **Metro** paketi `react-native` alanı/export koşuluyla doğrudan TypeScript
  kaynağından (`src/`) derler; ek Babel ayarı gerekmez. Tip çözümlemesi Expo'nun
  `tsconfig.base` ayarıyla (`customConditions: ["react-native"]`) ya da
  `dist/*.d.ts` üzerinden çalışır.
- **Expo SDK 52 ve öncesi (ör. Fisly):** Metro'da package `exports` desteği
  varsayılan kapalıdır; ana giriş çalışır ama `@wowsyler/ds-ui-native/charts`
  alt yolu için açın:

  ```js
  // metro.config.js
  const { getDefaultConfig } = require("expo/metro-config");
  const config = getDefaultConfig(__dirname);
  config.resolver.unstable_enablePackageExports = true;
  module.exports = config;
  ```
- Peer bağımlılıklar: `react >=18`, `react-native >=0.76`,
  `react-native-safe-area-context >=4.12`, isteğe bağlı `react-native-svg`
  (yalnız `./charts`). Reanimated / gesture-handler **gerekmez**.
- Tablet: `useBreakpoint()` (`isPhone`, `isTablet`, `isLandscape`, `up("md")`),
  `useResponsiveValue({ base, md, lg })`, `<Show>` / `<Hide>`; `Screen` tablette
  içeriği okunabilir genişlikte ortalar.
- RTL: `I18nManager.isRTL` otomatik okunur; `direction="rtl"` ile
  zorlanabilir, `useIsRTL()` hook'u mevcuttur.
- NativeWind kullanan projeler (Dolap mobil) aynı renkler için
  `@wowsyler/ds-tokens/tailwind-preset`'i NativeWind'in `presets` alanına
  ekleyebilir.

## 8. Tema, karanlık mod ve RTL

**Web — `DsThemeProvider`:**

| Prop | Varsayılan | Açıklama |
|---|---|---|
| `defaultTheme` / `theme` | `"deploylens"` | `deploylens` · `dolap` · `randevu` · `glowscan` · `fisly` |
| `defaultMode` / `mode` | `"system"` | `light` · `dark` · `system` |
| `defaultDir` / `dir` | `"ltr"` | `ltr` · `rtl` — Radix bileşenlerine de iletilir |
| `applyTo` | `"root"` | `root`: `<html>`'e sınıf/`dir` yazar (uygulamalar). `self`: sarmalayıcı `div`'e uygular (önizleme, iç içe tema) |

`default*` prop'ları kontrolsüz, `theme`/`mode`/`dir` kontrollü kullanım içindir.

```tsx
"use client";
import { ThemeSelect, ThemeModeToggle, ThemeDirectionToggle, useDsTheme } from "@wowsyler/ds-ui";

const { theme, setTheme, mode, setMode, resolvedMode, dir, setDir } = useDsTheme();
```

- Tailwind olmadan da çalışır: tema sınıfı (`theme-<ad>`) ya da
  `data-theme="<ad>"` + `dark` sınıfı CSS değişkenlerini değiştirir.
- **RTL:** bileşenler mantıksal utility'ler (`ms-*`, `pe-*`, `start-*`,
  `text-start`) kullanır; `dir="rtl"` ile otomatik aynalanır. Kendi kodunuzda da
  `ml-*`/`left-*` yerine mantıksal karşılıklarını tercih edin.

**React Native — `NativeThemeProvider`:** `theme`, `mode`, `fonts`,
`direction`; `useNativeTheme()` → `theme` (çözümlenmiş renk/ölçek), `mode`,
`setMode`, `toggle`, `fonts`, `direction`.

## 9. Sürüm yükseltme ve yayın

Sürümler [Changesets](https://github.com/changesets/changesets) ile yönetilir.
Üç paket **sabit grup**tur: biri yükselince hepsi aynı sürüme geçer.

**Katkı verenler için (bu repo):**

1. Değişikliği yapın, ardından `pnpm changeset` → paketleri ve sürüm tipini
   seçin (`patch` hata düzeltme, `minor` yeni özellik, `major` kırıcı
   değişiklik), açıklama yazın. Oluşan `.changeset/*.md` dosyasını PR'a ekleyin.
2. PR `main`'e birleşince **Release** iş akışı bir *"chore(release): paket
   sürümleri"* PR'ı açar (sürüm numaraları + CHANGELOG).
3. O PR birleştirildiğinde paketler derlenip GitHub Packages'a yayınlanır.

**Tüketiciler için:**

```bash
pnpm up "@wowsyler/ds-*" --latest
```

Değişiklikler her paketin `CHANGELOG.md` dosyasındadır. `major` yükseltmelerde
CHANGELOG'daki geçiş notlarını okuyun.

## Sık karşılaşılan sorunlar

| Belirti | Neden / çözüm |
|---|---|
| `401 Unauthorized` / `404 Not Found` (kurulumda) | `NPM_TOKEN` tanımlı değil ya da `read:packages` yetkisi yok; `.npmrc`'deki `@wowsyler:registry` satırını kontrol edin. |
| Butonlar beyaz, renkler yok | Tema CSS'i yüklenmemiş: `styles.css` (veya `css/themes.css`) import edilmeli ve `<html>`/sarmalayıcıda `theme-<ad>` sınıfı olmalı. |
| Menü/diyalog içeriği serif fontla ya da temasız görünüyor | `DsThemeProvider`'ı `applyTo="root"` ile kullanın; portal içerikleri tema değişkenlerini `<html>`'den alır. |
| Kendi Tailwind derlemenizde bileşenler stilsiz | `content` dizisine `dsUiContent` eklenmemiş. |
| Next.js'te sayfa JS'i çok büyük | `experimental.optimizePackageImports: ["@wowsyler/ds-ui"]` ekleyin. |
| RN'de `./charts` import hatası | `react-native-svg` kurulu değil (`npx expo install react-native-svg`). |
