import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles, Receipt } from "lucide-react";

import { QrCode } from "@wowsyler/ds-ui";

const meta: Meta<typeof QrCode> = {
  title: "Primitives/QrCode",
  component: QrCode,
};

export default meta;
type Story = StoryObj<typeof QrCode>;

/**
 * Randevu dijital bileti: check-in ekraninda gosterilen QR blogu.
 * Not: Desen dekoratiftir, gercek veri kodlamaz.
 */
export const RandevuCheckIn: Story = {
  args: {
    value: "randevu://checkin/RND-2026-4821",
    caption: "Salona girişte bu kodu resepsiyona okutun · Randevu #4821",
    "aria-label": "Randevu check-in QR kodu",
  },
};

/**
 * GlowScan seans kodu: merkez logolu, nokta modullu, muted tonlu varyant.
 */
export const GlowScanSeansKodu: Story = {
  args: {
    value: "glowscan://session/skin-analysis/ozan-k",
    tone: "muted",
    moduleStyle: "dots",
    size: 224,
    logo: <Sparkles className="text-primary" />,
    caption: "Cilt analizi sonuçlarını uygulamada açmak için tarayın",
    downloadLabel: "Kaydet",
    shareLabel: "Gönder",
    "aria-label": "GlowScan seans QR kodu",
  },
};

/**
 * Fisly fatura dogrulama: butonsuz, kompakt, kare modullu sade kart.
 */
export const FislyFaturaDogrulama: Story = {
  args: {
    value: "fisly://invoice/verify/2026-000731",
    size: 176,
    modules: 33,
    logo: <Receipt className="text-foreground" />,
    caption: "Fatura no: 2026-000731",
    showActions: false,
    "aria-label": "Fisly fatura doğrulama QR kodu",
  },
};
