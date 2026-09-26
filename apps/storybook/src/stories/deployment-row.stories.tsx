import type { Meta, StoryObj } from "@storybook/react-vite";

import { DeploymentRow, DeploymentRowGroup } from "@wowsyler/ds-ui";

const meta: Meta<typeof DeploymentRow> = {
  title: "Composites/DeploymentRow",
  component: DeploymentRow,
};

export default meta;
type Story = StoryObj<typeof DeploymentRow>;

export const TekDagitim: Story = {
  render: () => (
    <DeploymentRowGroup className="max-w-2xl">
      <DeploymentRow
        status="success"
        environment="production"
        message="feat: dağıtım grafiğine p95 gecikme çizgisi eklendi"
        branch="main"
        commit="a1b2c3d"
        authorName="Ayşe Demir"
        time="3 dk önce"
        duration="1dk 24sn"
        onViewLogs={() => {}}
        onRollback={() => {}}
      />
    </DeploymentRowGroup>
  ),
};

export const DagitimGecmisi: Story = {
  render: () => (
    <DeploymentRowGroup className="max-w-2xl">
      <DeploymentRow
        status="running"
        environment="production"
        message="chore: DeployLens webhook imza doğrulaması"
        branch="main"
        commit="9f3ac21"
        authorName="Mert Kaya"
        time="şimdi"
        onViewLogs={() => {}}
      />
      <DeploymentRow
        status="success"
        environment="staging"
        message="feat: ortam bazlı özellik bayrakları paneli"
        branch="feat/flag-panel"
        commit="c4d5e6f"
        authorName="Ayşe Demir"
        time="12 dk önce"
        duration="58sn"
        onViewLogs={() => {}}
        onRollback={() => {}}
      />
      <DeploymentRow
        status="failed"
        environment="production"
        message="fix: kuyruk tüketici zaman aşımı süresi düşürüldü"
        branch="hotfix/queue-timeout"
        commit="7b8c9d0"
        authorName="Selin Yıldız"
        time="41 dk önce"
        duration="2dk 06sn"
        onViewLogs={() => {}}
        onRollback={() => {}}
      />
      <DeploymentRow
        status="canceled"
        environment="preview"
        message="refactor: bağımlılık grafiği önbelleği"
        branch="pr/482"
        commit="e1f2a3b"
        authorName="Can Öztürk"
        time="1 sa önce"
        onViewLogs={() => {}}
      />
    </DeploymentRowGroup>
  ),
};

export const KuyruktakiDagitim: Story = {
  render: () => (
    <DeploymentRowGroup className="max-w-2xl">
      <DeploymentRow
        status="queued"
        environment="staging"
        message="feat: dağıtım satırına canlı ilerleme çubuğu"
        branch="feat/live-progress"
        commit="00ab12c"
        authorName="Deniz Aksoy"
        time="sırada"
      />
      <DeploymentRow
        status="running"
        environment="development"
        message="test: uçtan uca dağıtım senaryoları"
        branch="ci/e2e"
        commit="34cd56e"
        authorName="Mert Kaya"
        time="şimdi"
        onViewLogs={() => {}}
      />
    </DeploymentRowGroup>
  ),
};
