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
| `pnpm sync` | Commit local changes and push them to GitHub (see "GitHub sync and CI") |
| `pnpm sync:check` | Show whether a sync would pass its safety checks, without changing anything |
| `pnpm sync:install` | Schedule `pnpm sync` every 15 minutes on Windows |

From the parent `nextDev/` folder: `pnpm install` (graphify tooling), `pnpm install:app`
(install this app) and `pnpm graph:rebuild` (refresh the knowledge graph after code changes).

## Environment variables

Copy `.env.example` to `.env.local` (git-ignored). Only the admin login is required, and only for `/admin-login` to work.

| Variable | Scope | Purpose |
|---|---|---|
| `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` | server only | Admin login. Written by `pnpm admin:create`; do not type them by hand |
| `DATA_DIR` | server only | Folder for stored jobs, contacts, applications and intakes. Default `.data` |
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
| `/candidate-login` | `CandidateLoginView` | Candidate account requests and sign-in; needs super admin approval, then shows the candidate's applications |
| `/admin-login` | `AdminLoginView` | Super admin console: candidate approvals, job postings, contacts, applications and intakes |
| `/portal` | `PortalView` | Developer intake form; its list only fills in when signed in as admin |
| `/api/admin-session` | route handler | `GET` session status; `POST` with `action` `login` or `logout` |
| `/api/candidate-session` | route handler | `GET` the signed-in candidate and their applications; `POST` with `action` `register`, `login` or `logout` |
| `/api/candidates` | route handler | Needs an admin. `GET` lists accounts; `POST` with `action` `approve`, `reject` or `delete` |
| `/api/jobs` | route handler | `GET` is public; `POST` with `action` `create`, `update` or `delete` needs an admin |
| `/api/contacts` | route handler | `POST` without `action` is the contact form; `GET` and `action` `create` or `delete` need an admin |
| `/api/applications` | route handler | `POST` without `action` is Quick Apply; `GET` and `action` `delete` need an admin |
| `/api/ai-respond` | route handler | `POST` validates and stores an intake; `GET` lists stored intakes and needs an admin |

> Create the super admin login with `pnpm admin:create [email] [password]`. Without a password, a strong one is generated
> and printed once. Data is saved as JSON files in `.data/` (or `DATA_DIR`).
> Candidate accounts start as pending and cannot sign in until approved in the console's Pending candidates tab.
> Rejecting or deleting an account ends its session on the next request. No emails are sent, so check that tab for new requests.

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

## GitHub sync and CI

This folder is the root of the public repository `ArAryan1314/the-automation-space`.

- **Branches:** features go on `feature/<name>` and fixes on `bugfix/<name>`, and reach `main` through a pull request. See `CONTRIBUTING.md`.
- **Sync:** the Windows task `AutomationSpace GitHub Sync` (set up by `pnpm sync:install`) runs `pnpm sync` every 15 minutes
  while you are signed in. It publishes every saved change on the `feature/` or `bugfix/` branch you are on, including unfinished
  work, and never commits to `main`. Results are logged to `.git/github-sync.log`.
- **Safety:** a sync stops without committing if it would include `.env*` (except `.env.example`), `.data/`, the GoDaddy bundle,
  a key file, a value from `.env.local`, or something that looks like an API key.
- **Stored data:** form submissions stay in `.data/` or `DATA_DIR` and are never sent to GitHub, because the repository is public.
- **CI:** each push and pull request builds the Linux deployment bundle, runs typecheck and lint, starts the bundle and requests key routes.
  Download the result from the run's `godaddy-linux-bundle` artifact. It has no real secrets, so set the variables on the host.

To stop syncing, run `Unregister-ScheduledTask -TaskName 'AutomationSpace GitHub Sync' -Confirm:$false` in PowerShell.

## Deploying

Hosts such as Vercel detect pnpm from `pnpm-lock.yaml`. Use install command
`pnpm install --frozen-lockfile` and build command `pnpm build`, and set the environment variables above
in the host's dashboard.
