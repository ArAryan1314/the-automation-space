# The Automation Studio — Recruitment Agency Website

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · TypeScript · **pnpm**

## Getting started

This project uses **pnpm** (pinned via the `packageManager` field in `package.json`).

```bash
npm install -g pnpm        # one-time (or: corepack enable pnpm)
pnpm install               # install dependencies from pnpm-lock.yaml
cp .env.example .env.local # optional — see "Environment variables"
pnpm dev                   # http://localhost:3000
```

Do not use `npm install` — it would create a conflicting `package-lock.json`.
Dependency build scripts are allow-listed in `pnpm-workspace.yaml` (`allowBuilds`).

## Commands

Run inside `recruitment-agency/`. The same names (`dev`, `build`, `start`, `lint`, `typecheck`, `check`)
also work from the parent `nextDev/` folder, which forwards them here.

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server (Turbopack) on port 3000 |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` / `pnpm lint:fix` | ESLint / ESLint with auto-fix |
| `pnpm typecheck` | TypeScript check (`tsc --noEmit`) |
| `pnpm check` | Typecheck + lint + build — run before deploying |
| `pnpm clean` | Delete the `.next` build cache |

From the parent `nextDev/` folder: `pnpm install` (graphify tooling), `pnpm install:app`
(install this app) and `pnpm graph:rebuild` (refresh the knowledge graph after code changes).

## Environment variables

Copy `.env.example` to `.env.local` (git-ignored). Every variable is optional.

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public, build time | Base URL for canonical and Open Graph links. Default `https://the-automation-space.com` |
| `GEMINI_API_KEY` | server only | Drafts personalised intake acknowledgements in `/api/ai-respond`. Empty = template reply |
| `GEMINI_MODEL` | server only | Gemini model for drafting. Default `gemini-2.5-flash` |

## Pages

Every route is registered in `src/lib/site.ts` (`SITE_PAGES`), which supplies its title, description and
canonical URL. The same list is shown in the **Site Pages** tab of `/documentation`.

| Route | View (`src/components/views/`) | Purpose |
|---|---|---|
| `/` | `HomeView` | Overview, hiring metrics, practices, outcomes, testimonials, FAQs, intake form |
| `/services` | `ServicesView` | Search practices and SLA standards |
| `/about` | `AboutView` | Founding story, values, timeline |
| `/team` | `TeamView` | Search partners and specialists |
| `/case-studies` | `CaseStudiesView` | Placement stories with metrics |
| `/contact` | `ContactView` | Offices, contact details, inquiry form |
| `/employers` | `EmployersView` | Hiring requisition form, engagement models, vetting standard |
| `/candidates` | `CandidatesView` | Confidential candidate registration |
| `/jobs` | `JobsView` | Searchable job board with quick-apply modal |
| `/salary-guide` | `SalaryGuideView` | 2026 compensation tables and insights |
| `/process` | `ProcessView` | 6-stage vetting process, 90-day guarantee |
| `/faq` | `FAQView` | Frequently asked questions |
| `/documentation` | `DocumentationView` | User manual, page directory, architecture, developer setup |
| `/candidate-login` | `CandidateLoginView` | Candidate portal (demo login) |
| `/admin-login` | `AdminLoginView` | Admin console of intake submissions (demo passkey) |
| `/portal` | `PortalView` | Developer monitor of stored intakes |
| `/api/ai-respond` | route handler | `POST` validates and stores an intake; `GET` lists stored intakes |

> The candidate and admin logins are front-end demos: any credentials are accepted, and
> `GET /api/ai-respond` is not access-controlled. Add real authentication before storing real data.
> Intakes live in server memory and are lost on restart.

## Project structure

```
src/app/              routes (thin page.tsx files) + layout, globals.css, api/ai-respond
src/components/layout/ Navbar, Footer
src/data/             static content (jobs, team, services, stories, FAQs)
src/components/ui/    design-system primitives (Button, Card, Badge, Section, PageHero, IconBox …)
src/components/views/ one view component per page
src/lib/site.ts       site config + page registry + pageMetadata()
src/lib/utils.ts      cn() class-name helper
```

See **`STYLE_GUIDE.md`** for the design system and **`CHANGELOG.md`** for release history.

## Adding a page

1. Create `src/components/views/MyView.tsx` using primitives from `@/components/ui`.
2. Add an entry to `SITE_PAGES` in `src/lib/site.ts`.
3. Create `src/app/my-route/page.tsx`:
   ```tsx
   import { MyView } from "@/components/views/MyView";
   import { pageMetadata } from "@/lib/site";

   export const metadata = pageMetadata("myKey");

   export default function MyPage() {
     return <MyView />;
   }
   ```

## Deploying

Hosts such as Vercel detect pnpm from `pnpm-lock.yaml`. Use install command
`pnpm install --frozen-lockfile` and build command `pnpm build`, and set the environment variables above
in the host's dashboard.

For PHP-only GoDaddy hosting, run `pnpm build:php` from PowerShell and follow `../../godaddy-php/README_GODADDY.txt`.
It produces a static copy of the site plus a PHP version of `/api/ai-respond`, whose classes live in
`godaddy-php/api/src`; there, `GET` requires the admin key (`ADMIN_KEY` or `godaddy-php/api/config.php`), and intakes
are saved to a file instead of server memory.
