"use client";

/**
 * CartDrawer — Sepet cekmecesi (Sheet uzerine kurulu).
 * Sagdan ya da alttan acilan bir cekmecede sepet satirlarini (gorsel + ad +
 * varyant + adet stepper + satir fiyati + sil) listeler; altta ara toplam,
 * kargo ve toplam ozetiyle "Odemeye gec" CTA'sini gosterir. Bos sepet durumu
 * icin ozel bir bos-durum ekrani sunar. Acik durumu hem kontrollu
 * (open/onOpenChange) hem kontrolsuz (defaultOpen) kullanilabilir. Adet ve
 * kaldirma islemleri item id'si ile disari bildirilir. Dolap urun sepeti /
 * header sepet cekmecesi icin tasarlanmistir.
 */
import * as React from "react";
import { ArrowRight, ShoppingBag, ShoppingCart, Truck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartLineItem } from "@/components/commerce/cart-line-item";
import { QuantityStepper } from "@/components/commerce/quantity-stepper";

/** Sepetteki tek bir urun satiri. */
export interface CartDrawerItem {
  /** Benzersiz satir kimligi (adet/kaldirma geri cagrimlarinda kullanilir). */
  id: string;
  /** Urun adi. */
  title: React.ReactNode;
  /** Varyant bilgisi (beden, renk vb.). */
  variant?: React.ReactNode;
  /** Birim fiyat (sayisal; satir toplami adet ile carpilarak hesaplanir). */
  price: number;
  /** Sepetteki adet. */
  quantity: number;
  /** Urun gorseli adresi. */
  image?: string;
  /** Gorsel alternatif metni. */
  imageAlt?: string;
  /** Bu satir icin ust adet siniri. */
  maxQuantity?: number;
}

export interface CartDrawerProps {
  /** Sepet satirlari. */
  items: CartDrawerItem[];
  /** Kontrollu acik durum. */
  open?: boolean;
  /** Kontrolsuz baslangic acik durumu. */
  defaultOpen?: boolean;
  /** Acik durum degisince cagrilir. */
  onOpenChange?: (open: boolean) => void;
  /** Cekmeceyi acan tetikleyici (or. <Button>). Verilmezse yalniz kontrollu kullanilir. */
  trigger?: React.ReactNode;
  /** Cekmecenin acildigi kenar. */
  side?: "right" | "bottom";
  /** Ust baslik. */
  title?: React.ReactNode;
  /** Kargo ucreti (sayisal). 0 ise "Ucretsiz" gosterilir. */
  shipping?: number;
  /**
   * Ucretsiz kargo esigi. Verilirse ve ara toplam esigin altindaysa,
   * kalan tutari gosteren bir ilerleme ipucu render edilir.
   */
  freeShippingThreshold?: number;
  /** Bir satirin adedi degisince cagrilir. */
  onQuantityChange?: (id: string, quantity: number) => void;
  /** Bir satir kaldirilinca cagrilir. Verilmezse sil butonu gizlenir. */
  onRemove?: (id: string) => void;
  /** "Odemeye gec" tiklaninca cagrilir. */
  onCheckout?: () => void;
  /** Odeme CTA etiketi. */
  checkoutLabel?: React.ReactNode;
  /** Alisverise devam tetikleyicisi (bos durumda gosterilir); tiklaninca cekmece kapanir. */
  onContinueShopping?: () => void;
  /** Para birimi bicimlendirici. Varsayilan: tr-TR + para birimi oneki. */
  formatPrice?: (value: number) => React.ReactNode;
  /** Varsayilan bicimlendiricide kullanilan para birimi oneki. */
  currencySymbol?: string;
  /** SheetContent ek sinif. */
  className?: string;
}

const CartDrawer = React.forwardRef<
  React.ElementRef<typeof SheetContent>,
  CartDrawerProps
