/**
 * IngredientList — cilt bakim icerik/formul listesi (GlowScan).
 * Bir urunun icerdigi aktif ve yardimci maddeleri satir satir listeler.
 * Her satir: icerik adi + rol rozeti (Nemlendirici / Aktif / Koruyucu /
 * Yatistirici / Antioksidan) + fayda ikonu ya da uyari ucgeni tasir.
 * flag alani "benefit" ise satirin rol ikonu tonlu gosterilir; "caution"
 * amber uyari ucgeni, "allergen" ise kirmizi alerjen rozeti eklenir.
 * skinType verildiginde, ilgili maddenin suitableFor listesi bu cilt
 * tipini kapsiyorsa satir vurgulanir (tonlu zemin + "cilde iyi gelir"
 * rozeti). Salt-gosterim, tema-agnostik; hardcoded renk yok.
 */
import * as React from "react";
import {
  AlertTriangle,
  Droplets,
  Leaf,
  Shield,
  ShieldAlert,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type IngredientTone =
  | "info"
  | "primary"
  | "muted"
  | "success"
  | "warning"
  | "destructive";

/** Icerik rolu: rozet etiketi, tonu ve ikonunu belirler. */
export type IngredientRole =
  | "nemlendirici"
  | "aktif"
  | "koruyucu"
  | "yatistirici"
  | "antioksidan";

/** Vurgu icin kullanilan cilt tipleri. */
export type IngredientSkinType =
  | "kuru"
  | "yagli"
  | "karma"
  | "hassas"
  | "normal";

/** Satirin durumu: fayda, dikkat ya da alerjen. */
export type IngredientFlag = "benefit" | "caution" | "allergen";

export interface IngredientListItem {
  /** Icerik adi (or. Hyaluronik Asit). */
  name: string;
  /** Icerigin formuldeki rolu; rozet ve ikon tonunu belirler. */
  role: IngredientRole;
  /** Kisa fayda / kullanim notu. */
  note?: string;
  /** Satir durumu. Verilmezse "benefit" kabul edilir. */
  flag?: IngredientFlag;
  /** Konsantrasyon etiketi (or. "%2"). */
  concentration?: string;
  /** Bu icerigin ozellikle iyi geldigi cilt tipleri. */
  suitableFor?: IngredientSkinType[];
}

const roleConfig: Record<
  IngredientRole,
  { label: string; tone: IngredientTone; icon: LucideIcon }
> = {
  nemlendirici: { label: "Nemlendirici", tone: "info", icon: Droplets },
  aktif: { label: "Aktif", tone: "primary", icon: Sparkles },
  koruyucu: { label: "Koruyucu", tone: "muted", icon: Shield },
  yatistirici: { label: "Yatıştırıcı", tone: "success", icon: Leaf },
  antioksidan: { label: "Antioksidan", tone: "warning", icon: Sun },
};

const skinTypeLabels: Record<IngredientSkinType, string> = {
  kuru: "Kuru",
  yagli: "Yağlı",
  karma: "Karma",
  hassas: "Hassas",
  normal: "Normal",
};

const toneBadge: Record<IngredientTone, string> = {
  info: "border-info/30 bg-info/10 text-info",
  primary: "border-primary/30 bg-primary/10 text-primary",
  muted: "border-border bg-muted text-muted-foreground",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
};

const toneIconWrap: Record<IngredientTone, string> = {
  info: "bg-info/10 text-info",
  primary: "bg-primary/10 text-primary",
  muted: "bg-muted text-muted-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

function resolveFlag(flag?: IngredientFlag): IngredientFlag {
  return flag ?? "benefit";
}

/** Satirin durumuna gore lider ikon, ton ve erisim metnini cozer. */
function resolveStatus(item: IngredientListItem): {
  icon: LucideIcon;
  tone: IngredientTone;
  srText: string;
} {
  const flag = resolveFlag(item.flag);
  if (flag === "allergen") {
    return { icon: ShieldAlert, tone: "destructive", srText: "Alerjen uyarısı" };
  }
  if (flag === "caution") {
    return { icon: AlertTriangle, tone: "warning", srText: "Dikkat" };
  }
  const role = roleConfig[item.role];
  return { icon: role.icon, tone: role.tone, srText: "Faydalı içerik" };
}

export interface IngredientRoleBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Gosterilecek icerik rolu. */
  role: IngredientRole;
  /** Rol ikonunu gizler. */
  hideIcon?: boolean;
}

/**
 * IngredientRoleBadge — salt-gosterim rol rozeti.
 * Icerik rolunu tonlu, ikonlu bir rozet olarak etiketler; kart ya da
 * detay yuzeylerinde IngredientList ile ayni ton haritasini paylasir.
 */
export const IngredientRoleBadge = React.forwardRef<
  HTMLSpanElement,
  IngredientRoleBadgeProps
>(({ role, hideIcon = false, className, ...props }, ref) => {
  const config = roleConfig[role];
  const Icon = config.icon;
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none",
        toneBadge[config.tone],
        className,
      )}
      {...props}
    >
      {hideIcon ? null : <Icon className="size-3" aria-hidden="true" />}
      {config.label}
    </span>
  );
});
IngredientRoleBadge.displayName = "IngredientRoleBadge";

