# Changelog: The Automation Studio Platform

All notable changes and architectural updates across the repository are documented in this file.

---

## [4.6.0] - 2026-10-31

### Added
- GitHub sync: `pnpm sync` commits and pushes to `ArAryan1314/the-automation-space`, and `pnpm sync:install` schedules it
  every 15 minutes on Windows. It stops without committing if a private file or secret would be included.
- GitHub Actions CI (`.github/workflows/ci.yml`): builds the Linux deployment bundle, runs typecheck and lint, starts the
  bundle, requests key routes, and keeps the bundle as a downloadable artifact for 14 days.
- `.gitattributes`, so text files are stored in git with LF line endings.

### Changed
- `.gitignore` now excludes `godaddy-dist/` and `godaddy-deployment.zip`, which contain a copy of `.env.local`.

## [4.5.0] - 2026-10-31

### Removed
- PHP hosting: the `godaddy-php/` upload folder and PHP API, `godaddy-php.zip`, `scripts/package-php.js`, `pnpm build:php`
  and the `STATIC_EXPORT` static-export mode in `next.config.ts`. The site now needs a Node.js host; `pnpm admin:create`
  writes to `.env.local` only.

## [4.4.0] - 2026-10-31

### Added
- Admin login with a username and password, replacing the passkey. `pnpm admin:create [username] [password]` saves a
  PBKDF2 hash to `.env.local` and `godaddy-php/api/credentials.php`. Sessions are signed HttpOnly cookies lasting 8 hours;
  10 failed sign-ins from one address block further attempts for 15 minutes.
- `/admin-login` console tabs: job postings (add, edit, delete), contacts (view, add, delete), job applications
  (view, delete) and intakes (view).
- API routes `/api/admin-session`, `/api/jobs`, `/api/contacts`, `/api/applications` in both Node (`src/app/api`,
  `src/lib/server`) and PHP (`godaddy-php/api`). Changes use POST with an `action`, because shared hosts often block PUT and DELETE.

### Changed
- `/jobs` loads postings from the API. The hard-coded list moved to `src/data/seed-jobs.json`, written to `jobs.json` once
  on first use. Job departments in the filter now come from the stored postings.
- Quick Apply now saves the application and asks for a name; before, it showed a success message and discarded the data.
- The contact form saves to `/api/contacts` with phone and inquiry type as separate fields, and shows an error when sending fails.
- Node: intakes are saved to a file instead of memory (`.data/`, or `DATA_DIR`), and `GET /api/ai-respond` requires a signed-in admin.
- `pnpm build:php` stops if `api/credentials.php` is missing, and no longer generates `admin_key`, which is now unused.

## [4.3.0] - 2026-10-31

### Changed
- Theme palette replaced: space-void canvas `#040810`, cyber-navy cards `#0A1322`, electric-cyan primary `#00F0FF`,
  royal-blue accent `#0066FF` and new energy-orange tokens (`energy`, `energy-soft`). New `accent-hover` and
  `shadow-neon-cyan` / `-blue` / `-orange` tokens. Glow and grid effects in `globals.css` use the new colors.
- `Button`: primary glows cyan; `secondary` is now royal blue. `Card`: hover uses a cyan border and glow.
  `Badge`: larger padding, and `warning` uses energy orange. Inputs and selects use `bg-surface` and `border-border`.
- `IconBox`: `amber` tone renamed to `energy`; `sky` is now soft cyan. Hero titles are `text-white`.
  Remaining raw sky and amber colors moved onto the palette.

## [4.2.0] - 2026-10-31

### Changed
- Source moved to a standard React layout under `src/`: `src/app`, `src/components/{layout,ui,views}`, `src/data`,
  `src/lib`. `Navbar` and `Footer` moved out of `app/components`, and static content out of `app/data`.
  The `@/*` alias now points at `src/`; `public/`, `scripts/` and config files stay at the project root.
- Public wording in the navigation menu, `/documentation`, `/faq`, `/portal` and `/admin-login` no longer says submissions are held in memory,
  since the PHP site saves them to a file.

## [4.1.0] - 2026-10-31

### Changed
- `godaddy-php/api`: split `ai-respond.php` into a layered class structure under `api/src` (no Composer, PHP 7.4+).
  Inheritance chains: `ApiController` > `AdminApiController` > `IntakeController`, `Validator` > `IntakeValidator`,
  `JsonStore` > `SubmissionStore`, `DraftWriter` > `AiDraftWriter` > `GeminiDraftWriter`. The API contract is unchanged.
