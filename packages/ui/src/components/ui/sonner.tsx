import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

import { useOptionalDsTheme } from "@/components/theme/theme-provider"

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * Toaster — sonner tabanlı bildirim yığını.
 * DsThemeProvider içindeyse açık/koyu mod ve yazı yönü (ltr/rtl) oradan alınır;
 * değilse next-themes'e (varsa) düşer. Bildirim göstermek için `toast()` kullanın.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const ds = useOptionalDsTheme()
  const { theme: nextTheme = "system" } = useTheme()
  const theme = ds ? ds.resolvedMode : nextTheme

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      dir={ds?.dir}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
