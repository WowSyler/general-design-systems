import { Text, type BottomNavItem } from "@wowsyler/ds-ui-native";

/** Gezinme story'lerinde ortak öğeler (ikonlar tema rengini render fonksiyonundan alır). */
export const NAV_ITEMS: BottomNavItem[] = [
  { value: "home", label: "Ana sayfa", icon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⌂</Text> },
  { value: "scan", label: "Tara", icon: ({ color }) => <Text style={{ color, fontSize: 20 }}>◎</Text> },
  { value: "inbox", label: "Mesajlar", badge: 3, icon: ({ color }) => <Text style={{ color, fontSize: 20 }}>✉</Text> },
  { value: "me", label: "Profil", icon: ({ color }) => <Text style={{ color, fontSize: 20 }}>●</Text> },
];
