"use client";

/**
 * UploadFileList — Gercek dosya yukleme listesi (FileDropzone'un ustune).
 * Gizli <input type="file"> + secili dosyalar listesi: her satirda gorsel
 * icin thumbnail veya tip ikonu, dosya adi, boyut, ilerleme cubugu ve durum
 * (bekliyor / yukleniyor / tamam / hata), kaldir butonu ve hatada tekrar-dene.
 * accept, multiple, maxSize proplari desteklenir; secim degistikce onFilesChange
 * tetiklenir. Ozel bir "uploader" verilmezse ilerleme simule edilir.
 * GlowScan cilt fotografi, Dolap ilan gorseli, DeployLens artefakt yuklemesi.
 */
import * as React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  File as FileIcon,
  FileText,
  ImageIcon,
  Loader2,
  RotateCcw,
  UploadCloud,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type UploadFileListStatus = "bekliyor" | "yukleniyor" | "tamam" | "hata";

export interface UploadFileListItem {
  /** Kararli benzersiz kimlik. */
  id: string;
  /** Secilen ham dosya. */
  file: File;
  status: UploadFileListStatus;
  /** 0-100 arasi ilerleme yuzdesi. */
  progress: number;
  /** Hata durumunda gosterilecek mesaj. */
  error?: string;
}

interface InternalItem extends UploadFileListItem {
  previewUrl?: string;
  canRetry?: boolean;
}

export interface UploadFileListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** input accept degeri, orn. "image/*" veya ".pdf,.zip". */
  accept?: string;
  /** Birden fazla dosya secilebilsin mi. Varsayilan true. */
  multiple?: boolean;
  /** Tekil dosya icin izin verilen en buyuk boyut (byte). */
  maxSize?: number;
  disabled?: boolean;
  /** Tetikleyici alandaki ana etiket. */
  label?: React.ReactNode;
  /** Tetikleyici alandaki kucuk ipucu. */
  hint?: React.ReactNode;
  triggerIcon?: React.ReactNode;
  /**
   * Ozel yukleyici. Verilmezse ilerleme simule edilir.
   * onProgress ile 0-100 arasi ilerleme bildirin; hata icin reject edin.
   */
  uploader?: (file: File, onProgress: (percent: number) => void) => Promise<void>;
  /** Liste her degistiginde (ekleme/kaldirma) guncel dosya dizisiyle cagrilir. */
  onFilesChange?: (files: File[]) => void;
}

const statusConfig: Record<
  UploadFileListStatus,
  { label: string; icon: React.ReactNode; className: string }
