/**
 * SocialAuthButtons — Sosyal giris butonlari (Google / Apple).
 * Tam genislik outline butonlar; dikey (stack) veya yatay (row) dizilim.
 * Google logosu marka geregi sabit hex renkli inline SVG (istisna),
 * Apple logosu currentColor kullanir. Logolar aria-hidden'dir.
 */
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type SocialProvider = "google" | "apple";
type SocialAuthLayout = "stack" | "row";

export interface SocialAuthButtonsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  providers: SocialProvider[];
  onProvider?: (provider: SocialProvider) => void;
  layout?: SocialAuthLayout;
}

const layoutClasses: Record<SocialAuthLayout, string> = {
  stack: "flex flex-col gap-2",
  row: "flex flex-row gap-2",
};

const providerLabels: Record<SocialProvider, string> = {
  google: "Google ile devam et",
  apple: "Apple ile devam et",
};

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.273c0-.851-.076-1.67-.218-2.455H12v4.642h6.458a5.52 5.52 0 0 1-2.394 3.622v3.011h3.878c2.269-2.089 3.578-5.165 3.578-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.956-1.075 7.942-2.907l-3.878-3.011c-1.075.72-2.45 1.145-4.064 1.145-3.125 0-5.771-2.111-6.715-4.948H1.276v3.11A11.995 11.995 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.285 14.279A7.213 7.213 0 0 1 4.909 12c0-.79.136-1.56.376-2.279V6.61H1.276a11.995 11.995 0 0 0 0 10.778l4.009-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.773c1.762 0 3.344.605 4.587 1.794l3.442-3.442C17.951 1.19 15.235 0 12 0A11.995 11.995 0 0 0 1.276 6.61l4.009 3.111C6.229 6.884 8.875 4.773 12 4.773Z"
      />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.365 12.789c.024 2.601 2.282 3.467 2.307 3.478-.019.061-.36 1.233-1.19 2.443-.716 1.047-1.46 2.09-2.632 2.111-1.152.021-1.523-.683-2.84-.683-1.317 0-1.728.662-2.819.704-1.131.043-1.993-1.132-2.716-2.175-1.477-2.135-2.605-6.033-1.09-8.663.753-1.306 2.098-2.134 3.559-2.155 1.111-.021 2.16.748 2.84.748.679 0 1.954-.925 3.294-.789.561.023 2.136.227 3.147 1.708-.081.05-1.879 1.097-1.86 3.273ZM14.2 6.399c.6-.727 1.005-1.739.894-2.746-.865.035-1.912.577-2.532 1.303-.556.643-1.043 1.673-.912 2.66.965.075 1.95-.49 2.55-1.217Z"
      />
    </svg>
  );
}

const providerLogos: Record<SocialProvider, React.ReactNode> = {
  google: <GoogleLogo />,
  apple: <AppleLogo />,
};

const SocialAuthButtons = React.forwardRef<HTMLDivElement, SocialAuthButtonsProps>(
  ({ providers, onProvider, layout = "stack", className, ...props }, ref) => (
    <div ref={ref} className={cn(layoutClasses[layout], className)} {...props}>
      {providers.map((provider) => (
        <button
          key={provider}
          type="button"
          onClick={() => onProvider?.(provider)}
          className="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:border-ring/60 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50"
        >
          {providerLogos[provider]}
          {providerLabels[provider]}
        </button>
      ))}
    </div>
  )
);
SocialAuthButtons.displayName = "SocialAuthButtons";

export { SocialAuthButtons };
