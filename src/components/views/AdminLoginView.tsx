"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Contact,
  FileUser,
  Inbox,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  RefreshCw,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardTitle,
  Heading,
  IconBox,
  Input,
  Label,
  Section,
  StatsGrid,
  TabsList,
  TabsTrigger,
  Text,
} from "@/components/ui";
import type { JobListing } from "@/data/agencyData";
import type { ApplicationRecord, CandidateAccountRecord, ContactRecord, SubmissionRecord } from "@/lib/records";
import { ApplicationsPanel } from "./admin/ApplicationsPanel";
import { CandidatesPanel } from "./admin/CandidatesPanel";
import { ContactsPanel } from "./admin/ContactsPanel";
import { JobsPanel } from "./admin/JobsPanel";
import { SubmissionsPanel } from "./admin/SubmissionsPanel";
import { ApiError, callApi } from "./admin/adminApi";

interface Session {
  authenticated: boolean;
  username: string | null;
}

interface ConsoleData {
  jobs: JobListing[];
  contacts: ContactRecord[];
  applications: ApplicationRecord[];
  submissions: SubmissionRecord[];
  candidates: CandidateAccountRecord[];
}

type TabKey = "jobs" | "candidates" | "contacts" | "applications" | "submissions";

function loadConsoleData(): Promise<ConsoleData> {
  return Promise.all([
    callApi<JobListing[]>("/api/jobs"),
    callApi<ContactRecord[]>("/api/contacts"),
    callApi<ApplicationRecord[]>("/api/applications"),
    callApi<SubmissionRecord[]>("/api/ai-respond"),
    callApi<CandidateAccountRecord[]>("/api/candidates"),
  ]).then(([jobs, contacts, applications, submissions, candidates]) => ({
    jobs,
    contacts,
    applications,
    submissions,
    candidates,
  }));
}

