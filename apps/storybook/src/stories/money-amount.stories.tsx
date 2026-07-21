import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

import { MoneyAmount } from "@ds/ui";

const meta: Meta<typeof MoneyAmount> = {
  title: "Primitives/MoneyAmount",
  component: MoneyAmount,
};

export default meta;
type Story = StoryObj<typeof MoneyAmount>;

export const Boyutlar: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <MoneyAmount amount={49.9} size="sm" />
      <MoneyAmount amount={1249.5} size="md" />
      <MoneyAmount amount={18750.75} size="lg" />
      <MoneyAmount amount={124680.25} size="xl" smallDecimals />
    </div>
  ),
};

export const GelirGider: Story = {
  render: () => {
    const hareketler = [
      { ad: "Kira geliri — Daire 3B", ikon: <ArrowUpRight />, tutar: 14500 },
      { ad: "Faturalı satış #10482", ikon: <ArrowUpRight />, tutar: 3299.9 },
      { ad: "Ofis kirası ödemesi", ikon: <ArrowDownLeft />, tutar: -8750 },
      { ad: "Muhasebe hizmet bedeli", ikon: <ArrowDownLeft />, tutar: -1180.5 },
    ];
    return (
      <div className="w-96 divide-y divide-border rounded-xl border border-border">
        {hareketler.map((hareket) => (
          <div
            key={hareket.ad}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className={
                  hareket.tutar >= 0
                    ? "rounded-md bg-success/10 p-1.5 text-success [&_svg]:size-3.5"
                    : "rounded-md bg-destructive/10 p-1.5 text-destructive [&_svg]:size-3.5"
                }
                aria-hidden="true"
              >
                {hareket.ikon}
              </span>
              <span className="text-foreground">{hareket.ad}</span>
            </div>
            <MoneyAmount amount={hareket.tutar} colored showSign smallDecimals />
          </div>
        ))}
      </div>
    );
  },
};

export const FiyatVeParaBirimleri: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
        <span
          className="rounded-lg bg-primary/10 p-2 text-primary [&_svg]:size-5"
          aria-hidden="true"
        >
          <Wallet />
        </span>
        <div>
          <div className="text-sm text-muted-foreground">Güncel bakiye</div>
          <MoneyAmount amount={87340.6} size="lg" smallDecimals />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground">
          Vintage deri ceket — Dolap
        </div>
        <div className="flex items-baseline gap-3">
          <MoneyAmount amount={1250} size="lg" decimals={0} />
          <span className="text-sm text-muted-foreground line-through">
            <MoneyAmount amount={1890} size="sm" decimals={0} />
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <MoneyAmount amount={49.99} currency="USD" currencyPosition="before" />
        <MoneyAmount amount={39.9} currency="EUR" currencyPosition="before" />
        <MoneyAmount amount={1499.9} currency="TRY" />
      </div>
    </div>
  ),
};