- Settings can come from environment variables (`ADMIN_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `DATA_DIR`, `APP_ENV`),
  which take priority over `api/config.php`.

### Fixed
- `godaddy-php/api`: a failed JSON encode can no longer empty `submissions.json`, and reads now take a shared lock.

## [4.0.0] - 2026-10-31

### Changed
- New "Neon Automation" dark theme replaces "Fresh Light": near-black navy canvas, glowing cyan primary and
  electric-blue accent. Tokens are in `app/globals.css`; `STYLE_GUIDE.md` is rewritten to match.
- Body copy now uses a new `text-body` token instead of `text-slate-*`. Status colors are translucent tints,
  and text on `bg-primary` uses `text-primary-foreground`.
- Footer call-to-action is now a glowing dark panel (`panel-glow`).
- `scripts/package-php.js`: `godaddy-php/` and `godaddy-php.zip` now live two levels up, in `D:\Free lancing`,
  matching where the upload folder was moved.

## [3.2.0] - 2026-10-31

### Added
- `../godaddy-php/`: upload folder for PHP-only GoDaddy hosting, holding the static export plus
  `api/ai-respond.php`, a PHP port of the API route that saves intakes to a file above the web root.
- `pnpm build:php` (`scripts/package-php.js`) regenerates that folder and `../godaddy-php.zip`, keeping the
  hand-written `.htaccess`, `api/` and README, and creating `api/config.php` with a random admin key if missing.
- `next.config.ts`: `STATIC_EXPORT=1` switches the build to a static export.

### Changed
- `/admin-login` no longer pre-fills the passkey, sends it as `X-Admin-Key` and shows a message on rejection.
  The PHP API enforces the key on `GET`; the Node route still ignores it.

## [3.1.1] - 2026-10-31

### Fixed
- `scripts/package-godaddy.js`: the deployment zip crashed on startup (`Cannot find module '@swc/helpers/...'`)
  because pnpm's junctions do not survive zipping. The bundle now has a flat `node_modules` of real files,
  and packaging fails if any link remains.
- GoDaddy guide: Node.js requirement corrected to 20.9+ (Next.js 16 does not run on 18.x).
- `pnpm check` failed on lint: `godaddy-dist/` and the stray nested `recruitment-agency/` output are now
  ignored, and CommonJS `require()` is allowed in `scripts/`.

---

## [3.1.0] - 2026-10-29

### Added
- `lib/site.ts`: site config (`SITE`) and the `SITE_PAGES` page registry with a `pageMetadata()` helper.
  Every route now exports its own title, description, canonical URL and Open Graph tags.
- `/documentation`: new **Site Pages** tab (directory of all 16 pages, generated from `SITE_PAGES`) and
  **Developer Setup** tab (pnpm commands, environment variables, how to add a page).
- `.env.example` documenting `NEXT_PUBLIC_SITE_URL`, `GEMINI_API_KEY`, `GEMINI_MODEL` (git-ignore exception added).
- Scripts: `lint:fix`, `check` (typecheck + lint + build), `clean`. Parent `nextDev/package.json` forwards
  `dev`/`build`/`start`/`lint`/`typecheck`/`check` to the app and adds `install:app`, `graph:rebuild`.

### Changed
- Site URL is configurable through `NEXT_PUBLIC_SITE_URL`; the Gemini model through `GEMINI_MODEL`.
- README rewritten with commands, env vars, page table and deployment notes; SCRATCHPAD route table
  regenerated from the views' actual imports.

### Fixed
- Removed the hard-coded `<link rel="canonical">` in `layout.tsx` that pointed every page at the homepage.

### Removed
- Unused dependencies `canvas-confetti` and `@types/canvas-confetti`.
- Unused Next.js template assets (`public/*.svg`) and the unused `components/views/index.ts` barrel.
- Unused `TESTIMONIALS`, `FAQS` and `Testimonial` in `app/data/agencyData.ts`, and the team `image` URLs no
  longer rendered by `TeamView`.
- Placeholder API-key string check in `/api/ai-respond` and leftover template comments in `next.config.ts`.

---

## [3.0.0] - 2026-10-29

### Changed — "Fresh Light" UI Redesign
- Replaced the dark obsidian theme with a clean, light design: soft cool-grey canvas, white cards,
  fresh teal primary (`#0d9488`), indigo secondary accent and deep navy ink typography.
- Introduced semantic design tokens in `app/globals.css` (`@theme`): `background`, `card`, `surface`,
  `foreground`, `muted-foreground`, `border`, `primary`, `primary-soft`, `accent`, `ink`, `shadow-soft`/`shadow-lift`.
- Switched typography to Plus Jakarta Sans via `next/font/google`; raised body copy from `text-xs` to
  `text-sm`/`text-[15px]` for readability.
- Restyled every UI primitive (`Button`, `Badge`, `Card`, `Input`, `Textarea`, `Accordion`, `AlertBanner`,
  `Modal`, `Section`, `StatsGrid`, `Tabs`, `Timeline`, `Typography`).
- Added primitives: `PageHero` (standard inner-page header), `IconBox` (tinted icon tile), `Label`
  (form labels), Button `soft`, Badge `success`/`warning`, Section `ink`.
- Rebuilt `Navbar` (data-driven mega menus, light frosted header, click + hover support) and `Footer`
  (gradient CTA banner + clean link columns).
- Converted all 16 page views to the new design system; removed `glass-panel*`, `gradient-border`,
  `bg-grid-pattern` and non-functional `animate-in` classes (replaced with `animate-fade-up`).
- Added `STYLE_GUIDE.md` documenting tokens, component usage and the old → new class mapping.

### Tooling
- Migrated from npm to **pnpm** (`pnpm-lock.yaml` imported from the previous `package-lock.json`, so
  resolved versions are unchanged). Pinned `packageManager: pnpm@12.16.1`; added `pnpm-workspace.yaml`
  with an explicit `allowBuilds` list. Added a `typecheck` script.
- Migrated the parent `nextDev/` tooling folder (graphify/engram) to pnpm as well; native tree-sitter
  parser builds are allowed, `tree-sitter-lua` is skipped (no prebuilt binary and no Lua code in the repo).
- Fixed pre-existing lint errors in UI primitives (empty interfaces, `any` casts).

---

## [2.1.0] - 2026-10-25

### Refactored
- **Page Routing via UI Components**:
  - Re-architected all 15 page routes in `app/` to delegate directly to dedicated view components located in `components/views/`.
  - Created `HomeView`, `JobsView`, `EmployersView`, `CandidatesView`, `ServicesView`, `AboutView`, `CaseStudiesView`, `SalaryGuideView`, `TeamView`, `ProcessView`, `FAQView`, `DocumentationView`, `CandidateLoginView`, `AdminLoginView`, `ContactView`, and `PortalView`.
  - Added new reusable UI primitives to `components/ui/`:
    - `Modal`: Accessible backdrop blur dialog for applications.
    - `TabsList` & `TabsTrigger`: Pill-style tabbed view controls.
    - `Timeline`: Multi-column milestone and step sequence renderer.

### Branding & Content Realignment
- **100% Recruitment Agency Focus**:
  - Removed all consumer-facing Gemini AI mentions and replaced with executive search practices, candidate advocacy protocols, 14-day delivery SLAs, and 90-day placement warranties.
  - Replaced API latency labels with candidate shortlisting SLAs.
  - Aligned company identity universally to **The Automation Studio**.

### Aesthetic Modernization
- **Apple & Dell Enterprise Design Standard**:
  - Replaced high-contrast neon accents with deep obsidian/charcoal canvas (`#0b0d11`), slate containers (`#12161f`), and precision enterprise blue accents (`#0076ce` / `#2563eb`).
  - Implemented Apple SF Pro / Segoe UI typographic hierarchy with high-contrast text (`#f1f3f7` / `#9ba3af`).
  - Converted all containers from `max-w-7xl` boxes to edge-to-edge full width layouts (`w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20`).

---

## [2.0.0] - 2026-10-25

### Added
- GitHub-style interactive Mega Menu in `Navbar.tsx` with 3 flyouts:
  - Recruitment Practices
  - Employers & Candidates
  - Resources & Manual
- Dedicated Candidate Portal (`/candidate-login`) with simulated authentication and pipeline progress tracking.
- Dedicated Admin Operations Console (`/admin-login`) with security passkey and live in-memory telemetry queue.
- Interactive 2026 Tech Salary Guide (`/salary-guide`) across AI, Core Engineering, Security, and Executive C-Suite roles.
- Plain-language Layman and Developer documentation (`/documentation`).

---

## [1.0.0] - 2026-10-25

### Initial Release
- Initial Next.js 16 App Router application scaffolded with TypeScript and Tailwind CSS.
- Zero-DB server in-memory singleton state buffer (`globalStorage.inMemorySubmissions`).
- Core 15 recruitment agency routes initialized.
