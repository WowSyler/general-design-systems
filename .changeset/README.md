# Changesets

Sürüm notları ve sürüm yükseltme bu klasördeki changeset dosyalarıyla yönetilir.

- Değişiklik yaptıktan sonra: `pnpm changeset` → etkilenen paketleri ve sürüm tipini
  (patch / minor / major) seçin, kısa bir açıklama yazın. Oluşan `.md` dosyasını
  PR'a ekleyin.
- Üç paket (`tokens`, `ui`, `ui-native`) **sabit (fixed) grup** olarak birlikte
  sürümlenir; biri yükselince hepsi aynı sürüme geçer.
- `main`'e birleştirilen changeset'ler için Release iş akışı "Version Packages"
  PR'ı açar. O PR birleştirilince paketler GitHub Packages'a yayınlanır.

Ayrıntılar: [docs/kurulum.md](../docs/kurulum.md#sürüm-yükseltme-ve-yayın)
