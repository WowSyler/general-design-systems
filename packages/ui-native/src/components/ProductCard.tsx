/**
 * ProductCard — ürün/ilan kartı (Dolap). Kare görsel (yüklenemezse yer
 * tutucu), görsel üstünde favori butonu ve opsiyonel rozet (ör. "Yeni"),
 * altında marka, başlık (2 satır), PriceTag ve durum/beden bilgisi. Izgarada
 * kullanım için genişlik kabı doldurur. Tüm kart tek dokunma hedefidir;
 * favori butonu ayrı erişilebilir denetimdir (32pt görsel, 44pt dokunma kutusu).
 */
import * as React from "react";
import { Image, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { IconButton } from "./IconButton";
import { PriceTag } from "./PriceTag";

export interface ProductCardProps {
  title: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  imageUri?: string;
  brand?: string;
  /** Alt bilgi (ör. "M beden · Az kullanılmış"). */
  meta?: string;
  /** Görsel üstü rozet metni (ör. "Yeni", "Satıldı"). */
  badge?: string;
  favorite?: boolean;
  onToggleFavorite?: (next: boolean) => void;
  onPress?: () => void;
  /** Satıldı/pasif görünümü (soluk + rozet). */
  soldOut?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ProductCard({
  title,
  price,
  originalPrice,
  currency,
  imageUri,
  brand,
  meta,
  badge,
  favorite = false,
  onToggleFavorite,
  onPress,
  soldOut = false,
  style,
}: ProductCardProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const [failed, setFailed] = React.useState(false);
  const showImage = imageUri !== undefined && imageUri.length > 0 && !failed;

  return (
    <View style={[{ opacity: soldOut ? 0.6 : 1 }, style]}>
      <Pressable
        role="button"
        aria-label={[brand, title, meta, soldOut ? "satıldı" : undefined].filter(Boolean).join(", ")}
        accessibilityHint="Ürün detayını açar"
        onPress={onPress}
        disabled={onPress === undefined}
        style={({ pressed }) => [{ rowGap: theme.space.sm, opacity: pressed ? 0.85 : 1 }]}
      >
        <View style={[styles.media, { borderRadius: theme.radius.lg, backgroundColor: theme.colors.muted }]}>
          {showImage ? (
            <Image source={{ uri: imageUri }} onError={() => setFailed(true)} resizeMode="cover" style={StyleSheet.absoluteFill} accessibilityIgnoresInvertColors />
          ) : (
            <DsText style={{ color: theme.colors.mutedForeground, fontSize: 28, fontWeight: "300" }}>◻︎</DsText>
          )}
          {badge !== undefined || soldOut ? (
            <View style={[styles.badge, { backgroundColor: soldOut ? theme.colors.foreground : theme.colors.primary, borderRadius: theme.radius.pill }]}>
              <DsText style={{ color: soldOut ? theme.colors.background : theme.colors.primaryForeground, fontSize: 11, fontWeight: "700" }}>
                {soldOut ? "Satıldı" : badge}
              </DsText>
            </View>
          ) : null}
        </View>
        <View style={{ rowGap: 2 }}>
          {brand !== undefined ? (
            <DsText numberOfLines={1} style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["xs"] ?? 12, fontWeight: "600", letterSpacing: 0.6, textTransform: "uppercase" }}>
              {brand}
            </DsText>
          ) : null}
          <DsText numberOfLines={2} style={{ color: theme.colors.foreground, fontSize: theme.fontSize["sm"] ?? 14, lineHeight: 19, fontWeight: "500" }}>
            {title}
          </DsText>
          <PriceTag price={price} originalPrice={originalPrice} currency={currency} size="sm" />
          {meta !== undefined ? (
            <DsText numberOfLines={1} style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["xs"] ?? 12 }}>
              {meta}
            </DsText>
          ) : null}
        </View>
      </Pressable>
      {onToggleFavorite !== undefined ? (
        <View style={styles.fav}>
          <IconButton
            size="sm"
            variant="solid"
            bleed
            selected={favorite}
            accessibilityLabel={favorite ? "Favorilerden çıkar" : "Favorilere ekle"}
            onPress={() => onToggleFavorite(!favorite)}
            contentStyle={{ backgroundColor: theme.colors.background }}
            icon={
              <DsText allowFontScaling={false} style={{ color: favorite ? theme.colors.destructive : theme.colors.foreground, fontSize: 16, lineHeight: 18 }}>
                {favorite ? "♥" : "♡"}
              </DsText>
            }
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  media: { width: "100%", aspectRatio: 1, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", top: 8, start: 8, paddingHorizontal: 8, paddingVertical: 3 },
  fav: { position: "absolute", top: 8, end: 8 },
});