> = {
  bekliyor: {
    label: "Sırada",
    icon: <Clock className="size-3.5" aria-hidden="true" />,
    className: "text-muted-foreground",
  },
  yukleniyor: {
    label: "Yükleniyor",
    icon: <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />,
    className: "text-info",
  },
  tamam: {
    label: "Tamamlandı",
    icon: <CheckCircle2 className="size-3.5" aria-hidden="true" />,
    className: "text-success",
  },
  hata: {
    label: "Hata",
    icon: <AlertCircle className="size-3.5" aria-hidden="true" />,
    className: "text-destructive",
  },
};

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, i);
  const rounded = value >= 10 || i === 0 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[i]}`;
}

function fileTypeIcon(file: File): React.ReactNode {
  if (file.type.startsWith("image/"))
    return <ImageIcon className="size-5" aria-hidden="true" />;
  if (
    file.type === "application/pdf" ||
    file.type.startsWith("text/") ||
    /\.(md|txt|json|csv|log|ya?ml)$/i.test(file.name)
  )
    return <FileText className="size-5" aria-hidden="true" />;
  return <FileIcon className="size-5" aria-hidden="true" />;
}

/** Ozel uploader verilmediginde ilerlemeyi simule eden yardimci. */
function simulateUpload(
  id: string,
  onProgress: (percent: number) => void,
  timers: React.MutableRefObject<Record<string, number>>
): Promise<void> {
  return new Promise((resolve) => {
    let percent = 0;
    const timer = window.setInterval(() => {
      percent += Math.random() * 16 + 7;
      if (percent >= 100) {
        onProgress(100);
        window.clearInterval(timers.current[id]);
        delete timers.current[id];
        resolve();
      } else {
        onProgress(percent);
      }
    }, 220);
    timers.current[id] = timer;
  });
}

const UploadFileList = React.forwardRef<HTMLDivElement, UploadFileListProps>(
  (
    {
      accept,
      multiple = true,
      maxSize,
      disabled = false,
      label = "Dosya seç veya sürükle",
      hint,
      triggerIcon,
      uploader,
      onFilesChange,
      className,
      ...props
    },
    ref
  ) => {
    const [items, setItems] = React.useState<InternalItem[]>([]);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const timersRef = React.useRef<Record<string, number>>({});
    const idRef = React.useRef(0);
    const itemsRef = React.useRef<InternalItem[]>(items);
    itemsRef.current = items;

    const updateItem = React.useCallback(
      (id: string, patch: Partial<InternalItem>) => {
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
        );
      },
      []
    );

    const startUpload = React.useCallback(
      (id: string, file: File) => {
        updateItem(id, {
          status: "yukleniyor",
          progress: 0,
          error: undefined,
          canRetry: false,
        });
        const onProgress = (percent: number) => {
          const clamped = Math.min(100, Math.max(0, Math.round(percent)));
          updateItem(id, { progress: clamped });
        };
        const task = uploader
          ? uploader(file, onProgress)
          : simulateUpload(id, onProgress, timersRef);
        task
          .then(() => {
            updateItem(id, { status: "tamam", progress: 100, error: undefined });
          })
          .catch((err: unknown) => {
            const message =
              err instanceof Error ? err.message : "Yükleme başarısız oldu";
            updateItem(id, { status: "hata", error: message, canRetry: true });
          });
      },
      [uploader, updateItem]
    );

    // "bekliyor" durumundaki dosyalar icin yuklemeyi otomatik baslat.
    React.useEffect(() => {
      for (const it of items) {
        if (it.status === "bekliyor") startUpload(it.id, it.file);
      }
    }, [items, startUpload]);

    // Secim degistiginde (ekleme/kaldirma) onFilesChange bildir.
    const filesKeyRef = React.useRef("");
    React.useEffect(() => {
      const key = items.map((it) => it.id).join("|");
      if (key !== filesKeyRef.current) {
        filesKeyRef.current = key;
        onFilesChange?.(items.map((it) => it.file));
      }
    }, [items, onFilesChange]);

    // Unmount: acik zamanlayicilari temizle, onizleme URL'lerini serbest birak.
    React.useEffect(() => {
      const timers = timersRef.current;
      return () => {
        Object.values(timers).forEach((t) => window.clearInterval(t));
        itemsRef.current.forEach((it) => {
          if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
        });
      };
    }, []);

    const addFiles = React.useCallback(
      (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;
        const incoming = Array.from(fileList);
        const created: InternalItem[] = incoming.map((file) => {
          const id = `ufl-${Date.now().toString(36)}-${(idRef.current++).toString(36)}`;
          const previewUrl = file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined;
          const tooBig = maxSize != null && file.size > maxSize;
          return {
            id,
            file,
            previewUrl,
            progress: 0,
            status: tooBig ? "hata" : "bekliyor",
            error: tooBig
              ? `Dosya çok büyük — en fazla ${formatBytes(maxSize)}`
              : undefined,
            canRetry: false,
          };
        });

        setItems((prev) => {
          if (multiple) return [...prev, ...created];
          // Tekil modda onceki secim(ler)i temizle.
          prev.forEach((it) => {
            if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
            const timer = timersRef.current[it.id];
            if (timer) {
              window.clearInterval(timer);
              delete timersRef.current[it.id];
            }
          });
          return created.slice(-1);
        });
      },
      [maxSize, multiple]
    );

    const handleRemove = React.useCallback((id: string) => {
      setItems((prev) => {
        const target = prev.find((it) => it.id === id);
        if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
        const timer = timersRef.current[id];
        if (timer) {
          window.clearInterval(timer);
          delete timersRef.current[id];
        }
        return prev.filter((it) => it.id !== id);
      });
    }, []);

    const openPicker = () => {
      if (!disabled) inputRef.current?.click();
    };

    const doneCount = items.filter((it) => it.status === "tamam").length;

    return (
      <div ref={ref} className={cn("flex flex-col gap-3", className)} {...props}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-label="Dosya seç"
          tabIndex={-1}
          className="sr-only"
          onChange={(event) => {
            addFiles(event.target.files);
            // Ayni dosya tekrar secilebilsin diye degeri sifirla.
            event.target.value = "";
          }}
        />

        {/* Tetikleyici birakma alani */}
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          className={cn(
            "group flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
            disabled
              ? "cursor-not-allowed opacity-60"
              : "hover:border-ring hover:bg-accent/40"
          )}
        >
          <span
            className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-200 group-hover:-translate-y-0.5"
            aria-hidden="true"
          >
            {triggerIcon ?? <UploadCloud className="size-5" />}
          </span>
          <span className="text-sm font-medium text-foreground">{label}</span>
          {hint ? (
            <span className="text-xs text-muted-foreground">{hint}</span>
          ) : null}
        </button>

        {items.length > 0 ? (
          <>
            <ul className="flex flex-col gap-2" aria-label="Yüklenen dosyalar">
              {items.map((item) => {
                const meta = statusConfig[item.status];
                const showProgress =
                  item.status === "bekliyor" || item.status === "yukleniyor";
                return (
                  <li
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors",
                      item.status === "hata" && "border-destructive/40 bg-destructive/5"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground",
                        item.status === "hata" && "bg-destructive/10 text-destructive"
                      )}
                    >
                      {item.previewUrl ? (
                        <img
                          src={item.previewUrl}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        fileTypeIcon(item.file)
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium text-foreground">
                          {item.file.name}
                        </span>
                        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                          {formatBytes(item.file.size)}
                        </span>
                      </div>

                      {showProgress ? (
                        <div className="mt-2 flex items-center gap-2">
                          <Progress
                            value={item.progress}
                            aria-label={`${item.file.name} yükleme ilerlemesi`}
                            className="h-1.5"
                          />
                          <span className="w-9 shrink-0 text-end text-xs tabular-nums text-muted-foreground">
                            {item.progress}%
                          </span>
                        </div>
                      ) : null}

                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span
                          className={cn(
                            "flex items-center gap-1 text-xs font-medium",
                            meta.className
                          )}
                        >
                          {meta.icon}
                          {meta.label}
                        </span>
                        {item.status === "hata" && item.error ? (
                          <span className="truncate text-xs text-destructive">
                            · {item.error}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      {item.status === "hata" && item.canRetry ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => startUpload(item.id, item.file)}
                          aria-label={`${item.file.name} yüklemesini tekrar dene`}
                        >
                          <RotateCcw className="size-4" />
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemove(item.id)}
                        aria-label={`${item.file.name} dosyasını kaldır`}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="text-xs tabular-nums text-muted-foreground" aria-live="polite">
              {doneCount}/{items.length} dosya yüklendi
            </p>
          </>
        ) : null}
      </div>
    );
  }
);
UploadFileList.displayName = "UploadFileList";

export { UploadFileList };
