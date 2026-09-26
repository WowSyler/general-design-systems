import type { Meta, StoryObj } from "@storybook/react-vite";

import { MapCard } from "@wowsyler/ds-ui";

const meta: Meta<typeof MapCard> = {
  title: "Composites/MapCard",
  component: MapCard,
};

export default meta;
type Story = StoryObj<typeof MapCard>;

export const RandevuMekan: Story = {
  args: {
    place: "Kadıköy Şubesi",
    address: "Caferağa Mah. Moda Cad. No:42, Kadıköy / İstanbul",
    distance: "1,2 km",
    tone: "primary",
    showMarkerLabel: true,
    onDirections: () => {},
    onExpand: () => {},
  },
};

export const SaticiKonumu: Story = {
  args: {
    place: "Buse'nin Dolabı",
    address: "Alsancak Mah. Kıbrıs Şehitleri Cad. No:118, Konak / İzmir",
    distance: "640 m",
    tone: "success",
    aspect: "wide",
    onDirections: () => {},
    onExpand: () => {},
  },
};

export const SadeceHarita: Story = {
  args: {
    place: "GlowScan Cilt Kliniği",
    tone: "info",
    aspect: "square",
    showMarkerLabel: true,
  },
};

export const MekanListesi: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
      <MapCard
        place="Nişantaşı Şubesi"
        address="Teşvikiye Mah. Abdi İpekçi Cad. No:14, Şişli / İstanbul"
        distance="3,4 km"
        tone="primary"
        onDirections={() => {}}
        onExpand={() => {}}
      />
      <MapCard
        place="Bornova Deposu"
        address="Kazımdirik Mah. Üniversite Cad. No:7, Bornova / İzmir"
        distance="8,1 km"
        tone="warning"
        onDirections={() => {}}
        onExpand={() => {}}
      />
    </div>
  ),
};

export const Yukleniyor: Story = {
  args: {
    loading: true,
  },
};
