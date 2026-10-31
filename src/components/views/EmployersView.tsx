"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  Filter,
  Users,
  MessagesSquare,
  Handshake,
} from "lucide-react";
import {
  Section,
  PageHero,
  SectionHeader,
  Heading,
  Text,
  Badge,
  Card,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Textarea,
  Label,
  IconBox,
} from "@/components/ui";

const selectClass =
  "flex h-11 w-full rounded-xl border border-input bg-surface px-3.5 text-sm text-foreground shadow-sm transition-all focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10";

export function EmployersView() {
  const [formData, setFormData] = useState({
    companyName: "",
    hiringManager: "",
    workEmail: "",
    roleLevel: "VP / C-Suite",
    timeline: "Immediate (< 30 days)",
    jobDescription: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/ai-respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.hiringManager,
          email: formData.workEmail,
          roleType: "employer",
          message: `[Employer Requisition: ${formData.companyName}] Level: ${formData.roleLevel}. Timeline: ${formData.timeline}. Scope: ${formData.jobDescription}`,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* SECTION 1: Executive Hiring Hero */}
      <PageHero
        badge={
          <Badge variant="default" className="py-1 px-3.5">
            <Building2 className="h-4 w-4" />
            <span>Retained Search & Executive Sourcing Squads</span>
          </Badge>
        }
        title={
          <>
            Scale Your Engineering & Leadership Bench with{" "}
            <span className="gradient-text">Zero Friction</span>
          </>
        }
        description="We help founders, boards, and CTOs build foundational AI, distributed systems, and product teams in 14 days, with pre-screened finalists who exceed technical benchmarks."
      >
        <div className="mt-10 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">14 Days</div>
            <div className="text-sm text-muted-foreground mt-1">Average Shortlist Delivery</div>
          </Card>
          <Card className="p-5 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-primary">92%</div>
            <div className="text-sm text-muted-foreground mt-1">1st-Choice Offer Close Rate</div>
          </Card>
          <Card className="p-5 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-primary">90 Days</div>
            <div className="text-sm text-muted-foreground mt-1">100% Replacement Guarantee</div>
          </Card>
        </div>
      </PageHero>

      {/* SECTION 2: Sourcing Requisition Intake Form */}
      <Section variant="muted">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-5">
            <IconBox size="lg">
              <Building2 />
            </IconBox>
            <Heading as="h2" size="h2">Initiate Search Mandate</Heading>
            <Text size="lg" variant="muted" className="max-w-lg">
              Submit your open headcount specs to instantly trigger partner allocation and talent pipeline mapping.
            </Text>
          </div>

          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8">
              {submitted ? (
                <div className="p-5 rounded-2xl bg-primary-soft border border-primary-muted text-primary-hover text-sm space-y-2 animate-fade-up">
                  <div className="flex items-center gap-2 font-bold text-base">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Mandate Intake Received</span>
                  </div>
                  <p className="leading-relaxed text-body">
                    Our sector managing partner has been assigned to your requisition. You will receive candidate market mapping insights within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                    className="mt-3"
                  >
                    Submit another hiring mandate
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="emp-company">Company / Organization</Label>
                    <Input
                      id="emp-company"
                      type="text"
                      required
                      placeholder="e.g. AnthroDynamics AI"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emp-manager">Hiring Manager Name</Label>
                      <Input
                        id="emp-manager"
                        type="text"
                        required
                        placeholder="e.g. Sarah Wu"
                        value={formData.hiringManager}
                        onChange={(e) => setFormData({ ...formData, hiringManager: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emp-email">Work Email</Label>
                      <Input
                        id="emp-email"
                        type="email"
                        required
                        placeholder="sarah@anthrodynamics.com"
                        value={formData.workEmail}
                        onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emp-level">Role Seniority Level</Label>
                      <select
                        id="emp-level"
                        value={formData.roleLevel}
                        onChange={(e) => setFormData({ ...formData, roleLevel: e.target.value })}
                        className={selectClass}
                      >
                        <option>Principal / Staff Engineer</option>
                        <option>Engineering Manager / Director</option>
                        <option>VP / Head of Department</option>
                        <option>C-Suite (CTO / CPO / CEO)</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="emp-timeline">Target Timeline</Label>
                      <select
                        id="emp-timeline"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className={selectClass}
                      >
                        <option>Immediate (&lt; 30 days)</option>
                        <option>Next Quarter (&lt; 60 days)</option>
                        <option>Pipelines & Exploratory</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="emp-scope">Headcount Requirements & Scope</Label>
                    <Textarea
                      id="emp-scope"
                      rows={3}
                      required
                      placeholder="Describe tech stack, key achievements needed, location or remote expectations..."
                      value={formData.jobDescription}
                      onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full"
                  >
                    {loading ? (
                      <span>Allocating Sector Practice Partner...</span>
                    ) : (
                      <>
                        <span>Launch Retained Search Mandate</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </Section>

      {/* SECTION 3: Engagement Models */}
      <Section>
        <SectionHeader
          badge={<Badge variant="outline">Tailored Engagement Structures</Badge>}
          title="Flexible Models Built for Velocity"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4">
            <Badge variant="default">Retained Executive Search</Badge>
            <CardTitle>C-Suite & VP Placements</CardTitle>
            <CardDescription>
              Dedicated partner attention, comprehensive market mapping, and confidential outreach targeting the top 1% passive leadership tier.
            </CardDescription>
            <ul className="space-y-2.5 text-sm text-body pt-4 border-t border-border">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span>100% Dedicated Practice Partner</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Confidential Off-Market Sourcing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span>90-Day Unconditional Guarantee</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 space-y-4 border-primary/30 bg-gradient-to-b from-card to-primary-soft shadow-lift">
            <Badge variant="default" className="bg-primary text-primary-foreground border-primary">
              Embedded Talent Squads
            </Badge>
            <CardTitle>High-Velocity Engineering Scale</CardTitle>
            <CardDescription>
              Plug senior recruitment specialists directly into your Slack and ATS to close 5-15 critical technical hires per quarter.
            </CardDescription>
            <ul className="space-y-2.5 text-sm text-body pt-4 border-t border-primary-muted">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Direct Slack & ATS Integration</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span>No per-hire percentage gouging</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Candidate brand narrative building</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 space-y-4">
            <Badge variant="secondary">Contingency Technical Sourcing</Badge>
            <CardTitle>Niche Subject Matter Experts</CardTitle>
            <CardDescription>
              Zero upfront commitment. Pay only upon successful placement of hard-to-find individual contributors like Compilers, Rust, and LLMOps.
            </CardDescription>
            <ul className="space-y-2.5 text-sm text-body pt-4 border-t border-border">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Zero Upfront Financial Risk</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Pre-vetted technical code challenges</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Fast 14-day turnaround</span>
              </li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* SECTION 4: The 4-Pillar Employer Vetting Guarantee */}
      <Section variant="glow">
        <SectionHeader
          align="left"
          title="The Automation Studio Hiring Standard for Employers"
          className="mb-10"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 space-y-3">
            <IconBox>
              <Filter />
            </IconBox>
            <div className="text-primary font-bold text-sm">01 / Rigorous Screening</div>
            <Text size="sm">
              We reject 94% of inbound applicants before they reach your calendar.
            </Text>
          </Card>
          <Card className="p-6 space-y-3">
            <IconBox tone="accent">
              <Users />
            </IconBox>
            <div className="text-primary font-bold text-sm">02 / Culture & Values Fit</div>
            <Text size="sm">
              Behavioral interviewing modeled against high-pressure startup environments.
            </Text>
          </Card>
          <Card className="p-6 space-y-3">
            <IconBox tone="sky">
              <MessagesSquare />
            </IconBox>
            <div className="text-primary font-bold text-sm">03 / Real Backchannels</div>
            <Text size="sm">
              We speak directly with former engineering peers, not just cherry-picked references.
            </Text>
          </Card>
          <Card className="p-6 space-y-3">
            <IconBox tone="energy">
              <Handshake />
            </IconBox>
            <div className="text-primary font-bold text-sm">04 / Offer Closing</div>
            <Text size="sm">
              We manage expectations so 9 out of 10 extended offers are accepted without delay.
            </Text>
          </Card>
        </div>
      </Section>
    </div>
  );
}
