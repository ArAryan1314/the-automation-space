# UI Style Guide — "Neon Automation" Dark Theme (v4.0)

The site uses a dark, high-tech design: deep navy cards on a near-black canvas, a glowing cyan primary,
an electric-blue secondary accent and soft white text. Font is Plus Jakarta Sans (via `next/font`).
All colors are **semantic tokens** defined in `src/app/globals.css` (`@theme`). Never use raw light-theme
colors (`bg-white`, `bg-slate-50`, `text-slate-600`, `bg-emerald-50`, `text-white` on `bg-primary` …).

## Tokens → Tailwind utilities

| Purpose | Utility |
|---|---|
| Page canvas | `bg-background` |
| Card / panel | `bg-card` (deep navy) |
| Subtle tinted panel / inset | `bg-surface` |
| Primary text / headings | `text-foreground` |
| Body copy | `text-body` (via `<Text>`), secondary: `text-muted-foreground` |
| Captions / placeholders | `text-subtle-foreground` |
| Borders | `border-border`, stronger: `border-border-strong` |
| Brand primary (cyan) | `bg-primary`, `text-primary`, hover `text-primary-hover` / `bg-primary-hover` |
| Text or icons on `bg-primary` | `text-primary-foreground` (dark; white is unreadable on cyan) |
| Soft brand tint | `bg-primary-soft` + `border-primary-muted` + `text-primary-hover` |
| Secondary accent (blue) | `text-accent`, `bg-accent-soft` |
| Contrast band | `bg-ink` (+ `text-white`) |
| Glowing call-to-action panel | `panel-glow` + `border border-primary/30` |
| Shadows | `shadow-soft` (resting), `shadow-lift` (hover/emphasis, cyan glow) |

Status colors: use translucent tints — `bg-emerald-500/10 text-emerald-300 border-emerald-500/30`,
`bg-amber-500/10 text-amber-300 border-amber-500/30`, `bg-red-500/10 text-red-300 border-red-500/30`,
`bg-sky-500/10 text-sky-200 border-sky-500/30`.

## Typography & sizing
- Body copy should be readable: prefer `text-sm` / `text-[15px]` over `text-xs`. Use `text-xs` only for
  captions, meta labels and badges. Avoid `text-[10px]`/`text-[11px]` except tiny meta.
- Form labels: use `<Label>` from `@/components/ui` (sentence case, not uppercase tracking-wider).
- Eyebrow labels: `text-xs font-semibold uppercase tracking-wider text-primary` (sparingly).
- Avoid emoji decorations in UI copy (⚡ 🔒 etc.) — use lucide icons.

## Components (`@/components/ui`)
`Button` (variants: default · secondary · outline · ghost · soft · accent(ink) · destructive),
`Badge` (default · secondary · outline · accent · success · warning · destructive), `Card*`,
`Input`, `Textarea`, `Label`, `Section` (variants: default · glass(card band) · glow(cyan tint band)
· muted(surface band) · hero(glow and grid) · ink(contrast band)), `SectionHeader`, **`PageHero`** (standard
inner-page header: `badge`, `title`, `description`, `actions`, `align`), `Heading`, `Text`,
`StatsGrid`, `Accordion`, `AlertBanner`, `Modal`, `TabsList`/`TabsTrigger`, `Timeline`, **`IconBox`**
(`tone`: primary · accent · sky · amber · rose · neutral; `size`: sm · default · lg).

## Layout rules (carried over from v2.1)
- Full-width fluid layout — keep `w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20` (built into `Section`).
- Every route delegates to a view in `src/components/views/`; pages stay thin.
- Inner pages start with `<PageHero>`; alternate section bands (`default` → `muted`/`glass` → `default`)
  for rhythm; generous spacing (`gap-6`, `p-6`, `space-y-…`).
- Cards: `rounded-2xl`, `bg-card`, `shadow-soft`, hover lift (built into `Card`).
- Brand name is **The Automation Studio**; content is 100% recruitment-agency focused.
