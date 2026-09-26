"use client";

/**
 * UserAccountMenu — Hesap tetigi + acilir menu (DeployLens/Dolap/Randevu).
 * Avatar ve isim/e-posta tasiyan tetige tiklaninca Radix DropdownMenu acilir;
 * ust blokta hesap bilgisi, ardindan Profil / Ayarlar / Tema / Klavye
 * kisayollari eylemleri ve ayracin altinda destructive Cikis yer alir.
 * Kisayollar Kbd kapaklariyla gosterilir. "full" (isim+e-posta) ve "compact"
 * (yalniz avatar) olmak uzere iki tetik varyanti sunar.
 */
import * as React from "react";
import {
  ChevronsUpDown,
  Keyboard,
  LogOut,
  Palette,
  Settings,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd, KbdGroup } from "@/components/ui-extras/kbd";

/** Menuyu tetikleyen hesap bilgisi. */
export interface UserAccountMenuUser {
  /** Tam ad. Tetik ve baslikta gorunur. */
  name: string;
  /** E-posta adresi. Tetik ve baslikta gorunur. */
  email: string;
  /** Avatar gorsel adresi; verilmezse bas harfler kullanilir. */
  avatarUrl?: string;
  /** Avatar yedegi icin bas harfler; verilmezse addan turetilir. */
  initials?: string;
  /** Isim altinda gosterilecek rol/plan etiketi (or. "Yonetici"). */
  role?: string;
}

/** Menudeki tek bir eylem satiri. */
export interface UserAccountMenuAction {
  /** Benzersiz anahtar. */
  key: string;
  /** Satir etiketi. */
  label: string;
  /** Sol taraftaki lucide ikonu. */
  icon?: React.ReactNode;
  /** Sag tarafta Kbd kapaklari olarak gosterilen kisayol tuslari. */
  shortcut?: string[];
  /** Satir secildiginde calisir. */
  onSelect?: () => void;
  disabled?: boolean;
}

