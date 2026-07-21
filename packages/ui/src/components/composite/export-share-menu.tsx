"use client";

/**
 * ExportShareMenu — Disa aktarma + paylas acilir menusu (DeployLens/Fisly/GlowScan).
 * "Disa aktar" tetigine (Download ikon) tiklaninca Radix DropdownMenu acilir;
 * ust blokta CSV / Excel / PDF / PNG bicim secenekleri (her biri ikon ve
 * uzanti ipucuyla), ardindan ayrac + Paylas grubu (baglanti kopyala, e-posta)
 * ve en altta "Takvime ekle" yer alir. Her secenek kendi onSelect geri
 * cagrisini alir; baglanti kopyalama menuyu acik tutup "Kopyalandi" geri
 * bildirimi gosterir. Opsiyonel indirme ilerlemesi (exportingKey + progress)
 * tetiklenen bicimde donen spinner ve alt kisimda Progress cubugu render eder.
 */
import * as React from "react";
import {
  CalendarPlus,
  Check,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  FileType,
  Image as ImageIcon,
  Link2,
  Loader2,
  Mail,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Menudeki tek bir disa aktarma bicimi. */
export interface ExportShareMenuFormatOption {
  /** Benzersiz anahtar (or. "csv", "pdf"). onExport bu anahtarla cagrilir. */
  key: string;
  /** Satir etiketi. */
  label: string;
  /** Sol taraftaki lucide ikonu. */
  icon?: React.ReactNode;
  /** Sag tarafta gosterilen uzanti/bilgi ipucu (or. ".csv"). */
  hint?: string;
  /** Bu bicim secildiginde calisir (onExport'tan once). */
  onSelect?: () => void;
  disabled?: boolean;
}

export interface ExportShareMenuProps {
  /** Tetik butonu etiketi. Varsayilan "Disa aktar". */
  triggerLabel?: string;
  /** Tetik butonu gorunumu (Button varyanti). Varsayilan "outline". */
  triggerVariant?: ButtonProps["variant"];
  /** Tetik butonu boyutu. Varsayilan "default". */
  triggerSize?: ButtonProps["size"];
  /** Bicim secenekleri. Verilmezse CSV / Excel / PDF / PNG kullanilir. */
  formats?: ExportShareMenuFormatOption[];
  /** Herhangi bir bicim secildiginde anahtariyla cagrilir. */
  onExport?: (key: string) => void;
  /** Bicim grubu ust basligi. Varsayilan "Dosya olarak indir". */
  formatsLabel?: string;
  /** Paylas grubunu gosterir. Varsayilan true. */
  showShare?: boolean;
  /** Paylas grubu ust basligi. Varsayilan "Paylas". */
  shareLabel?: string;
  /** Kopyalanacak baglanti; verilirse panoya yazilir. */
  shareUrl?: string;
  /** Baglanti kopyala satiri etiketi. Varsayilan "Baglantiyi kopyala". */
  copyLinkLabel?: string;
  /** Kopyalama sonrasi gosterilen etiket. Varsayilan "Baglanti kopyalandi". */
  copiedLabel?: string;
  /** Baglanti kopyala satiri secildiginde (panoya yazmadan once cagrilir). */
  onCopyLink?: () => void;
  /** E-posta satiri etiketi. Varsayilan "E-posta ile gonder". */
  emailLabel?: string;
  /** E-posta satiri secildiginde. */
  onEmailShare?: () => void;
  /** "Takvime ekle" satirini gosterir. Varsayilan true. */
  showCalendar?: boolean;
  /** Takvime ekle satiri etiketi. Varsayilan "Takvime ekle". */
  calendarLabel?: string;
  /** Takvime ekle satiri secildiginde. */
  onAddToCalendar?: () => void;
  /** O an disa aktarilan bicim anahtari; satirinda donen spinner gosterir. */
  exportingKey?: string | null;
  /** 0-100 arasi indirme ilerlemesi; verilirse alt kisimda Progress render eder. */
  progress?: number | null;
  /** Ilerleme metni. Varsayilan "Hazirlaniyor...". */
  progressLabel?: string;
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

/** Varsayilan bicim secenekleri. */
function defaultFormats(): ExportShareMenuFormatOption[] {
  return [
    {
      key: "csv",
      label: "CSV olarak indir",
      icon: <FileText aria-hidden="true" />,
      hint: ".csv",
    },
    {
      key: "xlsx",
      label: "Excel calisma kitabi",
      icon: <FileSpreadsheet aria-hidden="true" />,
      hint: ".xlsx",
    },
    {
      key: "pdf",
      label: "PDF raporu",
      icon: <FileType aria-hidden="true" />,
      hint: ".pdf",
    },
    {
      key: "png",
      label: "PNG goruntusu",
      icon: <ImageIcon aria-hidden="true" />,
      hint: ".png",
    },
  ];
}

const ExportShareMenu = React.forwardRef<HTMLButtonElement, ExportShareMenuProps>(
  (
    {
      triggerLabel = "Disa aktar",
      triggerVariant = "outline",
      triggerSize = "default",
      formats,
      onExport,
      formatsLabel = "Dosya olarak indir",
      showShare = true,
      shareLabel = "Paylas",
      shareUrl,
      copyLinkLabel = "Baglantiyi kopyala",
      copiedLabel = "Baglanti kopyalandi",
      onCopyLink,
      emailLabel = "E-posta ile gonder",
      onEmailShare,
      showCalendar = true,
      calendarLabel = "Takvime ekle",
      onAddToCalendar,
      exportingKey = null,
      progress = null,
      progressLabel = "Hazirlaniyor...",
      align = "end",
      side = "bottom",
      defaultOpen = false,
      disabled,
      className,
      contentClassName,
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);
    const copyTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(
      () => () => {
        if (copyTimer.current) clearTimeout(copyTimer.current);
      },
      []
    );

    const items = formats ?? defaultFormats();
    const isExporting =
      exportingKey != null || (typeof progress === "number" && progress >= 0);

    const handleCopyLink = (event: Event) => {
      // Menuyu acik tutarak "Kopyalandi" geri bildirimini gosterebilmek icin.
      event.preventDefault();
      onCopyLink?.();
      if (
        shareUrl &&
        typeof navigator !== "undefined" &&
        navigator.clipboard?.writeText
      ) {
        void navigator.clipboard.writeText(shareUrl).catch(() => {});
      }
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1600);
    };

    return (
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant={triggerVariant}
            size={triggerSize}
            disabled={disabled}
            className={cn("group gap-2", className)}
          >
            <Download aria-hidden="true" />
            {triggerLabel}
            <ChevronDown
              className="shrink-0 text-muted-foreground/70 transition-transform duration-200 group-data-[state=open]:rotate-180"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={align}
          side={side}
          className={cn("min-w-60", contentClassName)}
        >
          <DropdownMenuLabel className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {formatsLabel}
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {items.map((option) => {
              const busy = exportingKey === option.key;
              return (
                <DropdownMenuItem
                  key={option.key}
                  disabled={option.disabled || busy}
                  aria-busy={busy || undefined}
                  onSelect={() => {
                    option.onSelect?.();
                    onExport?.(option.key);
                  }}
                  className="gap-2.5 [&>svg]:text-muted-foreground"
                >
                  {busy ? (
                    <Loader2
                      className="animate-spin text-primary"
                      aria-hidden="true"
                    />
                  ) : (
                    option.icon
                  )}
                  <span className="flex-1 truncate">{option.label}</span>
                  {option.hint ? (
                    <span className="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground/70">
                      {option.hint}
                    </span>
                  ) : null}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>

          {showShare ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {shareLabel}
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={handleCopyLink}
                  className={cn(
                    "gap-2.5 [&>svg]:text-muted-foreground",
                    copied &&
                      "text-success focus:text-success [&>svg]:text-success"
                  )}
                >
                  {copied ? (
                    <Check aria-hidden="true" />
                  ) : (
                    <Link2 aria-hidden="true" />
                  )}
                  <span className="flex-1 truncate">
                    {copied ? copiedLabel : copyLinkLabel}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => onEmailShare?.()}
                  className="gap-2.5 [&>svg]:text-muted-foreground"
                >
                  <Mail aria-hidden="true" />
                  <span className="flex-1 truncate">{emailLabel}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          ) : null}

          {showCalendar ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => onAddToCalendar?.()}
                className="gap-2.5 [&>svg]:text-muted-foreground"
              >
                <CalendarPlus aria-hidden="true" />
                <span className="flex-1 truncate">{calendarLabel}</span>
              </DropdownMenuItem>
            </>
          ) : null}

          {isExporting ? (
            <>
              <DropdownMenuSeparator />
              <div className="px-2 py-2">
                <div className="mb-1.5 flex items-center gap-2 text-xs font-medium">
                  <Loader2
                    className="size-3.5 shrink-0 animate-spin text-primary"
                    aria-hidden="true"
                  />
                  <span className="flex-1 truncate text-muted-foreground">
                    {progressLabel}
                  </span>
                  {typeof progress === "number" ? (
                    <span className="tabular-nums text-foreground">
                      %{Math.round(progress)}
                    </span>
                  ) : null}
                </div>
                {typeof progress === "number" ? (
                  <Progress
                    value={progress}
                    className="h-1.5"
                    aria-label={progressLabel}
                  />
                ) : null}
              </div>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
ExportShareMenu.displayName = "ExportShareMenu";

export { ExportShareMenu };
