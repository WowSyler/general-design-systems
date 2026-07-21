import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Building2,
  File,
  FileCode,
  Folder,
  FolderGit2,
  Image,
  Server,
  Shirt,
  Tag,
  Users,
} from "lucide-react";

import { TreeView } from "@ds/ui";

const meta: Meta<typeof TreeView> = {
  title: "Primitives/TreeView",
  component: TreeView,
};

export default meta;
type Story = StoryObj<typeof TreeView>;

type Node = React.ComponentProps<typeof TreeView>["data"][number];

// DeployLens — dagitim deposu dosya agaci
const dosyaAgaci: Node[] = [
  {
    id: "src",
    label: "src",
    icon: <Folder />,
    children: [
      {
        id: "app",
        label: "app",
        icon: <Folder />,
        children: [
          { id: "layout", label: "layout.tsx", icon: <FileCode /> },
          { id: "page", label: "page.tsx", icon: <FileCode /> },
        ],
      },
      {
        id: "lib",
        label: "lib",
        icon: <Folder />,
        children: [
          { id: "deploy", label: "deploy.ts", icon: <FileCode /> },
          { id: "metrics", label: "metrics.ts", icon: <FileCode /> },
        ],
      },
    ],
  },
  {
    id: "public",
    label: "public",
    icon: <Folder />,
    children: [
      { id: "logo", label: "logo.svg", icon: <Image /> },
      { id: "og", label: "og-kapak.png", icon: <Image /> },
    ],
  },
  { id: "readme", label: "README.md", icon: <File /> },
  { id: "workflow", label: ".github/deploy.yml", icon: <FileCode /> },
];

export const DosyaAgaci: Story = {
  render: () => {
    const [active, setActive] = React.useState("page");
    return (
      <div className="w-80 rounded-lg border border-border bg-card p-2">
        <TreeView
          data={dosyaAgaci}
          defaultExpandedIds={["src", "app"]}
          activeId={active}
          onActiveChange={setActive}
        />
      </div>
    );
  },
};

// DeployLens — organizasyon / ortam agaci (ikonlu, aktif vurgulu)
const orgAgaci: Node[] = [
  {
    id: "acme",
    label: "Acme Yazılım",
    icon: <Building2 />,
    children: [
      {
        id: "web",
        label: "web-frontend",
        icon: <FolderGit2 />,
        children: [
          { id: "web-prod", label: "production · eu-central-1", icon: <Server /> },
          { id: "web-stag", label: "staging · eu-west-1", icon: <Server /> },
        ],
      },
      {
        id: "api",
        label: "api-gateway",
        icon: <FolderGit2 />,
        children: [
          { id: "api-prod", label: "production · us-east-1", icon: <Server /> },
          { id: "api-prev", label: "preview · pr-482", icon: <Server /> },
        ],
      },
      { id: "ekip", label: "Ekip (12 üye)", icon: <Users /> },
    ],
  },
];

export const OrganizasyonAgaci: Story = {
  render: () => (
    <div className="w-80 rounded-lg border border-border bg-card p-2">
      <TreeView
        data={orgAgaci}
        defaultExpandedIds={["acme", "web"]}
        defaultActiveId="web-prod"
      />
    </div>
  ),
};

// Fisly — kategori > alt-kategori, tri-state checkbox secim
const kategoriAgaci: Node[] = [
  {
    id: "gelir",
    label: "Gelirler",
    icon: <Tag />,
    children: [
      { id: "maas", label: "Maaş" },
      { id: "serbest", label: "Serbest Çalışma" },
      { id: "kira-geliri", label: "Kira Geliri" },
    ],
  },
  {
    id: "gider",
    label: "Giderler",
    icon: <Tag />,
    children: [
      {
        id: "sabit",
        label: "Sabit Giderler",
        children: [
          { id: "kira", label: "Kira" },
          { id: "abonelik", label: "Abonelikler" },
        ],
      },
      {
        id: "degisken",
        label: "Değişken Giderler",
        children: [
          { id: "market", label: "Market" },
          { id: "ulasim", label: "Ulaşım" },
          { id: "eglence", label: "Eğlence" },
        ],
      },
    ],
  },
];

export const KategoriSecimi: Story = {
  render: () => {
    const [checked, setChecked] = React.useState<string[]>(["kira", "abonelik"]);
    return (
      <div className="w-80 space-y-3">
        <div className="rounded-lg border border-border bg-card p-2">
          <TreeView
            selectable
            data={kategoriAgaci}
            defaultExpandedIds={["gider", "sabit", "degisken"]}
            checkedIds={checked}
            onCheckedChange={setChecked}
          />
        </div>
        <p className="text-xs text-muted-foreground tabular-nums">
          {checked.length} kategori seçili · rapora dahil edilecek
        </p>
      </div>
    );
  },
};

// Dolap — urun kategori agaci (ikonlu)
const dolapAgaci: Node[] = [
  {
    id: "kadin",
    label: "Kadın",
    icon: <Shirt />,
    children: [
      { id: "elbise", label: "Elbise" },
      { id: "kadin-ust", label: "Üst Giyim" },
      { id: "kadin-ayakkabi", label: "Ayakkabı" },
    ],
  },
  {
    id: "erkek",
    label: "Erkek",
    icon: <Shirt />,
    children: [
      { id: "gomlek", label: "Gömlek" },
      { id: "erkek-pantolon", label: "Pantolon" },
    ],
  },
  { id: "aksesuar", label: "Aksesuar", icon: <Tag /> },
];

export const DolapKategorileri: Story = {
  render: () => (
    <div className="w-72 rounded-lg border border-border bg-card p-2">
      <TreeView data={dolapAgaci} defaultExpandedIds={["kadin"]} defaultActiveId="elbise" />
    </div>
  ),
};
