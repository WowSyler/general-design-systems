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
export {
  ThemeShowcase,
  type ThemeShowcaseProps,
} from "./components/theme/theme-showcase";

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

// Marketing bileşenleri
export * from "./components/marketing/feature-card";
export * from "./components/marketing/testimonial-card";
export * from "./components/marketing/logo-cloud";
export * from "./components/marketing/stats-strip";
export * from "./components/marketing/split-hero";
export * from "./components/marketing/promo-banner";
export * from "./components/marketing/cta-banner";
export * from "./components/marketing/footer-columns";

// Commerce bileşenleri
export * from "./components/commerce/product-card";
export * from "./components/commerce/rating";
export * from "./components/commerce/quantity-stepper";
export * from "./components/commerce/cart-line-item";

// Data / görselleştirme bileşenleri
export * from "./components/data/progress-ring";
export * from "./components/data/sparkline";
export * from "./components/data/bar-chart";
export * from "./components/data/donut-chart";
export * from "./components/data/activity-feed";
export * from "./components/data/line-chart";
export * from "./components/data/heat-calendar";
export * from "./components/data/compare-slider";

// UI yardımcıları (ek primitifler)
export * from "./components/ui-extras/tag";
export * from "./components/ui-extras/kbd";
export * from "./components/ui-extras/spinner";
export * from "./components/ui-extras/search-bar";
export * from "./components/ui-extras/password-input";
export * from "./components/ui-extras/form-field";
export * from "./components/ui-extras/combobox";
export * from "./components/ui-extras/color-swatches";
export * from "./components/ui-extras/code-block";

// İkonik / imza bileşenleri (modern desenler)
export * from "./components/iconic/bento-grid";
export * from "./components/iconic/spotlight-card";
export * from "./components/iconic/tilt-card";
export * from "./components/iconic/shine-border";
export * from "./components/iconic/marquee";
export * from "./components/iconic/aurora-background";
export * from "./components/iconic/announcement-bar";
export * from "./components/iconic/gradient-mesh";
export * from "./components/iconic/dock";
export * from "./components/iconic/segmented-control";
export * from "./components/iconic/shimmer-button";
export * from "./components/iconic/command-palette";
export * from "./components/iconic/animated-counter";
export * from "./components/iconic/kpi-tile";
export * from "./components/iconic/timeline";
export * from "./components/iconic/stat-ring";

// Kompozit bileşenler
export * from "./components/composite/avatar-group";
export * from "./components/composite/result-state";
export * from "./components/composite/media-frame";
export * from "./components/composite/fab";
export * from "./components/composite/bottom-nav";
export * from "./components/composite/phone-frame";
export * from "./components/composite/list-row";
export * from "./components/composite/notification-list";
export * from "./components/composite/social-auth-buttons";
export * from "./components/composite/file-dropzone";
export * from "./components/composite/prose";
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


