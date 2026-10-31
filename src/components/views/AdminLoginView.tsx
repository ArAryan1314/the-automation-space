"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Lock,
  User,
  Mail,
  FileText,
  Clock,
  ArrowRight,
  LogOut,
  RefreshCw,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Inbox,
  Users,
  Building2,
  KeyRound,
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

interface SubmissionRecord {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  roleType: string;
  message: string;
  aiDraft: string;
}

export function AdminLoginView() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [authRejected, setAuthRejected] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-respond", { headers: { "X-Admin-Key": adminKey } });
      if (res.status === 401) {
        setIsAuthorized(false);
        setAuthRejected(true);
        return;
      }
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSubmissions(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthRejected(false);
    setIsAuthorized(true);
    fetchRecords();
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const candidateCount = submissions.filter((s) => s.roleType === "candidate").length;
  const employerCount = submissions.filter((s) => s.roleType === "employer").length;

  return (
    <div>
      {!isAuthorized ? (
        /* Auth Gate */
        <Section variant="hero" spacing="lg" className="border-b border-border">
          <div className="max-w-md mx-auto space-y-8 animate-fade-up">
            <div className="text-center space-y-4">
              <Badge variant="destructive" className="py-1 px-3">
                <Lock className="h-3.5 w-3.5" />
                <span>Restricted Executive Operations Portal</span>
              </Badge>
              <Heading as="h1" size="h2">
                Admin Operations Console
              </Heading>
              <Text size="sm" variant="muted" className="max-w-sm mx-auto">
                Authorized personnel only. Live telemetry queue, candidate-client matchmaking queue, and requisition intake inspector.
              </Text>
            </div>

            <Card className="p-8 space-y-6 shadow-lift hover:shadow-lift">
              <div className="flex items-start gap-4">
                <IconBox tone="primary">
                  <KeyRound />
                </IconBox>
                <div className="space-y-1">
                  <CardTitle>Agency Executive Authentication</CardTitle>
                  <CardDescription>
                    Enter your administrative key to unlock the live submission queue.
                  </CardDescription>
                </div>
              </div>

              <form onSubmit={handleAuth} className="space-y-5">
                <div>
                  <Label htmlFor="admin-key">Security passkey</Label>
                  <Input
                    id="admin-key"
                    type="password"
                    required
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="font-mono"
                  />
                  {authRejected && (
                    <Badge variant="destructive" className="mt-2">
                      That passkey was not accepted.
                    </Badge>
                  )}
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <span>Authorize & Mount Telemetry Stream</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="flex items-center gap-2 rounded-xl bg-surface border border-border px-3.5 py-2.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Sessions are scoped to this browser and every access is logged.</span>
              </div>

              <div className="text-center text-sm text-muted-foreground border-t border-border pt-5">
                Are you an applicant?{" "}
                <Link href="/candidate-login" className="text-primary hover:text-primary-hover font-semibold">
                  Go to Candidate Portal
                </Link>
              </div>
            </Card>
          </div>
        </Section>
      ) : (
        /* Live Monitor Dashboard */
        <Section spacing="sm">
          <div className="space-y-8 animate-fade-up">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
              <div className="space-y-2">
                <Badge variant="success">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin Authorization Level 1 Active
                </Badge>
                <Heading as="h1" size="h3">
                  Live Submissions ({submissions.length} Records)
                </Heading>
                <Text size="sm" variant="muted">
                  Real-time pipeline routing & intake verification
                </Text>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={fetchRecords}
                  disabled={loading}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
                  <span>Sync Records</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAuthorized(false)}
                  className="text-red-300 border-red-500/40 hover:bg-red-500/10 hover:border-red-500/60"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Lock Console</span>
                </Button>
              </div>
            </div>

            <StatsGrid
              columns={3}
              stats={[
                { label: "Records stored", value: submissions.length, icon: <Inbox className="h-4 w-4" />, highlight: true },
                { label: "Candidate intakes", value: candidateCount, icon: <Users className="h-4 w-4" /> },
                { label: "Employer requisitions", value: employerCount, icon: <Building2 className="h-4 w-4" /> },
              ]}
            />

            {/* Submissions Stream */}
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {submissions.length === 0 ? (
                <div className="flex flex-col items-center gap-3 text-center text-sm text-muted-foreground py-16 px-6 bg-card border border-dashed border-border-strong rounded-2xl">
                  <IconBox tone="neutral">
                    <Inbox />
                  </IconBox>
                  No records stored yet. Submit an intake via the Home or Contact page to watch live ingestion.
                </div>
              ) : (
                submissions.map((sub) => (
                  <Card key={sub.id} className="p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                      <div className="flex items-center gap-3">
                        <IconBox tone="primary" size="sm">
                          <User />
                        </IconBox>
                        <div>
                          <div className="font-bold text-foreground text-sm">{sub.name}</div>
                          <div className="text-muted-foreground text-sm flex items-center mt-0.5 gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-subtle-foreground" />
                            <span>{sub.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={sub.roleType === "employer" ? "accent" : "default"} className="capitalize">
                          {sub.roleType}
                        </Badge>
                        <span className="text-xs font-mono text-subtle-foreground flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {new Date(sub.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-surface border border-border text-sm text-body">
                      <span className="font-semibold text-xs text-muted-foreground block mb-1.5">
                        Inbound Requisition / Inquiry:
                      </span>
                      <p className="leading-relaxed whitespace-pre-wrap">{sub.message}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-primary-soft border border-primary-muted text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-xs text-primary-hover flex items-center">
                          <FileText className="h-3.5 w-3.5 mr-1.5" />
                          Intake Confirmation & Response Payload:
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyText(sub.id, sub.aiDraft)}
                          className="h-7 text-xs px-2"
                        >
                          {copiedId === sub.id ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                              <span className="text-primary">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy Draft</span>
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="p-3 rounded-lg bg-card border border-border text-body leading-relaxed whitespace-pre-wrap">
                        {sub.aiDraft}
                      </p>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}
