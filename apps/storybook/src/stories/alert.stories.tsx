import type { Meta, StoryObj } from "@storybook/react";
import { AlertTriangle, Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@ds/ui";

const meta: Meta<typeof Alert> = {
  title: "Primitives/Alert",
  component: Alert,
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <Alert className="max-w-lg">
      <Info className="size-4" />
      <AlertTitle>Analiz hazır</AlertTitle>
      <AlertDescription>
        GlowScan cilt analiziniz tamamlandı. Nem skorunuz geçen aya göre %12
        arttı — önerilen bakım rutinini profilinizden görebilirsiniz.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="max-w-lg">
      <AlertTriangle className="size-4" />
      <AlertTitle>Deploy karşılaştırması başarısız</AlertTitle>
      <AlertDescription>
        DeployLens, production ortamının ekran görüntüsünü alamadı. Hedef URL
        yanıt vermiyor olabilir; erişimi kontrol edip yeniden deneyin.
      </AlertDescription>
    </Alert>
  ),
};

export const WithoutIcon: Story = {
  name: "Simgesiz",
  render: () => (
    <Alert className="max-w-lg">
      <AlertTitle>Fiş taraması sıraya alındı</AlertTitle>
      <AlertDescription>
        Yüklediğiniz 4 fiş işleniyor. Kategoriler otomatik atandığında
        bildirim alacaksınız.
      </AlertDescription>
    </Alert>
  ),
};
