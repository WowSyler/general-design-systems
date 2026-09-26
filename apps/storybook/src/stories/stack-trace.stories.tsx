import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { StackTrace } from "@wowsyler/ds-ui";

type StackTraceFrameData = React.ComponentProps<typeof StackTrace>["frames"][number];

const meta: Meta<typeof StackTrace> = {
  title: "Composites/StackTrace",
  component: StackTrace,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StackTrace>;

// DeployLens dağıtım kuyruğunda oluşan bir zaman aşımı hatasının yığın izi.
const deployFrames: StackTraceFrameData[] = [
  {
    id: "deploy-1",
    functionName: "waitForBuildArtifacts",
    file: "src/server/deploy/pipeline.ts",
    line: 148,
    column: 21,
    context: [
      { number: 146, code: "  const artifacts = await registry.fetch(buildId);" },
      { number: 147, code: "  if (!artifacts.ready) {" },
      {
        number: 148,
        code: "    throw new DeployTimeoutError(`Derleme ${buildId} zaman aşımına uğradı`);",
        highlight: true,
      },
      { number: 149, code: "  }" },
      { number: 150, code: "  return artifacts.manifest;" },
    ],
  },
  {
    id: "deploy-2",
    functionName: "runDeployStage",
    file: "src/server/deploy/pipeline.ts",
    line: 92,
    column: 11,
    context: [
      { number: 90, code: "  const manifest = await waitForBuildArtifacts(build.id, {" },
      { number: 91, code: "    timeoutMs: stage.timeout ?? 120_000," },
      { number: 92, code: "  });", highlight: true },
      { number: 93, code: "  await publish(manifest, stage.region);" },
    ],
  },
  {
    id: "deploy-3",
    functionName: "processQueue",
    file: "src/server/queue/worker.ts",
    line: 57,
    column: 9,
    context: [
      { number: 55, code: "  for (const job of batch) {" },
      { number: 56, code: "    try {" },
      { number: 57, code: "      await runDeployStage(job.payload);", highlight: true },
      { number: 58, code: "    } catch (err) {" },
      { number: 59, code: "      reporter.capture(err, { job });" },
    ],
  },
  {
    id: "deploy-4",
    functionName: "Timeout._onTimeout",
    file: "node_modules/p-queue/dist/index.js",
    line: 214,
    library: true,
  },
  {
    id: "deploy-5",
    functionName: "listOnTimeout",
    file: "node:internal/timers",
    line: 573,
    column: 17,
    library: true,
  },
];

export const DeployZamanAsimi: Story = {
  args: {
    errorType: "DeployTimeoutError",
    message:
      "Derleme dpl_8f3a21 üretim ortamına yayınlanamadan 120 saniyede zaman aşımına uğradı.",
    frames: deployFrames,
    defaultExpandedIds: ["deploy-1"],
  },
};

// Kütüphane kareleri baştan gizli; kullanıcı yalnızca uygulama kodunu görür.
export const YalnizcaUygulamaKodu: Story = {
  args: {
    errorType: "TypeError",
    message: "Cannot read properties of undefined (reading 'region')",
    defaultShowLibrary: false,
    defaultExpandedIds: ["app-1"],
    frames: [
      {
        id: "app-1",
        functionName: "resolveRegion",
        file: "src/lib/regions.ts",
        line: 34,
        column: 14,
        context: [
          { number: 32, code: "export function resolveRegion(config) {" },
          { number: 33, code: "  const primary = config.deploy;" },
          {
            number: 34,
            code: "  return primary.region.toLowerCase();",
            highlight: true,
          },
          { number: 35, code: "}" },
        ],
      },
      {
        id: "app-2",
        functionName: "buildDeployPlan",
        file: "src/lib/plan.ts",
        line: 71,
        column: 20,
        context: [
          { number: 70, code: "  const region = resolveRegion(project.settings);" },
          { number: 71, code: "  plan.push({ region, stage });", highlight: true },
        ],
      },
      {
        id: "app-3",
        functionName: "dispatch",
        file: "node_modules/react-dom/cjs/react-dom.js",
        line: 4291,
        library: true,
      },
      {
        id: "app-4",
        functionName: "invokeGuardedCallback",
        file: "node_modules/react-dom/cjs/react-dom.js",
        line: 4056,
        library: true,
      },
    ],
  },
};

// Kod bağlamı olmayan, kopyalama kapalı kısa bir yığın izi.
export const BaglamsizVeKopyaKapali: Story = {
  args: {
    errorType: "ValidationError",
    message: "Geçersiz bölge kodu: 'ist2' tanımlı bölgeler arasında değil.",
    copyable: false,
    frames: [
      {
        id: "v-1",
        functionName: "assertRegion",
        file: "src/lib/validate.ts",
        line: 18,
        column: 5,
      },
      {
        id: "v-2",
        functionName: "parseConfig",
        file: "src/lib/config.ts",
        line: 44,
        column: 12,
      },
      {
        id: "v-3",
        functionName: "loadProject",
        file: "src/server/boot.ts",
        line: 26,
        column: 9,
      },
    ],
  },
};
