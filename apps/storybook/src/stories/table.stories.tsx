import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Badge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@ds/ui";

const meta: Meta<typeof Table> = {
  title: "Primitives/Table",
  component: Table,
};

export default meta;
type Story = StoryObj<typeof Table>;

const rezervasyonlar = [
  {
    musteri: "Elif Yıldız",
    hizmet: "Saç kesimi + fön",
    saat: "10:00",
    durum: "Onaylandı",
    varyant: "success-soft" as const,
    ucret: "₺450",
  },
  {
    musteri: "Mert Kaya",
    hizmet: "Sakal tıraşı",
    saat: "11:30",
    durum: "Bekliyor",
    varyant: "warning-soft" as const,
    ucret: "₺200",
  },
  {
    musteri: "Zeynep Arslan",
    hizmet: "Manikür",
    saat: "13:00",
    durum: "Gelmedi",
    varyant: "destructive-soft" as const,
    ucret: "₺350",
  },
  {
    musteri: "Can Demir",
    hizmet: "Cilt bakımı",
    saat: "15:30",
    durum: "Onaylandı",
    varyant: "success-soft" as const,
    ucret: "₺600",
  },
];

export const Default: Story = {
  name: "Rezervasyon Listesi",
  render: () => (
    <Table className="w-[560px]">
      <TableCaption>Bugünün randevuları — Salon Aura</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Müşteri</TableHead>
          <TableHead>Hizmet</TableHead>
          <TableHead>Saat</TableHead>
          <TableHead>Durum</TableHead>
          <TableHead className="text-right">Ücret</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rezervasyonlar.map((r) => (
          <TableRow key={r.musteri}>
            <TableCell className="font-medium">{r.musteri}</TableCell>
            <TableCell>{r.hizmet}</TableCell>
            <TableCell>{r.saat}</TableCell>
            <TableCell>
              <Badge variant={r.varyant}>{r.durum}</Badge>
            </TableCell>
            <TableCell className="text-right">{r.ucret}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Toplam</TableCell>
          <TableCell className="text-right">₺1.600</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const Compact: Story = {
  name: "Sade",
  render: () => (
    <Table className="w-[420px]">
      <TableHeader>
        <TableRow>
          <TableHead>Kategori</TableHead>
          <TableHead className="text-right">Bu ay</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Yakıt</TableCell>
          <TableCell className="text-right">₺3.240</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Yemek</TableCell>
          <TableCell className="text-right">₺1.875</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Ofis</TableCell>
          <TableCell className="text-right">₺940</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
