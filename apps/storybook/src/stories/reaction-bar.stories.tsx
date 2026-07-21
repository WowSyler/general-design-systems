import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flame, Heart, Laugh, PartyPopper, ThumbsUp } from "lucide-react";

import { ReactionBar } from "@ds/ui";

type Reaction = React.ComponentProps<typeof ReactionBar>["reactions"][number];

const meta: Meta<typeof ReactionBar> = {
  title: "Composites/ReactionBar",
  component: ReactionBar,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ReactionBar>;

const dolapReactions: Reaction[] = [
  { id: "like", label: "Begen", emoji: <ThumbsUp />, count: 42 },
  { id: "heart", label: "Bayildim", emoji: <Heart />, count: 128 },
  { id: "fire", label: "Harika", emoji: <Flame />, count: 17 },
];

const dolapAddOptions: Reaction[] = [
  { id: "laugh", label: "Guldurdu", emoji: "😂", count: 8 },
  { id: "party", label: "Kutlama", emoji: "🎉", count: 3 },
  { id: "wow", label: "Sasirtici", emoji: "😮", count: 5 },
  { id: "sad", label: "Uzucu", emoji: "😢", count: 1 },
];

export const DolapIlanTepkileri: Story = {
  name: "Dolap — ilan tepkileri",
  args: {
    reactions: dolapReactions,
    defaultValue: ["heart"],
    addOptions: dolapAddOptions,
    addLabel: "Tepki ekle",
  },
};

export const KucukYorumCubugu: Story = {
  name: "DeployLens — yorum satiri (sm)",
  args: {
    size: "sm",
    reactions: [
      { id: "up", label: "Katiliyorum", emoji: <ThumbsUp />, count: 6 },
      { id: "celebrate", label: "Tebrikler", emoji: <PartyPopper />, count: 2 },
      { id: "haha", label: "Guldum", emoji: <Laugh />, count: 0 },
    ],
    defaultValue: ["up"],
  },
};

export const KontrolluTekSecim: Story = {
  name: "GlowScan — kontrollu, tek secim",
  render: () => {
    const [value, setValue] = React.useState<string[]>([]);
    const puanlar: Reaction[] = [
      { id: "great", label: "Cok iyi", emoji: "😍", count: 214 },
      { id: "ok", label: "Idare eder", emoji: "🙂", count: 96 },
      { id: "meh", label: "Beklentimin altinda", emoji: "😕", count: 12 },
    ];
    const secili = puanlar.find((p) => p.id === value[0]);

    return (
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-muted-foreground">
          Bu haftaki cilt rutininizi degerlendirin
        </p>
        <ReactionBar
          reactions={puanlar}
          value={value}
          onChange={setValue}
          allowMultiple={false}
          size="lg"
        />
        <p className="text-xs text-muted-foreground">
          {secili ? `Seciminiz: ${secili.label}` : "Henuz secim yapmadiniz"}
        </p>
      </div>
    );
  },
};