export interface IngredientListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Listelenecek icerikler. */
  items: IngredientListItem[];
  /** Baslik. Verilmezse "İçindekiler". */
  title?: React.ReactNode;
  /** Baslik alti aciklama. */
  subtitle?: React.ReactNode;
  /** Vurgulanacak cilt tipi; eslesen satirlar one cikar. */
  skinType?: IngredientSkinType;
  /** Baslik yaninda icerik sayisi rozetini gizler. */
  hideCount?: boolean;
}

const IngredientList = React.forwardRef<HTMLDivElement, IngredientListProps>(
  (
    {
      items,
      title = "İçindekiler",
      subtitle,
      skinType,
      hideCount = false,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const headingId = `${id ?? reactId}-heading`;
    const skinTypeLabel = skinType ? skinTypeLabels[skinType] : undefined;

    return (
      <div
        ref={ref}
        id={id}
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm",
          className,
        )}
        {...props}
      >
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 border-b border-border bg-muted/30 px-4 py-3">
          <div className="min-w-0">
            <h3
              id={headingId}
              className="flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              <Leaf className="size-4 text-primary" aria-hidden="true" />
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {skinTypeLabel ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                <Sparkles className="size-3" aria-hidden="true" />
                {skinTypeLabel} cilt
              </span>
            ) : null}
            {hideCount ? null : (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
                {items.length} içerik
              </span>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            İçerik bilgisi bulunamadı.
          </p>
        ) : (
          <ul role="list" aria-labelledby={headingId} className="divide-y divide-border">
            {items.map((item, index) => {
              const role = roleConfig[item.role];
              const RoleIcon = role.icon;
              const status = resolveStatus(item);
              const StatusIcon = status.icon;
              const flag = resolveFlag(item.flag);
              const highlighted =
                skinType != null && (item.suitableFor?.includes(skinType) ?? false);

              return (
                <li
                  key={`${item.name}-${index}`}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 transition-colors duration-200",
                    highlighted
                      ? "bg-primary/[0.05] hover:bg-primary/10"
                      : "hover:bg-muted/40",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                      toneIconWrap[status.tone],
                    )}
                  >
                    <StatusIcon className="size-4" aria-hidden="true" />
                    <span className="sr-only">{status.srText}</span>
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm font-medium text-foreground">
                        {item.name}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none",
                          toneBadge[role.tone],
                        )}
                      >
                        <RoleIcon className="size-3" aria-hidden="true" />
                        {role.label}
                      </span>
                      {item.concentration ? (
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">
                          {item.concentration}
                        </span>
                      ) : null}
                      {flag === "allergen" ? (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none",
                            toneBadge.destructive,
                          )}
                        >
                          <ShieldAlert className="size-3" aria-hidden="true" />
                          Alerjen
                        </span>
                      ) : null}
                      {flag === "caution" ? (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none",
                            toneBadge.warning,
                          )}
                        >
                          <AlertTriangle className="size-3" aria-hidden="true" />
                          Dikkat
                        </span>
                      ) : null}
                    </div>

                    {item.note ? (
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {item.note}
                      </p>
                    ) : null}

                    {highlighted && skinTypeLabel ? (
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                        <Sparkles className="size-3" aria-hidden="true" />
                        {skinTypeLabel} cilde iyi gelir
                      </span>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  },
);
IngredientList.displayName = "IngredientList";

export { IngredientList };
