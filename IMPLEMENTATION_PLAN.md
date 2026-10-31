# Implementation Plan: Component-Driven Architecture & Enterprise Modernization

## 1. Overview
The Automation Studio platform was refactored from page-level inline implementations into a fully centralized, modular **Component-Driven Architecture** adhering to industry UI library design patterns (similar to `shadcn/ui`). Every route now delegates rendering exclusively to dedicated UI components and view controllers.

## 2. Directory Architecture
```
recruitment-agency/src/        (public/, scripts/ and config files stay at the project root)
├── components/
│   ├── layout/                # Navbar, Footer
│   │
│   ├── ui/                    # Base UI Primitives (Design System Tokens)
│   │   ├── button.tsx         # Apple / Dell precision buttons with active states
│   │   ├── card.tsx           # Obsidian backdrop blur cards & header/content slots
│   │   ├── badge.tsx          # Status, priority & practice pill badges
│   │   ├── input.tsx          # High-contrast inputs & textareas
│   │   ├── modal.tsx          # Dialog/drawer with backdrop blur & close triggers
│   │   ├── tabs.tsx           # Segmented role & category pill switchers
│   │   ├── timeline.tsx       # Multi-column step & milestone timeline trackers
│   │   ├── accordion.tsx      # Smooth collapsing FAQ panels
│   │   ├── stats-grid.tsx     # 3-column metric cards with KPI callouts
│   │   ├── alert-banner.tsx   # Success, error, and notice telemetry alerts
│   │   ├── section.tsx        # Viewport-wide section wrapper with fluid padding
│   │   ├── typography.tsx     # Semantic Heading and Text elements
│   │   ├── icon-box.tsx       # Tinted icon tiles (primary/accent/sky/amber/rose/neutral)
│   │   └── index.ts           # Central barrel export
│   │
│   └── views/                 # Modular Page View Components
│       ├── HomeView.tsx       # Hero, KPI grid, live intake form, and practice previews
│       ├── JobsView.tsx       # Career search, department/type filters, quick apply modal
│       ├── EmployersView.tsx  # Search mandate intake, 3 engagement models, 4 vetting pillars
│       ├── CandidatesView.tsx # Confidential intake, career perk cards, NDA notices
│       ├── ServicesView.tsx   # Search practices matrix & SLA standards
│       ├── AboutView.tsx      # Heritage timeline, core values, and founding story
│       ├── CaseStudiesView.tsx# Enterprise placement stories & metric counters
│       ├── SalaryGuideView.tsx# Interactive 2026 tech compensation benchmarks
│       ├── TeamView.tsx       # Executive partners directory & specialist credentials
│       ├── ProcessView.tsx    # 6-stage candidate vetting protocol & 90-day guarantee
│       ├── FAQView.tsx        # Technical recruitment FAQs with Accordion component
│       ├── DocumentationView.tsx # Layman-friendly operational manual with tabs
│       ├── CandidateLoginView.tsx# Candidate portal with pipeline status tracking
│       ├── AdminLoginView.tsx # Executive operations console with live memory telemetry
│       ├── ContactView.tsx    # Practice office directory & direct inquiry forms
│       └── PortalView.tsx     # Developer live in-memory telemetry monitor
│
├── data/                      # Static content (jobs, team, services, stories, FAQs)
│
├── lib/
│   ├── site.ts                # Site config, SITE_PAGES registry, pageMetadata() helper
│   └── utils.ts               # cn() class-name helper
│
├── app/                       # Pure Route Handlers (export pageMetadata + render a View)
│   ├── page.tsx               # -> <HomeView />
│   ├── jobs/page.tsx          # -> <JobsView />
│   ├── employers/page.tsx     # -> <EmployersView />
│   ├── candidates/page.tsx    # -> <CandidatesView />
│   ├── services/page.tsx      # -> <ServicesView />
│   ├── about/page.tsx         # -> <AboutView />
│   ├── case-studies/page.tsx  # -> <CaseStudiesView />
│   ├── salary-guide/page.tsx  # -> <SalaryGuideView />
│   ├── team/page.tsx          # -> <TeamView />
│   ├── process/page.tsx       # -> <ProcessView />
│   ├── faq/page.tsx           # -> <FAQView />
│   ├── documentation/page.tsx # -> <DocumentationView />
│   ├── candidate-login/page.tsx# -> <CandidateLoginView />
│   ├── admin-login/page.tsx   # -> <AdminLoginView />
│   ├── contact/page.tsx       # -> <ContactView />
│   ├── portal/page.tsx        # -> <PortalView />
│   └── api/ai-respond/route.ts# Zero-DB in-memory persistence & acknowledgement API
```

## 3. Key Design System Enhancements
- **Color Aesthetics (v4.0)**: "Neon Automation" theme — `#050b14` canvas, `#0b1726` cards, cyan `#22d3ee` primary, electric blue `#60a5fa` accent, `#eaf6fb` headings, `#c3d3e2` body text. All colors are semantic tokens in `src/app/globals.css`; see `STYLE_GUIDE.md`. (Superseded the v3.0 "Fresh Light" palette.)
- **Typography**: Plus Jakarta Sans via `next/font/google`.
- **Tooling**: pnpm (`pnpm-lock.yaml`), `pnpm typecheck` / `pnpm lint` / `pnpm build`.
- **Layout Standards**: Full-width fluid viewports across every screen (`w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20`) eliminating narrow boxed constraints.
- **Data Protection**: Documented TLS 1.3 encrypted transit, isolated server memory buffers, zero third-party disclosure, and strict NDA protocols.
