# @wowsyler/ds-ui-native

## 0.2.0

### Minor Changes

- 8fdfb23: İlk yayın (GitHub Packages).

  - **@wowsyler/ds-ui-native:** bileşen seti genişletildi (form, geri bildirim, yapı, alan
    bileşenleri, `./charts` giriş noktası), tablet/responsive hook'ları, RTL ve
    erişilebilirlik iyileştirmeleri; `dist/` derlemesi. Tüm dokunulabilir öğeler
    gerçek ≥44pt dokunma kutusuna sahip (`hitSlop` yerine). **Davranış değişikliği:**
    `Button` ve `IconButton`'da `style` artık dış dokunma kutusuna uygulanır; görsel
    yüzey stili için `IconButton`'da `contentStyle` kullanın. `ListRow`'a
    `switchValue`/`onSwitchChange` eklendi.
  - **@wowsyler/ds-ui:** RTL desteği (`DsThemeProvider` `dir`/`defaultDir`, mantıksal
    utility'ler), dokunmatik cihazlarda ≥44px dokunma hedefleri, mobil taşma
    düzeltmeleri; dosya başına ESM çıktısı ve korunan `"use client"`
    direktifleri (Next.js App Router), `@wowsyler/ds-ui/tailwind-preset`.
  - **@wowsyler/ds-tokens:** WCAG AA kontrastı için destructive/success/warning/info,
    dark primary, mutedForeground ve GlowScan odak halkası tonları koyulaştırıldı.
    `pointer-coarse` / `pointer-fine` / `hover-none` variant'ları,
    `touch-hitbox` utility'si, `fonts.css` dışa aktarımı.
  - Test altyapısı: token kontrast/sözleşme testleri, bileşen davranış testleri,
    tüm story'ler için render + axe erişilebilirlik denetimi, tüketici smoke testi.

### Patch Changes

- Updated dependencies [8fdfb23]
  - @wowsyler/ds-tokens@0.2.0
