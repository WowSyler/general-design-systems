// @react-native/assets-registry Flow kaynağıdır; react-native-svg'nin web
// derlemesi yalnızca bu iki fonksiyona başvurur. Storybook için basit taklit.
const assets: unknown[] = [];

export function registerAsset(asset: unknown): number {
  return assets.push(asset);
}

export function getAssetByID(id: number): unknown {
  return assets[id - 1];
}
