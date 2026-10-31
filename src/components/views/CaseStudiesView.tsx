import Link from "next/link";
import {
  Award,
  ArrowRight,
  AlertCircle,
  Compass,
  CheckCircle2,
} from "lucide-react";
import {
  Section,
  PageHero,
  Heading,
  Text,
  Badge,
  Card,
  CardTitle,
  Button,
  IconBox,
} from "@/components/ui";

export function CaseStudiesView() {
  const caseStudies = [
    {
      company: "Synapse Dynamics (Series B AI Startup)",
      challenge: "Urgent need for a VP of Machine Learning and 4 Principal Distributed Inference Engineers within 30 days to meet investor product milestones.",
      solution: "The Automation Studio deployed an Embedded Talent Squad and utilized comprehensive market mapping to identify 18 calibrated candidates across North America.",
      outcome: "All 5 positions filled in 26 days. Zero candidate fallouts, and the company completed their Series C at a $1.2B valuation 6 months later.",
      metrics: [
        { label: "Delivery Velocity", val: "26 Days" },
        { label: "Offer Acceptance", val: "100%" },
        { label: "Retention After 1 Yr", val: "100%" },
      ],
      tag: "AI & Deep Tech",
    },
    {
      company: "Verve Cloud (Enterprise FinTech Infrastructure)",
      challenge: "Confidential search for a Chief Information Security Officer (CISO) following global SOC2 & ISO expansion under strict discretion.",
      solution: "Retained executive search led by Managing Partner Marcus Vance with direct board interview coordination and backchannel vetting.",
      outcome: "Secured a top-quartile former AWS security director with extensive financial governance experience within 18 business days.",
      metrics: [
        { label: "Search Timeline", val: "18 Days" },
        { label: "Comp Savings", val: "12% vs Cap" },
        { label: "Board Approval", val: "Unanimous" },
      ],
      tag: "Executive Retained",
    },
    {
      company: "Hyperion Labs (Autonomous Robotics)",
      challenge: "Scaling an embedded systems engineering team from 12 to 35 engineers across multiple specialized disciplines (ROS, C++, CUDA).",
      solution: "Multi-quarter talent partnership with custom technical screening rubrics and direct founder weekly sync loops.",
      outcome: "Placed 23 senior engineers over two quarters with an average time-to-hire of 19 days per requisition.",
      metrics: [
        { label: "Engineers Hired", val: "23 Placed" },
        { label: "Avg Days to Hire", val: "19 Days" },
        { label: "Diversity Ratio", val: "42%" },
      ],
      tag: "Robotics & Hardware",
    },
  ];

  return (
    <div className="animate-fade-up">
      {/* SECTION 1: Page Header */}
      <PageHero
        badge={
          <Badge variant="default" className="py-1 px-3.5">
            <Award className="h-4 w-4" />
            <span>Client Proof & Performance Track Record</span>
          </Badge>
        }
        title="Executive Placement Case Studies"
        description="Read how venture-backed startups and market-leading enterprises rely on The Automation Studio to resolve high-stakes engineering and executive leadership hiring constraints."
      />

      {/* SECTION 2: Detailed Case Study Deep Dives */}
      <Section>
        <div className="space-y-8">
          {caseStudies.map((cs, idx) => {
            const blocks = [
              { label: "The Challenge", icon: <AlertCircle />, tone: "energy" as const, text: cs.challenge },
              { label: "The Solution", icon: <Compass />, tone: "sky" as const, text: cs.solution },
              { label: "Verified Outcome", icon: <CheckCircle2 />, tone: "primary" as const, text: cs.outcome },
            ];
            return (
              <Card
                key={idx}
                className="p-6 sm:p-10 space-y-8"
              >
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-border pb-6">
                  <div className="space-y-2">
                    <Badge variant="default">{cs.tag}</Badge>
                    <CardTitle className="text-xl sm:text-2xl">
                      {cs.company}
                    </CardTitle>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {cs.metrics.map((m, i) => (
                      <div key={i} className="rounded-xl bg-primary-soft border border-primary-muted px-4 py-3 text-center lg:text-right">
                        <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-primary">{m.val}</div>
                        <div className="text-xs text-muted-foreground font-medium mt-0.5">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {blocks.map((b) => (
                    <div key={b.label} className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <IconBox size="sm" tone={b.tone}>{b.icon}</IconBox>
                        <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                          {b.label}
                        </span>
                      </div>
                      <Text size="sm">{b.text}</Text>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* SECTION 3: CTA to Initiate Search */}
      <Section variant="ink" className="text-center">
        <div className="space-y-4 max-w-2xl mx-auto">
          <Heading as="h2" size="h2" className="text-white">Ready to Replicate These Results for Your Team?</Heading>
          <Text size="base" className="text-body max-w-xl mx-auto">
            Schedule an exploratory intake briefing with our sector managing partners to review active talent market dynamics.
          </Text>
          <Link href="/employers" className="inline-block">
            <Button size="lg" className="mt-4">
              <span>Request Case Study Portfolio</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}
