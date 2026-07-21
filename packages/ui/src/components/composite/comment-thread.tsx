/**
 * CommentThread — Ic-ice (girintili) yorum dizisi (Dolap/genel sosyal).
 * Her yorum avatar + isim (opsiyonel dogrulanmis rozeti) + zaman + metin ve
 * Yanitla / Begen aksiyonlarini gosterir; yanitlar sol tarafta ince bir ray
 * (border-l) ile girintilenir. Opsiyonel "daha fazla yanit goster" satiri
 * gizli yanit sayisini duyurur. Bilesenin kendi durumu yoktur (salt sunum);
 * begeni/yanit/yanit-goster geri cagirimlari prop olarak verilir. Tema-agnostik.
 *
 * CommentThreadItem tek bir yorumu (girinti/ray olmadan) render eder ve ozel
 * kompozisyon icin disa acilir; CommentThread veri odakli recursive kapsayicidir.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { BadgeCheck, CornerDownRight, Heart, MessageSquareReply, Pin } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const numberFormatter = new Intl.NumberFormat("tr-TR");

/** Yorum yazarini tanimlayan alanlar. */
export interface CommentThreadAuthor {
  /** Yazar gorunen adi. */
  name: string;
  /** Opsiyonel kullanici adi/handle (or. "@selin.vintage"). */
  handle?: string;
  /** Avatar gorsel adresi (yoksa fallback bas harfleri gosterilir). */
  avatarSrc?: string;
  /** Avatar gorseli icin alternatif metin. */
  avatarAlt?: string;
  /** Fallback icerigi: bas harfler (or. "SA"). */
  fallback: React.ReactNode;
  /** Dogrulanmis yazar rozetini goster. */
  verified?: boolean;
}

/** Tekil yorum verisi; yanitlar ic-ice ayni yapida tutulur. */
export interface CommentThreadComment {
  /** Benzersiz yorum kimligi (geri cagirimlarda dondurulur). */
  id: string;
  /** Yorumu yazan kisi. */
  author: CommentThreadAuthor;
  /** Zaman etiketi (or. "2 saat once"). */
  timestamp: React.ReactNode;
  /** Yorum metni/icerigi. */
  content: React.ReactNode;
  /** Begeni sayisi (verilirse begen aksiyonunda gosterilir). */
  likeCount?: number;
  /** Kullanicinin bu yorumu begenip begenmedigi (kalp dolar). */
  liked?: boolean;
  /** Sabitlenmis yorum rozetini goster. */
  pinned?: boolean;
  /** Ic-ice yanitlar. */
  replies?: CommentThreadComment[];
  /** Henuz yuklenmemis/gizli yanit sayisi ("N yanit daha" satiri icin). */
  hiddenReplyCount?: number;
}

const itemVariants = cva("flex gap-3", {
  variants: {
    density: {
      comfortable: "gap-3",
      compact: "gap-2.5",
    },
  },
  defaultVariants: {
    density: "comfortable",
  },
});

export interface CommentThreadItemProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "content">,
    VariantProps<typeof itemVariants> {
  /** Render edilecek yorum verisi. */
  comment: CommentThreadComment;
  /** Yanit girinti seviyesi (0 = kok). Avatar boyutunu olceklendirir. */
  depth?: number;
  /** Yanitla aksiyonu (verilmezse buton gizlenir). */
  onReply?: (id: string) => void;
  /** Begen aksiyonu (verilmezse buton gizlenir). */
  onLike?: (id: string) => void;
}

