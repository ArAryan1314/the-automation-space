import Link from "next/link";
import { Zap, Mail, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

const FOOTER_COLUMNS = [
  {
    title: "Search Practices",
    links: [
      { href: "/services", label: "Executive AI Search" },
      { href: "/services", label: "Core Distributed Systems" },
      { href: "/services", label: "Embedded Talent Squads" },
      { href: "/employers", label: "Employer Hiring Engine" },
      { href: "/process", label: "6-Stage Vetting Protocol" },
    ],
  },
  {
    title: "Candidates",
    links: [
      { href: "/jobs", label: "Browse Curated Jobs" },
      { href: "/candidates", label: "Confidential Representation" },
      { href: "/salary-guide", label: "2026 Tech Salary Guide" },
      { href: "/candidate-login", label: "Candidate Portal Login" },
      { href: "/faq", label: "Candidate FAQs" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "/about", label: "About Our Agency" },
      { href: "/team", label: "Executive Partners" },
      { href: "/case-studies", label: "Placement Case Studies" },
      { href: "/documentation", label: "Layman Guide & Manual" },
      { href: "/admin-login", label: "Admin Console" },
      { href: "/portal", label: "Live State Telemetry" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto text-sm">
      {/* Top CTA Banner */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 panel-glow px-6 py-12 sm:px-12 shadow-lift">
          <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Ready to Accelerate Your Technical & Executive Hiring?
              </h3>
              <p className="text-body text-[15px] mt-2 leading-relaxed">
                Connect directly with our recruitment practice heads or submit your active requisition for direct partner review.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link href="/employers" className="w-full md:w-auto">
                <Button size="lg" className="w-full md:w-auto">
                  <span>Start Hiring Requisition</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/jobs" className="w-full md:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full md:w-auto"
                >
                  Explore Open Roles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="border-t border-border bg-card">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
            {/* Brand Info */}
            <div className="col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-extrabold text-lg text-foreground">The Automation Studio</span>
              </Link>
              <p className="text-muted-foreground leading-relaxed max-w-sm">
                A technical recruitment agency specializing in Executive AI & Machine Learning, Distributed Infrastructure, and Embedded Engineering talent scaleups.
              </p>
              <div className="space-y-2.5 text-body">
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>555 California St, Suite 4800, San Francisco, CA 94104</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href={`mailto:${SITE.email}`} className="hover:text-primary transition-colors">
                    {SITE.email}
                  </a>
                </div>
              </div>
            </div>

            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title} className="space-y-4">
                <p className="text-foreground font-semibold">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-muted-foreground hover:text-primary transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground text-[13px]">
            <p>© {new Date().getFullYear()} The Automation Studio LLC. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                TLS 1.3 encrypted intake
              </span>
              <Link href="/documentation" className="hover:text-primary">Architecture Manual</Link>
              <Link href="/candidate-login" className="hover:text-primary">Candidate Gateway</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
