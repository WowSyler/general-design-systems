# design-sync notları

- [GENERAL] Yalnızca story dosyalarında kullanılan Tailwind utility'leri
  (w-[420px], w-80, h-72, pl-9, -space-x-2 vb.) bundle CSS'inde yoktu —
  @wowsyler/ds-ui'ın content taraması yalnızca packages/ui/src'yi kapsıyordu; story'ler
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
  (pnpm + turbo). Senkronize edilen yüzey `@wowsyler/ds-ui` (web) + `@wowsyler/ds-tokens`.
- Storybook: `apps/storybook` (react-vite, port 6006). Tema × mod toolbar
  global'leri: `theme` (deploylens|dolap|randevu|glowscan|fisly), `mode`
  (light|dark). Story'ler decorator ile `DsThemeProvider applyTo="self"`
  içinde sarılır — önizlemelerde de aynı sarmalayıcı gerekir.
- Tema CSS'i `@wowsyler/ds-tokens/dist/css/themes.css` — `.theme-<ad>` sınıfı +
  `.dark` kombinasyonu. Bileşen stilleri Tailwind v3 ile derlenir
  (`packages/ui/dist/styles.css`).
- Hedef projelerin Tailwind sürümleri karışık: DeployLens v3, Dolap v3 (web +
  NativeWind mobil), Randevu v4 (CSS-first) → v4 için `css/v4-bridge.css`.
- GlowScan fontları (Cormorant Garamond + Playfair Display, latin+latin-ext)
  packages/tokens/fonts/ altına yerelleştirildi; cfg.extraFonts ile pakete,
  storybook styles.css @import'u ile referansa bağlı. Her iki taraf gerçek
  fontla render eder.
