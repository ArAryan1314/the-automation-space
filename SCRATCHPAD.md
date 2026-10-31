# Developer Scratchpad: Architectural State & Operational Notes

## Current Environment Status
- **Application Directory**: `d:\Free lancing\nextDev\recruitment-agency`
- **Active Node Version**: `v24.16.0`
- **Framework**: Next.js 16.4.3 (App Router with Turbopack)
- **Styling**: Tailwind CSS v4 with CVA Component Tokens — "Neon Automation" dark theme (see `STYLE_GUIDE.md`)
- **Package Manager**: pnpm 12 (`pnpm-lock.yaml`, `pnpm-workspace.yaml` allowBuilds) — do not use npm install
- **Dev Server**: `pnpm dev` → `http://localhost:3000`
- **Production Build Status**: Verified clean with `pnpm build` (19 routes generated)

## Route-to-Component Mapping Table
Each page exports `metadata = pageMetadata(key)`; the key is its entry in `SITE_PAGES` (`src/lib/site.ts`).

| Route | Page File (`src/app/`) | View (`src/components/views/`) | `SITE_PAGES` key | UI Components Used |
|---|---|---|---|---|
| `/` | `src/app/page.tsx` | `HomeView.tsx` | `home` | `Button`, `Card`, `CardTitle`, `CardDescription`, `Badge`, `Input`, `Textarea`, `Label`, `Section`, `SectionHeader`, `Heading`, `Text`, `StatsGrid`, `Accordion`, `AlertBanner`, `IconBox` |
| `/jobs` | `src/app/jobs/page.tsx` | `JobsView.tsx` | `jobs` | `Section`, `PageHero`, `Badge`, `Card`, `CardTitle`, `CardDescription`, `Button`, `Input`, `Label`, `Modal`, `IconBox`, `TabsList`, `TabsTrigger` |
| `/employers` | `src/app/employers/page.tsx` | `EmployersView.tsx` | `employers` | `Section`, `PageHero`, `SectionHeader`, `Heading`, `Text`, `Badge`, `Card`, `CardTitle`, `CardDescription`, `Button`, `Input`, `Textarea`, `Label`, `IconBox` |
| `/candidates` | `src/app/candidates/page.tsx` | `CandidatesView.tsx` | `candidates` | `Section`, `PageHero`, `SectionHeader`, `Heading`, `Text`, `Badge`, `Card`, `CardTitle`, `CardDescription`, `Button`, `Input`, `Textarea`, `Label`, `IconBox` |
| `/services` | `src/app/services/page.tsx` | `ServicesView.tsx` | `services` | `Section`, `SectionHeader`, `PageHero`, `Badge`, `Card`, `CardTitle`, `CardDescription`, `Button`, `IconBox` |
| `/about` | `src/app/about/page.tsx` | `AboutView.tsx` | `about` | `Section`, `SectionHeader`, `PageHero`, `Heading`, `Text`, `Badge`, `Card`, `CardTitle`, `CardDescription`, `Button`, `Timeline`, `IconBox` |
| `/case-studies` | `src/app/case-studies/page.tsx` | `CaseStudiesView.tsx` | `caseStudies` | `Section`, `PageHero`, `Heading`, `Text`, `Badge`, `Card`, `CardTitle`, `Button`, `IconBox` |
| `/salary-guide` | `src/app/salary-guide/page.tsx` | `SalaryGuideView.tsx` | `salaryGuide` | `Section`, `SectionHeader`, `PageHero`, `Badge`, `Card`, `CardTitle`, `CardDescription`, `TabsList`, `TabsTrigger`, `IconBox` |
| `/team` | `src/app/team/page.tsx` | `TeamView.tsx` | `team` | `Section`, `PageHero`, `Heading`, `Text`, `Badge`, `Card`, `CardTitle`, `CardDescription`, `IconBox` |
| `/process` | `src/app/process/page.tsx` | `ProcessView.tsx` | `process` | `Section`, `PageHero`, `Heading`, `Text`, `Badge`, `Card`, `CardTitle`, `CardDescription`, `Button` |
| `/faq` | `src/app/faq/page.tsx` | `FAQView.tsx` | `faq` | `Section`, `PageHero`, `Heading`, `Text`, `Badge`, `Button`, `Accordion`, `IconBox` |
| `/documentation` | `src/app/documentation/page.tsx` | `DocumentationView.tsx` | `documentation` | `Section`, `PageHero`, `Badge`, `Card`, `CardTitle`, `CardDescription`, `TabsList`, `TabsTrigger`, `IconBox` |
| `/candidate-login` | `src/app/candidate-login/page.tsx` | `CandidateLoginView.tsx` | `candidateLogin` | `Section`, `Heading`, `Text`, `Badge`, `Card`, `CardTitle`, `CardDescription`, `Button`, `Input`, `Label`, `IconBox`, `StatsGrid` |
| `/admin-login` | `src/app/admin-login/page.tsx` | `AdminLoginView.tsx` | `adminLogin` | `Section`, `Heading`, `Text`, `Badge`, `Card`, `CardTitle`, `CardDescription`, `Button`, `Input`, `Label`, `IconBox`, `StatsGrid` |
| `/contact` | `src/app/contact/page.tsx` | `ContactView.tsx` | `contact` | `Section`, `PageHero`, `Badge`, `Card`, `CardTitle`, `CardDescription`, `Button`, `Input`, `Textarea`, `Label`, `IconBox` |
| `/portal` | `src/app/portal/page.tsx` | `PortalView.tsx` | `portal` | `Section`, `Heading`, `Text`, `Badge`, `Card`, `CardTitle`, `CardDescription`, `Button`, `Input`, `Textarea`, `Label`, `IconBox`, `StatsGrid` |

