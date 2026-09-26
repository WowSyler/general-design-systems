/**
 * Sheet — alt sayfa (bottom sheet). Telefonda alttan kayarak açılır (üst köşeleri
 * radius.xl, tutma çubuğu, alt güvenli alan boşluğu); tablette varsayılan olarak
 * ekranın ortasında kart şeklinde sunulur (`presentation="auto"`). Scrim'e basınca
 * ya da geri tuşunda kapanır (`dismissable=false` ile kapatılamaz).
 */
import * as React from "react";
import type { StyleProp, ViewStyle } from "react-native";

import {
  AdaptiveModal,
  type ModalPresentation,
} from "../internal/AdaptiveModal";

export type SheetPresentation = ModalPresentation;

export interface SheetProps {
  /** Sayfa görünür mü. */
  visible: boolean;
  /** Scrim'e basıldığında / geri tuşunda çağrılır. */
  onClose: () => void;
  /** Opsiyonel başlık. */
  title?: string;
  /** "auto" (telefon: alt sayfa, tablet: ortada kart), "sheet" ya da "center". */
  presentation?: SheetPresentation;
  /** Scrim/geri tuşu kapatabilir mi; varsayılan true. */
  dismissable?: boolean;
  /** Tablette ortalanmış kartın azami genişliği; varsayılan 520. */
  maxWidth?: number;
  /** Panel stili. */
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function Sheet({
  visible,
  onClose,
  title,
  presentation = "auto",
  dismissable = true,
  maxWidth = 520,
  style,
  children,
}: SheetProps): React.JSX.Element {
  return (
    <AdaptiveModal
      visible={visible}
      onClose={onClose}
      title={title}
      presentation={presentation}
      dismissable={dismissable}
      maxWidth={maxWidth}
      panelStyle={style}
    >
      {children}
    </AdaptiveModal>
  );
}
