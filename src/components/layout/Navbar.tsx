"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Zap,
  Menu,
  X,
  ChevronDown,
  Bot,
  Cpu,
  Workflow,
  Users,
  Building2,
  Briefcase,
  DollarSign,
  BookOpen,
  HelpCircle,
  Lock,
  ArrowRight,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconBox, type IconBoxProps } from "@/components/ui/icon-box";
import { cn } from "@/lib/utils";

type MenuKey = "practices" | "talent" | "resources";

interface MenuLink {
  href: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  tone: IconBoxProps["tone"];
}

const MENUS: Record<
  MenuKey,
  { label: string; heading: string; headerLink?: { href: string; label: string }; headerNote?: string; links: MenuLink[] }
> = {
  practices: {
    label: "Recruitment Practices",
    heading: "Specialized Technical Search Practices",
    headerLink: { href: "/services", label: "Explore All Practices" },
    links: [
      {
        href: "/services",
        title: "Executive AI & ML Search",
        desc: "Retained headhunting for Staff/VP AI Researchers, LLM Infrastructure, and PyTorch specialists.",
        icon: <Bot />,
        tone: "primary",
      },
      {
        href: "/services",
        title: "Core Systems & Low-Latency",
        desc: "Placing top 1% engineers in Rust, Go, distributed brokers, and cloud security enclaves.",
        icon: <Cpu />,
        tone: "sky",
      },
      {
        href: "/services",
        title: "Embedded Talent Squads (RPO)",
        desc: "Turnkey hiring squads embedded in your Slack to close 5-20 engineering hires per quarter.",
        icon: <Workflow />,
        tone: "accent",
      },
      {
        href: "/services",
        title: "C-Suite & Board Leadership",
        desc: "Confidential board-level retained search for Chief Technology Officers and VP of Engineering.",
        icon: <Building2 />,
        tone: "energy",
      },
    ],
  },
  talent: {
    label: "Employers & Candidates",
    heading: "Dual Recruitment Portals & Sourcing Engine",
    headerNote: "Strict privacy separation between applicants & hiring firms",
    links: [
      {
        href: "/employers",
        title: "For Corporate Employers",
        desc: "Launch a retained search mandate, deploy embedded engineering squads, and access passive senior tech talent.",
        icon: <Building2 />,
        tone: "primary",
      },
      {
        href: "/candidates",
        title: "For Confidential Candidates",
        desc: "Confidential executive career representation, compensation advocacy, and unlisted founder roles.",
        icon: <Users />,
        tone: "accent",
      },
      {
        href: "/jobs",
        title: "Browse Active Tech Openings",
        desc: "Verified staff, principal, VP, and C-Suite mandates with published salary ranges.",
        icon: <Briefcase />,
        tone: "sky",
      },
      {
        href: "/salary-guide",
        title: "2026 Tech Salary Guide",
        desc: "Comprehensive compensation tables across AI, Distributed Systems, Security, and C-Suite roles.",
        icon: <DollarSign />,
        tone: "energy",
      },
    ],
  },
  resources: {
    label: "Resources & Manual",
    heading: "Agency System Architecture & Documentation",
    headerLink: { href: "/documentation", label: "Read Full Documentation" },
    links: [
      {
        href: "/documentation",
        title: "Layman's Agency Guide",
        desc: "Everyday plain-English explanation of talent intake workflows, candidate screening, and data security.",
        icon: <BookOpen />,
        tone: "primary",
      },
      {
        href: "/process",
        title: "6-Stage Recruitment Vetting",
        desc: "Step-by-step breakdown from Day 1 candidate discovery to Day 90 retention warranty.",
        icon: <Workflow />,
        tone: "sky",
      },
      {
        href: "/team",
        title: "Executive Talent Partners",
        desc: "Meet executive search directors, AI systems researchers, and senior recruiters.",
        icon: <Users />,
        tone: "accent",
      },
      {
        href: "/faq",
        title: "Recruitment FAQs & Advice",
        desc: "Answers to technical vetting rubrics, placement fee structures, and SLA terms.",
        icon: <HelpCircle />,
        tone: "rose",
      },
    ],
  },
};

