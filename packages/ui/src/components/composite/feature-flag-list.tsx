"use client";

/**
 * FeatureFlagList — Ozellik bayragi (feature flag) listesi (DeployLens/genel).
 * Her satir bayrak adi + anahtar (key) + aciklama + ortam rozetleri + acik/kapali
 * Switch tasir; opsiyonel olarak kademeli dagitim (rollout %) cubugu ve bir
 * yasam-dongusu durumu (Kararli/Beta/Deneysel/Planli/Kullanimdan kalkiyor)
 * gosterir. Ust barda arama kutusu ve "Tumu / Etkin / Kapali" filtresi bulunur.
 *
 * Switch kontrolsuz calisir: her bayragin baslangic durumu item.enabled'dan
 * gelir, kullanici degistirdikce ic durumda tutulur ve onFlagToggle tetiklenir.
 * loading=true iken iskelet (skeleton) satirlar render eder.
 */
import * as React from "react";
import { Flag, Search, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

/** Bayragin yasam-dongusu durumu (Switch'ten bagimsiz). */
export type FeatureFlagListStatus =
  | "stable"
  | "beta"
  | "experimental"
  | "scheduled"
  | "deprecated";

/** Ortam rozetinin anlamsal tonu. */
export type FeatureFlagListEnvironmentTone =
  | "production"
  | "staging"
  | "development"
  | "preview"
  | "neutral";

/** Bayragin etkin oldugu tek bir ortam (rozet olarak gosterilir). */
export interface FeatureFlagListEnvironment {
  /** Rozet etiketi (orn. "Uretim"). */
  label: string;
  /** Anlamsal ton (rozet rengini belirler). */
  tone?: FeatureFlagListEnvironmentTone;
}

/** Listedeki tek bir ozellik bayragi. */
export interface FeatureFlagListItem {
  /** Benzersiz kimlik (yoksa index kullanilir). */
  id?: string;
  /** Insan-okur bayrak adi. */
  name: React.ReactNode;
  /** Kod tarafi bayrak anahtari (orn. "checkout.new_flow"). */
  flagKey?: string;
  /** Kisa aciklama. */
  description?: React.ReactNode;
  /** Baslangic acik/kapali durumu (varsayilan kapali). */
  enabled?: boolean;
  /** Yasam-dongusu durumu. */
  status?: FeatureFlagListStatus;
  /** Kademeli dagitim yuzdesi (0-100). Verilirse dagitim cubugu gosterilir. */
  rollout?: number;
  /** Bayragin etkin oldugu ortamlar (rozetler). */
  environments?: FeatureFlagListEnvironment[];
  /** Switch'i devre disi birakir (or. kilitli bayrak). */
  disabled?: boolean;
}

type EnabledFilter = "all" | "enabled" | "disabled";

export interface FeatureFlagListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onChange"> {
  /** Listelenecek bayraklar. */
  flags: FeatureFlagListItem[];
  /** Kart basligi (varsayilan "Ozellik bayraklari"). */
  title?: React.ReactNode;
  /** Baslik altindaki aciklama. */
  description?: React.ReactNode;
  /** Arama kutusunu gosterir (varsayilan true). */
  searchable?: boolean;
  /** Arama kutusu yer tutucusu. */
  searchPlaceholder?: string;
  /** Bir bayragin Switch'i degistiginde tetiklenir. */
  onFlagToggle?: (
    id: string,
    enabled: boolean,
    flag: FeatureFlagListItem,
  ) => void;
  /** Yukleniyor durumunda iskelet satirlar gosterir. */
  loading?: boolean;
  /** Iskelet satir sayisi (varsayilan 3). */
  skeletonRows?: number;
  /** Sonuc yokken gosterilecek metin. */
  emptyLabel?: React.ReactNode;
}

type StatusMeta = { label: string; variant: BadgeProps["variant"] };