export interface UserAccountMenuProps {
  /** Tetigi ve menu basligini besleyen hesap bilgisi. */
  user: UserAccountMenuUser;
  /** Tetik gorunumu: tam (isim+e-posta) veya kompakt (yalniz avatar). */
  variant?: "full" | "compact";
  /** Varsayilan eylemlerin yerine gececek ozel eylem listesi. */
  actions?: UserAccountMenuAction[];
  /** Profil satiri secildiginde. */
  onProfileSelect?: () => void;
  /** Ayarlar satiri secildiginde. */
  onSettingsSelect?: () => void;
  /** Tema satiri secildiginde. */
  onThemeSelect?: () => void;
  /** Klavye kisayollari satiri secildiginde. */
  onShortcutsSelect?: () => void;
  /** Cikis satiri secildiginde. */
  onSignOut?: () => void;
  /** Cikis satiri etiketi. Varsayilan "Cikis yap". */
  signOutLabel?: string;
  /** Menu hizalamasi. Varsayilan "end". */
  align?: "start" | "center" | "end";
  /** Menunun tetige gore yonu. Varsayilan "bottom". */
  side?: "top" | "right" | "bottom" | "left";
  /** Statik onizleme icin menuyu acik baslatir. */
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

/** Ad girdisinden en fazla iki bas harf turetir. */
function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ?? "";
  const last = parts[parts.length - 1] ?? "";
  if (!first) return "?";
  if (parts.length === 1) return first.slice(0, 2).toUpperCase();
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

const UserAccountMenu = React.forwardRef<
  HTMLButtonElement,
  UserAccountMenuProps
>(
  (
    {
      user,
      variant = "full",
      actions,
      onProfileSelect,
      onSettingsSelect,
      onThemeSelect,
      onShortcutsSelect,
      onSignOut,
      signOutLabel = "Cikis yap",
      align = "end",
      side = "bottom",
      defaultOpen = false,
      disabled,
      className,
      contentClassName,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const initials = user.initials ?? deriveInitials(user.name);

    const defaultActions: UserAccountMenuAction[] = [
      {
        key: "profile",
        label: "Profil",
        icon: <User aria-hidden="true" />,
        shortcut: ["⇧", "⌘", "P"],
        onSelect: onProfileSelect,
      },
      {
        key: "settings",
        label: "Ayarlar",
        icon: <Settings aria-hidden="true" />,
        shortcut: ["⌘", ","],
        onSelect: onSettingsSelect,
      },
      {
        key: "theme",
        label: "Tema",
        icon: <Palette aria-hidden="true" />,
        onSelect: onThemeSelect,
      },
      {
        key: "shortcuts",
        label: "Klavye kisayollari",
        icon: <Keyboard aria-hidden="true" />,
        shortcut: ["⌘", "K"],
        onSelect: onShortcutsSelect,
      },
    ];

    const items = actions ?? defaultActions;

    const renderAvatar = (size: string) => (
      <Avatar className={size}>
        {user.avatarUrl ? (
          <AvatarImage src={user.avatarUrl} alt="" />
        ) : null}
        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
    );

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          {variant === "compact" ? (
            <button
              ref={ref}
              type="button"
              disabled={disabled}
              aria-label={`${user.name} hesap menusu`}
              className={cn(
                "inline-flex rounded-full ring-offset-background touch-hitbox transition-all duration-200 hover:brightness-105 active:scale-[0.97]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                className
              )}
            >
              {renderAvatar("size-9")}
            </button>
          ) : (
            <button
              ref={ref}
              type="button"
              disabled={disabled}
              aria-label={`${user.name} hesap menusu`}
              className={cn(
                "group inline-flex w-full max-w-xs items-center gap-2.5 rounded-lg border border-border/60 bg-card p-1.5 pe-2.5 text-start shadow-sm ring-offset-background transition-all duration-200",
                "hover:border-ring/50 hover:bg-accent/40 hover:shadow-md active:scale-[0.99]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "data-[state=open]:border-ring/60 data-[state=open]:bg-accent/40",
                "disabled:pointer-events-none disabled:opacity-50",
                className
              )}
            >
              {renderAvatar("size-9")}
              <span className="grid min-w-0 flex-1 leading-tight">
                <span className="truncate text-sm font-medium text-foreground">
                  {user.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </span>
              <ChevronsUpDown
                className="size-4 shrink-0 text-muted-foreground/70 transition-transform duration-200 group-data-[state=open]:text-foreground"
                aria-hidden="true"
              />
            </button>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={align}
          side={side}
          className={cn("min-w-64 p-0", contentClassName)}
        >
          <div className="flex items-center gap-3 border-b border-border/60 bg-muted/40 p-3">
            {renderAvatar("size-10")}
            <div className="grid min-w-0 flex-1 leading-tight">
              <span className="truncate text-sm font-semibold text-foreground">
                {user.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
              {user.role ? (
                <span className="mt-1 inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                  {user.role}
                </span>
              ) : null}
            </div>
          </div>

          <DropdownMenuGroup className="p-1">
            {items.map((action) => (
              <DropdownMenuItem
                key={action.key}
                disabled={action.disabled}
                onSelect={action.onSelect}
                className="gap-2.5 [&>svg]:text-muted-foreground"
              >
                {action.icon}
                <span className="flex-1 truncate">{action.label}</span>
                {action.shortcut && action.shortcut.length > 0 ? (
                  <KbdGroup className="ms-auto">
                    {action.shortcut.map((keyCap, index) => (
                      <Kbd key={`${action.key}-${index}`}>{keyCap}</Kbd>
                    ))}
                  </KbdGroup>
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-0" />

          <div className="p-1">
            <DropdownMenuItem
              onSelect={onSignOut}
              className="gap-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive [&>svg]:text-destructive"
            >
              <LogOut className="rtl:-scale-x-100" aria-hidden="true" />
              <span className="flex-1 truncate">{signOutLabel}</span>
              <KbdGroup className="ms-auto">
                <Kbd>⇧</Kbd>
                <Kbd>⌘</Kbd>
                <Kbd>Q</Kbd>
              </KbdGroup>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
UserAccountMenu.displayName = "UserAccountMenu";

export { UserAccountMenu };