const CommentThreadItem = React.forwardRef<HTMLElement, CommentThreadItemProps>(
  ({ comment, depth = 0, density, onReply, onLike, className, ...props }, ref) => {
    const { author, timestamp, content, likeCount, liked = false, pinned = false } = comment;
    const nested = depth > 0;

    return (
      <article
        ref={ref}
        className={cn(itemVariants({ density }), className)}
        {...props}
      >
        <Avatar
          className={cn(
            "shrink-0 ring-1 ring-border",
            nested ? "size-8" : "size-9"
          )}
        >
          {author.avatarSrc ? (
            <AvatarImage src={author.avatarSrc} alt={author.avatarAlt ?? author.name} />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {author.fallback}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          {pinned ? (
            <div className="mb-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Pin className="size-3 fill-current" aria-hidden="true" />
              Sabitlenmis
            </div>
          ) : null}

          <div className="rounded-2xl rounded-tl-sm bg-muted/60 px-3.5 py-2.5">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                {author.name}
                {author.verified ? (
                  <BadgeCheck
                    className="size-3.5 shrink-0 fill-info text-info-foreground"
                    aria-label="Dogrulanmis yazar"
                  />
                ) : null}
              </span>
              {author.handle ? (
                <span className="text-xs text-muted-foreground">{author.handle}</span>
              ) : null}
            </div>
            <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-foreground">
              {content}
            </p>
          </div>

          <div className="mt-1.5 flex items-center gap-1 pl-1 text-xs text-muted-foreground">
            <span className="tabular-nums">{timestamp}</span>
            {onLike ? (
              <>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => onLike(comment.id)}
                  aria-pressed={liked}
                  className={cn(
                    "inline-flex min-h-8 items-center gap-1 rounded-md px-2 py-1 font-medium tabular-nums transition-all duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
                    liked && "text-destructive hover:text-destructive"
                  )}
                >
                  <Heart
                    className={cn("size-3.5", liked && "fill-current")}
                    aria-hidden="true"
                  />
                  <span>Begen</span>
                  {likeCount != null && likeCount > 0 ? (
                    <span aria-hidden="true">· {numberFormatter.format(likeCount)}</span>
                  ) : null}
                  {likeCount != null && likeCount > 0 ? (
                    <span className="sr-only">
                      ({numberFormatter.format(likeCount)} begeni)
                    </span>
                  ) : null}
                </button>
              </>
            ) : null}
            {onReply ? (
              <>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => onReply(comment.id)}
                  className="inline-flex min-h-8 items-center gap-1 rounded-md px-2 py-1 font-medium transition-all duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
                >
                  <MessageSquareReply className="size-3.5" aria-hidden="true" />
                  Yanitla
                </button>
              </>
            ) : null}
          </div>
        </div>
      </article>
    );
  }
);
CommentThreadItem.displayName = "CommentThreadItem";

export interface CommentThreadProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "content">,
    VariantProps<typeof itemVariants> {
  /** Kok seviyedeki yorumlar (her biri ic-ice yanitlar icerebilir). */
  comments: CommentThreadComment[];
  /** Yanitla aksiyonu (verilmezse butonlar gizlenir). */
  onReply?: (id: string) => void;
  /** Begen aksiyonu (verilmezse butonlar gizlenir). */
  onLike?: (id: string) => void;
  /** "Daha fazla yanit goster" tiklamasi (verilmezse satir gizlenir). */
  onShowReplies?: (id: string) => void;
  /** Kok seviye ile baslayan derinlik (dahili recursive kullanim). */
  depth?: number;
}

const CommentThread = React.forwardRef<HTMLElement, CommentThreadProps>(
  (
    { comments, onReply, onLike, onShowReplies, density, depth = 0, className, ...props },
    ref
  ) => (
    <ol
      ref={ref as React.Ref<HTMLOListElement>}
      className={cn(
        "space-y-4",
        depth > 0 && "mt-3 space-y-3 border-l border-border pl-3 sm:pl-4",
        className
      )}
      {...props}
    >
      {comments.map((comment) => {
        const replies = comment.replies ?? [];
        const hidden = comment.hiddenReplyCount ?? 0;
        return (
          <li key={comment.id}>
            <CommentThreadItem
              comment={comment}
              depth={depth}
              density={density}
              onReply={onReply}
              onLike={onLike}
            />

            {replies.length > 0 ? (
              <CommentThread
                comments={replies}
                onReply={onReply}
                onLike={onLike}
                onShowReplies={onShowReplies}
                density={density}
                depth={depth + 1}
              />
            ) : null}

            {hidden > 0 && onShowReplies ? (
              <div className={cn("mt-2", replies.length > 0 ? "ml-3 pl-3 sm:ml-4 sm:pl-4" : "ml-11")}>
                <button
                  type="button"
                  onClick={() => onShowReplies(comment.id)}
                  className="inline-flex items-center gap-1.5 rounded-md py-0.5 text-xs font-semibold text-primary transition-all duration-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <CornerDownRight className="size-3.5" aria-hidden="true" />
                  {numberFormatter.format(hidden)} yaniti daha goster
                </button>
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  )
);
CommentThread.displayName = "CommentThread";

export { CommentThread, CommentThreadItem };
