# desing-systems

> **5 ürüne hizmet eden çok-temalı, çok-platformlu merkezi tasarım sistemi.**
> Tek semantik token şeması → proje başına tema (light + dark) → shadcn tabanlı
> **284 web bileşeni**, **25 React Native bileşeni** ve 280+ story'lik canlı
> Storybook kataloğu. Web · tablet · mobil için mobil-öncelikli, erişilebilir,
> tema-agnostik bileşenler.

<p>
  <img alt="Bileşen" src="https://img.shields.io/badge/web%20bile%C5%9Fen-284-0B5CFF">
  <img alt="RN" src="https://img.shields.io/badge/react%20native-25-7C3AED">
  <img alt="Tema" src="https://img.shields.io/badge/tema-5%20%C3%97%20light%2Fdark-047857">
  <img alt="Story" src="https://img.shields.io/badge/storybook-280%2B%20story-B34F82">
</p>

---

## İçindekiler

- [Genel bakış](#genel-bakış)
- [Temalar](#temalar)
- [Mimari](#mimari)
- [Paketler](#paketler)
- [Hızlı başlangıç](#hızlı-başlangıç)
- [Kullanım](#kullanım)
- [Tema yönetimi](#tema-yönetimi)
- [Responsive & adaptif tasarım](#responsive--adaptif-tasarım)
- [Erişilebilirlik](#erişilebilirlik)
- [Bileşen kataloğu](#bileşen-kataloğu)
- [Komutlar](#komutlar)
- [Proje yapısı](#proje-yapısı)
- [Genişletme](#genişletme)
- [Konvansiyonlar](#konvansiyonlar)

---

## Genel bakış

`desing-systems`, birbirinden çok farklı beş ürünü **tek bir tasarım dili**
altında toplayan bir monorepo'dur. Amaç: her proje kendi marka kimliğini
(renk, tipografi, yoğunluk) korurken; bileşenler, tokenlar ve erişilebilirlik
kuralları tek kaynaktan yönetilir.

Her bileşen **semantik tokenlar** üzerine kuruludur — `bg-primary`,
`text-muted-foreground`, `border-border` gibi. Böylece aynı `<Button />`,
`theme-<ad>` sınıfı ve `dark` modu değiştiğinde **hiçbir class değişmeden**
beş temaya ve light/dark moda otomatik uyum sağlar.

| | |
|---|---|
| **Ürün sayısı** | 5 (web + mobil) |
| **Web bileşeni** | 284 (9 kategori) |
| **RN bileşeni** | 25 |
| **Tema** | 5 × (light + dark) |
| **Stack** | React 18 · Tailwind v3 (v4 köprüsü) · Radix · React Native |
| **Yeni bağımlılık politikası** | Sıfır ekstra runtime bağımlılığı — mevcut Radix/cva/lucide üzerine kurulu |

## Temalar

Her tema `@ds/tokens` içinde bir `ThemeDefinition` olarak tanımlanır ve
build sırasında CSS custom property, Tailwind preset ve RN tema objesi olarak
üretilir.

| Tema | Proje | Kimlik | Tipografi |
|---|---|---|---|
| `deploylens` | **DeployLens** — browser-compare (DevOps aracı) | Marka mavisi `#0B5CFF`, nötr gri eksen | Sans |
| `dolap` | **Dolap** — myDolapApp (C2C moda pazaryeri, web+mobil) | Violet `#7C3AED`, zinc nötrler | Sans |
| `randevu` | **Randevu** — appointment-global (rezervasyon) | Indigo `#4F46E5`, zinc nötrler | Sans |
| `glowscan` | **GlowScan** — face-analizy-app (cilt analizi) | Gül/leylak `#B34F82`, krem zemin | Serif |
| `fisly` | **Fisly** — gider-gelir-takibi-app (finans) | Zümrüt `#047857`/`#10B981`, slate | Sans |

## Mimari

```
                       ┌─────────────────────┐
                       │     @ds/tokens      │  tek doğruluk kaynağı
                       │  ThemeDefinition ×5 │  (renk, ölçek, tipografi)
                       └──────────┬──────────┘
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
     dist/css/*.css      tailwind-preset        dist/native
   (CSS custom props)   (v3) + v4-bridge      (RN tema objeleri)
              │                   │                   │
              ▼                   ▼                   ▼
     ┌────────────────────────────────┐     ┌──────────────────┐
     │            @ds/ui              │     │  @ds/ui-native   │
     │  React + Tailwind v3 · 284     │     │  RN + StyleSheet │
     │  bileşen · DsThemeProvider     │     │  25 bileşen      │
     └────────────────┬───────────────┘     └──────────────────┘
                      ▼
              ┌──────────────┐
              │ apps/storybook│  5 tema × light/dark × responsive viewport
              └──────────────┘
```

Token akışı tek yönlüdür: **tokenlar değişir → tüm çıktılar yeniden üretilir →
bileşenler otomatik güncellenir.** Bileşenler asla sabit (hardcoded) renk
içermez.

## Paketler

- **`@ds/tokens`** — tek doğruluk kaynağı. Çıktılar: tema başına CSS custom
  properties (`dist/css/*.css`), Tailwind v3 preset (`/tailwind-preset`),
  Tailwind v4 köprüsü (`css/v4-bridge.css`), RN tema objeleri (`/native`).
  Ayrıca semantik ölçekler (`space`, `radius`, `fontSize`, `breakpoints`) ve
  tonlu gölgeler.
- **`@ds/ui`** — web bileşen havuzu (React + Tailwind v3). **284 bileşen**:
  41 shadcn primitifi (`ui`), 41 ek primitif (`ui-extras`), 14 layout, 11
  marketing, 17 commerce, 21 veri/grafik, 17 ikonik/imza, 119 kompozit, çoklu
  tema `DsThemeProvider`. 5 projeyi A-Z kapsar: arama/filtre, tarih/saat,
  bildirim, finans, DevOps-CI, booking, kamera-tarama, onboarding, ödeme,
  mobil-jest ve cihaza-uyarlanan (adaptif) desenler.
- **`@ds/ui-native`** — React Native bileşenleri (token + StyleSheet, NativeWind
  **yok**). `NativeThemeProvider` + **25 bileşen** (navigasyon, form, geri
  bildirim, layout primitifleri).
- **`apps/storybook`** — katalog: 5 tema × light/dark × responsive viewport,
  280+ story.

## Hızlı başlangıç

```bash
pnpm install
pnpm build        # tüm paketleri derle (turbo)
pnpm storybook    # kataloğu aç → http://localhost:6006
```

## Kullanım

### Web — Tailwind v3

```ts
// tailwind.config.ts
import { dsPreset } from "@ds/tokens/tailwind-preset";

export default {
  presets: [dsPreset],
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
};
```

```tsx
import "@ds/tokens/css/themes.css";
import { DsThemeProvider, Button, StatCard, DataTableAdvanced } from "@ds/ui";

export function App() {
  return (
    <DsThemeProvider defaultTheme="dolap" defaultMode="system">
      <Button>Kaydet</Button>
    </DsThemeProvider>
  );
}
```

### Web — Tailwind v4 (ör. Randevu admin)

```css
@import "tailwindcss";
@import "@ds/tokens/css/v4-bridge.css";
@import "@ds/tokens/css/themes.css";
```

### React Native

```tsx
import { NativeThemeProvider, Button, ListRow, BottomNav } from "@ds/ui-native";

export function App() {
  return (
    <NativeThemeProvider theme="fisly" mode="system">
      <Button title="Kaydet" onPress={onSave} />
    </NativeThemeProvider>
  );
}
```

## Tema yönetimi

`DsThemeProvider` beş temayı ve light/dark/system modunu yönetir. Kullanıcıya
tema/mod değiştirme için hazır bileşenler mevcuttur:

```tsx
import { ThemeSelect, ThemeModeToggle, useDsTheme } from "@ds/ui";

<ThemeSelect />        {/* 5 tema arasında geçiş */}
<ThemeModeToggle />    {/* light ↔ dark ↔ system */}

const { theme, mode, setTheme, setMode } = useDsTheme();
```

## Responsive & adaptif tasarım

Tasarım sistemi **mobil-öncelikli** ve **web · tablet · mobil** için tasarlanmıştır.

**Breakpoint'ler** (Tailwind ile aynı, `@ds/tokens`'tan):

| Ad | Genişlik | Tipik cihaz |
|---|---|---|
| `sm` | 640px | Büyük telefon |
| `md` | 768px | Tablet (dikey) |
| `lg` | 1024px | Tablet (yatay) / küçük dizüstü |
| `xl` | 1280px | Masaüstü |
| `2xl` | 1536px | Geniş ekran |

**İki katman ile responsive:**

1. **Akışkan bileşenler** — Bileşenlerin çoğu (%90+) Tailwind akışkan
   utility'leriyle (`max-w-full`, `flex-wrap`, `grid-cols-1 sm:grid-cols-2`,
   `overflow-x-auto`, `min-w-0`) her viewport'a kendiliğinden uyum sağlar.
   Grafikler dar kaplarda yatay kaydırılır, tablolar `overflow-x-auto` ile
   sarmalanır.

2. **Cihaza-uyarlanan (adaptif) bileşenler** — Aynı içeriği cihaza göre
   **farklı sunar**:

   | Bileşen | Masaüstü | Mobil |
   |---|---|---|
   | `ResponsiveDialog` | Radix Dialog (merkez) | Drawer (alttan) |
   | `ResponsiveMenu` | DropdownMenu | Bottom Sheet |
   | `AdaptiveNavigation` | Üst-nav / sidebar | BottomNav |
   | `ResponsiveTable` | `<table>` | Yığınlanmış kartlar |

**Responsive araç kutusu:**

```tsx
import {
  useBreakpoint, useMediaQuery, useBreakpointValue,  // hook'lar
  Show, Hide,           // breakpoint bazlı görünürlük (SSR-güvenli, CSS)
  SafeArea,             // mobil çentik/home-bar güvenli alanı (env(safe-area-*))
  AutoGrid,             // medya-sorgusuz auto-fit izgara
  TouchTarget,          // min 44px dokunma hedefi sarmalayıcı
  DevicePreview,        // telefon/tablet/masaüstü önizleme aracı
  PhoneFrame, TabletFrame, BrowserFrame,  // cihaz çerçeveleri (vitrin)
} from "@ds/ui";

const { isMobile, isTablet, isDesktop, breakpoint } = useBreakpoint();
const cols = useBreakpointValue({ base: 1, md: 2, lg: 3 });

<Show above="lg"><Sidebar /></Show>
<Hide above="lg"><BottomNav /></Hide>
```

Mobil-ağırlıklı ürünler (Dolap, GlowScan, Randevu) için ek olarak
`swipeable-row`, `pull-to-refresh`, `bottom-sheet-draggable`, `long-press-menu`
gibi dokunmatik jest desenleri ve tam `@ds/ui-native` paketi bulunur.

## Erişilebilirlik

Tüm bileşenler erişilebilirlik gözetilerek yazılmıştır:

- Doğru ARIA rolleri/durumları, klavye navigasyonu (Tab/ok/Enter/Escape),
  `focus-visible` halkaları, `sr-only` açıklamalar.
- Grafikler `role="img"` + Türkçe özet `aria-label` taşır.
- Mobilde ≥ 44px dokunma hedefleri; `TouchTarget` ile küçük ikonlar telafi edilir.
- Altyapı primitifleri: `VisuallyHidden`, `SkipLink`, `FocusTrap`,
  `LiveRegionAnnouncer`.

## Bileşen kataloğu

<details open>
<summary><b>Primitifler — <code>ui</code> (41, shadcn tabanlı)</b></summary>

`accordion` · `alert` · `alert-dialog` · `avatar` · `badge` · `breadcrumb` ·
`button` · `calendar` · `card` · `checkbox` · `collapsible` · `command` ·
`context-menu` · `dialog` · `drawer` · `dropdown-menu` · `form` · `hover-card` ·
`input` · `input-otp` · `label` · `pagination` · `popover` · `progress` ·
`radio-group` · `scroll-area` · `select` · `separator` · `sheet` · `sidebar` ·
`skeleton` · `slider` · `sonner` · `switch` · `table` · `tabs` · `textarea` ·
`toggle` · `toggle-group` · `tooltip` · `tree-view`
</details>

<details>
<summary><b>Ek primitifler — <code>ui-extras</code> (41)</b></summary>

`back-to-top` · `code-block` · `color-picker` · `color-swatches` · `combobox` ·
`copy-button` · `count-badge` · `currency-selector` · `date-picker` ·
`date-range-picker` · `focus-trap` · `form-field` · `git-ref` · `input-affix` ·
`kbd` · `language-selector` · `live-region-announcer` · `money-amount` ·
`month-year-picker` · `multi-select` · `number-field` · `password-input` ·
`phone-input` · `qr-code` · `range-calendar` · `search-bar` ·
`skeleton-templates` · `skip-link` · `slider-range` · `sort-dropdown` ·
`spinner` · `status-badge` · `status-dot` · `tag` · `time-picker` ·
`timezone-select` · `toggle-card` · `touch-target` · `trend-delta-badge` ·
`use-breakpoint` · `visually-hidden`
</details>

<details>
<summary><b>Layout — <code>layout</code> (14)</b></summary>

`app-shell` · `aspect-ratio` · `auth-shell` · `auto-grid` · `container` ·
`grid` · `marketing-shell` · `page-header` · `resizable-split-pane` ·
`safe-area` · `section` · `show` (Show/Hide) · `sidebar-shell` · `stack`
</details>

<details>
<summary><b>Marketing — <code>marketing</code> (11)</b></summary>

`centered-hero` · `cta-banner` · `feature-card` · `footer-columns` ·
`logo-cloud` · `media-hero` · `pricing-table` · `promo-banner` · `split-hero` ·
`stats-strip` · `testimonial-card`
</details>

<details>
<summary><b>Commerce — <code>commerce</code> (17)</b></summary>

`cart-line-item` · `checkout-order-summary` · `condition-selector` ·
`favorite-button` · `ingredient-list` · `make-offer-panel` ·
`payment-method-card` · `price-tag` · `product-card` · `product-match-card` ·
`provider-card` · `quantity-stepper` · `rating` · `rating-input` ·
`receipt-card` · `service-card` · `variant-size-selector`
</details>

<details>
<summary><b>Veri & grafik — <code>data</code> (21)</b></summary>

`activity-feed` · `area-chart` · `bar-chart` · `budget-ring` · `bullet-chart` ·
`candlestick-chart` · `compare-slider` · `donut-chart` · `funnel-chart` ·
`gauge-chart` · `grouped-bar-chart` · `heat-calendar` · `line-chart` ·
`pie-chart` · `progress-ring` · `radar-chart` · `scatter-plot` · `sparkline` ·
`stacked-bar-chart` · `uptime-bars` · `waterfall-chart`
</details>

<details>
<summary><b>İkonik / imza — <code>iconic</code> (17)</b></summary>

`animated-counter` · `announcement-bar` · `aurora-background` · `bento-grid` ·
`command-palette` · `countdown-timer` · `dock` · `gradient-mesh` · `kpi-tile` ·
`marquee` · `segmented-control` · `shimmer-button` · `shine-border` ·
`spotlight-card` · `stat-ring` · `tilt-card` · `timeline`
</details>

<details>
<summary><b>Kompozit — <code>composite</code> (119)</b></summary>

**Arama/Filtre:** `filter-panel` · `faceted-filter` · `active-filter-chips` ·
`filter-toolbar` · `bulk-action-bar` · `column-toggle`
**Bildirim & hesap:** `notification-bell` · `notification-center-panel` ·
`notification-preferences` · `notification-list` · `user-account-menu` ·
`account-switcher` · `settings-row-group`
**Veri & yükleme:** `data-table-advanced` · `data-table` · `load-more` ·
`infinite-scroll` · `cursor-pagination` · `description-list` ·
`export-share-menu` · `upload-file-list`
**Adaptif & cihaz:** `responsive-dialog` · `responsive-menu` ·
`responsive-table` · `adaptive-navigation` · `device-preview` · `phone-frame` ·
`tablet-frame` · `browser-frame` · `bottom-nav` · `nav-tabs`
**Onboarding & auth:** `onboarding-checklist` · `onboarding-carousel` ·
`product-tour-coachmark` · `welcome-modal` · `choice-card` · `setup-progress` ·
`auth-form` · `otp-verification` · `form-wizard` · `error-page-states`
**Dolap (pazaryeri):** `carousel` · `lightbox-viewer` ·
`listing-photo-uploader` · `make-offer-panel`* · `seller-profile-header` ·
`order-shipment-tracker` · `cart-drawer` · `mini-cart-badge` ·
`category-nav-tiles` · `conversation-list` · `message-composer` ·
`review-card` · `rating-summary` · `comment-thread` · `reaction-bar` ·
`share-buttons`
**Randevu:** `appointment-card` · `booking-summary` · `map-card` ·
`location-picker` · `address-form` · `address-card`
**GlowScan:** `skin-metric-card` · `face-scan-overlay` · `face-zone-map` ·
`camera-controls` · `routine-checklist` · `streak-tracker`
**Fisly (finans):** `account-card` · `transaction-row` · `budget-bar` ·
`savings-goal-card` · `numeric-keypad` · `category-picker` ·
`income-expense-summary` · `recurring-bill-item`
**DeployLens (DevOps):** `log-viewer` · `diff-viewer` · `ci-pipeline` ·
`browser-matrix` · `deployment-row` · `stack-trace` · `status-check-list` ·
`integration-card` · `feature-flag-list` · `quota-meter` · `env-switcher` ·
`member-role-row`
**Mobil-jest:** `swipeable-row` · `pull-to-refresh` · `bottom-sheet-draggable` ·
`long-press-menu`
**Genel:** `stat-card` · `metric-bar` · `score-badge` · `avatar-group` ·
`avatar-status` · `list-row` · `empty-state` · `result-state` · `alert-callout` ·
`action-button` · `stepper` · `profile-person-card` · `category-breakdown` ·
`period-switcher` · `media-frame` · `image-grid` · `glass-card` ·
`gradient-hero` · `feature-cta` · `prose` · `chat-bubble` · `plan-card` ·
`fab` · `social-auth-buttons` · `file-dropzone` · `time-slot-grid` ·
`week-calendar`
</details>

<details>
<summary><b>React Native — <code>@ds/ui-native</code> (25)</b></summary>

`Avatar` · `Badge` · `BottomNav` · `Button` · `Card` · `Checkbox` · `Chip` ·
`Divider` · `EmptyState` · `Input` · `ListRow` · `MetricBar` · `ModalDialog` ·
`ProgressBar` · `ScoreBadge` · `Screen` · `SegmentedControl` · `Select` ·
`Sheet` · `SkeletonBlock` · `StatCard` · `Tabs` · `Text` · `Toast` ·
`ToggleSwitch`
</details>

## Komutlar

```bash
pnpm build              # tüm paketleri derle (turbo)
pnpm storybook          # kataloğu aç (localhost:6006)
pnpm --filter @ds/ui typecheck          # web bileşen tip kontrolü
pnpm --filter @ds/ui-native typecheck   # RN tip kontrolü
pnpm --filter storybook typecheck       # story tip kontrolü
pnpm --filter @ds/ui build              # tsup + Tailwind CSS derlemesi
```

## Proje yapısı

```
desing-systems/
├── packages/
│   ├── tokens/                 # @ds/tokens — tek doğruluk kaynağı
│   │   ├── src/themes/         # 5 ThemeDefinition (deploylens, dolap, ...)
│   │   ├── src/scales.ts       # space, radius, fontSize, breakpoints
│   │   └── dist/               # css/, themes/, native/, tailwind-preset
│   ├── ui/                     # @ds/ui — web (React + Tailwind v3)
│   │   └── src/components/
│   │       ├── ui/  ui-extras/  layout/  marketing/
│   │       ├── commerce/  data/  iconic/  composite/  theme/
│   └── ui-native/              # @ds/ui-native — React Native
│       └── src/components/     # PascalCase bileşenler + theme/ThemeProvider
└── apps/
    └── storybook/              # katalog (5 tema × mod × viewport)
```

## Genişletme

**Yeni proje teması ekleme:**

1. `packages/tokens/src/themes/<ad>.ts` — `ThemeDefinition` doldur.
2. `themes/index.ts` kaydına ekle.
3. `pnpm build` — CSS/preset/native çıktıları otomatik üretilir.

**Yeni bileşen ekleme:**

1. `packages/ui/src/components/<kategori>/<ad>.tsx` — bileşeni yaz
   (bkz. [Konvansiyonlar](#konvansiyonlar)).
2. `packages/ui/src/index.ts` — `export * from "./components/<kategori>/<ad>";`.
3. `apps/storybook/src/stories/<ad>.stories.tsx` — story ekle.

## Konvansiyonlar

- **Stil:** `cva` (class-variance-authority) ile varyantlar; `React.forwardRef`
  + `displayName`. Sadece semantik tokenlar — **hardcoded renk yasak**.
- **İstemci:** interaktif/stateful bileşenlerde dosya başında `"use client";`.
- **Mobil-öncelikli:** önce mobil, sonra `sm:`/`md:`/`lg:` ile büyüt; akışkan
  genişlik (`max-w-full`, `min-w-0`, `flex-wrap`, `overflow-x-auto`).
- **Bağımlılık:** yeni npm bağımlılığı eklenmez; mevcut Radix/cva/lucide/vaul/cmdk
  üzerine kurulur.
- **Erişilebilirlik:** rol/aria/klavye/`focus-visible`/`sr-only` zorunlu.
- **RN:** `StyleSheet` + `useNativeTheme`; `theme.colors/space/radius/fontSize`
  üzerinden; NativeWind kullanılmaz.

<sub>* `make-offer-panel` hem Dolap kategorisinde listelenmiştir (birincil
kullanım); `commerce` klasöründedir.</sub>
