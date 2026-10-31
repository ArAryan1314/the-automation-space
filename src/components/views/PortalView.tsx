"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, Database, User, FileText, RefreshCw, Inbox, Users, Building2 } from "lucide-react";
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
  Textarea,
  Label,
  IconBox,
  StatsGrid,
} from "@/components/ui";

interface Submission {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  roleType: string;
  message: string;
  aiDraft: string;
}

export function PortalView() {
  const [formData, setFormData] = useState({ name: "", email: "", roleType: "candidate", message: "" });
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(true);

  const syncData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/ai-respond");
      const json = await res.json();
      if (json.success) setSubmissions(json.data);
    } catch {
      console.error("Data syncing failed.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/ai-respond")
      .then((res) => res.json())
      .then((json) => {
        if (active && json.success) setSubmissions(json.data);
      })
      .catch(() => console.error("Data syncing failed."))
      .finally(() => {
        if (active) setRefreshing(false);
      });
    return () => { active = false; };
  }, []);

  const handleCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/ai-respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ name: "", email: "", roleType: "candidate", message: "" });
        await syncData();
      }
    } catch {
      console.error("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const candidateCount = submissions.filter((s) => s.roleType === "candidate").length;
  const employerCount = submissions.filter((s) => s.roleType === "employer").length;

  return (
    <div className="py-10 space-y-6">
      <Section spacing="none">
        <div className="space-y-8 animate-fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
            <div className="flex items-start gap-4">
              <IconBox tone="primary">
                <Database />
              </IconBox>
              <div>
                <Heading as="h1" size="h3">
                  The Automation Studio · Live Telemetry Console
                </Heading>
                <Text size="sm" variant="muted" className="mt-1">
                  Secure server persistence engine routing directly to executive search directors.
                </Text>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={syncData}
              disabled={refreshing}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
              <span>Sync Live Data ({submissions.length} Records)</span>
            </Button>
          </div>

          <StatsGrid
            columns={3}
            stats={[
              { label: "Total elements", value: submissions.length, icon: <Inbox className="h-4 w-4" />, highlight: true },
              { label: "Candidates", value: candidateCount, icon: <Users className="h-4 w-4" /> },
              { label: "Employers", value: employerCount, icon: <Building2 className="h-4 w-4" /> },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Data Intake Form */}
            <div className="lg:col-span-5">
              <Card className="p-6">
                <div className="flex items-start gap-3 mb-6">
                  <IconBox tone="primary" size="sm">
                    <Sparkles />
                  </IconBox>
                  <div className="space-y-1">
                    <CardTitle>Portal Intake Entry</CardTitle>
                    <CardDescription>
                      Enter candidate or employer requirements to dispatch through intake evaluation.
                    </CardDescription>
                  </div>
                </div>

                <form onSubmit={handleCommit} className="space-y-5">
                  <div>
                    <Label htmlFor="portal-name">Full name</Label>
                    <Input
                      id="portal-name"
                      type="text"
                      required
                      placeholder="e.g. Rachel Adams"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="portal-email">Email address</Label>
                    <Input
                      id="portal-email"
                      type="email"
                      required
                      placeholder="rachel@domain.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="portal-role">Classification</Label>
                    <select
                      id="portal-role"
                      className="w-full h-11 rounded-xl border border-input bg-surface px-3.5 text-sm text-foreground shadow-sm transition-all focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
                      value={formData.roleType}
                      onChange={e => setFormData({...formData, roleType: e.target.value})}
                    >
                      <option value="candidate">Candidate (Job Seeker)</option>
                      <option value="employer">Employer (Hiring Firm)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="portal-message">Requirements / message</Label>
                    <Textarea
                      id="portal-message"
                      rows={4}
                      required
                      placeholder="Outline your background, goals, or hiring needs..."
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full"
                  >
                    {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Commit Application & Generate Draft"}
                  </Button>
                </form>
              </Card>
            </div>

            {/* RIGHT COLUMN: Live Telemetry Stream */}
            <div className="lg:col-span-7">
              <Card className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border mb-5">
                  <div>
                    <CardTitle className="text-base">Live Submission Stream</CardTitle>
                    <CardDescription className="font-mono text-xs text-primary">
                      Private submission store
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="font-mono">
                    {submissions.length} Total Elements
                  </Badge>
                </div>

                {submissions.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-16 px-6 text-center text-sm text-muted-foreground bg-surface border border-dashed border-border-strong rounded-xl">
                    <IconBox tone="neutral">
                      <Inbox />
                    </IconBox>
                    No submissions to show yet. Submit the form to watch real-time persistence.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                    {submissions.map((sub) => (
                      <div key={sub.id} className="p-5 rounded-xl bg-card border border-border space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm border-b border-border pb-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <User className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="font-bold text-foreground">{sub.name}</span>
                            <span className="text-xs text-subtle-foreground font-mono truncate">({sub.email})</span>
                          </div>
                          <Badge variant={sub.roleType === "employer" ? "accent" : "default"} className="capitalize">
                            {sub.roleType}
                          </Badge>
                        </div>

                        <div className="text-sm text-body">
                          <span className="text-xs font-semibold text-muted-foreground block mb-1.5">Raw Inquiry Input:</span>
                          <p className="bg-surface p-3 rounded-lg border border-border leading-relaxed">{sub.message}</p>
                        </div>

                        <div className="bg-primary-soft border border-primary-muted p-3.5 rounded-lg text-sm">
                          <span className="text-primary-hover font-semibold flex items-center mb-1.5 text-xs">
                            <FileText className="h-3.5 w-3.5 mr-1.5" /> Response Email Draft:
                          </span>
                          <p className="whitespace-pre-wrap leading-relaxed text-body bg-card p-3 rounded-lg border border-border">
                            {sub.aiDraft}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
