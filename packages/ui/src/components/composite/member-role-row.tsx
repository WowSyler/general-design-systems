"use client";

/**
 * MemberRoleRow — Ekip uyesi / RBAC satiri (DeployLens ve genel ekip yonetimi).
 * Avatar + isim + e-posta + rol secimi (Sahip/Yonetici/Uye/Izleyici) + durum
 * rozeti (aktif / davet bekliyor) + kaldir menusu icerir. Rol kontrollu veya
 * kontrolsuz calisir; sahip gibi kilitli satirlar icin rol salt-okunur gosterilir.
 * MemberRoleRowInvite: e-posta girisi + rol + "Uye davet et" butonu varyanti.
 * MemberRoleRowGroup: satirlari ayrilmis (divide-y) kart icinde toplar.
 * Tema-agnostik, salt sunum (hardcoded renk yok).
 */
import * as React from "react";
import { MoreHorizontal, RefreshCw, ShieldCheck, UserMinus, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Rol secenegi. */
export interface MemberRoleRowRole {
  value: string;
  label: string;
  /** Select menusunde etiketin altinda gosterilen kisa aciklama. */
  description?: string;
}

/** Uye durum degeri. */
export type MemberRoleRowStatus = "active" | "invited";

/** Varsayilan RBAC rolleri (DeployLens ekip yonetimi). */
const DEFAULT_ROLES: MemberRoleRowRole[] = [
  { value: "owner", label: "Sahip", description: "Tam yetki ve faturalandirma" },
  { value: "admin", label: "Yönetici", description: "Üyeleri ve dağıtımları yönetir" },
  { value: "member", label: "Üye", description: "Dağıtım yapar ve ortamları düzenler" },
  { value: "viewer", label: "İzleyici", description: "Yalnızca görüntüleme erişimi" },
];

const STATUS_META: Record<
  MemberRoleRowStatus,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  active: { label: "Aktif", variant: "success-soft" },
  invited: { label: "Davet bekliyor", variant: "warning-soft" },
};

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase("tr-TR"))
    .join("");
}

export interface MemberRoleRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Uyenin gorunen adi. */
  name: string;
  /** E-posta adresi. */
  email: string;
  /** Avatar gorsel kaynagi (opsiyonel). */
  avatarSrc?: string;
  /** Avatar bas harfleri; verilmezse isimden turetilir. */
  avatarFallback?: string;
  /** Kontrollu rol degeri. */
  role?: string;
  /** Kontrolsuz baslangic rolu. */
  defaultRole?: string;
  /** Secilebilir roller. Varsayilan: Sahip/Yonetici/Uye/Izleyici. */
  roles?: MemberRoleRowRole[];
  /** Rol degistiginde tetiklenir. */
  onRoleChange?: (value: string) => void;
  /** Uye durumu (aktif / davet bekliyor). */
  status?: MemberRoleRowStatus;
  /** Rolu kilitler ve salt-okunur gosterir (or. hesap sahibi). */
  disabled?: boolean;
  /** "Siz" rozeti gosterir (oturum sahibi satiri). */
  isCurrentUser?: boolean;
  /** Kaldir/menu eylemi. Verilirse satir sonunda menu gosterilir. */
  onRemove?: () => void;
  /** Daveti yeniden gonder eylemi (yalnizca davet bekleyen uyeler icin). */
  onResendInvite?: () => void;
}

