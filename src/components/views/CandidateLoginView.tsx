"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CalendarClock,
  Clock,
  Loader2,
  Lock,
  LogOut,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import {
  AlertBanner,
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
import { callApi } from "@/lib/api";
import type { CandidateAccountRecord } from "@/lib/records";

interface PortalSession {
  authenticated: boolean;
  account: CandidateAccountRecord | null;
  applications: { id: string; timestamp: string; jobTitle: string }[];
}

const SIGNED_OUT: PortalSession = { authenticated: false, account: null, applications: [] };

export function CandidateLoginView() {
  const [session, setSession] = useState<PortalSession | null>(null);
  const [resetToken, setResetToken] = useState("");

  const loadSession = useCallback(
    () => callApi<PortalSession>("/api/candidate-session").catch(() => SIGNED_OUT).then(setSession),
    []
  );

  useEffect(() => {
    let active = true;
    callApi<PortalSession>("/api/candidate-session")
      .catch(() => SIGNED_OUT)
      .then((result) => {
        if (!active) return;
        setResetToken(new URLSearchParams(window.location.search).get("reset") ?? "");
        setSession(result);
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

  if (resetToken || !session.account) {
    return (
      <AccessForms
        resetToken={resetToken}
        // A new password ends the old session, so the dashboard must not come back from stale state.
        onResetDone={() => {
          setResetToken("");
          setSession(SIGNED_OUT);
        }}
        onSignedIn={loadSession}
      />
    );
  }

  return <Dashboard account={session.account} applications={session.applications} onSignedOut={() => setSession(SIGNED_OUT)} />;
}

type AccessMode = "login" | "register" | "forgot" | "reset";

const FORM_TEXT: Record<AccessMode, { title: string; description: string; submit: string }> = {
  login: {
    title: "Sign in to your account",
    description: "Enter the email and password you registered with.",
    submit: "Sign in",
  },
  register: {
    title: "Request a candidate account",
    description: "A super admin reviews each request before the account can sign in.",
    submit: "Send request",
  },
  forgot: {
    title: "Reset your password",
    description: "Enter your email address and we will send you a reset link.",
    submit: "Send reset link",
  },
  reset: {
    title: "Choose a new password",
    description: "Enter a new password for your account.",
    submit: "Save new password",
  },
};

function AccessForms({
  resetToken,
  onResetDone,
  onSignedIn,
}: {
  resetToken: string;
  onResetDone: () => void;
  onSignedIn: () => Promise<void>;
}) {
  const [mode, setMode] = useState<AccessMode>(resetToken ? "reset" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const switchMode = (next: AccessMode) => {
    setMode(next);
    setError("");
    setNotice("");
  };

  // Takes the token out of the address bar and browser history.
  const leaveResetLink = () => {
    window.history.replaceState(null, "", window.location.pathname);
    onResetDone();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);
    try {
      if (mode === "register") {
        await callApi("/api/candidate-session", { action: "register", name, email, password });
        setPassword("");
        setMode("login");
        setNotice("Request received. You can sign in once a super admin approves your account.");
      } else if (mode === "forgot") {
        await callApi("/api/candidate-session", { action: "request-reset", email });
        setMode("login");
        setNotice("If that email has an account, a reset link is on its way. If nothing arrives, please contact us.");
      } else if (mode === "reset") {
        await callApi("/api/candidate-session", { action: "reset", token: resetToken, password });
        setPassword("");
        setMode("login");
        setNotice("Your password has been changed. Please sign in.");
        leaveResetLink();
      } else {
        await callApi("/api/candidate-session", { action: "login", email, password });
        await onSignedIn();
      }
    } catch (err) {
      setPassword("");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section variant="hero" spacing="lg" className="border-b border-border">
      <div className="max-w-md mx-auto space-y-8 animate-fade-up">
        <div className="text-center space-y-4">
          <Badge variant="default" className="py-1 px-3">
            <Users className="h-3.5 w-3.5" />
            <span>Candidate Portal</span>
          </Badge>
          <Heading as="h1" size="h2">
            Candidate Portal & Career Tracker
          </Heading>
          <Text size="sm" variant="muted" className="max-w-sm mx-auto">
            Request an account and sign in once a super admin approves it, then follow your job applications in one place.
          </Text>
        </div>

        <Card className="p-8 space-y-6 shadow-lift hover:shadow-lift">
          {mode !== "reset" && (
            <TabsList>
              <TabsTrigger active={mode === "login"} onClick={() => switchMode("login")}>
                <Lock className="h-4 w-4" />
                Sign in
              </TabsTrigger>
              <TabsTrigger active={mode === "register"} onClick={() => switchMode("register")}>
                <UserPlus className="h-4 w-4" />
                Request access
              </TabsTrigger>
            </TabsList>
          )}

          <div className="space-y-1">
            <CardTitle>{FORM_TEXT[mode].title}</CardTitle>
            <CardDescription>{FORM_TEXT[mode].description}</CardDescription>
          </div>

          {notice && <AlertBanner variant="success">{notice}</AlertBanner>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" && (
              <div>
                <Label htmlFor="candidate-name">Full name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-subtle-foreground" />
                  <Input
                    id="candidate-name"
                    required
                    minLength={2}
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {mode !== "reset" && (
              <div>
                <Label htmlFor="candidate-email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-subtle-foreground" />
                  <Input
                    id="candidate-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {mode !== "forgot" && (
              <div>
                <Label htmlFor="candidate-password">{mode === "reset" ? "New password" : "Password"}</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-subtle-foreground" />
                  <Input
                    id="candidate-password"
                    type="password"
                    required
                    minLength={mode === "login" ? undefined : 12}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {mode !== "login" && (
                  <p className="mt-1.5 text-xs text-muted-foreground">Use at least 12 characters.</p>
                )}
              </div>
            )}

            {error && (
              <p role="alert" className="text-sm text-red-300">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>{FORM_TEXT[mode].submit}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            {mode === "login" && (
              <button
                type="button"
                onClick={() => switchMode("forgot")}
                className="block mx-auto text-sm text-primary hover:text-primary-hover font-semibold cursor-pointer"
              >
                Forgot your password?
              </button>
            )}

            {mode === "reset" && (
              <button
                type="button"
                onClick={() => {
                  leaveResetLink();
                  switchMode("login");
                }}
                className="block mx-auto text-sm text-primary hover:text-primary-hover font-semibold cursor-pointer"
              >
                Back to sign in
              </button>
            )}
          </form>

          <div className="border-t border-border pt-5 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2 text-xs">
              <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Only approved accounts can sign in.</span>
            </div>
            <div className="text-center">
              Looking for agency administration?{" "}
              <Link href="/admin-login" className="text-primary hover:text-primary-hover font-semibold">
                Go to Super Admin Console
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function Dashboard({
  account,
  applications,
  onSignedOut,
}: {
  account: CandidateAccountRecord;
  applications: PortalSession["applications"];
  onSignedOut: () => void;
}) {
  const signOut = async () => {
    await callApi("/api/candidate-session", { action: "logout" }).catch(() => undefined);
    onSignedOut();
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" });

  return (
    <Section spacing="sm">
      <div className="space-y-8 animate-fade-up">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-4 min-w-0">
            <IconBox tone="primary" size="lg">
              <Users />
            </IconBox>
            <div className="space-y-1 min-w-0">
              <Badge variant="success">Approved account</Badge>
              <Heading as="h1" size="h3">
                Welcome, {account.name}
              </Heading>
              <Text size="sm" variant="muted" className="break-all">
                {account.email}
              </Text>
            </div>
          </div>

          <Button variant="secondary" size="sm" onClick={signOut}>
            <LogOut className="h-3.5 w-3.5" />
            <span>Log Out</span>
          </Button>
        </div>

        <StatsGrid
          columns={2}
          stats={[
            { label: "Job applications", value: applications.length, icon: <Briefcase className="h-4 w-4" />, highlight: true },
            {
              label: "Member since",
              value: formatDate(account.timestamp),
              icon: <CalendarClock className="h-4 w-4" />,
            },
          ]}
        />

        <div className="space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            <span>Your applications</span>
          </h2>

          {applications.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-12 px-6 bg-card border border-dashed border-border-strong rounded-2xl space-y-3">
              <p>Jobs you apply for while signed in will appear here.</p>
              <Link href="/jobs" className="text-primary hover:text-primary-hover font-semibold">
                Browse open roles
              </Link>
            </div>
          ) : (
            applications.map((application) => (
              <Card key={application.id} className="p-6 flex flex-wrap items-center justify-between gap-3">
                <CardTitle>{application.jobTitle}</CardTitle>
                <span className="text-xs text-subtle-foreground flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  Applied {formatDate(application.timestamp)}
                </span>
              </Card>
            ))
          )}
        </div>
      </div>
    </Section>
  );
}