- `@wowsyler/ds-ui-native` senkronize EDİLMEZ (Claude Design web render'ı); yalnızca
  proje entegrasyonu içindir.
- Notlandırma rehberi: ds yakalama viewport'u sabit 900×700 — uzun story'ler
  (shell'ler, ImageGrid) önizleme panelinde alt kısımdan kırpılır ve sheet'in
  panel-bazlı ölçeklemesi dikey kayma yanılsaması yaratır. "Eksik içerik"
  notu vermeden önce raw PNG'leri tam çözünürlükte karşılaştır — ortak
  700px bölgesi piksel piksel hizalıysa framing'dir, hata değil.
- [GENERAL] bg-sheen/bg-brand-gradient, tailwind-merge'in varsayılan
  yapılandırmasında RENK sanılıyor → cn() içinde bg-primary'yi silip
  butonları bembeyaz bırakıyordu (canary'de yakalandı; oracle yakalayamaz —
  iki taraf aynı kaynaktan aynı şekilde bozulur). Düzeltme: lib/utils.ts
  extendTailwindMerge ile bg-image grubuna kayıt. Yeni bg-image utility'si
  eklerken AYNI kayda ekleme ŞART.
# wave2-d learnings

## LineChart: plot area is blank in BOTH storybook reference and preview (repo component bug, not preview drift)
- Evidence: raw pairs for all 3 LineChart stories show only the legend; pixel scan confirms zero non-white content in the plot area on BOTH `__sb.png` and `__ds.png` (diff bbox = legend text AA only).
- Root cause (verified in source): `packages/ui/src/components/data/line-chart.tsx` strokes polylines/dots with `hsl(var(--chart-1))`..`(--chart-5)` (hyphenated), but the token preset (`packages/tokens/src/tailwind-preset.ts`) and the built reference CSS (`.design-sync/sb-reference/assets/preview-*.css`) define `--chart1`..`--chart5` (no hyphen). Undefined var -> invalid `hsl()` -> SVG `stroke` falls back to `none` -> invisible lines everywhere.
- Legend dots still render because they use Tailwind classes `bg-chart-1..5`, which the preset maps to the correct `hsl(var(--chart1))` form.
- Grading consequence: do NOT "fix" a preview to draw visible lines — the reference is equally blank; identical blank states are a match. Any component styling SVG via literal `hsl(var(--chart-N))` strings will show the same symptom (BarChart/DonutChart/Sparkline are unaffected: they use Tailwind classes or --primary/--success/--warning/--destructive vars).
# wave2-u learnings

- Combobox (overlay, cardMode single): AcikListe story'sinde acik liste panelinin ICINDEKI metinler ("Hizmet ara…" ve liste ogeleri) HEM storybook referansinda HEM preview'da ayni serif fallback fontla render oluyor (trigger sans kaliyor). Iki panelde birebir ayni oldugu icin mismatch degil — overlay/portal bilesenlerinde panel ici serif font gorursen once iki taraf simetrik mi diye bak; simetrikse font-fallback'i mismatch sayma. Panel konumu/kenarligi/ogeleri piksel hizali cikti.
- Fan-out notlandırma ajanlarına grade.json yazarken story anahtarlarının
  compare .json'daki GÖRÜNEN adla (boşluklu: "Deploy Ekibi") birebir aynı
  olması gerektiğini AÇIKÇA söyle — üç tur boyunca 23 bileşenin notu
  boşluksuz anahtar yüzünden sayılmadı.
- Dock (ve genel): bir bileşen Storybook'ta yalnızca parameters:{layout:"centered"}
  sayesinde toplu görünüp kökü blok seviyesi + genişlik-sınırsızsa (mx-auto flex),
  önizleme harness'ında (centered sarmalayıcı yok) tam genişliğe yayılır → mismatch.
  Çözüm: kök kendi genişliğini sınırlasın (w-fit / inline-flex). Yeni imza/serbest
  genişlikli bileşen eklerken kökü w-fit veya inline-* yap.

# re-sync 2026-07 (161 yeni bileşen) learnings
- [GENERAL] Görsel-taşıyan kartlar (CartLineItem, ConditionSelector, FavoriteButton overlay, ProductCard) örnek görselleri broken-image placeholder ikonuyla gösterir — HEM storybook HEM preview'da simetrik → örnek-görsel durumu, kusur değil → match.
- [GENERAL] AccountSwitcher (ve benzeri inline-anchored dropdown'lar): compare [PORTAL?] uyarısı verebilir ama açık liste tetiğin hemen altına inline demirlenir (hücreden kaçmaz) ve temalıdır → full-res'te iki taraf da aynı açık durumu render eder → match, override GEREKMEZ, açık durumu nötrleme.
- [GENERAL] Composite sheet'te preview kolonu storybook'tan dar/farklı-oranlı görünebilir → saf sheet framing/ölçek artefaktı (ds ham canvas daha geniş render edilip küçültülür) → full-res'te kart genişliği/kompozisyonu aynıdır → match; yalnız sheet'te görülen görünür genişlik farklarını kovalama.
- [PENDING config] validate [GRID_OVERFLOW]: CartDrawer + UserAccountMenu + ContextMenu → cfg.overrides cardMode:"single" gerekli (sona toplu uygulanacak; grade'i etkilemez).
- [GENERAL] CenteredHero (marketing): atmosphere="aurora"/"gradient" dekoratif katmanı `-z-10 absolute inset-0` div, `relative overflow-hidden` bölüm stacking-context kurmadığı için -z-10 köke kaçar → storybook harness'ın opak canvas'ı arkasında GIZLI, preview'da GORUNUR. Icerik birebir aynı; sadece dekoratif wash farkli → KABUL EDILEBILIR `close` (preview daha dogru render). Gelecek iyilestirme: bolume `isolate`/`z-0` ekle (kaynak degisikligi + tam rebuild gerektirir). bg-aurora + -z-10 atmosfer kullanan diger bilesenler izole ebeveyn icindeyse ayni asimetriyi gosterebilir (AuroraBackground/GradientHero/GradientMesh bu turda match cikti — onlar izole/farkli katmanli).
