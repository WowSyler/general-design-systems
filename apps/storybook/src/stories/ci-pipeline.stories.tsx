import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { CiPipeline } from "@ds/ui";

type CiPipelineStage = React.ComponentProps<typeof CiPipeline>["stages"][number];

const meta: Meta<typeof CiPipeline> = {
  title: "Composites/CiPipeline",
  component: CiPipeline,
};

export default meta;
type Story = StoryObj<typeof CiPipeline>;

// DeployLens uretim dagitimi — tum asamalar basarili
const basariliAsamalar: CiPipelineStage[] = [
  {
    id: "kur",
    label: "Kur",
    status: "success",
    duration: "24sn",
    description:
      "Bağımlılıklar pnpm ile kuruldu. Önbellek isabet oranı %92, 1.284 paket çözüldü.",
  },
  {
    id: "derle",
    label: "Derle",
    status: "success",
    duration: "1dk 12sn",
    description:
      "Next.js üretim derlemesi tamamlandı. 48 rota oluşturuldu, paket boyutu 214 KB.",
  },
  {
    id: "test",
    label: "Test",
    status: "success",
    duration: "38sn",
    description: "312 birim ve 26 entegrasyon testi geçti. Kapsam %87.",
  },
  {
    id: "dagit",
    label: "Dağıt",
    status: "success",
    duration: "19sn",
    description:
      "Üretim ortamına kademeli (canary) dağıtım yapıldı, sağlık kontrolü yeşil.",
  },
];

export const BasariliDagitim: Story = {
  args: {
    title: "DeployLens · Üretim dağıtımı",
    subtitle: "web-app · #482 numaralı çalışma",
    branch: "main",
    commit: "a3f9c21",
    totalDuration: "2dk 33sn",
    stages: basariliAsamalar,
    activeStageId: "dagit",
    className: "max-w-2xl",
  },
};

// Test asamasinda hata — sonraki asama atlandi, detay panelinde log ozeti
export const TesttebHata: Story = {
  name: "Testte Hata",
  args: {
    title: "DeployLens · Önizleme derlemesi",
    subtitle: "web-app · #483 numaralı çalışma",
    branch: "feature/odeme-akisi",
    commit: "7b1e0d4",
    totalDuration: "1dk 44sn",
    activeStageId: "test",
    stages: [
      {
        id: "kur",
        label: "Kur",
        status: "success",
        duration: "22sn",
        description: "Bağımlılıklar kuruldu, önbellek geri yüklendi.",
      },
      {
        id: "derle",
        label: "Derle",
        status: "success",
        duration: "1dk 08sn",
        description: "Derleme tamamlandı, tip denetimi temiz.",
      },
      {
        id: "test",
        label: "Test",
        status: "failed",
        duration: "14sn",
        description:
          "checkout.spec.ts başarısız: beklenen 200, alınan 500. Toplam 3 test kırıldı. Ayrıntı için çalışma günlüğünü inceleyin.",
      },
      {
        id: "dagit",
        label: "Dağıt",
        status: "skipped",
        description: "Önceki aşama başarısız olduğu için dağıtım atlandı.",
      },
    ],
    className: "max-w-2xl",
  },
};

// Canli calisan hat — asamaya tiklayarak detay panelini degistir
export const CalisiyorInteraktif: Story = {
  name: "Çalışıyor (Tıklanabilir)",
  render: () => {
    const asamalar: CiPipelineStage[] = [
      {
        id: "kur",
        label: "Kur",
        status: "success",
        duration: "26sn",
        description: "Bağımlılıklar kuruldu, iş alanı önbelleği hazır.",
      },
      {
        id: "derle",
        label: "Derle",
        status: "success",
        duration: "1dk 04sn",
        description: "Üretim derlemesi tamamlandı, kaynak haritaları yüklendi.",
      },
      {
        id: "test",
        label: "Test",
        status: "running",
        duration: "18sn…",
        description:
          "Test paketi çalışıyor. 214/338 test tamamlandı, henüz hata yok.",
      },
      {
        id: "dagit",
        label: "Dağıt",
        status: "pending",
        description: "Testler geçtiğinde otomatik olarak başlayacak.",
      },
    ];

    const [seciliId, setSeciliId] = React.useState<string | undefined>("test");

    return (
      <CiPipeline
        title="DeployLens · Sürekli entegrasyon"
        subtitle="web-app · #484 numaralı çalışma"
        branch="main"
        commit="c9d2f80"
        totalDuration="1dk 48sn…"
        stages={asamalar}
        activeStageId={seciliId}
        onStageSelect={(stage: CiPipelineStage) => setSeciliId(stage.id)}
        className="max-w-2xl"
      />
    );
  },
};
