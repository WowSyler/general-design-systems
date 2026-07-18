# design-sync notları

- [GENERAL] Yalnızca story dosyalarında kullanılan Tailwind utility'leri
  (w-[420px], w-80, h-72, pl-9, -space-x-2 vb.) bundle CSS'inde yoktu —
  @ds/ui'ın content taraması yalnızca packages/ui/src'yi kapsıyordu; story'ler
  apps/storybook'ta. 15 bileşen bu yüzden yanlış genişlik/konumla render oldu
  (tailwind-merge ağırlaştırıcı: story sınıfı bileşeninkini SİLİP yerine
  geçer — kuralı olmayan sınıf = hiç boyut yok). Düzeltme:
  packages/ui/tailwind.config.ts content'ine "../../apps/storybook/src/**"
  glob'u eklendi; dist/styles.css artık story utility'lerini içeriyor.
  Yeni bileşen/story eklerken bu glob'un korunması ŞART.

- [GENERAL] Storybook styles.css'e fonts.css @import'u eklenince decorator
  bundle'ı `.woff2` loader hatasıyla düştü → önizlemeler temasız (CSS var'sız)
  render oldu. Çözüm: `cfg.provider = DsThemeProvider {applyTo:"self",
  defaultTheme:"deploylens", defaultMode:"light"}` — decorator bundling'i
  tamamen atlar; README sarmalama rehberi de bu config'den üretilir.
  Önizlemeler tek temada (deploylens/light) render edilir; tema geçişi
  tokens CSS'i üzerinden çalışır.

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
- GlowScan fontları (Cormorant Garamond + Playfair Display, latin+latin-ext)
  packages/tokens/fonts/ altına yerelleştirildi; cfg.extraFonts ile pakete,
  storybook styles.css @import'u ile referansa bağlı. Her iki taraf gerçek
  fontla render eder.
- `@ds/ui-native` senkronize EDİLMEZ (Claude Design web render'ı); yalnızca
  proje entegrasyonu içindir.
- Notlandırma rehberi: ds yakalama viewport'u sabit 900×700 — uzun story'ler
  (shell'ler, ImageGrid) önizleme panelinde alt kısımdan kırpılır ve sheet'in
  panel-bazlı ölçeklemesi dikey kayma yanılsaması yaratır. "Eksik içerik"
  notu vermeden önce raw PNG'leri tam çözünürlükte karşılaştır — ortak
  700px bölgesi piksel piksel hizalıysa framing'dir, hata değil.