## Commands & Environment
- Commands: `pnpm dev` · `pnpm build` · `pnpm start` · `pnpm lint` (`lint:fix`) · `pnpm typecheck` · `pnpm check` · `pnpm clean` (see README).
- Env: `NEXT_PUBLIC_SITE_URL`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `DATA_DIR` — documented in `.env.example`.
- Admin login: `pnpm admin:create [username] [password]` writes the hash to `.env.local`.
- After code changes: `pnpm graph:rebuild` from the parent `nextDev/` folder.
- GitHub: this folder is the repo root (`ArAryan1314/the-automation-space`, public). The scheduled task `AutomationSpace GitHub Sync` runs `pnpm sync` every 15 minutes while signed in; its log is `.git/github-sync.log`. Never commit `.env*`, `.data/` or the GoDaddy bundle.
- GoDaddy bundle: `pnpm build:godaddy` writes `godaddy-dist/` and `godaddy-deployment.zip` (flat `node_modules`, no links). Tested by running it extracted on Windows only, not yet on the Linux host.

## Data Persistence & Hosting Architecture
1. **JSON files, no database**:
   - `jobs.json`, `contacts.json`, `applications.json`, `submissions.json`, `candidates.json`, `login-attempts.json`, `candidate-login-attempts.json`, `candidate-register-attempts.json`.
   - Saved to `.data/` or `DATA_DIR` (`src/lib/server/store.ts`).
   - `jobs.json` is seeded once from `src/data/seed-jobs.json`. A file that already exists is never reseeded, so deleted jobs stay deleted.
2. **Security & Confidentiality Protocol**:
   - TLS 1.3 encryption in transit for all candidate and corporate inputs.
   - Zero third-party candidate profile disclosures without written authorization.
   - Dual portal isolation: Candidate self-service cannot inspect administrative candidate queues or internal fee metrics.
3. **Admin auth**: `/admin-login` is enforced on the server with a signed HttpOnly cookie. Reading contacts, applications and intakes, and changing jobs, all require it.
4. **Candidate auth**: `/candidate-login` accounts live in `candidates.json` with a PBKDF2 hash and start as `pending`. Only `approved` accounts get a session, and status is re-read on every request (`src/lib/server/candidates.ts`).
5. **Known limitations**: No emails are sent, so the super admin must check the console for new requests and candidates are not told of a decision. There is no candidate password reset. Applications match an account by email without proving the application's sender owned it. The public contact, apply and intake forms have no spam protection beyond field validation. The super admin has one shared login, with no per-user accounts or audit log.