/** Durum -> etiket/rozet varyanti eslesmesi. */
const statusMeta: Record<FeatureFlagListStatus, StatusMeta> = {
  stable: { label: "Kararlı", variant: "success-soft" },
  beta: { label: "Beta", variant: "info-soft" },
  experimental: { label: "Deneysel", variant: "warning-soft" },
  scheduled: { label: "Planlı", variant: "secondary" },
  deprecated: { label: "Kullanımdan kalkıyor", variant: "destructive-soft" },
};

/** Ortam tonu -> rozet sinifi eslesmesi (semantik tokenlar). */
const environmentToneClasses: Record<FeatureFlagListEnvironmentTone, string> = {
  production: "border-transparent bg-success/15 text-success",
  staging: "border-transparent bg-warning/15 text-warning",
  development: "border-transparent bg-info/15 text-info",
  preview: "border-transparent bg-accent text-accent-foreground",
  neutral: "border-transparent bg-muted text-muted-foreground",
};

const filterOptions: { value: EnabledFilter; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "enabled", label: "Etkin" },
  { value: "disabled", label: "Kapalı" },
];

/** Turkce-duyarli kucuk harfe cevirip arama metnini normalize eder. */
function normalize(value: React.ReactNode): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value).toLocaleLowerCase("tr-TR")
    : "";
}

