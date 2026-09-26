/**
 * Avatar — kullanıcı görselini gösteren yuvarlak/köşeli rozet. Görsel (uri)
 * verilmişse Image, aksi halde isimden türetilen baş harfler (initials) gösterilir;
 * görsel yüklenemezse otomatik olarak baş harflere düşülür. Boyut sm/md/lg/xl
 * (ya da doğrudan sayısal), şekil circle/rounded. Opsiyonel presence noktası
 * alt-sonda (LTR: sağ-alt, RTL: sol-alt) durum rengiyle çizilir: online→success, offline→mutedForeground,
 * away→warning, busy→destructive. Renkler yalnızca temadan gelir. Dolap/Randevu.
 */
import * as React from "react";
import {
  Image,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";

import type { NativeTheme } from "@wowsyler/ds-tokens/native";

import { DsText as RNText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export type AvatarShape = "circle" | "rounded";

export type AvatarPresence = "online" | "offline" | "away" | "busy";

export interface AvatarProps extends Omit<ViewProps, "children"> {
  /** Görsel kaynağı (uri). Verilmezse ya da yüklenemezse baş harflere düşülür. */
  uri?: string;
  /** Baş harflerin türetileceği ve erişilebilirlik etiketinde kullanılacak ad. */
  name?: string;
  /** Ada güvenmeyip baş harfleri elle vermek için (ör. "AK"). */
  initials?: string;
  /** Boyut önayarı ya da doğrudan piksel değeri; varsayılan "md". */
  size?: AvatarSize | number;
  /** Şekil: tam yuvarlak ya da yumuşak köşeli; varsayılan "circle". */
  shape?: AvatarShape;
  /** Sağ-altta gösterilecek durum noktası. */
  presence?: AvatarPresence;
}

const SIZE_PX: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const PRESENCE_LABEL: Record<AvatarPresence, string> = {
  online: "çevrimiçi",
  offline: "çevrimdışı",
  away: "uzakta",
  busy: "meşgul",
};

function presenceColor(theme: NativeTheme, presence: AvatarPresence): string {
  const { colors } = theme;
  switch (presence) {
    case "online":
      return colors.success;
    case "away":
      return colors.warning;
    case "busy":
      return colors.destructive;
    case "offline":
    default:
      return colors.mutedForeground;
  }
}

/** İsimden baş harfleri türetir: tek kelimede ilk iki harf, çok kelimede ilk+son. */
function deriveInitials(name?: string): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  const first = parts[0]![0] ?? "";
  const last = parts[parts.length - 1]![0] ?? "";
  return (first + last).toUpperCase();
}

export function Avatar({
  uri,
  name,
  initials,
  size = "md",
  shape = "circle",
  presence,
  style,
  accessibilityLabel,
  ...rest
}: AvatarProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const [failed, setFailed] = React.useState(false);

  // Kaynak değiştiğinde hata bayrağını sıfırla.
  React.useEffect(() => {
    setFailed(false);
  }, [uri]);

  const dimension = typeof size === "number" ? size : SIZE_PX[size];
  const borderRadius =
    shape === "circle" ? dimension / 2 : theme.radius.lg;

  const showImage = uri !== undefined && uri.length > 0 && !failed;
  const label = initials ?? deriveInitials(name);
  const initialsFontSize = Math.max(11, Math.round(dimension * 0.4));

  // Presence noktası ve onu zeminden ayıran halka.
  const dotSize = Math.max(8, Math.round(dimension * 0.28));
  const ringWidth = Math.max(1.5, Math.round(dimension * 0.05));

  const a11yLabel =
    accessibilityLabel ??
    (presence !== undefined
      ? `${name ?? "Avatar"}, ${PRESENCE_LABEL[presence]}`
      : (name ?? "Avatar"));

  return (
    <View
      role="img"
      aria-label={a11yLabel}
      {...rest}
      style={[{ width: dimension, height: dimension }, style]}
    >
      <View
        style={[
          styles.surface,
          {
            borderRadius,
            backgroundColor: theme.colors.muted,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {showImage ? (
          <Image
            source={{ uri }}
            onError={() => setFailed(true)}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            style={styles.image}
          />
        ) : (
          <RNText
            allowFontScaling={false}
            numberOfLines={1}
            style={{
              color: theme.colors.mutedForeground,
              fontSize: initialsFontSize,
              fontWeight: "600",
            }}
          >
            {label}
          </RNText>
        )}
      </View>

      {presence !== undefined ? (
        <View
          aria-hidden
          importantForAccessibility="no"
          style={[
            styles.presence,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: presenceColor(theme, presence),
              borderWidth: ringWidth,
              borderColor: theme.colors.background,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  presence: {
    position: "absolute",
    end: 0,
    bottom: 0,
  },
});
