"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Lock,
  Mail,
  ArrowRight,
  Briefcase,
  LogOut,
  Check,
  CircleDot,
  Circle,
  ShieldCheck,
  MessageSquareQuote,
  MapPin,
  CalendarClock,
  Layers,
} from "lucide-react";
import {
  Section,
  Heading,
  Text,
  Badge,
  Card,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Label,
  IconBox,
  StatsGrid,
} from "@/components/ui";

export function CandidateLoginView() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("elena.rostova@techcorp.io");
  const [password, setPassword] = useState("••••••••");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <div>
      {!isLoggedIn ? (
        /* Login Card */
        <Section variant="hero" spacing="lg" className="border-b border-border">
          <div className="max-w-md mx-auto space-y-8 animate-fade-up">
            <div className="text-center space-y-4">
              <Badge variant="default" className="py-1 px-3">
                <Users className="h-3.5 w-3.5" />
                <span>Candidate Self-Service Gateway</span>
              </Badge>
              <Heading as="h1" size="h2">
                Candidate Portal & Career Tracker
              </Heading>
              <Text size="sm" variant="muted" className="max-w-sm mx-auto">
                Check your active interview pipeline status, review technical screening milestones, and access 2026 tech compensation benchmarks.
              </Text>
            </div>

            <Card className="p-8 space-y-6 shadow-lift hover:shadow-lift">
              <div className="space-y-1">
                <CardTitle>Log In to Candidate Workspace</CardTitle>
                <CardDescription>
                  Enter your credentials or click below to simulate instant one-click demo access.
                </CardDescription>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <Label htmlFor="candidate-email">Registered email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-subtle-foreground" />
                    <Input
                      id="candidate-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="candidate-password">Security password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-subtle-foreground" />
                    <Input
                      id="candidate-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <span>Enter Candidate Portal (Simulated Demo)</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="border-t border-border pt-5 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2 text-xs">
                  <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Protected by candidate privacy encryption.</span>
                </div>
                <div className="text-center">
                  Looking for agency administration?{" "}
                  <Link href="/admin-login" className="text-primary hover:text-primary-hover font-semibold">
                    Go to Admin Console
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </Section>
      ) : (
        /* Dashboard View */
        <Section spacing="sm">
          <div className="space-y-8 animate-fade-up">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
              <div className="flex items-center gap-4">
                <IconBox tone="primary" size="lg">
                  <Users />
                </IconBox>
                <div className="space-y-1">
                  <Badge variant="success">Active Candidate Profile</Badge>
                  <Heading as="h1" size="h3">
                    Welcome, Elena Rostova
                  </Heading>
                  <Text size="sm" variant="muted">
                    {email} · Senior Lead Cloud Architect
                  </Text>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsLoggedIn(false)}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </Button>
            </div>

            <StatsGrid
              columns={3}
              stats={[
                { label: "Active representations", value: 1, icon: <Briefcase className="h-4 w-4" /> },
                { label: "Current stage", value: "Stage 4", icon: <Layers className="h-4 w-4" />, highlight: true },
                { label: "Next briefing", value: "Tue 2:00 PM", icon: <CalendarClock className="h-4 w-4" /> },
              ]}
            />

            {/* Application Pipeline Status */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                <span>Active Representation & Sourcing Status</span>
              </h2>

              <Card className="p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-foreground text-base">
                      VP of Artificial Intelligence & LLM Systems
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-subtle-foreground" />
                      San Francisco, CA · $320k - $420k + Equity
                    </p>
                  </div>
                  <Badge variant="warning">
                    Stage 4: Partner Calibrated
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm font-medium">
                  <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    <Check className="h-4 w-4" />
                    Intake Received
                  </div>
                  <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    <Check className="h-4 w-4" />
                    Partner Evaluated
                  </div>
                  <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-primary-soft border border-primary/30 text-primary-hover font-semibold">
                    <CircleDot className="h-4 w-4" />
                    Partner Review
                  </div>
                  <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-surface border border-border text-subtle-foreground">
                    <Circle className="h-4 w-4" />
                    Client Onsite
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-border text-sm text-body space-y-1.5">
                  <span className="font-semibold text-primary-hover flex items-center gap-1.5 text-xs">
                    <MessageSquareQuote className="h-3.5 w-3.5" />
                    Assigned Technical Partner Advisory Note:
                  </span>
                  <p className="leading-relaxed">
                    &ldquo;Elena&rsquo;s background in distributed Kubernetes architectures and Golang clusters matches the client&rsquo;s core infrastructure requirements. We have scheduled an exploratory briefing with the CTO for Tuesday at 2:00 PM PST.&rdquo;
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}
