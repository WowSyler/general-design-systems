/**
 * AvatarGroup — üst üste binen avatar yığını + "+N" taşma rozeti (aile üyeleri,
 * katılımcılar). Binme yönü yazı yönünü izler (marginStart negatif). Her
 * avatar zemin renginde halka ile ayrışır.
 */
import * as React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { Avatar, type AvatarSize } from "./Avatar";

export interface AvatarGroupItem {
  name?: string;
  uri?: string;
}

export interface AvatarGroupProps {
  items: AvatarGroupItem[];
  /** Gösterilecek azami avatar; kalanlar "+N". Varsayılan 4. */
  max?: number;
  size?: AvatarSize;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const PX: Record<AvatarSize, number> = { sm: 32, md: 40, lg: 48, xl: 64 };

export function AvatarGroup({ items, max = 4, size = "md", accessibilityLabel, style }: AvatarGroupProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const shown = items.slice(0, max);
  const rest = items.length - shown.length;
  const px = PX[size];
  const overlap = Math.round(px * 0.3);
  const ring = 2;

  return (
    <View
      accessible
      role="img"
      aria-label={accessibilityLabel ?? `${items.length} kişi: ${items.slice(0, 3).map((i) => i.name ?? "").filter(Boolean).join(", ")}${items.length > 3 ? " ve diğerleri" : ""}`}
      style={[{ flexDirection: "row", alignItems: "center" }, style]}
    >
      {shown.map((item, i) => (
        <View
          key={`${item.name ?? "a"}-${i}`}
          style={{
            marginStart: i === 0 ? 0 : -overlap,
            borderRadius: (px + ring * 2) / 2,
            borderWidth: ring,
            borderColor: theme.colors.background,
          }}
        >
          <Avatar name={item.name} uri={item.uri} size={size} aria-hidden importantForAccessibility="no" />
        </View>
      ))}
      {rest > 0 ? (
        <View
          style={{
            marginStart: -overlap,
            width: px + ring * 2,
            height: px + ring * 2,
            borderRadius: (px + ring * 2) / 2,
            borderWidth: ring,
            borderColor: theme.colors.background,
            backgroundColor: theme.colors.secondary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DsText allowFontScaling={false} style={{ color: theme.colors.secondaryForeground, fontSize: Math.max(11, Math.round(px * 0.34)), fontWeight: "700" }}>
            {`+${rest}`}
          </DsText>
        </View>
      ) : null}
    </View>
  );
}
