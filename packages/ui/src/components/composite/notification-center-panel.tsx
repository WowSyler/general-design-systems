"use client";

/**
 * NotificationCenterPanel — Tam bildirim merkezi paneli.
 * Ust barda baslik + okunmamis rozeti ve "Tumunu okundu isaretle" aksiyonu;
 * altinda Tumu/Okunmamis sekmeleri ve Bugun/Bu hafta/Daha eski zaman gruplari.
 * Her oge: tonlu ikon, baslik, aciklama, goreli zaman, okunmadi noktasi ve
 * opsiyonel satir aksiyonu icerir. Icerik ScrollArea ile kaydirilir.
 * onMarkAllRead ve onItemClick geri cagirimlariyla dis duruma baglanir.
 */
import * as React from "react";
import { BellOff, CheckCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/** Bir bildirimin dustugu zaman kovasi. */
export type NotificationCenterGroup = "today" | "week" | "older";

/** Ikonun tonu — anlamli renk vurgusu icin. */
export type NotificationCenterTone =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "destructive"
  | "info";

export interface NotificationCenterAction {
  label: string;
  onClick?: () => void;
}

export interface NotificationCenterPanelItem {
  /** Benzersiz anahtar. */
  id: string;
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Goreli zaman metni, orn. "5 dk", "2 sa". */
  time: React.ReactNode;
  unread?: boolean;
  /** Varsayilan "today". */
  group?: NotificationCenterGroup;
  tone?: NotificationCenterTone;
  action?: NotificationCenterAction;
}

export interface NotificationCenterPanelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick" | "title"> {
  items: NotificationCenterPanelItem[];
  /** Ust bar basligi. Varsayilan "Bildirimler". */
  title?: React.ReactNode;
  /** Baslangicta secili sekme. Varsayilan "all". */
  defaultTab?: "all" | "unread";
  markAllLabel?: string;
  emptyMessage?: React.ReactNode;
  onMarkAllRead?: () => void;
  onItemClick?: (item: NotificationCenterPanelItem) => void;
}

const GROUP_ORDER: NotificationCenterGroup[] = ["today", "week", "older"];

const groupLabels: Record<NotificationCenterGroup, string> = {
  today: "Bugün",
  week: "Bu hafta",
  older: "Daha eski",
};

const toneClasses: Record<NotificationCenterTone, string> = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/15 text-destructive",
  info: "bg-info/15 text-info",
};

/** Ogeleri zaman kovalarina gore siralar ve gruplar. */
function groupItems(
  items: NotificationCenterPanelItem[]
): Array<{ group: NotificationCenterGroup; items: NotificationCenterPanelItem[] }> {
  return GROUP_ORDER.map((group) => ({
    group,
    items: items.filter((item) => (item.group ?? "today") === group),
  })).filter((section) => section.items.length > 0);
}

interface NotificationRowProps {
  item: NotificationCenterPanelItem;
  onItemClick?: (item: NotificationCenterPanelItem) => void;
}

function NotificationRow({ item, onItemClick }: NotificationRowProps) {
  const clickable = Boolean(onItemClick);
  const unread = Boolean(item.unread);

  const handleActivate = () => {
    onItemClick?.(item);
  };

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? handleActivate : undefined}
      onKeyDown={
        clickable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleActivate();
              }
            }
          : undefined
      }
      className={cn(
        "group/row relative flex items-start gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
        unread && "bg-primary/5",
        clickable &&
          "cursor-pointer hover:-translate-y-0.5 hover:bg-muted/60 hover:shadow-sm active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
      )}
    >
      {unread ? (
        <span
          className="absolute left-1 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary shadow-glow"
          aria-hidden="true"
        />
      ) : null}
      {item.icon ? (
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full [&_svg]:size-4",
            toneClasses[item.tone ?? "default"]
          )}
          aria-hidden="true"
        >
          {item.icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <div
            className={cn(
              "truncate text-sm text-foreground",
              unread ? "font-semibold" : "font-medium"
            )}
          >
            {item.title}
          </div>
          <div className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {item.time}
          </div>
        </div>
        {item.description ? (
          <div className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </div>
        ) : null}
        {item.action ? (
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={(event) => {
                event.stopPropagation();
                item.action?.onClick?.();
              }}
            >
              {item.action.label}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface NotificationSectionsProps {
  items: NotificationCenterPanelItem[];
  emptyMessage: React.ReactNode;
  onItemClick?: (item: NotificationCenterPanelItem) => void;
}

function NotificationSections({
  items,
  emptyMessage,
  onItemClick,
}: NotificationSectionsProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <BellOff className="size-5" aria-hidden="true" />
        </span>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const sections = groupItems(items);

  return (
    <div className="flex flex-col gap-4 p-2">
      {sections.map((section) => (
        <section key={section.group} className="space-y-1">
          <h3 className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {groupLabels[section.group]}
          </h3>
          {section.items.map((item) => (
            <NotificationRow key={item.id} item={item} onItemClick={onItemClick} />
          ))}
        </section>
      ))}
    </div>
  );
}

const NotificationCenterPanel = React.forwardRef<
  HTMLDivElement,
  NotificationCenterPanelProps
>(
  (
    {
      items,
      title = "Bildirimler",
      defaultTab = "all",
      markAllLabel = "Tümünü okundu işaretle",
      emptyMessage = "Görüntülenecek bildirim yok.",
      onMarkAllRead,
      onItemClick,
      className,
      ...props
    },
    ref
  ) => {
    const [tab, setTab] = React.useState<"all" | "unread">(defaultTab);

    const unreadItems = React.useMemo(
      () => items.filter((item) => item.unread),
      [items]
    );
    const unreadCount = unreadItems.length;

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full max-w-sm flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-lg",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            {unreadCount > 0 ? (
              <Badge
                variant="secondary"
                className="h-5 min-w-5 justify-center px-1.5 tabular-nums"
              >
                {unreadCount}
              </Badge>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
            disabled={unreadCount === 0}
            onClick={onMarkAllRead}
          >
            <CheckCheck className="size-3.5" aria-hidden="true" />
            {markAllLabel}
          </Button>
        </div>

        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as "all" | "unread")}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="px-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">Tümü</TabsTrigger>
              <TabsTrigger value="unread" className="gap-1.5">
                Okunmamış
                {unreadCount > 0 ? (
                  <span className="rounded-full bg-primary/15 px-1.5 text-[11px] font-semibold tabular-nums text-primary">
                    {unreadCount}
                  </span>
                ) : null}
              </TabsTrigger>
            </TabsList>
          </div>

          <Separator className="mt-3" />

          <TabsContent
            value="all"
            className="mt-0 min-h-0 flex-1 focus-visible:ring-0"
          >
            <ScrollArea className="h-[360px]">
              <NotificationSections
                items={items}
                emptyMessage={emptyMessage}
                onItemClick={onItemClick}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent
            value="unread"
            className="mt-0 min-h-0 flex-1 focus-visible:ring-0"
          >
            <ScrollArea className="h-[360px]">
              <NotificationSections
                items={unreadItems}
                emptyMessage="Okunmamış bildiriminiz yok."
                onItemClick={onItemClick}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
);
NotificationCenterPanel.displayName = "NotificationCenterPanel";

export { NotificationCenterPanel };
