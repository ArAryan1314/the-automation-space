"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Briefcase,
  DollarSign,
  Lock,
  CheckCircle2,
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

export function CandidatesView() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    currentTitle: "",
    desiredCompensation: "",
    targetRoles: "",
    portfolioUrl: "",
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
          name: formData.fullName,
          email: formData.email,
          roleType: "candidate",
          message: `[Confidential Candidate Registration] Title: ${formData.currentTitle}. Desired Comp: ${formData.desiredCompensation}. Target: ${formData.targetRoles}. Profile: ${formData.portfolioUrl}`,
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
      {/* SECTION 1: Candidate Hero & Privacy Guarantee */}
      <PageHero
        badge={
          <Badge variant="default" className="py-1 px-3.5">
            <ShieldCheck className="h-4 w-4" />
            <span>Strictly Confidential Executive Representation</span>
          </Badge>
        }
        title={
          <>
            Accelerate Your Career Without{" "}
            <span className="gradient-text">Risking Your Current Role</span>
          </>
        }
        description="We act as dedicated talent agents for senior engineering leaders and executive operators. Access unlisted, founder-referred opportunities with guaranteed compensation advocacy."
        actions={
          <>
            <Link href="/jobs">
              <Button size="lg">
                <span>Browse Confidential Openings</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/salary-guide">
              <Button variant="secondary" size="lg">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>2026 Compensation Guide</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* SECTION 2: Confidential Profile Intake */}
      <Section variant="muted">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-5">
            <IconBox size="lg">
              <Lock />
            </IconBox>
            <Heading as="h2" size="h2">Confidential Profile Entry</Heading>
            <Text size="lg" variant="muted" className="max-w-lg">
              Your details are stored in our secure zero-leakage pipeline. Never shared without your direct written authorization.
            </Text>
          </div>

          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8">
              {submitted ? (
                <div className="p-5 rounded-2xl bg-primary-soft border border-primary-muted text-primary-hover text-sm space-y-2 animate-fade-up">
                  <div className="flex items-center gap-2 font-bold text-base">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Confidential Intake Activated</span>
                  </div>
                  <p className="leading-relaxed text-body">
                    A senior sector career partner has been paired with your profile. We will review match compatibility and reach out confidentially.
                  </p>
                  <Link href="/candidate-login">
                    <Button size="sm" className="mt-3">
                      Enter Candidate Portal
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="cand-name">Full Legal Name</Label>
                    <Input
                      id="cand-name"
                      type="text"
                      required
                      placeholder="e.g. David Lin"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cand-email">Personal Email</Label>
                      <Input
                        id="cand-email"
                        type="email"
                        required
                        placeholder="david.lin@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cand-title">Current Seniority</Label>
                      <Input
                        id="cand-title"
                        type="text"
                        required
                        placeholder="e.g. Staff ML Engineer"
                        value={formData.currentTitle}
                        onChange={(e) => setFormData({ ...formData, currentTitle: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cand-comp">Target Comp (Base + Equity)</Label>
                      <Input
                        id="cand-comp"
                        type="text"
                        required
                        placeholder="e.g. $280k - $340k"
                        value={formData.desiredCompensation}
                        onChange={(e) => setFormData({ ...formData, desiredCompensation: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cand-url">LinkedIn / GitHub URL</Label>
                      <Input
                        id="cand-url"
                        type="url"
                        required
                        placeholder="https://..."
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cand-goals">Target Companies, Sectors, or Career Goals</Label>
                    <Textarea
                      id="cand-goals"
                      rows={3}
                      required
                      placeholder="Tell us what excites you: Series B AI startups, public tech, remote flexibility..."
                      value={formData.targetRoles}
                      onChange={(e) => setFormData({ ...formData, targetRoles: e.target.value })}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full"
                  >
                    {loading ? (
                      <span>Registering with Sector Lead...</span>
                    ) : (
                      <>
                        <span>Submit Confidential Representation Request</span>
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

      {/* SECTION 3: Why Senior Engineers Partner with The Automation Studio */}
      <Section>
        <SectionHeader
          badge={<Badge variant="outline">Candidate Representation</Badge>}
          title="We Never Waste Your Time"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4">
            <IconBox>
              <Lock />
            </IconBox>
            <CardTitle>Zero Blind Resume Blasting</CardTitle>
            <CardDescription>
              We never submit your profile without a thorough mutual briefing and your explicit permission for every single organization.
            </CardDescription>
          </Card>

          <Card className="p-6 space-y-4">
            <IconBox tone="accent">
              <DollarSign />
            </IconBox>
            <CardTitle>Compensation Maximization</CardTitle>
            <CardDescription>
              Our partners negotiate for you behind the scenes, securing higher equity allocations and protecting sign-on bonuses.
            </CardDescription>
          </Card>

          <Card className="p-6 space-y-4">
            <IconBox tone="sky">
              <Briefcase />
            </IconBox>
            <CardTitle>Unlisted Founder Mandates</CardTitle>
            <CardDescription>
              Over 60% of our high-paying searches are confidential mandates not publicly advertised on job boards.
            </CardDescription>
          </Card>
        </div>
      </Section>
    </div>
  );
}
