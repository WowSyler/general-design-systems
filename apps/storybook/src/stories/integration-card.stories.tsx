import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, Grid, IntegrationCard } from "@wowsyler/ds-ui";
import { Bug, Container, Github, Gitlab, Slack, Webhook } from "lucide-react";

const meta: Meta<typeof IntegrationCard> = {
  title: "Composites/IntegrationCard",
  component: IntegrationCard,
};

export default meta;
type Story = StoryObj<typeof IntegrationCard>;

export const BagliDegil: Story = {
  render: () => (
    <div className="w-80 max-w-full">
      <IntegrationCard
        icon={<Slack />}
        name="Slack"
        category="Bildirim"
        description="Dağıtım başarılı ya da başarısız olduğunda seçtiğiniz kanala anlık bildirim gönderin."
        connected={false}
      />
    </div>
  ),
};

export const Bagli: Story = {
  render: () => (
    <div className="w-80 max-w-full">
      <IntegrationCard
        icon={<Github />}
        name="GitHub"
        category="Kod deposu"
        description="deploylens/api deposuna bağlı. main dalına her push'ta otomatik dağıtım tetiklenir."
        connected
      />
    </div>
  ),
};

export const EntegrasyonGridi: Story = {
  render: () => (
    <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap="lg" className="max-w-5xl items-stretch">
      <IntegrationCard
        icon={<Github />}
        name="GitHub"
        category="Kod deposu"
        description="deploylens/api deposuna bağlı. main dalına her push'ta dağıtım tetiklenir."
        connected
      />
      <IntegrationCard
        icon={<Slack />}
        name="Slack"
        category="Bildirim"
        description="#dağıtımlar kanalına başarı ve hata bildirimleri gönderiliyor."
        connected
      />
      <IntegrationCard
        icon={<Gitlab />}
        name="GitLab"
        category="Kod deposu"
        description="GitLab depolarınızı bağlayarak boru hattı dağıtımlarını yönetin."
        connected={false}
      />
      <IntegrationCard
        icon={<Bug />}
        name="Sentry"
        category="Hata izleme"
        description="Üretimdeki istisnaları yakalayın; her dağıtımı sürüm olarak işaretleyin."
        connected={false}
      />
      <IntegrationCard
        icon={<Container />}
        name="Docker Hub"
        category="Konteyner kayıt defteri"
        description="İmajlarınızı Docker Hub'dan çekerek ortamlara dağıtın."
        connected
      />
      <IntegrationCard
        icon={<Webhook />}
        name="Webhook"
        category="Otomasyon"
        description="Dağıtım olaylarını kendi HTTP uç noktanıza iletin ve iş akışlarını tetikleyin."
        connected={false}
      />
    </Grid>
  ),
};

export const OzelAksiyon: Story = {
  render: () => (
    <div className="w-80 max-w-full">
      <IntegrationCard
        icon={<Slack />}
        name="Slack"
        category="Bildirim"
        description="Bağlantıyı kaldırmak ya da kanal ayarlarını düzenlemek için özel aksiyon slotu kullanılır."
        connected
        action={
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              Ayır
            </Button>
            <Button variant="outline" size="sm">
              Yönet
            </Button>
          </div>
        }
      />
    </div>
  ),
};

export const Yukleniyor: Story = {
  render: () => (
    <div className="w-80 max-w-full">
      <IntegrationCard name="" loading />
    </div>
  ),
};
