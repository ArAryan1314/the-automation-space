"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  CheckCircle2,
  Star,
  ChevronRight,
  Zap,
  Clock,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import {
  Button,
  Card,
  CardTitle,
  CardDescription,
  Badge,
  Input,
  Textarea,
  Label,
  Section,
  SectionHeader,
  Heading,
  Text,
  StatsGrid,
  Accordion,
  AlertBanner,
  IconBox,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  AUTOMATION_STUDIO_SERVICES,
  AUTOMATION_STUDIO_CLIENT_STORIES,
  AUTOMATION_STUDIO_TESTIMONIALS,
  AUTOMATION_STUDIO_FAQS,
} from "@/data/automationData";

const SERVICE_TONES = ["primary", "sky", "accent", "energy"] as const;

export function HomeView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roleType: "candidate" as "candidate" | "employer",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [responseSuccess, setResponseSuccess] = useState<string | null>(null);

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseSuccess(null);
    try {
      const res = await fetch("/api/ai-respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResponseSuccess(
          `Requisition received! Confirmation summary: "${data.data.aiDraft.slice(0, 130)}..."`
        );
        setFormData({ name: "", email: "", roleType: "candidate", message: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const heroStats = [
    { value: "14 Days", label: "Average Shortlist Time", description: "Vetted senior candidate delivery", icon: <Clock className="h-4 w-4" /> },
    { value: "98.4%", label: "Offer Acceptance Rate", description: "Accurate compensation modeling", highlight: true, icon: <TrendingUp className="h-4 w-4" /> },
    { value: "90 Days", label: "Placement Guarantee", description: "Unconditional replacement warranty", icon: <ShieldCheck className="h-4 w-4" /> },
  ];

  return (
    <div className="pb-20">
      {/* SECTION 1: Hero Banner */}
      <Section variant="hero" spacing="none" className="pt-14 pb-20 lg:pt-20 lg:pb-24 border-b border-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Headline */}
          <div className="lg:col-span-7 space-y-7">
            <Badge variant="default" className="py-1 px-3 text-[13px]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Executive & Technical Recruitment Practice</span>
            </Badge>

            <Heading as="h1" size="h1" className="text-white">
              Precision Talent Search for{" "}
              <span className="gradient-text">Frontier Engineering Teams</span>
            </Heading>

            <Text size="lg" className="max-w-2xl">
              We place exceptional engineering leaders, distributed systems architects, and machine learning specialists. Partner directly with senior technical search directors who understand your architecture, cultural bar, and hiring urgency.
            </Text>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/employers">
                <Button size="lg">
                  <Building2 className="h-4 w-4" />
                  <span>Hire Technical Talent</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/jobs">
                <Button variant="secondary" size="lg">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span>Explore Open Roles</span>
                </Button>
              </Link>

              <Link href="/salary-guide">
                <Button variant="ghost" size="lg" className="text-primary hover:text-primary-hover">
                  <TrendingUp className="h-4 w-4" />
                  <span>2026 Compensation Guide</span>
                </Button>
              </Link>
            </div>

            <StatsGrid stats={heroStats} columns={3} className="pt-4" />
          </div>

          {/* Right: Instant Intake Card */}
          <div className="lg:col-span-5">
            <Card className="p-6 sm:p-8 shadow-lift hover:shadow-lift">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Confidential Requisition Intake
                  </span>
                </div>
                <Badge variant="outline">Priority Routing</Badge>
              </div>

              <CardTitle className="text-2xl mb-1.5">Direct Practice Briefing</CardTitle>
              <CardDescription className="mb-6">
                Submit candidate credentials or corporate hiring specifications for direct partner review within 24 hours.
              </CardDescription>

              {responseSuccess && (
                <AlertBanner variant="success" className="mb-5">
                  {responseSuccess}
                </AlertBanner>
              )}

              <form onSubmit={handleHeroSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="hero-name">Full Name</Label>
                  <Input
                    id="hero-name"
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="hero-email">Work Email Address</Label>
                  <Input
                    id="hero-email"
                    type="email"
                    required
                    placeholder="alex@enterprise.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label>I am a</Label>
                  <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-surface p-1.5 border border-border">
                    {(["candidate", "employer"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, roleType: type })}
                        className={cn(
                          "flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-all cursor-pointer",
                          formData.roleType === type
                            ? "bg-card text-primary-hover shadow-soft"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {type === "candidate" ? <Users className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                        <span>{type === "candidate" ? "Candidate" : "Employer"}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="hero-message">Inquiry / Requirements Scope</Label>
                  <Textarea
                    id="hero-message"
                    rows={3}
                    required
                    placeholder="Describe target engineering requisition, technical stack, or career background..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button type="submit" disabled={loading} size="lg" className="w-full">
                  {loading ? (
                    <span>Routing Confidential Briefing...</span>
                  ) : (
                    <>
                      <span>Submit Requisition for Partner Review</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </Section>

      {/* SECTION 2: Client Brand Trust Row */}
      <Section spacing="sm">
        <Text as="div" size="sm" variant="muted" className="font-medium text-center mb-6">
          Architecting high-performing teams for frontier tech leaders
        </Text>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-center">
          {["Anthropic Alumni", "OpenAI Ecosystem", "Snowflake Scaleups", "Datadog Alumni", "ScaleFlow SaaS", "Horizon AI Labs"].map((co) => (
            <div
              key={co}
              className="py-3.5 px-4 rounded-xl border border-border bg-card text-sm font-semibold text-muted-foreground text-center hover:text-foreground hover:border-primary/30 transition-colors"
            >
              {co}
            </div>
          ))}
        </div>
      </Section>

      {/* SECTION 3: Featured Recruitment Practices */}
      <Section variant="muted" spacing="default">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="space-y-3">
            <Badge variant="default">Practice Areas</Badge>
            <Heading as="h2" size="h2">Executive & Engineering Search</Heading>
          </div>
          <Link href="/services">
            <Button variant="ghost" className="text-primary hover:text-primary-hover">
              <span>View All Practices</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AUTOMATION_STUDIO_SERVICES.map((srv, idx) => (
            <Card key={srv.id} className="p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <IconBox tone={SERVICE_TONES[idx % SERVICE_TONES.length]}>
                    <Zap />
                  </IconBox>
                  <Badge variant="secondary">{srv.category}</Badge>
                </div>

                <CardTitle className="text-xl mb-2">{srv.title}</CardTitle>
                <CardDescription className="mb-5">{srv.description}</CardDescription>

                <ul className="space-y-2.5">
                  {srv.deliverables.map((del, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-body">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-5 border-t border-border flex items-center justify-between gap-4">
                <span className="text-sm text-primary-hover font-semibold">{srv.metrics}</span>
                <Link href="/services">
                  <Button variant="ghost" size="sm">
                    <span>Explore Practice</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* SECTION 4: Client Placement Stories */}
      <Section spacing="lg">
        <SectionHeader
          badge={<Badge variant="default">Verified Track Record</Badge>}
          title="Executive Placement Outcomes"
          description="Discover how venture-backed startups and enterprises scale engineering teams with zero recruitment friction."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AUTOMATION_STUDIO_CLIENT_STORIES.map((story, idx) => (
            <Card key={idx} className="p-6 flex flex-col">
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-border">
                <div>
                  <Heading as="h4" size="h5">{story.client}</Heading>
                  <Text size="sm" variant="muted">{story.domain}</Text>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-extrabold text-primary">{story.stat}</div>
                  <div className="text-xs text-muted-foreground">{story.statLabel}</div>
                </div>
              </div>

              <dl className="pt-5 space-y-4 text-sm">
                {[
                  { label: "Challenge", value: story.challenge },
                  { label: "Strategy", value: story.recruitmentStrategy },
                  { label: "Result", value: story.placementResult },
                ].map((row) => (
                  <div key={row.label}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">{row.label}</dt>
                    <dd className="text-body leading-relaxed">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          ))}
        </div>
      </Section>

      {/* SECTION 5: Client Endorsements */}
      <Section variant="glow" spacing="default">
        <SectionHeader
          badge={<Badge variant="outline">Testimonials</Badge>}
          title="Endorsed by Engineering & Operations Leaders"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AUTOMATION_STUDIO_TESTIMONIALS.map((t, i) => (
            <Card key={i} className="p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-0.5 text-energy">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <Text size="base" className="leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </Text>
              </div>
              <div className="mt-6 pt-5 border-t border-border flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-muted-foreground">{t.role} · {t.company}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* SECTION 6: Documentation Teaser */}
      <Section spacing="default">
        <Card className="p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-dots">
          <div className="flex items-start gap-5 max-w-3xl">
            <IconBox tone="accent" size="lg" className="hidden sm:inline-flex">
              <BookOpen />
            </IconBox>
            <div className="space-y-3">
              <Badge variant="accent">Layman-Friendly Manual</Badge>
              <Heading as="h2" size="h3">Transparent, Zero-Complexity Documentation</Heading>
              <Text size="base">
                Read our plain-language guide detailing our candidate vetting standards, why candidate and admin portals remain strictly isolated, and how client data is securely protected.
              </Text>
            </div>
          </div>
          <Link href="/documentation" className="flex-shrink-0">
            <Button size="lg">
              <span>Read Documentation</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </Section>

      {/* SECTION 7: FAQs */}
      <Section spacing="default">
        <SectionHeader
          badge={<Badge variant="outline">Questions & Answers</Badge>}
          title="Frequently Asked Questions"
        />

        <div className="max-w-3xl mx-auto">
          <Accordion
            items={AUTOMATION_STUDIO_FAQS.map((faq, i) => ({
              id: i,
              trigger: faq.q,
              content: faq.a,
            }))}
            defaultOpenId={0}
          />
        </div>
      </Section>
    </div>
  );
}
