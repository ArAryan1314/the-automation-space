export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-Time" | "Contract" | "Executive Retained";
  salaryRange: string;
  experienceLevel: "Mid-Level" | "Senior" | "Lead" | "VP" | "C-Suite";
  overview: string;
  skills: string[];
  featured: boolean;
  postedDate: string;
}

export interface TalentSpecialist {
  name: string;
  role: string;
  specialization: string;
  bio: string;
  placements: number;
}

export const FEATURED_JOBS: JobListing[] = [
  {
    id: "job-01",
    title: "VP of Artificial Intelligence & LLM Systems",
    department: "AI & Machine Learning",
    location: "San Francisco, CA (Hybrid / Remote Option)",
    type: "Executive Retained",
    salaryRange: "$320,000 - $420,000 + Equity",
    experienceLevel: "VP",
    overview: "Directing generative AI architecture, large model fine-tuning pipelines, and distributed inference clusters for a Series C frontier enterprise.",
    skills: ["Large Language Models", "PyTorch", "Kubernetes", "Distributed Training", "MLOps"],
    featured: true,
    postedDate: "2 days ago",
  },
  {
    id: "job-02",
    title: "Principal Distributed Systems Engineer",
    department: "Core Engineering",
    location: "New York, NY (Hybrid)",
    type: "Full-Time",
    salaryRange: "$240,000 - $290,000 + Bonus",
    experienceLevel: "Lead",
    overview: "Architecting zero-latency financial trading infrastructure and high-throughput transaction brokers operating under millisecond SLA constraints.",
    skills: ["Rust", "Go", "Kafka", "Low-Latency Networks", "PostgreSQL"],
    featured: true,
    postedDate: "Just now",
  },
  {
    id: "job-03",
    title: "Chief Product Officer (CPO)",
    department: "Executive Leadership",
    location: "Austin, TX / Remote",
    type: "Executive Retained",
    salaryRange: "$350,000 - $460,000 + Founding Equity",
    experienceLevel: "C-Suite",
    overview: "Leading cross-functional product, UX, and strategic partner roadmap across North America and European enterprise markets.",
    skills: ["Product Strategy", "B2B SaaS Growth", "PLG Architecture", "Board Governance"],
    featured: true,
    postedDate: "3 days ago",
  },
  {
    id: "job-04",
    title: "Staff Cloud Security Architect",
    department: "Cybersecurity & InfoSec",
    location: "Seattle, WA (Remote Friendly)",
    type: "Full-Time",
    salaryRange: "$220,000 - $275,000",
    experienceLevel: "Senior",
    overview: "Spearheading multi-cloud zero-trust network boundaries, SOC2/ISO compliance automation, and confidential enclave encryption standards.",
    skills: ["AWS / GCP Security", "Terraform", "Zero Trust", "Threat Modeling", "IAM"],
    featured: false,
    postedDate: "5 days ago",
  },
  {
    id: "job-05",
    title: "Head of Talent Acquisition & People Ops",
    department: "People & Talent",
    location: "London, UK / Remote",
    type: "Full-Time",
    salaryRange: "£140,000 - £180,000",
    experienceLevel: "Lead",
    overview: "Scaling an EMEA hyper-growth engineering studio from 80 to 250 headcount with structured competency rubrics and diverse pipeline sourcing.",
    skills: ["Executive Search", "Global HR Ops", "Headcount Modeling", "Culture Architecture"],
    featured: false,
    postedDate: "1 week ago",
  },
  {
    id: "job-06",
    title: "Lead Frontend Engineer (Next.js & Design Systems)",
    department: "Frontend Experience",
    location: "Remote (Global / Americas Timezones)",
    type: "Contract",
    salaryRange: "$160 - $200 / hr",
    experienceLevel: "Lead",
    overview: "Engineering fluid micro-interactions, responsive high-performance dashboards, and component design tokens for premier analytics portals.",
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "Web Vitals", "Canvas / WebGL"],
    featured: true,
    postedDate: "1 day ago",
  },
];

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
