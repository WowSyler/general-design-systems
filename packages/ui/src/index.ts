/**
 * @ds/ui — shadcn tabanlı, tema-agnostik web bileşen havuzu.
 * Tüm bileşenler semantik tokenlar üzerinden 5 proje temasına ve
 * dark/light moda otomatik uyum sağlar.
 */

// Yardımcılar
export { cn } from "./lib/utils";
export { useIsMobile } from "./hooks/use-mobile";

// Tema
export {
  DsThemeProvider,
  useDsTheme,
  type DsThemeProviderProps,
  type DsThemeContextValue,
  type ThemeMode,
} from "./components/theme/theme-provider";
export {
  ThemeModeToggle,
  ThemeSelect,
  type ThemeSelectProps,
} from "./components/theme/theme-toggle";

// shadcn primitifleri
export * from "./components/ui/accordion";
export * from "./components/ui/alert";
export * from "./components/ui/alert-dialog";
export * from "./components/ui/avatar";
export * from "./components/ui/badge";
export * from "./components/ui/breadcrumb";
export * from "./components/ui/button";
export * from "./components/ui/calendar";
export * from "./components/ui/card";
export * from "./components/ui/checkbox";
export * from "./components/ui/collapsible";
export * from "./components/ui/command";
export * from "./components/ui/dialog";
export * from "./components/ui/drawer";
export * from "./components/ui/dropdown-menu";
export * from "./components/ui/form";
export * from "./components/ui/hover-card";
export * from "./components/ui/input";
export * from "./components/ui/input-otp";
export * from "./components/ui/label";
export * from "./components/ui/pagination";
export * from "./components/ui/popover";
export * from "./components/ui/progress";
export * from "./components/ui/radio-group";
export * from "./components/ui/scroll-area";
export * from "./components/ui/select";
export * from "./components/ui/separator";
export * from "./components/ui/sheet";
export * from "./components/ui/sidebar";
export * from "./components/ui/skeleton";
export * from "./components/ui/slider";
export * from "./components/ui/sonner";
export * from "./components/ui/switch";
export * from "./components/ui/table";
export * from "./components/ui/tabs";
export * from "./components/ui/textarea";
export * from "./components/ui/toggle";
export * from "./components/ui/toggle-group";
export * from "./components/ui/tooltip";

// Layout sistemi
export * from "./components/layout/container";
export * from "./components/layout/stack";
export * from "./components/layout/grid";
export * from "./components/layout/page-header";
export * from "./components/layout/section";
export * from "./components/layout/app-shell";
export * from "./components/layout/sidebar-shell";
export * from "./components/layout/marketing-shell";
export * from "./components/layout/auth-shell";

// Kompozit bileşenler
export * from "./components/composite/stat-card";
export * from "./components/composite/empty-state";
export * from "./components/composite/metric-bar";
export * from "./components/composite/score-badge";
export * from "./components/composite/period-switcher";
export * from "./components/composite/category-breakdown";
export * from "./components/composite/data-table";
export * from "./components/composite/chat-bubble";
export * from "./components/composite/plan-card";
export * from "./components/composite/time-slot-grid";
export * from "./components/composite/week-calendar";
export * from "./components/composite/image-grid";
export * from "./components/composite/gradient-hero";
export * from "./components/composite/glass-card";
export * from "./components/composite/feature-cta";
export * from "./components/composite/stepper";
