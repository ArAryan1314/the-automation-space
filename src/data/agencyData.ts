export const JOB_TYPES = ["Full-Time", "Contract", "Executive Retained"] as const;
export const EXPERIENCE_LEVELS = ["Mid-Level", "Senior", "Lead", "VP", "C-Suite"] as const;

export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: (typeof JOB_TYPES)[number];
  salaryRange: string;
  experienceLevel: (typeof EXPERIENCE_LEVELS)[number];
  overview: string;
  skills: string[];
  postedAt: string;
}

export interface TalentSpecialist {
  name: string;
  role: string;
  specialization: string;
  bio: string;
  placements: number;
}

export const SPECIALISTS: TalentSpecialist[] = [
  {
    name: "Marcus Vance",
    role: "Managing Partner & Head of Executive Search",
    specialization: "C-Suite, VP Engineering, Board Advisories",
    bio: "14+ years scaling top-quartile technology startups across Silicon Valley and NYC with over 450 verified executive placements.",
    placements: 450,
  },
  {
    name: "Dr. Alistair Chen",
    role: "Head of AI & Quantitative Practice",
    specialization: "GenAI, LLM Infrastructure, Machine Learning Leads",
    bio: "Former Stanford AI researcher bridging deep engineering research with enterprise tier-1 talent sourcing.",
    placements: 280,
  },
  {
    name: "Eleanor Sterling",
    role: "Director of Enterprise Client Partnerships",
    specialization: "B2B SaaS, FinTech, Global Talent Retainers",
    bio: "Strategic talent architect facilitating rapid pipeline velocity for Fortune 500 tech innovators and high-velocity scaleups.",
    placements: 390,
  },
  {
    name: "Soraya Kabbaj",
    role: "Candidate Experience & Career Advisory Lead",
    specialization: "Confidential Candidate Placement & Negotiation",
    bio: "Dedicated advocate mentoring senior and principal leaders through counter-offers, compensation equity packages, and career leaps.",
    placements: 310,
  },
];
