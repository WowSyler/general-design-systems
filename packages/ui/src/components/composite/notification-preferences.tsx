"use client";

/**
 * NotificationPreferences — Bildirim tercih matrisi.
 * Her satir bir bildirim turu (or. Randevu hatirlatma, Kampanyalar,
 * Guvenlik), her sutun bir kanal (E-posta/Push/SMS). Kesisim
 * hucrelerinde Switch bulunur. Bolum baslikliklari ile gruplanir.
 * Kontrollu deger + onValueChange; erisilebilir tablo semantigi
 * (scope'lu basliklar) ve her Switch icin sr-only etiket saglar.
 */
import * as React from "react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/** rowId -> channelId -> acik/kapali. */
export type NotificationPreferenceValue = Record<
  string,
  Record<string, boolean>
>;

export interface NotificationPreferenceChannel {
  /** Benzersiz kanal anahtari (or. "email"). */
  id: string;
  /** Sutun basliginda gosterilen etiket. */
  label: React.ReactNode;
  /** Etiket ustunde gosterilen opsiyonel ikon. */
  icon?: React.ReactNode;
  /** Ekran okuyucu icin metin (label metin degilse gerekli). */
  srLabel?: string;
}

export interface NotificationPreferenceRow {
  /** Benzersiz bildirim turu anahtari. */
  id: string;
  /** Satir basliginda gosterilen etiket. */
  label: React.ReactNode;
  /** Etiketin altinda gosterilen kisa aciklama. */
  description?: React.ReactNode;
  /** Bu tur icin kullanilamayan kanal id'leri. */
  disabledChannels?: string[];
  /** Ekran okuyucu icin metin (label metin degilse gerekli). */
  srLabel?: string;
}

export interface NotificationPreferenceSection {
  /** Benzersiz bolum anahtari. */
  id: string;
  /** Bolum basligi (or. "Randevular"). */
  title: React.ReactNode;
  /** Bolum basligi altinda opsiyonel aciklama. */
  description?: React.ReactNode;
  /** Bolumdeki bildirim turleri. */
  rows: NotificationPreferenceRow[];
}

export interface NotificationPreferencesChange {
  rowId: string;
  channelId: string;
  enabled: boolean;
}

export interface NotificationPreferencesProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Kanal sutunlari. */
  channels: NotificationPreferenceChannel[];
  /** Bolumlere ayrilmis bildirim turleri. */
  sections: NotificationPreferenceSection[];
  /** Kontrollu deger haritasi. */
  value: NotificationPreferenceValue;
  /** Bir hucre degistiginde yeni deger ile cagrilir. */
  onValueChange?: (
    next: NotificationPreferenceValue,
    changed: NotificationPreferencesChange
  ) => void;
  /** Ilk sutun (satir basligi) ustundeki etiket. */
  rowHeaderLabel?: React.ReactNode;
  /** Ekran okuyucular icin tablo basligi (gorunmez). */
  caption?: React.ReactNode;
}

/** Verilen degerden tek bir hucreyi guncelleyen saf yardimci. */
export function setNotificationPreference(
  value: NotificationPreferenceValue,
  rowId: string,
  channelId: string,
  enabled: boolean
): NotificationPreferenceValue {
  return {
    ...value,
    [rowId]: { ...value[rowId], [channelId]: enabled },
  };
}

function textOf(node: React.ReactNode, srLabel: string | undefined, fallback: string): string {
  if (srLabel) return srLabel;
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  return fallback;
}

const NotificationPreferences = React.forwardRef<
  HTMLDivElement,
  NotificationPreferencesProps
>(
  (
    {
      channels,
      sections,
      value,
      onValueChange,
      rowHeaderLabel = "Bildirim türü",
      caption = "Bildirim tercih matrisi",
      className,
      ...props
    },
    ref
  ) => {
    const handleToggle = React.useCallback(
      (rowId: string, channelId: string, enabled: boolean) => {
        onValueChange?.(setNotificationPreference(value, rowId, channelId, enabled), {
          rowId,
          channelId,
          enabled,
        });
      },
      [onValueChange, value]
    );

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-xl border bg-card shadow-sm",
          className
        )}
        {...props}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {rowHeaderLabel}
                </th>
                {channels.map((channel) => (
                  <th
                    key={channel.id}
                    scope="col"
                    className="w-24 px-3 py-3 text-center text-xs font-medium text-muted-foreground"
                  >
                    <span className="flex flex-col items-center gap-1 whitespace-nowrap">
                      {channel.icon ? (
                        <span className="text-muted-foreground" aria-hidden="true">
                          {channel.icon}
                        </span>
                      ) : null}
                      <span>{channel.label}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            {sections.map((section) => (
              <tbody key={section.id}>
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={channels.length + 1}
                    className="border-t border-border bg-muted/20 px-4 pb-2 pt-4 text-left"
                  >
                    <span className="text-sm font-semibold text-foreground">
                      {section.title}
                    </span>
                    {section.description ? (
                      <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                        {section.description}
                      </span>
                    ) : null}
                  </th>
                </tr>
                {section.rows.map((row) => {
                  const rowText = textOf(row.label, row.srLabel, row.id);
                  return (
                    <tr
                      key={row.id}
                      className="border-t border-border/60 transition-colors hover:bg-muted/40"
                    >
                      <th
                        scope="row"
                        className="px-4 py-3 text-left align-top font-normal"
                      >
                        <span className="block text-sm font-medium text-foreground">
                          {row.label}
                        </span>
                        {row.description ? (
                          <span className="mt-0.5 block max-w-xs text-xs text-muted-foreground">
                            {row.description}
                          </span>
                        ) : null}
                      </th>
                      {channels.map((channel) => {
                        const channelText = textOf(
                          channel.label,
                          channel.srLabel,
                          channel.id
                        );
                        const disabled = row.disabledChannels?.includes(channel.id);
                        const checked = Boolean(value[row.id]?.[channel.id]);
                        const switchLabel = `${channelText}: ${rowText}`;
                        return (
                          <td key={channel.id} className="px-3 py-3 text-center align-middle">
                            {disabled ? (
                              <>
                                <span className="text-muted-foreground/60" aria-hidden="true">
                                  —
                                </span>
                                <span className="sr-only">
                                  {switchLabel} — kullanılamıyor
                                </span>
                              </>
                            ) : (
                              <Switch
                                checked={checked}
                                onCheckedChange={(next) =>
                                  handleToggle(row.id, channel.id, next)
                                }
                                aria-label={switchLabel}
                                className="mx-auto"
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    );
  }
);
NotificationPreferences.displayName = "NotificationPreferences";

export { NotificationPreferences };