export function AdminLoginView() {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const handleSessionExpired = useCallback(() => {
    setSessionExpired(true);
    setSession({ authenticated: false, username: null });
  }, []);

  useEffect(() => {
    let active = true;
    callApi<Session>("/api/admin-session")
      .catch((): Session => ({ authenticated: false, username: null }))
      .then((result) => {
        if (active) setSession(result);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!session) {
    return (
      <Section variant="hero" spacing="lg" className="border-b border-border">
        <div className="flex justify-center text-muted-foreground" role="status" aria-label="Loading">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Section>
    );
  }

  if (!session.authenticated) {
    return (
      <LoginForm
        notice={sessionExpired ? "Your session ended. Please sign in again." : ""}
        onSignedIn={(result) => {
          setSessionExpired(false);
          setSession(result);
        }}
      />
    );
  }

  return (
    <AdminConsole
      username={session.username ?? ""}
      onSignedOut={() => setSession({ authenticated: false, username: null })}
      onSessionExpired={handleSessionExpired}
    />
  );
}

function LoginForm({ notice, onSignedIn }: { notice: string; onSignedIn: (session: Session) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      onSignedIn(await callApi<Session>("/api/admin-session", { action: "login", username, password }));
    } catch (err) {
      setPassword("");
      setError(err instanceof Error ? err.message : "Could not sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section variant="hero" spacing="lg" className="border-b border-border">
      <div className="max-w-md mx-auto space-y-8 animate-fade-up">
        <div className="text-center space-y-4">
          <Badge variant="destructive" className="py-1 px-3">
            <Lock className="h-3.5 w-3.5" />
            <span>Restricted Super Admin Portal</span>
          </Badge>
          <Heading as="h1" size="h2">
            Super Admin Console
          </Heading>
          <Text size="sm" variant="muted" className="max-w-sm mx-auto">
            Authorized personnel only. Approve candidate accounts, manage job postings and review contacts, applications and intakes.
          </Text>
        </div>

        <Card className="p-8 space-y-6 shadow-lift hover:shadow-lift">
          <div className="flex items-start gap-4">
            <IconBox tone="primary">
              <KeyRound />
            </IconBox>
            <div className="space-y-1">
              <CardTitle>Super admin sign in</CardTitle>
              <CardDescription>Enter your super admin email and password.</CardDescription>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="admin-username">Email</Label>
              <Input
                id="admin-username"
                type="email"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {(error || notice) && (
              <p role="alert" className="text-sm text-red-300">
                {error || notice}
              </p>
            )}

            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="flex items-center gap-2 rounded-xl bg-surface border border-border px-3.5 py-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
            <span>Sessions end after 8 hours. Repeated failed sign-ins are blocked for 15 minutes.</span>
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
  );
}

function AdminConsole({
  username,
  onSignedOut,
  onSessionExpired,
}: {
  username: string;
  onSignedOut: () => void;
  onSessionExpired: () => void;
}) {
  const [data, setData] = useState<ConsoleData | null>(null);
  const [tab, setTab] = useState<TabKey>("jobs");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const applyResult = useCallback(
    (load: Promise<ConsoleData>, isActive: () => boolean = () => true) =>
      load
        .then((result) => {
          if (!isActive()) return;
          setData(result);
          setLoadError("");
        })
        .catch((err: unknown) => {
          if (!isActive()) return;
          if (err instanceof ApiError && err.status === 401) onSessionExpired();
          else setLoadError("Could not load the latest records. Please try again.");
        })
        .finally(() => {
          if (isActive()) setLoading(false);
        }),
    [onSessionExpired]
  );

  useEffect(() => {
    let active = true;
    applyResult(loadConsoleData(), () => active);
    return () => {
      active = false;
    };
  }, [applyResult]);

  const refresh = () => {
    setLoading(true);
    applyResult(loadConsoleData());
  };

  const signOut = async () => {
    await callApi("/api/admin-session", { action: "logout" }).catch(() => undefined);
    onSignedOut();
  };

  const tabs: { key: TabKey; label: string; count: number; icon: React.ReactNode }[] = [
    { key: "jobs", label: "Job postings", count: data?.jobs.length ?? 0, icon: <Briefcase className="h-4 w-4" /> },
    {
      key: "candidates",
      label: "Pending candidates",
      count: data?.candidates.filter((candidate) => candidate.status === "pending").length ?? 0,
      icon: <UserCheck className="h-4 w-4" />,
    },
    { key: "contacts", label: "Contacts", count: data?.contacts.length ?? 0, icon: <Contact className="h-4 w-4" /> },
    { key: "applications", label: "Applications", count: data?.applications.length ?? 0, icon: <FileUser className="h-4 w-4" /> },
    { key: "submissions", label: "Intakes", count: data?.submissions.length ?? 0, icon: <Inbox className="h-4 w-4" /> },
  ];

  return (
    <Section spacing="sm">
      <div className="space-y-8 animate-fade-up">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-2">
            <Badge variant="success">
              <ShieldCheck className="h-3.5 w-3.5" />
              Signed in as {username}
            </Badge>
            <Heading as="h1" size="h3">
              Super Admin Console
            </Heading>
            <Text size="sm" variant="muted">
              Approve candidate accounts, manage job postings and review what visitors send you.
            </Text>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={refresh} disabled={loading}>
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
              <span>Refresh</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="text-red-300 border-red-500/40 hover:bg-red-500/10 hover:border-red-500/60"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign out</span>
            </Button>
          </div>
        </div>

        <StatsGrid
          columns={5}
          stats={tabs.map((item, index) => ({
            label: item.label,
            value: item.count,
            icon: item.icon,
            highlight: index === 0,
          }))}
        />

        {loadError && (
          <p role="alert" className="text-sm text-red-300">
            {loadError}
          </p>
        )}

        <TabsList>
          {tabs.map((item) => (
            <TabsTrigger key={item.key} active={tab === item.key} onClick={() => setTab(item.key)}>
              {item.icon}
              {item.label} ({item.count})
            </TabsTrigger>
          ))}
        </TabsList>

        {!data ? (
          loading && (
            <div className="flex justify-center py-16 text-muted-foreground" role="status" aria-label="Loading">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )
        ) : (
          <>
            {tab === "jobs" && <JobsPanel jobs={data.jobs} onChanged={refresh} onSessionExpired={onSessionExpired} />}
            {tab === "candidates" && (
              <CandidatesPanel candidates={data.candidates} onChanged={refresh} onSessionExpired={onSessionExpired} />
            )}
            {tab === "contacts" && (
              <ContactsPanel contacts={data.contacts} onChanged={refresh} onSessionExpired={onSessionExpired} />
            )}
            {tab === "applications" && (
              <ApplicationsPanel applications={data.applications} onChanged={refresh} onSessionExpired={onSessionExpired} />
            )}
            {tab === "submissions" && <SubmissionsPanel submissions={data.submissions} />}
          </>
        )}
      </div>
    </Section>
  );
}
