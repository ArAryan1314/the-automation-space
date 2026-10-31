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
- Env: `NEXT_PUBLIC_SITE_URL`, `GEMINI_API_KEY`, `GEMINI_MODEL` — documented in `.env.example`.
- After code changes: `pnpm graph:rebuild` from the parent `nextDev/` folder.
- GoDaddy bundle: `pnpm build:godaddy` writes `godaddy-dist/` and `godaddy-deployment.zip` (flat `node_modules`, no links). Tested by running it extracted on Windows only, not yet on the Linux host.
- PHP hosting bundle: `pnpm build:php` writes `../../godaddy-php/` and `../../godaddy-php.zip` (static export + `api/ai-respond.php`). Run it from PowerShell: under Git Bash the final zip step fails because Git's `tar` cannot handle the `D:\` path. Change app code here, never the generated HTML there. Any change to `src/app/api/ai-respond/route.ts` must be mirrored in the PHP classes under `godaddy-php/api/src` (`api/ai-respond.php` only wires them together). Tested on XAMPP Apache 2.4 / PHP 8.2 and standalone PHP 7.4, not yet on GoDaddy.

## Data Persistence & Hosting Architecture
1. **Server Lifecycle Memory (`globalStorage.inMemorySubmissions`)**:
   - Zero external database requirements for session runtime.
   - Intakes are stored in Node.js server singleton state.
   - Real-time polling via `/api/ai-respond` (GET / POST).
2. **Security & Confidentiality Protocol**:
   - TLS 1.3 encryption in transit for all candidate and corporate inputs.
   - Zero third-party candidate profile disclosures without written authorization.
   - Dual portal isolation: Candidate self-service cannot inspect administrative candidate queues or internal fee metrics.
3. **Known limitation**: logins are front-end demos (any credentials accepted) and the Node route's `GET /api/ai-respond` is not access-controlled (the PHP API requires the admin key). Add server-side auth before handling real candidate data.
