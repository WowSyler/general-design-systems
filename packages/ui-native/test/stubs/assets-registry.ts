// @react-native/assets-registry Flow kaynağıdır; web/jsdom testlerinde basit taklit.
const assets: unknown[] = [];
export function registerAsset(asset: unknown): number {
  return assets.push(asset);
}
export function getAssetByID(id: number): unknown {
  return assets[id - 1];
}
