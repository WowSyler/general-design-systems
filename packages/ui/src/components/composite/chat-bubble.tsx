/**
 * ChatBubble — AI stilist sohbet balonu (Dolap).
 * Kullanici mesajlari sagda birincil renkte, asistan mesajlari solda
 * muted arka planla gosterilir. ChatList mesajlari dikey listeler.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type ChatRole = "user" | "assistant";

export interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  role: ChatRole;
  avatar?: React.ReactNode;
  timestamp?: React.ReactNode;
  children: React.ReactNode;
}

const bubbleClasses: Record<ChatRole, string> = {
  user: "bg-primary text-primary-foreground rounded-2xl rounded-br-sm",
  assistant: "bg-muted text-foreground rounded-2xl rounded-bl-sm",
};

const wrapperClasses: Record<ChatRole, string> = {
  user: "ml-auto flex-row-reverse self-end",
  assistant: "mr-auto self-start",
};

const timestampAlignClasses: Record<ChatRole, string> = {
  user: "text-right",
  assistant: "text-left",
};

const roleText: Record<ChatRole, string> = {
  user: "Kullanici",
  assistant: "Asistan",
};

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ role, avatar, timestamp, children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex max-w-[80%] items-end gap-2", wrapperClasses[role], className)}
      {...props}
    >
      {avatar ? <div className="shrink-0" aria-hidden="true">{avatar}</div> : null}
      <div className="flex min-w-0 flex-col gap-1">
        <span className="sr-only">{roleText[role]}:</span>
        <div className={cn("px-4 py-2.5 text-sm", bubbleClasses[role])}>{children}</div>
        {timestamp ? (
          <div className={cn("text-xs text-muted-foreground", timestampAlignClasses[role])}>
            {timestamp}
          </div>
        ) : null}
      </div>
    </div>
  )
);
ChatBubble.displayName = "ChatBubble";

export interface ChatListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ChatList = React.forwardRef<HTMLDivElement, ChatListProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-3", className)} {...props}>
      {children}
    </div>
  )
);
ChatList.displayName = "ChatList";

export { ChatBubble, ChatList };
