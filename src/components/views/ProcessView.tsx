import Link from "next/link";
import {
  Workflow,
  ArrowRight,
  Clock,
  ShieldCheck,
} from "lucide-react";
import {
  Section,
  PageHero,
  Heading,
  Text,
  Badge,
  Card,
  CardTitle,
  CardDescription,
  Button,
} from "@/components/ui";

export function ProcessView() {
  const steps = [
    {
      num: "01",
      title: "Intake Discovery & Architecture Calibration",
      desc: "We analyze technical stack requirements, cultural constraints, compensation parity, and company trajectory. Inbound requisitions trigger our structured practice matching pipeline to map ideal candidate attributes.",
      duration: "Days 1 - 2",
    },
    {
      num: "02",
      title: "Full-Market Passive Sourcing & Confidential Outreach",
      desc: "Our sector specialists execute targeted outreach to the top 5% of passive performers. We bypass generic job boards, engaging talent through trusted peer networks.",
      duration: "Days 3 - 6",
    },
    {
      num: "03",
      title: "Technical Architecture & Behavioral Vetting",
      desc: "Candidates complete structured technical discussions and leadership scenario audits conducted by former engineers and practice heads.",
      duration: "Days 7 - 10",
    },
    {
      num: "04",
      title: "Calibrated Shortlist Presentation (3 - 5 Finalists)",
      desc: "Clients receive an interview-ready dossier complete with technical assessment scorecards, compensation alignment, and motivation factors.",
      duration: "Days 11 - 14",
    },
    {
      num: "05",
      title: "Offer Engineering & Counter-Offer Defense",
      desc: "We mediate equity allocations, bonus structuring, and manage candidate expectations to prevent offer rejection or counter-offer retention by current employers.",
      duration: "Days 15 - 20",
    },
    {
      num: "06",
      title: "Post-Placement Onboarding & 90-Day Retention Warranty",
      desc: "We conduct 30, 60, and 90-day syncs with both employer and candidate. If any placement does not meet benchmarks within 90 days, we replace them at zero additional cost.",
      duration: "Days 21 - 90",
    },
  ];

  return (
    <div className="animate-fade-up">
      {/* SECTION 1: Page Header */}
      <PageHero
        badge={
          <Badge variant="default" className="py-1 px-3.5">
            <Workflow className="h-4 w-4" />
            <span>Our Systematic 6-Stage Vetting Protocol</span>
          </Badge>
        }
        title="How The Automation Studio Ensures 98.4% Placement Success"
        description="Predictable executive and engineering hiring requires systematic precision. Our 6-stage protocol eliminates risk, minimizes hiring manager calendar fatigue, and guarantees fast results."
      />

      {/* SECTION 2: Step-by-Step Flow */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {steps.map((st, i) => (
            <Card
              key={i}
              className="p-6 sm:p-7 flex flex-col gap-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-sm shadow-primary/20">
                    {st.num}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Step {st.num}
                  </span>
                </div>
                <Badge variant="secondary" className="flex-shrink-0">
                  <Clock className="h-3.5 w-3.5" />
                  {st.duration}
                </Badge>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-lg">{st.title}</CardTitle>
                <CardDescription>
                  {st.desc}
                </CardDescription>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* SECTION 3: The Guarantee Box */}
      <Section variant="ink">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-5 max-w-2xl">
            <div className="hidden sm:flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <Heading as="h2" size="h2" className="text-white">Backed by the 90-Day Placement Guarantee</Heading>
              <Text size="base" className="text-body">
                Every executive search contract is fully protected. In the rare event of a placement mismatch or early departure, our practice re-opens the search at zero charge.
              </Text>
            </div>
          </div>
          <Link href="/employers" className="flex-shrink-0">
            <Button size="lg">
              <span>Initiate a Search</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}
