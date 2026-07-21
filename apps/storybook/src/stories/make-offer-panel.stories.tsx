import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, MakeOfferPanel, MakeOfferStatusBadge } from "@ds/ui";
import { Check } from "lucide-react";

const meta: Meta<typeof MakeOfferPanel> = {
  title: "Commerce/MakeOfferPanel",
  component: MakeOfferPanel,
};

export default meta;
type Story = StoryObj<typeof MakeOfferPanel>;

type OfferStatus = React.ComponentProps<typeof MakeOfferPanel>["status"];

/** Dolap: alici teklif verir, panel "Bekliyor" ozetine gecer. */
function TeklifAkisi() {
  const [offer, setOffer] = React.useState(320);
  const [status, setStatus] = React.useState<OfferStatus>(undefined);

  return (
    <div className="w-[360px] space-y-3">
      <MakeOfferPanel
        listPrice={450}
        value={offer}
        onValueChange={setOffer}
        onSubmit={() => setStatus("pending")}
        status={status}
        submittedOffer={offer}
      />
      {status ? (
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setStatus(undefined)}
        >
          Teklifi düzenle
        </Button>
      ) : null}
    </div>
  );
}

export const Varsayilan: Story = {
  render: () => <TeklifAkisi />,
};

/** Vintage Levi's ceket icin hizli indirim onerileriyle teklif girisi. */
export const HizliOneriler: Story = {
  render: () => (
    <MakeOfferPanel
      className="w-[360px]"
      title="Vintage Levi's Ceket"
      listPrice={1200}
      defaultValue={960}
      quickDiscounts={[10, 20, 30]}
      onSubmit={(tutar) => console.log("Teklif gönderildi:", tutar)}
    />
  ),
};

/** Saticinin karsi teklif verdigi durum ozeti + aksiyon slotu. */
export const KarsiTeklif: Story = {
  render: () => (
    <MakeOfferPanel
      className="w-[360px]"
      listPrice={450}
      submittedOffer={320}
      status="countered"
      counterPrice={385}
      action={
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm">
            <Check aria-hidden="true" />
            Kabul et
          </Button>
          <Button size="sm" variant="outline">
            Yeni teklif
          </Button>
        </div>
      }
    />
  ),
};

/** Dort teklif durumu: Bekliyor, Kabul, Red, Karsi-teklif rozetleri. */
export const DurumRozetleri: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <MakeOfferStatusBadge status="pending" />
      <MakeOfferStatusBadge status="accepted" />
      <MakeOfferStatusBadge status="rejected" />
      <MakeOfferStatusBadge status="countered" />
    </div>
  ),
};
