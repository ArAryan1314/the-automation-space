"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Lock,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Server,
  LayoutGrid,
  Code2,
  ArrowUpRight,
} from "lucide-react";
import {
  Section,
  PageHero,
  Badge,
  Card,
  CardTitle,
  CardDescription,
  TabsList,
  TabsTrigger,
  IconBox,
} from "@/components/ui";
import { SITE_PAGES, type PageGroup, type SitePage } from "@/lib/site";

const PAGE_GROUPS: PageGroup[] = ["Agency", "Employers & Candidates", "Resources", "Portals"];
const ALL_PAGES: SitePage[] = Object.values(SITE_PAGES);

const DEV_COMMANDS = [
  { cmd: "pnpm install", desc: "Install dependencies from pnpm-lock.yaml" },
  { cmd: "pnpm dev", desc: "Start the development server on http://localhost:3000" },
  { cmd: "pnpm build", desc: "Create an optimized production build" },
  { cmd: "pnpm start", desc: "Serve the production build" },
  { cmd: "pnpm lint", desc: "Run ESLint (pnpm lint:fix to auto-fix)" },
  { cmd: "pnpm typecheck", desc: "Run the TypeScript compiler without emitting files" },
  { cmd: "pnpm check", desc: "Typecheck, lint and build in one step (run before deploying)" },
  { cmd: "pnpm clean", desc: "Delete the .next build cache" },
];

const ENV_VARS = [
  { name: "NEXT_PUBLIC_SITE_URL", desc: "Public site URL used for canonical and Open Graph links (applied at build time)." },
  { name: "GEMINI_API_KEY", desc: "Optional, server-only. Enables personalised intake acknowledgements; a template reply is used when empty." },
  { name: "GEMINI_MODEL", desc: "Optional, server-only. Gemini model for drafting replies (default gemini-2.5-flash)." },
];

const codeClass = "rounded-md bg-surface border border-border px-1.5 py-0.5 font-mono text-[13px] text-foreground";

