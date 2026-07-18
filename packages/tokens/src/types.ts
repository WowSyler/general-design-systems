/**
 * Semantik token sözleşmesi — her tema bu şemayı doldurur.
 * Bileşenler yalnızca bu semantik isimleri tüketir; ham renk asla kullanılmaz.
 * Renk değerleri kaynakta hex (#rrggbb) tutulur; build aşamasında
 * CSS custom property (web) ve TS objesi (React Native) olarak üretilir.
 */

export interface ColorTokens {
  background: string;
  foreground: string;

  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;

  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;

  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;

  border: string;
  input: string;
  ring: string;

  /** Grafik/veri görselleştirme paleti (ör. Fisly harcama grafikleri) */
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;

  /** Dashboard/admin kabuğu (DeployLens, Randevu admin) */
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;

  /** Marka gradyanı (ör. GlowScan premium yüzeyler, CTA'lar) */
  gradientFrom: string;
  gradientTo: string;
}

export interface TypographyTokens {
  /** Gövde metni yazı ailesi (CSS font-family listesi) */
  fontSans: string;
  /** Vurgu/başlık serif ailesi — kullanmayan temalar sans ile doldurur */
  fontSerif: string;
  /** Eş aralıklı aile (kod, tutar/tablo hizalama) */
  fontMono: string;
  /** Büyük başlık/display ailesi — çoğu temada fontSans veya fontSerif ile aynı */
  fontDisplay: string;
}

export interface RadiusTokens {
  /** Temel yarıçap (px) — shadcn --radius'a eşlenir; sm/md/lg bundan türetilir */
  base: number;
}

export interface ThemeDefinition {
  /** Makine adı: kebab-case (ör. "glowscan") — CSS sınıfı `theme-<name>` olur */
  name: string;
  /** İnsan okunur ad (ör. "GlowScan") */
  label: string;
  /** Temanın ait olduğu proje klasörü / açıklaması */
  project: string;
  colors: {
    light: ColorTokens;
    dark: ColorTokens;
  };
  typography: TypographyTokens;
  radius: RadiusTokens;
}

/** Tüm temaların paylaştığı, temadan bağımsız ölçekler */
export interface SharedScales {
  /** 4px taban aralık ölçeği */
  spacing: Record<string, number>;
  /** Yazı boyutu ölçeği (px) */
  fontSize: Record<string, number>;
  /** Satır yüksekliği çarpanları */
  lineHeight: Record<string, number>;
  /** Yazı ağırlıkları */
  fontWeight: Record<string, number>;
  /** Responsive kırılım noktaları (px) — web */
  breakpoints: Record<string, number>;
  /** Gölge ölçeği — web box-shadow dizgeleri */
  shadows: Record<string, string>;
  /** z-index katmanları */
  zIndex: Record<string, number>;
}
