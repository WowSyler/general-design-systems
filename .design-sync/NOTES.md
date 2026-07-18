# design-sync notları

- Repo, 5 harici projeye hizmet eden sıfırdan kurulmuş bir DS monorepo'sudur
  (pnpm + turbo). Senkronize edilen yüzey `@ds/ui` (web) + `@ds/tokens`.
- Storybook: `apps/storybook` (react-vite, port 6006). Tema × mod toolbar
  global'leri: `theme` (deploylens|dolap|randevu|glowscan|fisly), `mode`
  (light|dark). Story'ler decorator ile `DsThemeProvider applyTo="self"`
  içinde sarılır — önizlemelerde de aynı sarmalayıcı gerekir.
- Tema CSS'i `@ds/tokens/dist/css/themes.css` — `.theme-<ad>` sınıfı +
  `.dark` kombinasyonu. Bileşen stilleri Tailwind v3 ile derlenir
  (`packages/ui/dist/styles.css`).
- Hedef projelerin Tailwind sürümleri karışık: DeployLens v3, Dolap v3 (web +
  NativeWind mobil), Randevu v4 (CSS-first) → v4 için `css/v4-bridge.css`.
- GlowScan fontları (Cormorant Garamond, Playfair Display) Google Fonts'tan
  gelir; DS build'i font dosyası taşımaz — storybook/sync önizlemelerinde
  serif fallback (Georgia) devreye girer. Gerekirse font dosyaları
  `fonts/` olarak sync'e eklenebilir.
- `@ds/ui-native` senkronize EDİLMEZ (Claude Design web render'ı); yalnızca
  proje entegrasyonu içindir.
