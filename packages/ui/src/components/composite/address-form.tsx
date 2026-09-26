"use client";

/**
 * AddressForm — Teslimat/kargo adresi formu (Dolap kargo, Randevu adres kaydi).
 * Duzenli iki sutunlu grid icinde ad-soyad, PhoneInput tarzi telefon alani
 * (sabit +90 oneki ve 5XX XXX XX XX bicimlemesi), il/ilce icin bagimli Select
 * ciftleri (il degisince ilce sifirlanir), mahalle, acik adres textarea'si,
 * Ev/Is segment secici (adres basligi) ve varsayilan-adres onay kutusu sunar.
 * Istemci tarafi zorunlu-alan dogrulamasi yapar; gecerliyse toplanan degerlerle
 * onSubmit cagrilir. onSubmit Promise dondururse birincil buton yuklenmeye gecer.
 * defaultValues ile mevcut adres duzenleme akislari desteklenir.
 */
import * as React from "react";
import { Briefcase, Home, Loader2, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Bir il ve ona bagli ilce listesi. */
export interface AddressFormProvince {
  /** Il adi, orn. "Istanbul". */
  name: string;
  /** Ile bagli ilce adlari. */
  districts: string[];
}

/** Adres basligi (Ev/Is) segment secenegi. */
export interface AddressFormLabelOption {
  /** Benzersiz deger, degerlerde saklanir. */
  value: string;
  /** Gorunen etiket. */
  label: React.ReactNode;
  /** Opsiyonel ikon (lucide onerilir). */
  icon?: React.ReactNode;
}

/** onSubmit'e iletilen ve alanlardan toplanan adres degerleri. */
export interface AddressFormValues {
  /** Alici ad-soyadi. */
  fullName: string;
  /** Yalnizca rakamlardan olusan ulusal telefon numarasi (10 hane). */
  phone: string;
  /** Secili il adi. */
  province: string;
  /** Secili ilce adi. */
  district: string;
  /** Mahalle. */
  neighborhood: string;
  /** Acik adres (cadde/sokak/no/daire, tarif). */
  addressLine: string;
  /** Adres basligi degeri (orn. "ev" | "is"). */
  label: string;
  /** Varsayilan adres olarak isaretli mi. */
  isDefault: boolean;
}

/** DeployLens/Dolap/Randevu/GlowScan/Fisly icin on tanimli il-ilce seti. */
export const addressFormProvinces: AddressFormProvince[] = [
  {
    name: "İstanbul",
    districts: ["Kadıköy", "Beşiktaş", "Şişli", "Üsküdar", "Bakırköy", "Ataşehir", "Maltepe", "Beyoğlu"],
  },
  { name: "Ankara", districts: ["Çankaya", "Keçiören", "Yenimahalle", "Etimesgut", "Mamak", "Altındağ"] },
  { name: "İzmir", districts: ["Konak", "Bornova", "Karşıyaka", "Buca", "Bayraklı", "Gaziemir"] },
  { name: "Bursa", districts: ["Nilüfer", "Osmangazi", "Yıldırım", "Mudanya", "Gemlik"] },
  { name: "Antalya", districts: ["Muratpaşa", "Konyaaltı", "Kepez", "Döşemealtı", "Aksu"] },
];

/** Varsayilan adres basligi secenekleri: Ev / Is. */
const defaultLabelOptions: AddressFormLabelOption[] = [
  { value: "ev", label: "Ev", icon: <Home className="size-4" aria-hidden="true" /> },
  { value: "is", label: "İş", icon: <Briefcase className="size-4" aria-hidden="true" /> },
];

/** Ulusal numarayi 5XX XXX XX XX olarak gruplar. */
function formatTrPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  const parts = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean);
  return parts.join(" ");
}

type AddressFormErrors = Partial<Record<keyof AddressFormValues, string>>;

export interface AddressFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "title"> {
  /** Il/ilce kaynagi. Verilmezse on tanimli set kullanilir. */
  provinces?: AddressFormProvince[];
  /** Adres basligi secenekleri. Verilmezse Ev/Is kullanilir. */
  labelOptions?: AddressFormLabelOption[];
  /** Alanlarin baslangic degerleri (mevcut adresi duzenleme icin). */
  defaultValues?: Partial<AddressFormValues>;
  /** Dogrulama gecerse toplanan degerlerle cagrilir; Promise buton yuklenmesini yonetir. */
  onSubmit?: (values: AddressFormValues) => void | Promise<unknown>;
  /** Iptal aksiyonu; verilirse ikincil "Vazgeç" butonu gosterilir. */
  onCancel?: () => void;
  /** Birincil buton etiketi. */
  submitLabel?: React.ReactNode;
  /** Iptal butonu etiketi. */
  cancelLabel?: React.ReactNode;
  /** Baslik; null verilirse baslik blogu gizlenir. */
  title?: React.ReactNode;
  /** Aciklama metni. */
  description?: React.ReactNode;
  /** Disaridan yuklenme zorlama (async onSubmit ile de otomatik yonetilir). */
  loading?: boolean;
  /** Tum alanlari ve butonlari devre disi birakir. */
  disabled?: boolean;
}