export function DocumentationView() {
  const [activeTab, setActiveTab] = useState<"layman" | "pages" | "architecture" | "portals" | "developer" | "seo">("layman");

  const tabOptions = [
    { id: "layman", label: "Layman's Guide" },
    { id: "pages", label: "Site Pages" },
    { id: "portals", label: "Candidate vs Admin Portals" },
    { id: "architecture", label: "Architecture & API" },
    { id: "developer", label: "Developer Setup" },
    { id: "seo", label: "SEO Standards" },
  ];

  return (
    <div>
      {/* SECTION 1: Page Header */}
      <PageHero
        badge={
          <Badge variant="default" className="py-1 px-3.5">
            <BookOpen className="h-3.5 w-3.5" />
            <span>The Automation Studio · Layman & Technical Manual</span>
          </Badge>
        }
        title="System Documentation & User Manual"
        description="Written in everyday language for laymen, with full technical architecture specifications for developers and operations teams."
      >
        {/* Tab Switcher using UI Tabs */}
        <div className="flex justify-center mt-10">
          <TabsList>
            {tabOptions.map((tab) => (
              <TabsTrigger
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </PageHero>

      {/* SECTION 2: Dynamic Documentation Content */}
      <Section variant="muted">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 sm:p-10 space-y-8 hover:shadow-soft hover:border-border">
            {/* TAB 1: Layman Guide */}
            {activeTab === "layman" && (
              <div className="space-y-8 animate-fade-up">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <IconBox>
                    <Zap />
                  </IconBox>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">The Layman&apos;s Guide to The Automation Studio</CardTitle>
                    <CardDescription className="mt-1">Clear, non-technical explanation of how this entire portal works.</CardDescription>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  <div className="py-6 first:pt-0 space-y-2">
                    <h2 className="text-base font-bold text-foreground">1. What happens when an intake is submitted?</h2>
                    <p className="text-[15px] text-body leading-relaxed max-w-prose">
                      When a candidate or company submits a message, it is validated and dispatched immediately to our executive search team. The submission is stamped with priority classification and placed directly into our secure partner review queue for immediate evaluation.
                    </p>
                  </div>

                  <div className="py-6 space-y-2">
                    <h2 className="text-base font-bold text-foreground">2. Where and how is agency data hosted?</h2>
                    <p className="text-[15px] text-body leading-relaxed max-w-prose">
                      Candidate resumes, compensation profiles, and client hiring requisitions are hosted in isolated enterprise server infrastructure with TLS 1.3 encryption in transit and AES-256 encryption at rest. Intake records are kept in private storage that is not publicly accessible.
                    </p>
                  </div>

                  <div className="py-6 space-y-2">
                    <h2 className="text-base font-bold text-foreground">3. Who evaluates candidate resumes or employer jobs?</h2>
                    <p className="text-[15px] text-body leading-relaxed max-w-prose">
                      Every requisition is reviewed personally by experienced technical search directors who have engineering backgrounds. Candidates are never spammed, and corporate clients only meet thoroughly pre-vetted engineers.
                    </p>
                  </div>

                  <div className="py-6 last:pb-0 space-y-2">
                    <h2 className="text-base font-bold text-foreground">4. Why are the Candidate and Admin portals separate?</h2>
                    <p className="text-[15px] text-body leading-relaxed max-w-prose">
                      Candidates have their own private area (<code className="rounded-md bg-surface border border-border px-1.5 py-0.5 font-mono text-[13px] text-foreground">/candidate-login</code>) to check their interview progress and view salary guides. Agency directors have a protected control room (<code className="rounded-md bg-surface border border-border px-1.5 py-0.5 font-mono text-[13px] text-foreground">/admin-login</code>) to inspect all live data without mixing client and applicant records.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Site Pages directory */}
            {activeTab === "pages" && (
              <div className="space-y-8 animate-fade-up">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <IconBox>
                    <LayoutGrid />
                  </IconBox>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">Site Pages Directory</CardTitle>
                    <CardDescription className="mt-1">All {ALL_PAGES.length} pages on the site and what each one is for.</CardDescription>
                  </div>
                </div>

                {PAGE_GROUPS.map((group) => (
                  <div key={group} className="space-y-3">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">{group}</h2>
                    <div className="divide-y divide-border rounded-xl border border-border">
                      {ALL_PAGES.filter((pg) => pg.group === group).map((pg) => (
                        <Link
                          key={pg.path}
                          href={pg.path}
                          className="group flex items-start justify-between gap-4 p-4 hover:bg-surface/70 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[15px] font-semibold text-foreground group-hover:text-primary-hover">{pg.title}</span>
                              <code className={codeClass}>{pg.path}</code>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{pg.description}</p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-subtle-foreground group-hover:text-primary flex-shrink-0 mt-1" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: Portals & Security */}
            {activeTab === "portals" && (
              <div className="space-y-8 animate-fade-up">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <IconBox>
                    <Lock />
                  </IconBox>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">Separation of Portals (Candidate vs. Admin)</CardTitle>
                    <CardDescription className="mt-1">Strict security boundaries preventing data cross-contamination.</CardDescription>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 space-y-2">
                    <h2 className="text-base font-bold text-foreground flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      <span>Candidate Portal (/candidate-login)</span>
                    </h2>
                    <p className="text-[15px] text-body leading-relaxed max-w-prose">
                      Job seekers log in securely to monitor the status of their active applications (Intake Received, Partner Evaluated, Partner Review, Client Onsite) and review 2026 salary benchmarks. Candidates can never see other applicants&apos; profiles or internal agency notes.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 space-y-2">
                    <h2 className="text-base font-bold text-foreground flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-accent" />
                      <span>Admin Operations Console (/admin-login)</span>
                    </h2>
                    <p className="text-[15px] text-body leading-relaxed max-w-prose">
                      Protected with an admin username and password. Admins add, edit and delete the job postings shown on the public jobs page, and review contacts, job applications and intake submissions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Technical Architecture */}
            {activeTab === "architecture" && (
              <div className="space-y-8 animate-fade-up">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <IconBox>
                    <Terminal />
                  </IconBox>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">Technical Architecture & Hosting Infrastructure</CardTitle>
                    <CardDescription className="mt-1">Next.js App Router, edge server middleware, and encrypted intake queue.</CardDescription>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-surface p-5 rounded-xl border border-border font-mono text-xs text-foreground overflow-x-auto whitespace-nowrap leading-relaxed">
                    <span className="text-primary block mb-2 font-bold">{"// Data Flow & Hosting Isolation"}</span>
                    [Client Intake Form UI] ──(POST /api/ai-respond)──&gt; [Zod Schema Validation]<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>
                    &nbsp;&nbsp;[Secure Submission Store]&nbsp;&nbsp;&nbsp; &lt;─── [Prepend to Secure Queue] ─┼───&gt; [Partner Notification Engine]<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(GET /api/ai-respond)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Immediate Acknowledgement)<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└────────────────────────&gt; [Live Admin Monitor UI] &lt;──────────────┘
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3.5 rounded-xl border border-border bg-card p-5">
                      <IconBox size="sm" tone="sky">
                        <Server />
                      </IconBox>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-foreground">Hosting Layer</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">Secure server API with private, access-controlled storage</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3.5 rounded-xl border border-border bg-card p-5">
                      <IconBox size="sm" tone="accent">
                        <ShieldCheck />
                      </IconBox>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-foreground">Data Security</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">Zero third-party exposure, strict NDA compliance, and ephemeral telemetry</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Developer Setup */}
            {activeTab === "developer" && (
              <div className="space-y-8 animate-fade-up">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <IconBox>
                    <Code2 />
                  </IconBox>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">Developer Setup & Commands</CardTitle>
                    <CardDescription className="mt-1">Next.js 16, React 19, Tailwind CSS v4 and TypeScript, managed with pnpm.</CardDescription>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-base font-bold text-foreground">Commands</h2>
                  <p className="text-sm text-muted-foreground">
                    Run from the <code className={codeClass}>recruitment-agency</code> folder (the same names also work from the parent folder). Install pnpm once with <code className={codeClass}>npm install -g pnpm</code>.
                  </p>
                  <div className="divide-y divide-border rounded-xl border border-border">
                    {DEV_COMMANDS.map((c) => (
                      <div key={c.cmd} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 p-4">
                        <code className={`${codeClass} w-fit sm:w-40 flex-shrink-0`}>{c.cmd}</code>
                        <span className="text-sm text-body">{c.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-base font-bold text-foreground">Environment variables</h2>
                  <p className="text-sm text-muted-foreground">
                    Copy <code className={codeClass}>.env.example</code> to <code className={codeClass}>.env.local</code>. Every variable is optional.
                  </p>
                  <div className="divide-y divide-border rounded-xl border border-border">
                    {ENV_VARS.map((v) => (
                      <div key={v.name} className="p-4 space-y-1">
                        <code className={codeClass}>{v.name}</code>
                        <p className="text-sm text-body leading-relaxed">{v.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-base font-bold text-foreground">Adding a page</h2>
                  <ol className="list-decimal pl-5 space-y-1.5 text-sm text-body leading-relaxed">
                    <li>Create the view in <code className={codeClass}>src/components/views/</code> using the primitives from <code className={codeClass}>@/components/ui</code> (see STYLE_GUIDE.md).</li>
                    <li>Register the route, title and description in <code className={codeClass}>src/lib/site.ts</code>.</li>
                    <li>Add <code className={codeClass}>src/app/&lt;route&gt;/page.tsx</code> that exports <code className={codeClass}>pageMetadata(&quot;key&quot;)</code> and renders the view.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* TAB 4: SEO Standards */}
            {activeTab === "seo" && (
              <div className="space-y-8 animate-fade-up">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <IconBox>
                    <ShieldCheck />
                  </IconBox>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">SEO Standards & Compliance Checklist</CardTitle>
                    <CardDescription className="mt-1">Search engine best practices applied across all {ALL_PAGES.length} pages.</CardDescription>
                  </div>
                </div>

                <ul className="space-y-4 text-[15px] text-body leading-relaxed max-w-prose">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Single Semantic H1:</strong> Every single page contains exactly one `&lt;h1&gt;` with logical `&lt;h2&gt;` and `&lt;h3&gt;` headings.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Global Metadata API:</strong> Every page sets its own title, description, canonical URL and OpenGraph tags from the page registry in src/lib/site.ts.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Design Powerhouse:</strong> Modular UI components eliminate CSS repetition and guarantee consistent visual tokens.</span>
                  </li>
                </ul>
              </div>
            )}
          </Card>
        </div>
      </Section>
    </div>
  );
}