// === A-Z kapsam genisletme (yeni bilesenler) ===
export * from "./components/composite/account-switcher";
export * from "./components/composite/active-filter-chips";
export * from "./components/composite/bulk-action-bar";
export * from "./components/composite/description-list";
export * from "./components/composite/faceted-filter";
export * from "./components/composite/filter-panel";
export * from "./components/composite/filter-toolbar";
export * from "./components/composite/notification-bell";
export * from "./components/composite/notification-center-panel";
export * from "./components/composite/notification-preferences";
export * from "./components/composite/settings-row-group";
export * from "./components/composite/user-account-menu";
export * from "./components/ui-extras/back-to-top";
export * from "./components/ui-extras/copy-button";
export * from "./components/ui-extras/date-picker";
export * from "./components/ui-extras/date-range-picker";
export * from "./components/ui-extras/language-selector";
export * from "./components/ui-extras/month-year-picker";
export * from "./components/ui-extras/range-calendar";
export * from "./components/ui-extras/sort-dropdown";
export * from "./components/ui-extras/status-badge";
export * from "./components/ui-extras/status-dot";
export * from "./components/ui-extras/time-picker";
export * from "./components/ui-extras/timezone-select";
export * from "./components/composite/column-toggle";
export * from "./components/composite/cursor-pagination";
export * from "./components/composite/data-table-advanced";
export * from "./components/composite/export-share-menu";
export * from "./components/composite/infinite-scroll";
export * from "./components/composite/load-more";
export * from "./components/composite/upload-file-list";
export * from "./components/layout/aspect-ratio";
export * from "./components/layout/resizable-split-pane";
export * from "./components/ui-extras/skeleton-templates";
export * from "./components/ui/context-menu";
export * from "./components/ui/tree-view";
export * from "./components/data/area-chart";
export * from "./components/data/bullet-chart";
export * from "./components/data/candlestick-chart";
export * from "./components/data/funnel-chart";
export * from "./components/data/gauge-chart";
export * from "./components/data/grouped-bar-chart";
export * from "./components/data/pie-chart";
export * from "./components/data/radar-chart";
export * from "./components/data/scatter-plot";
export * from "./components/data/stacked-bar-chart";
export * from "./components/data/waterfall-chart";
export * from "./components/ui-extras/trend-delta-badge";
export * from "./components/commerce/rating-input";
export * from "./components/composite/action-button";
export * from "./components/composite/alert-callout";
export * from "./components/composite/avatar-status";
export * from "./components/composite/nav-tabs";
export * from "./components/ui-extras/color-picker";
export * from "./components/ui-extras/count-badge";
export * from "./components/ui-extras/input-affix";
export * from "./components/ui-extras/multi-select";
export * from "./components/ui-extras/number-field";
export * from "./components/ui-extras/phone-input";
export * from "./components/ui-extras/slider-range";
export * from "./components/ui-extras/toggle-card";
export * from "./components/composite/auth-form";
export * from "./components/composite/choice-card";
export * from "./components/composite/error-page-states";
export * from "./components/composite/onboarding-carousel";
export * from "./components/composite/onboarding-checklist";
export * from "./components/composite/otp-verification";
export * from "./components/composite/product-tour-coachmark";
export * from "./components/composite/setup-progress";
export * from "./components/composite/welcome-modal";
export * from "./components/marketing/centered-hero";
export * from "./components/marketing/media-hero";
export * from "./components/marketing/pricing-table";
export * from "./components/commerce/condition-selector";
export * from "./components/commerce/favorite-button";
export * from "./components/commerce/make-offer-panel";
export * from "./components/commerce/price-tag";
export * from "./components/commerce/provider-card";
export * from "./components/commerce/service-card";
export * from "./components/commerce/variant-size-selector";
export * from "./components/composite/appointment-card";
export * from "./components/composite/booking-summary";
export * from "./components/composite/carousel";
export * from "./components/composite/lightbox-viewer";
export * from "./components/composite/listing-photo-uploader";
export * from "./components/composite/order-shipment-tracker";
export * from "./components/composite/seller-profile-header";
export * from "./components/commerce/checkout-order-summary";
export * from "./components/commerce/payment-method-card";
export * from "./components/commerce/receipt-card";
export * from "./components/composite/account-card";
export * from "./components/composite/budget-bar";
export * from "./components/composite/category-picker";
export * from "./components/composite/income-expense-summary";
export * from "./components/composite/numeric-keypad";
export * from "./components/composite/recurring-bill-item";
export * from "./components/composite/savings-goal-card";
export * from "./components/composite/transaction-row";
export * from "./components/data/budget-ring";
export * from "./components/ui-extras/currency-selector";
export * from "./components/ui-extras/money-amount";
export * from "./components/commerce/ingredient-list";
export * from "./components/commerce/product-match-card";
export * from "./components/composite/camera-controls";
export * from "./components/composite/comment-thread";
export * from "./components/composite/face-scan-overlay";
export * from "./components/composite/face-zone-map";
export * from "./components/composite/rating-summary";
export * from "./components/composite/reaction-bar";
export * from "./components/composite/review-card";
export * from "./components/composite/routine-checklist";
export * from "./components/composite/share-buttons";
export * from "./components/composite/skin-metric-card";
export * from "./components/composite/streak-tracker";
export * from "./components/composite/browser-matrix";
export * from "./components/composite/ci-pipeline";
export * from "./components/composite/deployment-row";
export * from "./components/composite/diff-viewer";
export * from "./components/composite/env-switcher";
export * from "./components/composite/feature-flag-list";
export * from "./components/composite/integration-card";
export * from "./components/composite/log-viewer";
export * from "./components/composite/member-role-row";
export * from "./components/composite/quota-meter";
export * from "./components/composite/stack-trace";
export * from "./components/composite/status-check-list";
export * from "./components/data/uptime-bars";
export * from "./components/ui-extras/git-ref";
export * from "./components/composite/address-card";
export * from "./components/composite/address-form";
export * from "./components/composite/bottom-sheet-draggable";
export * from "./components/composite/location-picker";
export * from "./components/composite/long-press-menu";
export * from "./components/composite/map-card";
export * from "./components/composite/pull-to-refresh";
export * from "./components/composite/swipeable-row";
export * from "./components/iconic/countdown-timer";
export * from "./components/ui-extras/focus-trap";
export * from "./components/ui-extras/live-region-announcer";
export * from "./components/ui-extras/qr-code";
export * from "./components/ui-extras/skip-link";
export * from "./components/ui-extras/visually-hidden";
export * from "./components/composite/cart-drawer";
export * from "./components/composite/category-nav-tiles";
export * from "./components/composite/conversation-list";
export * from "./components/composite/form-wizard";
export * from "./components/composite/message-composer";
export * from "./components/composite/mini-cart-badge";
export * from "./components/composite/profile-person-card";
export * from "./components/composite/adaptive-navigation";
export * from "./components/composite/browser-frame";
export * from "./components/composite/device-preview";
export * from "./components/composite/responsive-dialog";
export * from "./components/composite/responsive-menu";
export * from "./components/composite/responsive-table";
export * from "./components/composite/tablet-frame";
export * from "./components/layout/auto-grid";
export * from "./components/layout/safe-area";
export * from "./components/layout/show";
export * from "./components/ui-extras/touch-target";
export * from "./components/ui-extras/use-breakpoint";
