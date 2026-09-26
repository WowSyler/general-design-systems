/**
 * ConfirmDialog — onay diyaloğu. Telefonda alttan sayfa (butonlar tam genişlik,
 * alt alta), tablette ortada kart (butonlar sonda yan yana). `destructive` ile
 * onay butonu tehlike tonunda olur. Onay async ise `loading` ile gösterilir.
 * GlowScan ConfirmSheet / Fisly silme onayı karşılığı.
 */
import * as React from "react";
import { View } from "react-native";

import {
  AdaptiveModal,
  useResolvedPresentation,
  type ModalPresentation,
} from "../internal/AdaptiveModal";
import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { Button } from "./Button";

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
  /** Onay işlemi sürüyor — buton yükleniyor, diyalog kapatılamaz. */
  loading?: boolean;
  presentation?: ModalPresentation;
  /** Açıklamanın altında ek içerik (onay kutusu vb.). */
  children?: React.ReactNode;
}

export function ConfirmDialog({
  visible,
  title,
  description,
  confirmLabel = "Onayla",
  cancelLabel = "Vazgeç",
  onConfirm,
  onCancel,
  destructive = false,
  loading = false,
  presentation = "auto",
  children,
}: ConfirmDialogProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const mode = useResolvedPresentation(presentation);
  const stacked = mode === "sheet";

  return (
    <AdaptiveModal
      visible={visible}
      onClose={onCancel}
      dismissable={!loading}
      presentation={presentation}
      title={title}
      maxWidth={440}
    >
      <View style={{ rowGap: theme.space.md }}>
        {description !== undefined ? (
          <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["sm"] ?? 14, lineHeight: 20 }}>
            {description}
          </DsText>
        ) : null}
        {children}
        <View
          style={
            stacked
              ? { rowGap: theme.space.sm, marginTop: theme.space.sm }
              : { flexDirection: "row", justifyContent: "flex-end", columnGap: theme.space.sm, marginTop: theme.space.sm }
          }
        >
          {stacked ? (
            <>
              <Button title={confirmLabel} variant={destructive ? "destructive" : "primary"} loading={loading} fullWidth onPress={onConfirm} />
              <Button title={cancelLabel} variant="ghost" disabled={loading} fullWidth onPress={onCancel} />
            </>
          ) : (
            <>
              <Button title={cancelLabel} variant="outline" disabled={loading} onPress={onCancel} />
              <Button title={confirmLabel} variant={destructive ? "destructive" : "primary"} loading={loading} onPress={onConfirm} />
            </>
          )}
        </View>
      </View>
    </AdaptiveModal>
  );
}
