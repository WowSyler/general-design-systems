import type { Meta, StoryObj } from "@storybook/react-vite";
import { Receipt, ShoppingBag, Sparkles } from "lucide-react";

import { ReceiptCard } from "@wowsyler/ds-ui";

const meta: Meta<typeof ReceiptCard> = {
  title: "Commerce/ReceiptCard",
  component: ReceiptCard,
};

export default meta;
type Story = StoryObj<typeof ReceiptCard>;

export const FislyFis: Story = {
  render: () => (
    <ReceiptCard
      logo={<Receipt className="size-5" />}
      merchant="Fisly"
      merchantMeta="Kadıköy Şubesi · Vergi No: 1234567890"
      documentNo="FS-2026-04871"
      date="14.07.2026 · 13:24"
      items={[
        { name: "Türk Kahvesi", amount: 65, qty: 2, note: "Orta şekerli" },
        { name: "Menengiç Kahvesi", amount: 75 },
        { name: "Fıstıklı Baklava", amount: 120, qty: 1 },
      ]}
      subtotal={325}
      tax={26}
      taxLabel="KDV %8"
      total={351}
      paymentMethod="Kredi Kartı · **** 4242"
      footerNote="Bizi tercih ettiğiniz için teşekkürler."
      zigzag
      barcode
    />
  ),
};

export const GenelMakbuz: Story = {
  render: () => (
    <ReceiptCard
      logo={<ShoppingBag className="size-5" />}
      merchant="Dolap Pazaryeri"
      merchantMeta="Sipariş Özeti"
      documentNo="DLP-88213"
      date="12.07.2026 · 09:05"
      items={[
        { name: "Vintage Deri Ceket", amount: 1250 },
        { name: "Kargo Ücreti", amount: 49.9, note: "Aynı gün teslimat" },
        { name: "Alıcı Koruma Bedeli", amount: 24.9 },
      ]}
      tax={0}
      taxLabel="KDV"
      paymentMethod="Havale / EFT"
      onDownload={() => console.log("Makbuz indirildi")}
      onShare={() => console.log("Makbuz paylaşıldı")}
    />
  ),
};

export const RandevuFisi: Story = {
  render: () => (
    <ReceiptCard
      logo={<Sparkles className="size-5" />}
      merchant="GlowScan Cilt Kliniği"
      merchantMeta="Nişantaşı · Randevu Makbuzu"
      documentNo="RND-2026-0142"
      date="20.07.2026 · 11:00"
      items={[
        { name: "Cilt Analizi Seansı", amount: 450 },
        { name: "Nemlendirme Bakımı", amount: 680, note: "Uzman: Dr. Elif Yılmaz" },
      ]}
      subtotal={1130}
      tax={226}
      taxLabel="KDV %20"
      total={1356}
      paymentMethod="Peşin · Nakit"
      footerNote="Geçmiş olsun, sağlıklı günler dileriz."
      zigzag
    />
  ),
};