const FeatureFlagList = React.forwardRef<HTMLDivElement, FeatureFlagListProps>(
  (
    {
      flags,
      title = "Özellik bayrakları",
      description,
      searchable = true,
      searchPlaceholder = "Bayrak ara...",
      onFlagToggle,
      loading = false,
      skeletonRows = 3,
      emptyLabel = "Eşleşen bayrak bulunamadı.",
      className,
      ...props
    },
    ref,
  ) => {
    const [query, setQuery] = React.useState("");
    const [filter, setFilter] = React.useState<EnabledFilter>("all");
    // Kontrolsuz Switch durumlarini kimlige gore tutan gecersiz-kilma haritasi.
    const [overrides, setOverrides] = React.useState<Record<string, boolean>>(
      {},
    );

    const getId = (flag: FeatureFlagListItem, index: number) =>
      flag.id ?? `flag-${index}`;

    const isEnabled = (flag: FeatureFlagListItem, id: string) =>
      overrides[id] ?? flag.enabled ?? false;

    const handleToggle = (
      flag: FeatureFlagListItem,
      id: string,
      value: boolean,
    ) => {
      setOverrides((prev) => ({ ...prev, [id]: value }));
      onFlagToggle?.(id, value, flag);
    };

    if (loading) {
      return (
        <Card ref={ref} className={cn("overflow-hidden", className)} {...props}>
          <CardHeader className="gap-4 space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-9 w-full rounded-md" />
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="divide-y divide-border">
              {Array.from({ length: Math.max(1, skeletonRows) }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 py-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                    <div className="flex gap-2 pt-1">
                      <Skeleton className="h-5 w-16 rounded-md" />
                      <Skeleton className="h-5 w-16 rounded-md" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-9 shrink-0 rounded-full" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      );
    }

    const enabledCount = flags.reduce(
      (acc, flag, index) => acc + (isEnabled(flag, getId(flag, index)) ? 1 : 0),
      0,
    );

    const q = query.trim().toLocaleLowerCase("tr-TR");
    const visibleFlags = flags
      .map((flag, index) => ({ flag, index, id: getId(flag, index) }))
      .filter(({ flag, id }) => {
        const enabled = isEnabled(flag, id);
        if (filter === "enabled" && !enabled) return false;
        if (filter === "disabled" && enabled) return false;
        if (!q) return true;
        return (
          normalize(flag.name).includes(q) ||
          normalize(flag.flagKey).includes(q) ||
          normalize(flag.description).includes(q)
        );
      });

    return (
      <Card
        ref={ref}
        className={cn(
          "overflow-hidden transition-all duration-300 hover:shadow-md",
          className,
        )}
        {...props}
      >
        <CardHeader className="gap-4 space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
              aria-hidden="true"
            >
              <Flag className="size-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <h3 className="truncate text-base font-semibold leading-none tracking-tight text-foreground">
                {title}
              </h3>
              <p className="truncate text-sm text-muted-foreground">
                {description ?? `${flags.length} bayrak yönetiliyor`}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold tabular-nums text-success">
              {enabledCount}/{flags.length} etkin
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {searchable ? (
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  aria-label="Bayrak ara"
                  className="ps-9"
                />
              </div>
            ) : null}
            <div
              role="group"
              aria-label="Duruma göre filtrele"
              className="inline-flex shrink-0 items-center gap-1 rounded-md border border-input bg-muted/40 p-1"
            >
              <SlidersHorizontal
                className="ms-1 size-3.5 text-muted-foreground"
                aria-hidden="true"
              />
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(option.value)}
                  aria-pressed={filter === option.value}
                  className={cn(
                    "rounded-sm min-h-8 px-2.5 py-1.5 text-xs pointer-coarse:min-h-11 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background",
                    filter === option.value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {visibleFlags.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1 py-10 text-center">
              <Search
                className="size-6 text-muted-foreground/60"
                aria-hidden="true"
              />
              <p className="text-sm text-muted-foreground">{emptyLabel}</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {visibleFlags.map(({ flag, id }) => {
                const enabled = isEnabled(flag, id);
                const meta = flag.status ? statusMeta[flag.status] : null;
                const hasRollout = typeof flag.rollout === "number";
                const rollout = hasRollout
                  ? Math.max(0, Math.min(100, flag.rollout as number))
                  : 0;
                return (
                  <li
                    key={id}
                    className="-mx-2 flex items-start gap-3 rounded-lg px-2 py-4 transition-colors duration-200 hover:bg-muted/40"
                  >
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-foreground">
                          {flag.name}
                        </span>
                        {flag.flagKey ? (
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                            {flag.flagKey}
                          </code>
                        ) : null}
                        {meta ? (
                          <Badge variant={meta.variant}>{meta.label}</Badge>
                        ) : null}
                      </div>

                      {flag.description ? (
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {flag.description}
                        </p>
                      ) : null}

                      {flag.environments && flag.environments.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {flag.environments.map((env, envIndex) => (
                            <Badge
                              key={`${env.label}-${envIndex}`}
                              variant="outline"
                              className={cn(
                                "font-medium",
                                environmentToneClasses[env.tone ?? "neutral"],
                              )}
                            >
                              {env.label}
                            </Badge>
                          ))}
                        </div>
                      ) : null}

                      {hasRollout ? (
                        <div className="space-y-1 pt-0.5">
                          <div className="flex items-center justify-between text-[11px] font-medium">
                            <span className="text-muted-foreground">
                              Kademeli dağıtım
                            </span>
                            <span className="tabular-nums text-foreground">
                              %{rollout}
                            </span>
                          </div>
                          <div
                            className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                            role="progressbar"
                            aria-valuenow={rollout}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Kademeli dağıtım %${rollout}`}
                          >
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                enabled ? "bg-primary" : "bg-muted-foreground/40",
                              )}
                              style={{ width: `${rollout}%` }}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1 pt-0.5">
                      <Switch
                        checked={enabled}
                        disabled={flag.disabled}
                        onCheckedChange={(value) =>
                          handleToggle(flag, id, value)
                        }
                        aria-label={`${
                          typeof flag.name === "string" ? flag.name : "Bayrak"
                        } — ${enabled ? "etkin" : "kapalı"}`}
                      />
                      <span
                        className={cn(
                          "text-[10px] font-medium uppercase tracking-wide tabular-nums",
                          enabled ? "text-success" : "text-muted-foreground",
                        )}
                      >
                        {enabled ? "Açık" : "Kapalı"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    );
  },
);
FeatureFlagList.displayName = "FeatureFlagList";

export { FeatureFlagList };
