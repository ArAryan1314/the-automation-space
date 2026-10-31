import type { Metadata } from "next";

/** Site-wide settings. Override the URL per environment with NEXT_PUBLIC_SITE_URL. */
export const SITE = {
  name: "The Automation Studio",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://the-automation-space.com").replace(/\/$/, ""),
  email: "advisory@the-automation-space.com",
  tagline: "Executive Technical Recruitment Agency",
};

export type PageGroup = "Agency" | "Employers & Candidates" | "Resources" | "Portals";

export interface SitePage {
  path: string;
  title: string;
  description: string;
  group: PageGroup;
}

/**
 * Single source of truth for every public route: drives per-page metadata
 * (title, description, canonical URL) and the page directory in /documentation.
 */
export const SITE_PAGES = {
  home: {
    path: "/",
    title: "Executive Technical Recruitment Agency",
    description: "Home: agency overview, key hiring metrics, practice areas, placement outcomes, testimonials, FAQs and a confidential intake form.",
    group: "Agency",
  },
  services: {
    path: "/services",
    title: "Recruitment Practices",
    description: "Our specialized search practices (Executive AI, Core Systems, Embedded Squads, C-Suite) and delivery SLA standards.",
    group: "Agency",
  },
  about: {
    path: "/about",
    title: "About Us",
    description: "Our founding story, core values and company timeline.",
    group: "Agency",
  },
  team: {
    path: "/team",
    title: "Executive Partners",
    description: "Meet the search directors and specialist recruiters, with their focus areas and placement records.",
    group: "Agency",
  },
  caseStudies: {
    path: "/case-studies",
    title: "Case Studies",
    description: "Client placement stories with the challenge, our search strategy and measured outcomes.",
    group: "Agency",
  },
  contact: {
    path: "/contact",
    title: "Contact",
    description: "Office locations, direct contact details and a general inquiry form.",
    group: "Agency",
  },
  employers: {
    path: "/employers",
    title: "For Employers",
    description: "Submit a hiring requisition, compare engagement models and review our candidate vetting standard.",
    group: "Employers & Candidates",
  },
  candidates: {
    path: "/candidates",
    title: "For Candidates",
    description: "Confidential career representation: register your profile and learn how we advocate for candidates.",
    group: "Employers & Candidates",
  },
  jobs: {
    path: "/jobs",
    title: "Open Roles",
    description: "Search and filter active job openings with published salary ranges, and apply through a quick-apply form.",
    group: "Employers & Candidates",
  },
  salaryGuide: {
    path: "/salary-guide",
    title: "2026 Tech Salary Guide",
    description: "Compensation benchmarks by role family and seniority, plus market insights.",
    group: "Employers & Candidates",
  },
  process: {
    path: "/process",
    title: "Our Recruitment Process",
    description: "The 6-stage vetting process from discovery to placement, and the 90-day placement guarantee.",
    group: "Resources",
  },
  faq: {
    path: "/faq",
    title: "FAQ",
    description: "Answers to common questions about fees, vetting, timelines and guarantees.",
    group: "Resources",
  },
  documentation: {
    path: "/documentation",
    title: "Documentation",
    description: "This manual: plain-language guide, page directory, portal separation, architecture and developer setup.",
    group: "Resources",
  },
  candidateLogin: {
    path: "/candidate-login",
    title: "Candidate Portal",
    description: "Candidate sign-in and pipeline dashboard showing interview stage and next steps (demo login).",
    group: "Portals",
  },
  adminLogin: {
    path: "/admin-login",
    title: "Admin Console",
    description: "Operations console listing every intake submission and its drafted acknowledgement (demo passkey).",
    group: "Portals",
  },
  portal: {
    path: "/portal",
    title: "Live Intake Monitor",
    description: "Developer view: submit a test intake and watch the server's stored submissions update.",
    group: "Portals",
  },
} satisfies Record<string, SitePage>;

export type SitePageKey = keyof typeof SITE_PAGES;

/** Builds a page's metadata (title, description, canonical, Open Graph) from SITE_PAGES. */
export function pageMetadata(key: SitePageKey): Metadata {
  const page: SitePage = SITE_PAGES[key];
  const isHome = page.path === "/";
  return {
    title: isHome ? { absolute: `${SITE.name} | ${SITE.tagline}` } : page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      title: isHome ? `${SITE.name} | ${SITE.tagline}` : `${page.title} | ${SITE.name}`,
      description: page.description,
      url: page.path,
      siteName: SITE.name,
      locale: "en_US",
      type: "website",
    },
  };
}
