export interface RecruitmentSpecialization {
  id: string;
  title: string;
  category: string;
  description: string;
  deliverables: string[];
  metrics: string;
  iconName: string;
}

export interface ClientPlacementStory {
  client: string;
  domain: string;
  challenge: string;
  recruitmentStrategy: string;
  placementResult: string;
  stat: string;
  statLabel: string;
}

export const AUTOMATION_STUDIO_SERVICES: RecruitmentSpecialization[] = [
  {
    id: "serv-ai-ml-recruitment",
    title: "Executive AI & Machine Learning Search",
    category: "Retained Technical Headhunting",
    description: "Surgical retained search targeting Principal, Staff, and VP AI leaders specializing in generative architectures, PyTorch infrastructure, LLM fine-tuning, and multimodal systems.",
    deliverables: [
      "Rigorous technical portfolio & research evaluation",
      "Confidential direct partner headhunting & backchannel checks",
      "Benchmark salary & equity modeling for 2026 indices",
      "Sub-14 day vetted shortlist delivery guarantee",
    ],
    metrics: "14-day average delivery vs. 45-day industry average",
    iconName: "Bot",
  },
  {
    id: "serv-systems-cloud",
    title: "Core Infrastructure & Distributed Systems",
    category: "Technical Individual Contributors",
    description: "Placing top 1% engineering talent in low-latency systems (Rust, Go, C++), high-throughput data pipelines, cloud security boundaries, and Kubernetes cluster orchestration.",
    deliverables: [
      "Rigorous technical architecture code & design audits",
      "Direct CTO & VP of Engineering candidate interviews",
      "Zero-blind-resume policy with explicit candidate authorization",
      "90-day unconditional replacement warranty",
    ],
    metrics: "98.4% offer acceptance rate across 450+ placements",
    iconName: "Cpu",
  },
  {
    id: "serv-embedded-squads",
    title: "Embedded Talent Squads (Recruitment RPO)",
    category: "High-Velocity Scaling",
    description: "Plug our senior technical recruitment partners directly into your hiring workflows, Slack, and ATS to rapidly scale engineering teams from 10 to 60+ without percentage markup fees.",
    deliverables: [
      "Dedicated recruitment director embedded in your team",
      "Interview loop architecture & structured scoring rubrics",
      "Employer branding narrative & candidate pipeline mapping",
      "Flat monthly engagement with zero commission gouging",
    ],
    metrics: "62% hiring cost reduction compared to legacy contingency agencies",
    iconName: "Users",
  },
  {
    id: "serv-board-exec",
    title: "C-Suite & Board Leadership Advisory",
    category: "Executive Governance",
    description: "Discreet advisory for boards, founders, and venture funds appointing Chief Technology Officers (CTO), Chief Product Officers (CPO), and technical independent board directors.",
    deliverables: [
      "Comprehensive nationwide passive leadership market mapping",
      "Strict confidentiality & NDA non-disclosure adherence",
      "Compensation package negotiation & change-of-control structuring",
      "100% executive retention after 1 year on the job",
    ],
    metrics: "$2.4B+ in client tech enterprise valuations scaled",
    iconName: "Building2",
  },
];

export const AUTOMATION_STUDIO_CLIENT_STORIES: ClientPlacementStory[] = [
  {
    client: "ScaleFlow Technologies",
    domain: "Series B Enterprise AI Studio",
    challenge: "Scaling foundational distributed ML engineering from 4 to 22 senior engineers in 45 days before product launch.",
    recruitmentStrategy: "Deployed an Embedded Talent Squad and utilized structured talent mapping to screen 180+ qualified candidates.",
    placementResult: "Closed all 18 engineering roles in 32 days with 100% offer acceptance and zero post-hire fallouts.",
    stat: "32 Days",
    statLabel: "Complete Squad Staffed",
  },
  {
    client: "Nexus Infrastructure",
    domain: "FinTech & Low-Latency Trading",
    challenge: "Confidential search for a VP of Core Systems after sudden leadership transition under extreme regulatory scrutiny.",
    recruitmentStrategy: "Retained executive search led personally by our managing partners with 360-degree backchannel checks.",
    placementResult: "Secured a top-quartile former AWS distributed systems director within 16 business days.",
    stat: "16 Days",
    statLabel: "VP Leadership Appointed",
  },
  {
    client: "Horizon Venture Partners",
    domain: "Venture Capital & Talent Incubation",
    challenge: "Portfolio-wide hiring across 40+ early-stage startups with no central candidate pipeline or equity consistency.",
    recruitmentStrategy: "Standardized candidate qualification streams and calibrated 2026 tech compensation bands.",
    placementResult: "Placed 42 principal engineers and technical founders across 14 portfolio firms in two consecutive quarters.",
    stat: "42",
    statLabel: "Foundational Hires Closed",
  },
];

export const AUTOMATION_STUDIO_TESTIMONIALS = [
  {
    quote: "The Automation Studio is unlike any recruitment agency we have engaged. Their talent qualification gives us instant visibility, and every candidate forwarded was caliber-ready for an immediate final round.",
    name: "Marcus Vance",
    role: "Chief Technology Officer",
    company: "Synapse Dynamics",
  },
  {
    quote: "They staffed our entire Core Rust & Infrastructure team in 3 weeks. Their transparent salary guides and candidate advocacy prevented counter-offers completely.",
    name: "Dr. Alistair Chen",
    role: "VP of Engineering",
    company: "ScaleFlow Technologies",
  },
  {
    quote: "The distinct portal separation between candidates and admin teams gave our board full peace of mind regarding privacy and confidential leadership searches.",
    name: "Eleanor Sterling",
    role: "Chief People Officer",
    company: "Horizon Scale Labs",
  },
];

export const AUTOMATION_STUDIO_FAQS = [
  {
    q: "What makes The Automation Studio different from traditional recruitment agencies?",
    a: "The Automation Studio combines human executive search expertise with structured technical evaluation. We eliminate recruitment agency bloat: incoming candidate and employer requisitions are analyzed rapidly, and every search is led by seasoned technical partners rather than junior sourcers.",
  },
  {
    q: "What technical disciplines and engineering roles do you specialize in?",
    a: "We focus on high-impact technical disciplines: Executive AI & Machine Learning, Low-Latency Distributed Systems (Rust, Go, C++), Cloud Infrastructure & Platform Engineering, and C-Suite Engineering Leadership (CTO, VP of Engineering).",
  },
  {
    q: "What is your placement fee and warranty structure?",
    a: "We offer both Retained Executive Search for senior leadership roles and Embedded Talent Squads with flat, transparent monthly retainers that eliminate aggressive percentage markups. Every single placement is backed by a 90-day unconditional replacement guarantee.",
  },
  {
    q: "How do you protect candidate confidentiality and employer privacy?",
    a: "We enforce a strict zero-blind-resume policy. We never submit a candidate's profile to any company without a mutual briefing and explicit authorization. Candidates log in via their private Candidate Portal (/candidate-login) once a super admin approves their account, while the super admin manages client flow through the secure Super Admin Console (/admin-login).",
  },
  {
    q: "Where is candidate and requisition data hosted and secured?",
    a: "All intake workflows run in isolated enterprise server infrastructure under strict data protection protocols. Data is hosted securely with encrypted transport and access-controlled storage, ensuring complete confidentiality for hiring organizations and executive candidates.",
  },
];
