import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { DiffViewer } from "@ds/ui";

type DiffLine = React.ComponentProps<typeof DiffViewer>["lines"][number];

const meta: Meta<typeof DiffViewer> = {
  title: "Composites/DiffViewer",
  component: DiffViewer,
};

export default meta;
type Story = StoryObj<typeof DiffViewer>;

const konfigDiff: DiffLine[] = [
  { type: "context", oldLineNumber: 1, newLineNumber: 1, content: "export const deployConfig = {" },
  { type: "context", oldLineNumber: 2, newLineNumber: 2, content: '  project: "deploylens",' },
  { type: "remove", oldLineNumber: 3, content: '  region: "eu-west-1",' },
  { type: "add", newLineNumber: 3, content: '  region: "eu-central-1",' },
  { type: "context", oldLineNumber: 4, newLineNumber: 4, content: "  replicas: 3," },
  { type: "remove", oldLineNumber: 5, content: "  timeout: 30," },
  { type: "add", newLineNumber: 5, content: "  timeout: 60," },
  { type: "add", newLineNumber: 6, content: "  autoRollback: true," },
  { type: "context", oldLineNumber: 6, newLineNumber: 7, content: "};" },
];

const saglikDiff: DiffLine[] = [
  { type: "context", oldLineNumber: 12, newLineNumber: 12, content: "// Dagitim sonrasi saglik kontrolu" },
  { type: "remove", oldLineNumber: 13, content: "export function healthCheck(url) {" },
  { type: "add", newLineNumber: 13, content: "export async function healthCheck(url) {" },
  { type: "remove", oldLineNumber: 14, content: "  return fetch(url).then((r) => r.ok);" },
  { type: "add", newLineNumber: 14, content: "  const res = await fetch(url, { timeout: 5000 });" },
  { type: "add", newLineNumber: 15, content: "  return res.status === 200;" },
  { type: "context", oldLineNumber: 15, newLineNumber: 16, content: "}" },
];

const kuralDiff: DiffLine[] = [
  { type: "context", oldLineNumber: 1, newLineNumber: 1, content: "export const alertRules = [" },
  { type: "context", oldLineNumber: 2, newLineNumber: 2, content: '  { metric: "p95_latency", threshold: 800 },' },
  { type: "add", newLineNumber: 3, content: '  { metric: "error_rate", threshold: 0.02 },' },
  { type: "add", newLineNumber: 4, content: '  { metric: "cpu_usage", threshold: 0.85 },' },
  { type: "context", oldLineNumber: 3, newLineNumber: 5, content: "];" },
];

export const BirlesikGorunum: Story = {
  render: () => (
    <div className="max-w-3xl">
      <DiffViewer fileName="src/config/deploy.config.ts" lines={konfigDiff} />
    </div>
  ),
};

export const YanYanaGorunum: Story = {
  render: () => (
    <div className="max-w-4xl">
      <DiffViewer
        fileName="src/lib/health-check.ts"
        lines={saglikDiff}
        view="split"
      />
    </div>
  ),
};

export const YenidenAdlandirma: Story = {
  render: () => (
    <div className="max-w-3xl">
      <DiffViewer
        fileName="src/monitors/alert-rules.ts"
        renamedFrom="src/alerts.ts"
        lines={kuralDiff}
      />
    </div>
  ),
};