const MOBILE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Recruitment Practices" },
  { href: "/jobs", label: "Jobs & Careers" },
  { href: "/employers", label: "For Employers" },
  { href: "/candidates", label: "For Candidates" },
  { href: "/salary-guide", label: "Salary Guide" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/documentation", label: "Documentation & Layman Guide" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menuName: MenuKey) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    };
  }, []);

  const closeMenu = () => setActiveMenu(null);

  const navLinkClass = (href: string) =>
    cn(
      "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
      pathname === href
        ? "text-primary-hover bg-primary-soft"
        : "text-body hover:text-foreground hover:bg-surface"
    );

  const menu = activeMenu ? MENUS[activeMenu] : null;

  return (
    <header
      className="sticky top-0 z-50 bg-card/85 backdrop-blur-xl border-b border-border transition-all"
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo with The Automation Studio Branding */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/25 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <span className="block font-extrabold text-[17px] text-foreground tracking-tight">
                The Automation Studio
              </span>
              <span className="block text-xs text-muted-foreground font-medium">
                Technical & Executive Recruitment
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with Mega Menus */}
          <nav className="hidden lg:flex items-center gap-0.5">
            <Link href="/" className={navLinkClass("/")}>
              Home
            </Link>

            {(Object.keys(MENUS) as MenuKey[]).map((key) => (
              <div key={key} className="relative" onMouseEnter={() => handleMouseEnter(key)}>
                <button
                  onClick={() => setActiveMenu(activeMenu === key ? null : key)}
                  aria-expanded={activeMenu === key}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer",
                    activeMenu === key
                      ? "text-foreground bg-surface"
                      : "text-body hover:text-foreground hover:bg-surface"
                  )}
                >
                  <span>{MENUS[key].label}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      activeMenu === key && "rotate-180 text-primary"
                    )}
                  />
                </button>
              </div>
            ))}

            <Link href="/case-studies" className={navLinkClass("/case-studies")}>
              Case Studies
            </Link>
            <Link href="/contact" className={navLinkClass("/contact")}>
              Contact
            </Link>
          </nav>

          {/* Action Portal Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/candidate-login">
              <Button variant="secondary" size="sm">
                <Users className="h-4 w-4 text-primary" />
                <span>Candidate Portal</span>
              </Button>
            </Link>

            <Link href="/admin-login">
              <Button variant="default" size="sm">
                <Lock className="h-4 w-4" />
                <span>Admin Console</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
              className="p-2 text-body hover:text-foreground rounded-lg bg-card border border-border cursor-pointer"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu Panel */}
      {menu && activeMenu && (
        <div
          className="hidden lg:block absolute top-full left-0 w-full bg-card border-b border-border shadow-lift animate-fade-up z-50"
          onMouseEnter={() => handleMouseEnter(activeMenu)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {menu.heading}
                  </span>
                  {menu.headerLink && (
                    <Link
                      href={menu.headerLink.href}
                      onClick={closeMenu}
                      className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
                    >
                      <span>{menu.headerLink.label}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  {menu.headerNote && (
                    <span className="text-sm text-muted-foreground">{menu.headerNote}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {menu.links.map((l) => (
                    <Link
                      key={l.title}
                      href={l.href}
                      onClick={closeMenu}
                      className="p-4 rounded-xl border border-transparent hover:border-border hover:bg-surface/70 transition-all group flex items-start gap-3.5"
                    >
                      <IconBox tone={l.tone} size="sm" className="group-hover:scale-105 transition-transform">
                        {l.icon}
                      </IconBox>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary-hover transition-colors">
                          {l.title}
                        </h4>
                        <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{l.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="col-span-4">
                <MenuSpotlight menuKey={activeMenu} onNavigate={closeMenu} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card px-4 pt-3 pb-6 space-y-1 animate-fade-up">
          {MOBILE_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-3 py-2.5 rounded-lg text-[15px] font-medium",
                pathname === l.href ? "bg-primary-soft text-primary-hover" : "text-body hover:bg-surface"
              )}
            >
              {l.label}
            </Link>
          ))}

          <div className="pt-4 mt-3 grid grid-cols-2 gap-2 border-t border-border">
            <Link href="/candidate-login" onClick={() => setMobileOpen(false)}>
              <Button variant="secondary" className="w-full">
                Candidate Portal
              </Button>
            </Link>
            <Link href="/admin-login" onClick={() => setMobileOpen(false)}>
              <Button variant="default" className="w-full">
                Admin Console
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function MenuSpotlight({ menuKey, onNavigate }: { menuKey: MenuKey; onNavigate: () => void }) {
  if (menuKey === "practices") {
    return (
      <div className="h-full bg-primary-soft p-6 rounded-2xl border border-primary-muted flex flex-col justify-between">
        <div>
          <Badge variant="default" className="mb-3 bg-card">Recruitment Guarantee</Badge>
          <h4 className="text-base font-bold text-foreground">14-Day Delivery SLA</h4>
          <p className="text-sm text-body mt-1.5 leading-relaxed">
            We present a calibrated shortlist of 3-5 pre-screened finalists within two weeks, backed by a 90-day replacement warranty.
          </p>
        </div>
        <div className="pt-4 mt-4 border-t border-primary-muted flex items-center justify-between">
          <span className="text-xl font-extrabold text-primary-hover">98.4% Close</span>
          <Link
            href="/employers"
            onClick={onNavigate}
            className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
          >
            <span>Hire Talent</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (menuKey === "talent") {
    return (
      <div className="h-full bg-surface p-6 rounded-2xl border border-border flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
            Direct Portal Access
          </span>
          <h4 className="text-base font-bold text-foreground">Separated Portals</h4>
          <p className="text-sm text-body mt-1.5 leading-relaxed">
            Zero cross-contamination between applicant files and internal operations controls.
          </p>

          <div className="mt-4 space-y-2">
            <Link href="/candidate-login" onClick={onNavigate} className="block">
              <Button variant="secondary" size="sm" className="w-full justify-between">
                <span>Candidate Portal</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin-login" onClick={onNavigate} className="block">
              <Button variant="default" size="sm" className="w-full justify-between">
                <span>Admin Console</span>
                <Lock className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="pt-3 mt-4 border-t border-border text-xs text-muted-foreground flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Multi-factor portal separation
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-surface p-6 rounded-2xl border border-border flex flex-col justify-between">
      <div>
        <Badge variant="outline" className="mb-3">Developer State</Badge>
        <h4 className="text-base font-bold text-foreground">Live Intake Monitor</h4>
        <p className="text-sm text-body mt-1.5 leading-relaxed">
          Inspect the split-screen intake console and incoming requisition logs in real time.
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-border">
        <Link href="/portal" onClick={onNavigate} className="block">
          <Button variant="outline" size="sm" className="w-full">
            <Terminal className="h-4 w-4 text-primary" />
            <span>Open Live Monitor (/portal)</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
