import Link from "next/link";
import {
  Target,
  Shield,
  Award,
  Cpu,
  ArrowRight,
} from "lucide-react";
import {
  Section,
  SectionHeader,
  PageHero,
  Heading,
  Text,
  Badge,
  Card,
  CardTitle,
  CardDescription,
  Button,
  Timeline,
  IconBox,
} from "@/components/ui";

export function AboutView() {
  const milestones = [
    { year: "2019", title: "Founded in San Francisco", desc: "Started as a boutique executive search studio catering to early-stage deep tech startups." },
    { year: "2021", title: "Expanded to EMEA & NYC", desc: "Opened practices in Manhattan and London to facilitate cross-border frontier talent transfers." },
    { year: "2024", title: "Intelligent Practice Modernization", desc: "Implemented accelerated candidate qualification protocols to eliminate screening latency." },
    { year: "2026", title: "The Automation Studio Platform Launch", desc: "1,500+ successful leadership placements and $2.4B+ in scaling client valuations." },
  ];

  const values = [
    {
      icon: <Shield />,
      tone: "primary" as const,
      title: "Uncompromising Integrity",
      desc: "We never blast resumes blindly or misrepresent roles. Every candidate and employer receives transparent, honest market reality checks.",
    },
    {
      icon: <Cpu />,
      tone: "accent" as const,
      title: "Architectural Rigor",
      desc: "We verify engineering depth firsthand through structured system design rubrics, ensuring candidates are fully calibrated before introduction.",
    },
    {
      icon: <Award />,
      tone: "amber" as const,
      title: "Retention Over Speed",
      desc: "We measure our success by candidate tenure and post-placement impact, not how many invoices we process in a single quarter.",
    },
  ];

  return (
    <div className="animate-fade-up">
      {/* SECTION 1: Mission Hero */}
      <PageHero
        badge={
          <Badge variant="default" className="py-1 px-3.5">
            <Target className="h-4 w-4" />
            <span>Our Vision & Heritage</span>
          </Badge>
        }
        title="We Believe the Future of Tech is Built by Extraordinary Teams"
        description="The Automation Studio was founded on a simple conviction: conventional recruitment agencies are noisy, transactional, and slow. We combine technical executive search expertise with structured architectural vetting to deliver engineering talent matchmaking with surgical precision."
      />

      {/* SECTION 2: Core Values */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v) => (
            <Card key={v.title} className="p-8 space-y-4">
              <IconBox tone={v.tone}>{v.icon}</IconBox>
              <CardTitle className="text-base">{v.title}</CardTitle>
              <CardDescription>{v.desc}</CardDescription>
            </Card>
          ))}
        </div>
      </Section>

      {/* SECTION 3: Company Timeline & Milestones */}
      <Section variant="muted">
        <SectionHeader title="The Journey of The Automation Studio" />
        <Timeline items={milestones} columns={4} />
      </Section>

      {/* SECTION 4: Team CTA */}
      <Section variant="glow" className="text-center">
        <div className="space-y-4 max-w-2xl mx-auto">
          <Heading as="h2" size="h2">Meet the Specialists Behind the Platform</Heading>
          <Text size="sm" variant="muted" className="max-w-xl mx-auto">
            Our practice leaders are former engineering VPs, AI researchers, and seasoned enterprise advisors with decades of combined executive search experience.
          </Text>
          <Link href="/team" className="inline-block">
            <Button size="lg" className="mt-4">
              <span>Meet Our Executive Team</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}
