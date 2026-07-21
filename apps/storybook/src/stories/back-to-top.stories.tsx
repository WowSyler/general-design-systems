import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { BackToTop } from "@ds/ui";

const meta: Meta<typeof BackToTop> = {
  title: "Primitives/BackToTop",
  component: BackToTop,
};

export default meta;
type Story = StoryObj<typeof BackToTop>;

type BackToTopVariant = React.ComponentProps<typeof BackToTop>["variant"];

/**
 * Uzun bir icerik bloku; gercek kaydirma davranisini gormek icin
 * sayfayi asagi kaydirin. 400px esigi gecince buton sag-altta belirir.
 */
const UzunIcerik = () => (
  <div className="mx-auto max-w-2xl space-y-4 p-6">
    <h2 className="font-display text-2xl font-semibold text-foreground">
      DeployLens dağıtım günlüğü
    </h2>
    {Array.from({ length: 24 }).map((_, index) => (
      <p key={index} className="text-sm leading-relaxed text-muted-foreground">
        {index + 1}. adım — Üretim ortamına yapılan dağıtım kaydı. Derleme
        tamamlandı, testler yeşile döndü ve yeni sürüm kademeli olarak
        yayına alındı. Sayfayı aşağı kaydırdıkça sağ-alttaki "yukarı çık"
        butonunun belirdiğini göreceksiniz.
      </p>
    ))}
  </div>
);

/**
 * Gerçek eşik davranışı: sayfa 400px'den fazla kaydırılınca buton belirir,
 * tıklayınca en üste yumuşak biçimde kayar.
 */
export const KaydirmaDavranisi: Story = {
  render: () => (
    <>
      <UzunIcerik />
      <BackToTop />
    </>
  ),
};

/**
 * Statik önizleme: forceVisible ile eşikten bağımsız her zaman görünür.
 * Tasarım varyantlarını tek bakışta karşılaştırmak için idealdir.
 */
export const Varyantlar: Story = {
  render: () => (
    <div className="relative min-h-[240px] rounded-xl border border-border bg-card p-6">
      <p className="text-sm text-muted-foreground">
        GlowScan cilt analizi raporu — üç görsel varyant sağ-altta üst üste
        gösteriliyor.
      </p>
      {(["default", "secondary", "outline"] as BackToTopVariant[]).map(
        (variant, index) => (
          <BackToTop
            key={variant}
            forceVisible
            variant={variant}
            className="absolute"
            style={{ bottom: 24 + index * 64, right: 24 }}
            label={`En üste dön (${variant})`}
          />
        )
      )}
    </div>
  ),
};

/**
 * Boyut seçenekleri: sm, default ve lg. Fisly gider akışında yoğun
 * listelerde küçük, ferah sayfalarda büyük buton tercih edilebilir.
 */
export const Boyutlar: Story = {
  render: () => (
    <div className="relative min-h-[200px] rounded-xl border border-border bg-card p-6">
      <p className="text-sm text-muted-foreground">
        Fisly aylık gider dökümü — sm / default / lg boyutları.
      </p>
      {(["sm", "default", "lg"] as const).map((size, index) => (
        <BackToTop
          key={size}
          forceVisible
          size={size}
          variant="outline"
          className="absolute"
          style={{ bottom: 24, right: 24 + index * 72 }}
          label={`En üste dön (${size})`}
        />
      ))}
    </div>
  ),
};
