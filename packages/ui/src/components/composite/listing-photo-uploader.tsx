"use client";

/**
 * ListingPhotoUploader — Coklu fotograf grid yukleyici (ilan olusturma).
 * Bos durumda buyuk bir birak-alani; secim sonrasi kare onizleme
 * thumbnail'lerinden olusan bir grid gosterir. Her fotografta sil (X)
 * butonu, ilk fotografta "Kapak" rozeti bulunur. Fotograflar surukle-birak
 * veya sol/sag ok butonlariyla yeniden siralanabilir; grid sonundaki
 * "+ Ekle" kutusu maks sayiya kadar yeni fotograf secmeyi saglar.
 * Secim/siralama degistikce onFilesChange guncel File dizisiyle cagrilir.
 * Dolap ilan olusturma gorselleri, GlowScan analiz fotograflari.
 */
import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  GripVertical,
  ImageOff,
  ImagePlus,
  Star,
  UploadCloud,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface ListingPhotoUploaderItem {
  /** Kararli benzersiz kimlik. */
  id: string;
  /** Secilen ham dosya. */
  file: File;
}

interface InternalPhoto extends ListingPhotoUploaderItem {
  previewUrl: string;
}

export interface ListingPhotoUploaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** input accept degeri. Varsayilan "image/*". */
  accept?: string;
  /** Izin verilen en fazla fotograf sayisi. Varsayilan 8. */
  maxFiles?: number;
  disabled?: boolean;
  /** Bos birak-alanindaki ana etiket. */
  label?: React.ReactNode;
  /** Bos birak-alanindaki kucuk ipucu. */
  hint?: React.ReactNode;
  /** Ilk fotografta gosterilen kapak rozeti metni. Varsayilan "Kapak". */
  coverLabel?: string;
  /** Secim veya siralama degistiginde guncel File dizisiyle cagrilir. */
  onFilesChange?: (files: File[]) => void;
}

/** Diziden bir elemani baska bir konuma tasir (yeni dizi dondurur). */
function moveInArray<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
    return list;
  }
  const next = list.slice();
  const [moved] = next.splice(from, 1);
  if (moved === undefined) return list;
  next.splice(to, 0, moved);
  return next;
}

const ListingPhotoUploader = React.forwardRef<
  HTMLDivElement,
  ListingPhotoUploaderProps