const MemberRoleRow = React.forwardRef<HTMLDivElement, MemberRoleRowProps>(
  (
    {
      name,
      email,
      avatarSrc,
      avatarFallback,
      role,
      defaultRole,
      roles = DEFAULT_ROLES,
      onRoleChange,
      status = "active",
      disabled = false,
      isCurrentUser = false,
      onRemove,
      onResendInvite,
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = role !== undefined;
    const [internalRole, setInternalRole] = React.useState(
      defaultRole ?? role ?? roles[0]?.value ?? ""
    );
    const currentRole = isControlled ? (role as string) : internalRole;
    const activeRole = roles.find((r) => r.value === currentRole);
    const statusMeta = STATUS_META[status];
    const hasMenu = Boolean(onRemove || (status === "invited" && onResendInvite));

    const handleRoleChange = (next: string) => {
      if (!isControlled) setInternalRole(next);
      onRoleChange?.(next);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40",
          className
        )}
        {...props}
      >
        <Avatar className="size-9">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {avatarFallback ?? deriveInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium text-foreground">
              {name}
            </span>
            {isCurrentUser ? (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] leading-4">
                Siz
              </Badge>
            ) : null}
          </div>
          <span className="block truncate text-xs text-muted-foreground">{email}</span>
        </div>

        <Badge variant={statusMeta.variant} className="hidden shrink-0 sm:inline-flex">
          {statusMeta.label}
        </Badge>

        {disabled ? (
          <span
            className="inline-flex h-9 w-36 shrink-0 items-center gap-1.5 rounded-md border border-input/60 bg-muted/40 px-3 text-sm text-muted-foreground"
            aria-label={`${name} rolü: ${activeRole?.label ?? currentRole} (kilitli)`}
          >
            <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{activeRole?.label ?? currentRole}</span>
          </span>
        ) : (
          <Select value={currentRole} onValueChange={handleRoleChange}>
            <SelectTrigger
              className="h-9 w-36 shrink-0"
              aria-label={`${name} rolü`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {roles.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  <span className="flex flex-col">
                    <span>{r.label}</span>
                    {r.description ? (
                      <span className="text-xs text-muted-foreground">
                        {r.description}
                      </span>
                    ) : null}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {hasMenu ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 shrink-0 text-muted-foreground"
              >
                <MoreHorizontal className="size-4" aria-hidden="true" />
                <span className="sr-only">{name} için işlemler</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {status === "invited" && onResendInvite ? (
                <DropdownMenuItem onSelect={() => onResendInvite()}>
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Daveti yeniden gönder
                </DropdownMenuItem>
              ) : null}
              {onRemove ? (
                <DropdownMenuItem
                  onSelect={() => onRemove()}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <UserMinus className="size-4" aria-hidden="true" />
                  {status === "invited" ? "Daveti iptal et" : "Üyeyi kaldır"}
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    );
  }
);
MemberRoleRow.displayName = "MemberRoleRow";

export interface MemberRoleRowInviteProps
  extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /** Secilebilir roller. Varsayilan: Sahip/Yonetici/Uye/Izleyici. */
  roles?: MemberRoleRowRole[];
  /** Baslangicta secili rol. */
  defaultRole?: string;
  /** E-posta girisi yer tutucusu. */
  placeholder?: string;
  /** Buton etiketi. */
  buttonLabel?: string;
  /** Davet gonderildiginde tetiklenir. */
  onInvite?: (payload: { email: string; role: string }) => void;
}

const MemberRoleRowInvite = React.forwardRef<
  HTMLFormElement,
  MemberRoleRowInviteProps
>(
  (
    {
      roles = DEFAULT_ROLES,
      defaultRole,
      placeholder = "ornek@deploylens.io",
      buttonLabel = "Üye davet et",
      onInvite,
      className,
      ...props
    },
    ref
  ) => {
    // Sahip rolu davetlerde secilemez.
    const invitableRoles = roles.filter((r) => r.value !== "owner");
    const [email, setEmail] = React.useState("");
    const [selectedRole, setSelectedRole] = React.useState(
      defaultRole ?? invitableRoles[0]?.value ?? ""
    );

    const trimmed = email.trim();
    const isValid = /.+@.+\..+/.test(trimmed);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isValid) return;
      onInvite?.({ email: trimmed, role: selectedRole });
      setEmail("");
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn("flex flex-col gap-2 sm:flex-row sm:items-center", className)}
        {...props}
      >
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={placeholder}
          aria-label="Davet edilecek e-posta"
          className="flex-1"
        />
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="h-9 w-full shrink-0 sm:w-36" aria-label="Davet rolü">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {invitableRoles.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" disabled={!isValid} className="shrink-0">
          <UserPlus className="size-4" aria-hidden="true" />
          {buttonLabel}
        </Button>
      </form>
    );
  }
);
MemberRoleRowInvite.displayName = "MemberRoleRowInvite";

export type MemberRoleRowGroupProps = React.HTMLAttributes<HTMLDivElement>;

const MemberRoleRowGroup = React.forwardRef<HTMLDivElement, MemberRoleRowGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("divide-y divide-border rounded-xl border bg-card", className)}
      {...props}
    />
  )
);
MemberRoleRowGroup.displayName = "MemberRoleRowGroup";

export { MemberRoleRow, MemberRoleRowInvite, MemberRoleRowGroup };
