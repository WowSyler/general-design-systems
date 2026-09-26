import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  MemberRoleRow,
  MemberRoleRowGroup,
  MemberRoleRowInvite,
} from "@wowsyler/ds-ui";

const meta: Meta<typeof MemberRoleRow> = {
  title: "Composites/MemberRoleRow",
  component: MemberRoleRow,
};

export default meta;
type Story = StoryObj<typeof MemberRoleRow>;

export const TekSatir: Story = {
  args: {
    name: "Elif Yıldırım",
    email: "elif.yildirim@deploylens.io",
    defaultRole: "admin",
    status: "active",
    onRemove: () => {},
  },
};

export const EkipListesi: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Ekip üyeleri</h3>
          <p className="text-xs text-muted-foreground">
            DeployLens çalışma alanınızda 4 kişi
          </p>
        </div>
      </div>
      <MemberRoleRowGroup>
        <MemberRoleRow
          name="Mert Kaya"
          email="mert.kaya@deploylens.io"
          defaultRole="owner"
          status="active"
          disabled
          isCurrentUser
        />
        <MemberRoleRow
          name="Elif Yıldırım"
          email="elif.yildirim@deploylens.io"
          defaultRole="admin"
          status="active"
          onRemove={() => {}}
        />
        <MemberRoleRow
          name="Burak Demir"
          email="burak.demir@deploylens.io"
          defaultRole="member"
          status="active"
          onRemove={() => {}}
        />
        <MemberRoleRow
          name="Zeynep Aksoy"
          email="zeynep.aksoy@deploylens.io"
          defaultRole="viewer"
          status="invited"
          onResendInvite={() => {}}
          onRemove={() => {}}
        />
      </MemberRoleRowGroup>
    </div>
  ),
};

type EkipUyesi = {
  name: string;
  email: string;
  role: string;
  status: "active" | "invited";
  disabled?: boolean;
  isCurrentUser?: boolean;
};

export const UyeDavetEt: Story = {
  render: () => {
    const [members, setMembers] = React.useState<EkipUyesi[]>([
      {
        name: "Mert Kaya",
        email: "mert.kaya@deploylens.io",
        role: "owner",
        status: "active",
        disabled: true,
        isCurrentUser: true,
      },
      {
        name: "Elif Yıldırım",
        email: "elif.yildirim@deploylens.io",
        role: "admin",
        status: "active",
      },
    ]);

    return (
      <div className="w-full max-w-2xl space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Üye davet et</h3>
          <p className="text-xs text-muted-foreground">
            Davet edilen kişilere e-posta ile katılım bağlantısı gönderilir
          </p>
        </div>
        <MemberRoleRowInvite
          defaultRole="member"
          onInvite={({ email, role }: { email: string; role: string }) =>
            setMembers((prev) => [
              ...prev,
              {
                name: (email.split("@")[0] ?? email).replace(/\./g, " "),
                email,
                role,
                status: "invited",
              },
            ])
          }
        />
        <MemberRoleRowGroup>
          {members.map((member) => (
            <MemberRoleRow
              key={member.email}
              name={member.name}
              email={member.email}
              defaultRole={member.role}
              status={member.status}
              disabled={member.disabled}
              isCurrentUser={member.isCurrentUser}
              onResendInvite={member.status === "invited" ? () => {} : undefined}
              onRemove={member.disabled ? undefined : () => {}}
            />
          ))}
        </MemberRoleRowGroup>
      </div>
    );
  },
};