>(
  (
    {
      accept = "image/*",
      maxFiles = 8,
      disabled = false,
      label = "Fotoğrafları buraya bırakın",
      hint = "İlk fotoğraf kapak olarak kullanılır",
      coverLabel = "Kapak",
      onFilesChange,
      className,
      ...props
    },
    ref
  ) => {
    const [photos, setPhotos] = React.useState<InternalPhoto[]>([]);
    const [dragIndex, setDragIndex] = React.useState<number | null>(null);
    const [overIndex, setOverIndex] = React.useState<number | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const idRef = React.useRef(0);
    const photosRef = React.useRef<InternalPhoto[]>(photos);
    photosRef.current = photos;

    const remaining = Math.max(0, maxFiles - photos.length);
    const full = remaining === 0;

    // Secim/siralama degistiginde onFilesChange bildir (id+sira anahtari ile).
    const keyRef = React.useRef("");
    React.useEffect(() => {
      const key = photos.map((p) => p.id).join("|");
      if (key !== keyRef.current) {
        keyRef.current = key;
        onFilesChange?.(photos.map((p) => p.file));
      }
    }, [photos, onFilesChange]);

    // Unmount: onizleme URL'lerini serbest birak.
    React.useEffect(() => {
      return () => {
        photosRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      };
    }, []);

    const addFiles = React.useCallback(
      (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0 || disabled) return;
        setPhotos((prev) => {
          const slots = Math.max(0, maxFiles - prev.length);
          if (slots === 0) return prev;
          const incoming = Array.from(fileList)
            .filter((file) => file.type.startsWith("image/"))
            .slice(0, slots);
          const created: InternalPhoto[] = incoming.map((file) => ({
            id: `lpu-${Date.now().toString(36)}-${(idRef.current++).toString(36)}`,
            file,
            previewUrl: URL.createObjectURL(file),
          }));
          return [...prev, ...created];
        });
      },
      [disabled, maxFiles]
    );

    const removeAt = React.useCallback((index: number) => {
      setPhotos((prev) => {
        const target = prev[index];
        if (target) URL.revokeObjectURL(target.previewUrl);
        return prev.filter((_, i) => i !== index);
      });
    }, []);

    const move = React.useCallback((from: number, to: number) => {
      setPhotos((prev) => moveInArray(prev, from, to));
    }, []);

    const openPicker = () => {
      if (!disabled && !full) inputRef.current?.click();
    };

    const handleDrop = React.useCallback(
      (event: React.DragEvent<HTMLElement>) => {
        if (dragIndex !== null) return; // Ic siralama surukle-birakmasi
        event.preventDefault();
        addFiles(event.dataTransfer.files);
      },
      [addFiles, dragIndex]
    );

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-3", className)}
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          disabled={disabled}
          className="sr-only"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />

        {photos.length === 0 ? (
          // Bos durum: buyuk birak-alani
          <button
            type="button"
            onClick={openPicker}
            disabled={disabled}
            onDragOver={(e) => {
              if (!disabled) e.preventDefault();
            }}
            onDrop={handleDrop}
            className={cn(
              "group flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
              disabled
                ? "cursor-not-allowed opacity-60"
                : "hover:border-ring hover:bg-accent/40"
            )}
          >
            <span
              className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-200 group-hover:-translate-y-0.5"
              aria-hidden="true"
            >
              <UploadCloud className="size-6" />
            </span>
            <span className="text-sm font-medium text-foreground">{label}</span>
            {hint ? (
              <span className="text-xs text-muted-foreground">{hint}</span>
            ) : null}
          </button>
        ) : (
          <div
            className="grid grid-cols-3 gap-3 sm:grid-cols-4"
            onDragOver={(e) => {
              // Dosya surukleme (ic siralama degil) icin birakmaya izin ver.
              if (dragIndex === null && !disabled && !full) e.preventDefault();
            }}
            onDrop={handleDrop}
          >
            {photos.map((photo, index) => {
              const isCover = index === 0;
              const isDragging = dragIndex === index;
              const isOver = overIndex === index && dragIndex !== index;
              return (
                <div
                  key={photo.id}
                  draggable={!disabled}
                  onDragStart={(e) => {
                    if (disabled) return;
                    setDragIndex(index);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragEnter={() => {
                    if (dragIndex !== null && dragIndex !== index) {
                      setOverIndex(index);
                      move(dragIndex, index);
                      setDragIndex(index);
                    }
                  }}
                  onDragOver={(e) => {
                    if (dragIndex !== null) e.preventDefault();
                  }}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-lg border bg-card transition-all duration-200",
                    !disabled && "cursor-grab active:cursor-grabbing",
                    isDragging && "opacity-50 ring-2 ring-ring",
                    isOver && "ring-2 ring-primary",
                    isCover && "ring-2 ring-primary/60"
                  )}
                >
                  <img
                    src={photo.previewUrl}
                    alt={`İlan fotoğrafı ${index + 1}`}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />

                  {/* Ust degerlendirme katmani (gradyan) */}
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/45 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />

                  {/* Kapak rozeti */}
                  {isCover ? (
                    <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-md bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground shadow-sm">
                      <Star className="size-3 fill-current" aria-hidden="true" />
                      {coverLabel}
                    </span>
                  ) : (
                    <span
                      className="absolute left-1.5 top-1.5 inline-flex size-5 items-center justify-center rounded-md bg-background/70 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    >
                      <GripVertical className="size-3.5" />
                    </span>
                  )}

                  {/* Sil butonu */}
                  {!disabled ? (
                    <button
                      type="button"
                      onClick={() => removeAt(index)}
                      className="absolute right-1.5 top-1.5 inline-flex size-6 items-center justify-center rounded-md bg-background/80 text-foreground opacity-0 shadow-sm backdrop-blur transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
                      aria-label={`${index + 1}. fotoğrafı sil`}
                    >
                      <X className="size-3.5" />
                    </button>
                  ) : null}

                  {/* Alt siralama oklari */}
                  {!disabled && photos.length > 1 ? (
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 px-1.5 pb-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={() => move(index, index - 1)}
                        disabled={index === 0}
                        className="inline-flex size-6 items-center justify-center rounded-md bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`${index + 1}. fotoğrafı geri al`}
                      >
                        <ChevronLeft className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, index + 1)}
                        disabled={index === photos.length - 1}
                        className="inline-flex size-6 items-center justify-center rounded-md bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`${index + 1}. fotoğrafı öne al`}
                      >
                        <ChevronRight className="size-3.5" />
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}

            {/* + Ekle kutusu */}
            {!full ? (
              <button
                type="button"
                onClick={openPicker}
                disabled={disabled}
                className={cn(
                  "group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed text-muted-foreground transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                  disabled
                    ? "cursor-not-allowed opacity-60"
                    : "hover:border-ring hover:bg-accent/40 hover:text-foreground"
                )}
                aria-label="Fotoğraf ekle"
              >
                <ImagePlus className="size-6 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="text-xs font-medium">Ekle</span>
              </button>
            ) : null}
          </div>
        )}

        {photos.length > 0 ? (
          <div className="flex items-center justify-between gap-2">
            <p
              className="text-xs tabular-nums text-muted-foreground"
              aria-live="polite"
            >
              {photos.length}/{maxFiles} fotoğraf
            </p>
            {full ? (
              <p className="inline-flex items-center gap-1 text-xs font-medium text-warning">
                <ImageOff className="size-3.5" aria-hidden="true" />
                Sınıra ulaşıldı
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
);
ListingPhotoUploader.displayName = "ListingPhotoUploader";

export { ListingPhotoUploader };