interface AddressFieldProps {
  id: string;
  label: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

function AddressField({ id, label, error, required, className, children }: AddressFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden="true">
            {" *"}
          </span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const invalidInputClass =
  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20";

const AddressForm = React.forwardRef<HTMLFormElement, AddressFormProps>(
  (
    {
      provinces = addressFormProvinces,
      labelOptions = defaultLabelOptions,
      defaultValues,
      onSubmit,
      onCancel,
      submitLabel = "Adresi Kaydet",
      cancelLabel = "Vazgeç",
      title = "Adres Bilgileri",
      description = "Kargonun sorunsuz teslimi için adresini eksiksiz doldur.",
      loading = false,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const baseId = React.useId();
    const [values, setValues] = React.useState<AddressFormValues>(() => ({
      fullName: "",
      phone: "",
      province: "",
      district: "",
      neighborhood: "",
      addressLine: "",
      label: labelOptions[0]?.value ?? "ev",
      isDefault: false,
      ...defaultValues,
    }));
    const [errors, setErrors] = React.useState<AddressFormErrors>({});
    const [submitting, setSubmitting] = React.useState(false);

    const busy = submitting || loading;
    const isDisabled = disabled || busy;

    const setField = <K extends keyof AddressFormValues>(
      key: K,
      value: AddressFormValues[K]
    ) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    };

    const districtOptions = React.useMemo(
      () => provinces.find((p) => p.name === values.province)?.districts ?? [],
      [provinces, values.province]
    );

    const handleProvinceChange = (name: string) => {
      setValues((prev) => ({ ...prev, province: name, district: "" }));
      setErrors((prev) => ({ ...prev, province: undefined, district: undefined }));
    };

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setField("phone", event.target.value.replace(/\D/g, "").slice(0, 10));
    };

    const validate = (): AddressFormErrors => {
      const next: AddressFormErrors = {};
      if (!values.fullName.trim()) next.fullName = "Ad soyad gerekli.";
      if (values.phone.length !== 10) next.phone = "Geçerli bir telefon numarası girin.";
      if (!values.province) next.province = "İl seçin.";
      if (!values.district) next.district = "İlçe seçin.";
      if (!values.neighborhood.trim()) next.neighborhood = "Mahalle gerekli.";
      if (!values.addressLine.trim()) next.addressLine = "Açık adres gerekli.";
      return next;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isDisabled) return;

      const found = validate();
      setErrors(found);
      if (Object.keys(found).length > 0) return;

      const result = onSubmit?.(values);
      if (result && typeof (result as { then?: unknown }).then === "function") {
        setSubmitting(true);
        (result as Promise<unknown>).then(
          () => setSubmitting(false),
          () => setSubmitting(false)
        );
      }
    };

    const ids = {
      fullName: `${baseId}-full-name`,
      phone: `${baseId}-phone`,
      province: `${baseId}-province`,
      district: `${baseId}-district`,
      neighborhood: `${baseId}-neighborhood`,
      addressLine: `${baseId}-address-line`,
      isDefault: `${baseId}-is-default`,
    };

    const describedBy = (field: keyof AddressFormValues, id: string) =>
      errors[field] ? `${id}-error` : undefined;

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        noValidate
        aria-busy={busy || undefined}
        className={cn("w-full space-y-6", className)}
        {...props}
      >
        {title || description ? (
          <div className="flex items-start gap-3">
            <span
              className="mt-0.5 grid size-9 shrink-0 place-content-center rounded-lg bg-primary/10 text-primary"
              aria-hidden="true"
            >
              <MapPin className="size-5" />
            </span>
            <div className="space-y-1">
              {title ? (
                <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
              ) : null}
              {description ? (
                <p className="text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
          <AddressField id={ids.fullName} label="Ad Soyad" required error={errors.fullName}>
            <Input
              id={ids.fullName}
              name="fullName"
              autoComplete="name"
              placeholder="Örn. Elif Yılmaz"
              value={values.fullName}
              onChange={(e) => setField("fullName", e.target.value)}
              disabled={isDisabled}
              aria-invalid={errors.fullName ? true : undefined}
              aria-describedby={describedBy("fullName", ids.fullName)}
              className={cn(errors.fullName && invalidInputClass)}
            />
          </AddressField>

          <AddressField id={ids.phone} label="Telefon" required error={errors.phone}>
            <div
              className={cn(
                "flex h-9 w-full items-center rounded-md border border-input bg-transparent shadow-sm pointer-coarse:h-[2.875rem] transition-[border-color,box-shadow] duration-200 hover:border-ring/40 focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/15",
                isDisabled && "cursor-not-allowed opacity-50",
                errors.phone && "border-destructive focus-within:border-destructive focus-within:ring-destructive/20"
              )}
            >
              <span
                className="inline-flex h-full shrink-0 items-center gap-1.5 rounded-s-md border-e border-input px-2.5 text-sm font-medium text-muted-foreground"
                aria-hidden="true"
              >
                <span className="text-base leading-none">🇹🇷</span>
                <span className="tabular-nums">+90</span>
              </span>
              <input
                id={ids.phone}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="5XX XXX XX XX"
                value={formatTrPhone(values.phone)}
                onChange={handlePhoneChange}
                disabled={isDisabled}
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={describedBy("phone", ids.phone)}
                className="h-full min-w-0 flex-1 rounded-e-md bg-transparent px-3 text-sm tabular-nums text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
              />
            </div>
          </AddressField>

          <AddressField id={ids.province} label="İl" required error={errors.province}>
            <Select
              value={values.province || undefined}
              onValueChange={handleProvinceChange}
              disabled={isDisabled}
            >
              <SelectTrigger
                id={ids.province}
                aria-invalid={errors.province ? true : undefined}
                aria-describedby={describedBy("province", ids.province)}
                className={cn(errors.province && invalidInputClass)}
              >
                <SelectValue placeholder="İl seçin" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem key={province.name} value={province.name}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AddressField>

          <AddressField id={ids.district} label="İlçe" required error={errors.district}>
            <Select
              value={values.district || undefined}
              onValueChange={(value) => setField("district", value)}
              disabled={isDisabled || !values.province}
            >
              <SelectTrigger
                id={ids.district}
                aria-invalid={errors.district ? true : undefined}
                aria-describedby={describedBy("district", ids.district)}
                className={cn(errors.district && invalidInputClass)}
              >
                <SelectValue placeholder={values.province ? "İlçe seçin" : "Önce il seçin"} />
              </SelectTrigger>
              <SelectContent>
                {districtOptions.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AddressField>

          <AddressField
            id={ids.neighborhood}
            label="Mahalle"
            required
            error={errors.neighborhood}
            className="sm:col-span-2"
          >
            <Input
              id={ids.neighborhood}
              name="neighborhood"
              autoComplete="address-level3"
              placeholder="Örn. Caferağa Mahallesi"
              value={values.neighborhood}
              onChange={(e) => setField("neighborhood", e.target.value)}
              disabled={isDisabled}
              aria-invalid={errors.neighborhood ? true : undefined}
              aria-describedby={describedBy("neighborhood", ids.neighborhood)}
              className={cn(errors.neighborhood && invalidInputClass)}
            />
          </AddressField>

          <AddressField
            id={ids.addressLine}
            label="Açık Adres"
            required
            error={errors.addressLine}
            className="sm:col-span-2"
          >
            <Textarea
              id={ids.addressLine}
              name="addressLine"
              autoComplete="street-address"
              rows={3}
              placeholder="Cadde/sokak, bina no, kat, daire ve tarif bilgilerini yazın."
              value={values.addressLine}
              onChange={(e) => setField("addressLine", e.target.value)}
              disabled={isDisabled}
              aria-invalid={errors.addressLine ? true : undefined}
              aria-describedby={describedBy("addressLine", ids.addressLine)}
              className={cn("resize-none", errors.addressLine && invalidInputClass)}
            />
          </AddressField>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Adres başlığı</span>
            <div
              role="radiogroup"
              aria-label="Adres başlığı"
              className="inline-flex w-fit gap-1 rounded-lg bg-muted p-1"
            >
              {labelOptions.map((option) => {
                const active = values.label === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    disabled={isDisabled}
                    onClick={() => setField("label", option.value)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all pointer-coarse:min-h-11 duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background disabled:pointer-events-none disabled:opacity-50",
                      active
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label
            htmlFor={ids.isDefault}
            className={cn(
              "flex items-center gap-2.5 rounded-md text-sm text-muted-foreground",
              !isDisabled && "cursor-pointer"
            )}
          >
            <Checkbox
              id={ids.isDefault}
              checked={values.isDefault}
              onCheckedChange={(checked) => setField("isDefault", checked === true)}
              disabled={isDisabled}
            />
            Varsayılan adres olarak kaydet
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {onCancel ? (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={busy}
              className="sm:min-w-32"
            >
              {cancelLabel}
            </Button>
          ) : null}
          <Button type="submit" disabled={isDisabled} className="sm:min-w-40">
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            {busy ? "Kaydediliyor…" : submitLabel}
          </Button>
        </div>
      </form>
    );
  }
);
AddressForm.displayName = "AddressForm";

export { AddressForm };