>(
  (
    {
      items,
      open,
      defaultOpen,
      onOpenChange,
      trigger,
      side = "right",
      title = "Sepetim",
      shipping = 0,
      freeShippingThreshold,
      onQuantityChange,
      onRemove,
      onCheckout,
      checkoutLabel = "Ödemeye geç",
      onContinueShopping,
      formatPrice,
      currencySymbol = "₺",
      className,
    },
    ref,
  ) => {
    const isControlled = open !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
      defaultOpen ?? false,
    );
    const actualOpen = isControlled ? open : uncontrolledOpen;

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange],
    );

    const format = React.useCallback(
      (value: number): React.ReactNode => {
        if (formatPrice) return formatPrice(value);
        return `${currencySymbol}${value.toLocaleString("tr-TR", {
          maximumFractionDigits: 2,
        })}`;
      },
      [formatPrice, currencySymbol],
    );

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = subtotal + shipping;
    const isEmpty = items.length === 0;

    const remaining =
      freeShippingThreshold !== undefined
        ? Math.max(0, freeShippingThreshold - subtotal)
        : 0;
    const showFreeShipping =
      freeShippingThreshold !== undefined && !isEmpty && remaining > 0;
    const freeShippingProgress =
      freeShippingThreshold && freeShippingThreshold > 0
        ? Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))
        : 0;

    return (
      <Sheet open={actualOpen} onOpenChange={setOpen}>
        {trigger ? <SheetTrigger asChild>{trigger}</SheetTrigger> : null}
        <SheetContent
          ref={ref}
          side={side}
          className={cn(
            "flex w-full flex-col gap-0 p-0",
            side === "right" && "sm:max-w-md",
            side === "bottom" &&
              "max-h-[85vh] rounded-t-2xl sm:max-w-none",
            className,
          )}
        >
          <SheetHeader className="flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4 text-left">
            <span
              className="grid size-10 shrink-0 place-content-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5"
              aria-hidden="true"
            >
              <ShoppingBag />
            </span>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-base font-semibold text-foreground">
                {title}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {isEmpty
                  ? "Sepetiniz boş"
                  : `${totalCount} ürün · ${format(subtotal)}`}
              </SheetDescription>
            </div>
          </SheetHeader>

          {isEmpty ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
              <span
                className="grid size-16 place-content-center rounded-full bg-muted text-muted-foreground [&_svg]:size-7"
                aria-hidden="true"
              >
                <ShoppingCart />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Sepetiniz henüz boş
                </p>
                <p className="text-sm text-muted-foreground">
                  Beğendiğiniz ürünleri sepete ekleyerek buradan takip
                  edebilirsiniz.
                </p>
              </div>
              {onContinueShopping ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onContinueShopping();
                    setOpen(false);
                  }}
                >
                  Alışverişe başla
                </Button>
              ) : null}
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto px-6">
                <ul className="divide-y divide-border">
                  {items.map((item) => (
                    <li key={item.id}>
                      <CartLineItem
                        image={item.image}
                        imageAlt={item.imageAlt}
                        title={item.title}
                        variant={item.variant}
                        price={format(item.price * item.quantity)}
                        quantity={
                          <QuantityStepper
                            value={item.quantity}
                            min={1}
                            max={item.maxQuantity}
                            onValueChange={(next) =>
                              onQuantityChange?.(item.id, next)
                            }
                          />
                        }
                        onRemove={
                          onRemove ? () => onRemove(item.id) : undefined
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 border-t border-border bg-card/40 px-6 py-4">
                {showFreeShipping ? (
                  <div className="space-y-2 rounded-lg bg-muted/60 p-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <Truck
                        aria-hidden="true"
                        className="size-3.5 text-primary"
                      />
                      <span>
                        Ücretsiz kargoya{" "}
                        <span className="tabular-nums text-primary">
                          {format(remaining)}
                        </span>{" "}
                        kaldı
                      </span>
                    </div>
                    <div
                      className="h-1.5 w-full overflow-hidden rounded-full bg-border"
                      role="progressbar"
                      aria-valuenow={freeShippingProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Ücretsiz kargo ilerlemesi"
                    >
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                  </div>
                ) : null}

                <dl className="space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Ara toplam</dt>
                    <dd className="font-medium tabular-nums text-foreground">
                      {format(subtotal)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Kargo</dt>
                    <dd className="font-medium tabular-nums text-foreground">
                      {shipping === 0 ? (
                        <span className="text-success">Ücretsiz</span>
                      ) : (
                        format(shipping)
                      )}
                    </dd>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex items-center justify-between text-base">
                    <dt className="font-semibold text-foreground">Toplam</dt>
                    <dd className="font-bold tabular-nums text-foreground">
                      {format(total)}
                    </dd>
                  </div>
                </dl>

                <Button
                  type="button"
                  size="lg"
                  className="w-full"
                  onClick={onCheckout}
                >
                  {checkoutLabel}
                  <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    );
  },
);
CartDrawer.displayName = "CartDrawer";

export { CartDrawer };
