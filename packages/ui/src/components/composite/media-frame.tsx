/**
 * MediaFrame — Medya çerçevesi.
 * Landing sayfalarındaki video/görsel alanları için yumuşak köşeli,
 * gölgeli bir çerçeve; opsiyonel oynatma rozeti ve alt yazı sunar.
 */
import * as React from "react";
import { Play } from "lucide-react";

import { cn } from "@/lib/utils";

export interface MediaFrameProps
  extends React.HTMLAttributes<HTMLElement> {
  /** Çerçeve içeriği; verilmezse bg-muted yer tutucu gösterilir. */
  media?: React.ReactNode;
  aspect?: "video" | "square" | "wide";
  /** Ortada oynatma rozeti gösterir. */
  play?: boolean;
  caption?: React.ReactNode;
}

const aspectClasses: Record<NonNullable<MediaFrameProps["aspect"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
};

const MediaFrame = React.forwardRef<HTMLElement, MediaFrameProps>(
  ({ media, aspect = "video", play, caption, className, ...props }, ref) => (
    <figure ref={ref} className={cn("w-full", className)} {...props}>
      <div
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl shadow-lg",
          aspectClasses[aspect],
          !media && "bg-muted"
        )}
      >
        {media ? <div className="absolute inset-0">{media}</div> : null}
        {play ? (
          <span
            className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur-sm transition-all duration-200 group-hover:scale-105"
            aria-hidden="true"
          >
            <Play className="ml-1 size-7 fill-current" />
          </span>
        ) : null}
      </div>
      {caption ? (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
);
MediaFrame.displayName = "MediaFrame";

export { MediaFrame };
