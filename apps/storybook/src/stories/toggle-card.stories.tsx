import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Bell,
  CalendarClock,
  Droplet,
  GitBranch,
  Leaf,
  Mail,
  MessageSquare,
  Rocket,
  Sparkles,
  Sun,
} from "lucide-react";

import { ToggleCard, ToggleCardGroup } from "@ds/ui";

const meta: Meta<typeof ToggleCardGroup> = {
  title: "Primitives/ToggleCard",
  component: ToggleCardGroup,
};

export default meta;
type Story = StoryObj<typeof ToggleCardGroup>;

export const GlowScanCiltTipi: Story = {
  render: () => {
    const [ciltTipi, setCiltTipi] = React.useState("karma");
    return (
      <div className="w-[26rem] max-w-full space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Cilt tipiniz</h3>
          <p className="text-sm text-muted-foreground">
            GlowScan analizini kişiselleştirmek için birini seçin.
          </p>
        </div>
        <ToggleCardGroup
          type="single"
          value={ciltTipi}
          onValueChange={(value: string | string[]) => setCiltTipi(value as string)}
          className="sm:grid-cols-2"
        >
          <ToggleCard
            value="kuru"
            icon={<Leaf />}
            title="Kuru"
            description="Gerginlik ve pul pul dökülme eğilimli."
          />
          <ToggleCard
            value="yagli"
            icon={<Droplet />}
            title="Yağlı"
            description="Gün içinde belirgin parlama ve gözenek."
          />
          <ToggleCard
            value="karma"
            icon={<Sparkles />}
            title="Karma"
            description="T bölgesi yağlı, yanaklar normal-kuru."
          />
          <ToggleCard
            value="hassas"
            icon={<Sun />}
            title="Hassas"
            description="Kızarıklık ve tahrişe kolay tepki verir."
          />
        </ToggleCardGroup>
        <p className="text-xs text-muted-foreground">
          Seçilen: <span className="font-medium text-foreground">{ciltTipi}</span>
        </p>
      </div>
    );
  },
};

export const DeployLensDagitimStratejisi: Story = {
  render: () => {
    const [strateji, setStrateji] = React.useState("canary");
    return (
      <div className="w-[26rem] max-w-full space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Dağıtım stratejisi
          </h3>
          <p className="text-sm text-muted-foreground">
            production ortamına yeni sürüm nasıl yayılsın?
          </p>
        </div>
        <ToggleCardGroup
          type="single"
          value={strateji}
          onValueChange={(value: string | string[]) => setStrateji(value as string)}
        >
          <ToggleCard
            value="rolling"
            icon={<Rocket />}
            title="Rolling"
            description="Pod'lar kademeli değişir, kesinti olmadan yayılır."
          />
          <ToggleCard
            value="canary"
            icon={<GitBranch />}
            title="Canary"
            description="Trafiğin %10'u yeni sürüme yönlendirilip izlenir."
          />
          <ToggleCard
            value="blue-green"
            icon={<GitBranch />}
            title="Blue-Green"
            description="Yeni sürüm hazır olunca trafik anında geçer. Yakında."
            disabled
          />
        </ToggleCardGroup>
      </div>
    );
  },
};

export const RandevuBildirimTercihleri: Story = {
  render: () => {
    const [kanallar, setKanallar] = React.useState<string[]>(["eposta", "push"]);
    return (
      <div className="w-[26rem] max-w-full space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Randevu hatırlatmaları
          </h3>
          <p className="text-sm text-muted-foreground">
            Size nereden ulaşalım? Birden fazla kanal seçebilirsiniz.
          </p>
        </div>
        <ToggleCardGroup
          type="multiple"
          value={kanallar}
          onValueChange={(value: string | string[]) => setKanallar(value as string[])}
          className="sm:grid-cols-2"
        >
          <ToggleCard
            value="eposta"
            icon={<Mail />}
            title="E-posta"
            description="Randevudan 24 saat önce."
          />
          <ToggleCard
            value="sms"
            icon={<MessageSquare />}
            title="SMS"
            description="Randevudan 1 saat önce."
          />
          <ToggleCard
            value="push"
            icon={<Bell />}
            title="Anlık bildirim"
            description="Değişiklik olduğunda anında."
          />
          <ToggleCard
            value="takvim"
            icon={<CalendarClock />}
            title="Takvim daveti"
            description="Otomatik takvim kaydı gönderilir."
          />
        </ToggleCardGroup>
        <p className="text-xs text-muted-foreground tabular-nums">
          {kanallar.length > 0
            ? `${kanallar.length} kanal etkin`
            : "Hiçbir hatırlatma gönderilmeyecek"}
        </p>
      </div>
    );
  },
};
