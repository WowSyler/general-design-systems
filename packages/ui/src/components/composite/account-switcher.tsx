"use client";

/**
 * AccountSwitcher — Coklu hesap / magaza / organizasyon secici.
 * Tetik aktif hesabin avatarini, adini ve rolunu gosterir; tiklandiginda
 * Popover icinde aranabilir bir Command listesi acilir. Her satirda avatar,
 * ad ve alt bilgi bulunur; aktif hesap Check ile isaretlenir. Listenin altinda
 * "+ Yeni hesap ekle" eylemi yer alir.
 * Dolap coklu magaza yonetimi, DeployLens organizasyon degistirme gibi
 * senaryolar icin tema-agnostik olarak tasarlanmistir.
 */
import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface AccountSwitcherAccount {
  /** Benzersiz kimlik (secim degeri). */
  id: string;
  /** Hesap / magaza / organizasyon adi. */
  name: string;
  /** Alt bilgi: uye sayisi, plan, alan adi vb. */
  description?: string;
  /** Rol veya tur etiketi (tetikte ve satirda gosterilir). */
  role?: string;
  /** Avatar gorsel adresi (opsiyonel). */
  avatarUrl?: string;
  /** Gorsel yoksa kullanilacak bas harfler; verilmezse addan turetilir. */
  initials?: string;
}

export interface AccountSwitcherProps {
  /** Secilebilir hesaplar. */
  accounts: AccountSwitcherAccount[];
  /** Kontrollu aktif hesap kimligi. */
  value?: string;
  /** Kontrolsuz baslangic hesabi. */
  defaultValue?: string;
  /** Aktif hesap degistiginde tetiklenir. */
  onValueChange?: (id: string) => void;
  /** "Yeni hesap ekle" tiklaminda tetiklenir. */
  onAddAccount?: () => void;
  /** Yeni hesap eylemi etiketi. */
  addAccountLabel?: string;
  /** Listenin ustunde gosterilecek baslik (orn. "Magazalarim"). */
  heading?: React.ReactNode;
  searchPlaceholder?: string;
  emptyMessage?: string;
  /** Statik onizleme icin listeyi acik baslatir. */
  defaultOpen?: boolean;
  disabled?: boolean;
  /** Popover hizalamasi. */
  align?: "start" | "center" | "end";
  className?: string;
}

function deriveInitials(account: AccountSwitcherAccount): string {
  if (account.initials) return account.initials;
  const parts = account.name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((word) => word[0]);
  return (letters.join("") || account.name.slice(0, 2)).toUpperCase();
}

function AccountAvatar({
  account,
  className,
}: {
  account: AccountSwitcherAccount;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-9 shrink-0", className)}>
      {account.avatarUrl ? (
        <AvatarImage src={account.avatarUrl} alt="" />
      ) : null}
      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
        {deriveInitials(account)}
      </AvatarFallback>
    </Avatar>
  );
}

const AccountSwitcher = React.forwardRef<HTMLButtonElement, AccountSwitcherProps>(
  (
    {
      accounts,
      value,
      defaultValue,
      onValueChange,
      onAddAccount,
      addAccountLabel = "Yeni hesap ekle",
      heading,
      searchPlaceholder = "Hesap ara…",
      emptyMessage = "Hesap bulunamadı.",
      defaultOpen = false,
      disabled,
      align = "start",
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? accounts[0]?.id ?? ""
    );
    const currentValue = value ?? internalValue;
    const active =
      accounts.find((account) => account.id === currentValue) ?? accounts[0];

    const handleSelect = (id: string) => {
      if (value === undefined) setInternalValue(id);
      onValueChange?.(id);
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-label={
              active
                ? `Aktif hesap: ${active.name}. Hesap değiştir`
                : "Hesap seç"
            }
            disabled={disabled}
            className={cn(
              "group flex w-full items-center gap-3 rounded-lg border border-input bg-background px-3 py-2 text-left shadow-sm transition-all duration-200",
              "hover:border-ring/60 hover:bg-accent/60 active:scale-[0.99]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
              "disabled:pointer-events-none disabled:opacity-50",
              className
            )}
          >
            {active ? (
              <>
                <AccountAvatar account={active} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {active.name}
                  </span>
                  {active.role || active.description ? (
                    <span className="block truncate text-xs text-muted-foreground">
                      {active.role ?? active.description}
                    </span>
                  ) : null}
                </span>
              </>
            ) : (
              <span className="min-w-0 flex-1 text-sm text-muted-foreground">
                Hesap seçin…
              </span>
            )}
            <ChevronsUpDown
              className="size-4 shrink-0 text-muted-foreground opacity-70 transition-transform duration-200 group-aria-expanded:rotate-180"
              aria-hidden="true"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align={align}
          className="w-[--radix-popover-trigger-width] min-w-64 p-0"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup heading={heading ?? undefined}>
                {accounts.map((account) => {
                  const selected = account.id === currentValue;
                  return (
                    <CommandItem
                      key={account.id}
                      value={account.id}
                      keywords={[account.name, account.description ?? "", account.role ?? ""]}
                      onSelect={handleSelect}
                      className="gap-3 py-2"
                    >
                      <AccountAvatar account={account} className="size-8" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {account.name}
                        </span>
                        {account.description ? (
                          <span className="block truncate text-xs text-muted-foreground">
                            {account.description}
                          </span>
                        ) : null}
                      </span>
                      <Check
                        className={cn(
                          "size-4 shrink-0 text-primary",
                          selected ? "opacity-100" : "opacity-0"
                        )}
                        aria-hidden="true"
                      />
                      {selected ? (
                        <span className="sr-only">(aktif hesap)</span>
                      ) : null}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            {onAddAccount ? (
              <div className="border-t p-1">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onAddAccount();
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                >
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full border border-dashed border-input text-muted-foreground"
                    aria-hidden="true"
                  >
                    <Plus className="size-4" />
                  </span>
                  {addAccountLabel}
                </button>
              </div>
            ) : null}
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
AccountSwitcher.displayName = "AccountSwitcher";

export { AccountSwitcher };
