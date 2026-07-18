# WorkPlace Design System — Build Conventions

## 1. Required wrapper (nothing renders correctly without it)

Wrap every screen in `DsThemeProvider`. It applies the theme class that defines
ALL color/font CSS variables — without it, components render unstyled
(black-on-white, default serif font, no brand colors).

```jsx
<DsThemeProvider applyTo="root" defaultTheme="deploylens" defaultMode="light">
  {/* your screen */}
</DsThemeProvider>
```

Use `applyTo="root"` for the screen's top-level wrapper — portal-based overlays
(Dialog, DropdownMenu, Select, Popover, Tooltip) render outside the DOM subtree
and only inherit theme variables from the page root. Use `applyTo="self"` ONLY
for nested sections that mix a second theme inside a page (e.g. theme preview
panels).

- `defaultTheme` — one of the 5 project themes: `"deploylens"` (dev-tool, blue
  #0B5CFF), `"dolap"` (wardrobe app, violet), `"randevu"` (booking platform,
  indigo), `"glowscan"` (beauty/spa, rose+cream, serif typography), `"fisly"`
  (finance, emerald). Pick the theme matching the product you're designing for.
- `defaultMode` — `"light"` or `"dark"`. Every theme fully supports both.

## 2. Styling idiom: semantic Tailwind tokens ONLY

Style layout glue with Tailwind v3 utilities bound to semantic tokens. NEVER
use raw palette classes (`bg-blue-500`, `text-gray-600`) — they ignore the
theme. The vocabulary:

| Purpose | Classes |
|---|---|
| Surfaces | `bg-background`, `bg-card`, `bg-popover`, `bg-muted`, `bg-secondary`, `bg-accent` |
| Text | `text-foreground`, `text-muted-foreground`, `text-card-foreground`, `text-primary`, on-color: `text-primary-foreground` etc. |
| Brand/action | `bg-primary text-primary-foreground`, focus: `ring-ring` |
| Status | `bg-destructive`, `bg-success`, `bg-warning`, `bg-info` (+ `text-*`, soft: `bg-success/15 text-success`) |
| Borders | `border` (token-bound), `border-input`, `divide-*` |
| Charts | `bg-chart-1` … `bg-chart-5` (theme-tuned categorical palette) |
| Admin shell | `bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-accent`, `border-sidebar-border` |
| Brand gradient | `bg-brand-gradient` (theme's gradient; pair with `text-primary-foreground`) |
| Radius | `rounded-sm/md/lg/xl/2xl` — bound to the theme's `--radius` |
| Fonts | `font-sans` (body), `font-display` (hero headings), `font-serif`, `font-mono` — glowscan maps these to Cormorant Garamond / Playfair Display automatically |

Dark mode needs no `dark:` variants for colors — the same semantic classes
re-resolve when mode changes. Responsive: standard `sm:`/`md:`/`lg:` prefixes.

## 3. Compose with the shipped components

Layout system: `AppShell` (topbar app), `SidebarShell` (admin dashboard),
`MarketingShell` (public site), `AuthShell` (centered auth), plus `Container`,
`Stack`/`VStack`/`HStack`, `Grid`, `PageHeader`, `Section`.

Pick by page type — prefer these over hand-rolling; check each component's
`.prompt.md` for its API:
- **Landing/marketing**: `SplitHero`, `GradientHero`, `FeatureCard`,
  `TestimonialCard`, `LogoCloud`, `StatsStrip`, `CtaBanner`, `PromoBanner`,
  `FooterColumns`, `MediaFrame`, `PlanCard`, `GlassCard`, `FeatureCta`
- **Dashboard/data**: `StatCard`, `DataTable`, `LineChart`, `BarChart`,
  `DonutChart`, `Sparkline`, `HeatCalendar`, `ProgressRing`, `MetricBar`,
  `CategoryBreakdown`, `ActivityFeed`, `PeriodSwitcher`, `CompareSlider`
- **Booking/scheduling**: `WeekCalendar`, `TimeSlotGrid`, `Steps`
- **Commerce**: `ProductCard`, `Rating`, `QuantityStepper`, `CartLineItem`,
  `ImageGrid`+`PhotoCard`
- **App/content**: `ListRow`+`ListGroup`, `NotificationList`+`NotificationItem`,
  `ChatBubble`+`ChatList`, `ScoreBadge`, `EmptyState`, `ResultState`,
  `AvatarGroup`, `Prose`, `CodeBlock`, `Tag`, `Kbd`+`KbdGroup`, `Spinner`,
  `SearchBar`, `PasswordInput`, `LabeledField`, `Combobox`, `ColorSwatches`,
  `FileDropzone`
- **Mobile app designs**: wrap the screen in `PhoneFrame`, navigate with
  `BottomNav` (supports a raised `centerAction`), float actions with `Fab`

## 4. Truth lives in

`styles.css` → imports `tokens/*.css` (per-theme variable definitions — read
`tokens/deploylens.css` etc. for exact values) and the compiled component CSS.
Per-component API: `components/<group>/<Name>/<Name>.d.ts` + `.prompt.md`.

## 5. Idiomatic example

```jsx
<DsThemeProvider applyTo="self" defaultTheme="fisly" defaultMode="light">
  <AppShell
    logo={<span className="font-semibold">Fisly</span>}
    nav={<a className="text-sm text-muted-foreground hover:text-foreground">Panel</a>}
    actions={<Button size="sm">Fiş Tara</Button>}
  >
    <PageHeader title="Panel" description="Bu ayki harcama özetin" />
    <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="md">
      <StatCard label="Toplam Gider" value="₺12.480"
        delta={{ value: "%8,2", trend: "down" }} />
    </Grid>
  </AppShell>
</DsThemeProvider>
```
