"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Loader2,
  Search,
  MapPin,
  DollarSign,
  Filter,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  Users,
  Handshake,
} from "lucide-react";
import {
  Section,
  PageHero,
  Badge,
  Card,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Label,
  Modal,
  IconBox,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { JOB_TYPES, JobListing } from "@/data/agencyData";
import { timeAgo } from "@/lib/utils";
import { callApi } from "@/lib/api";

const emptyApplication = { name: "", email: "", profileUrl: "" };

export function JobsView() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [jobsStatus, setJobsStatus] = useState<"loading" | "ready" | "error">("loading");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [application, setApplication] = useState(emptyApplication);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    let active = true;
    callApi<JobListing[]>("/api/jobs")
      .then((result) => {
        if (!active) return;
        setJobs(result);
        setJobsStatus("ready");
      })
      .catch(() => {
        if (active) setJobsStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  const departments = ["All", ...Array.from(new Set(jobs.map((job) => job.department))).sort()];
  const jobTypes = ["All", ...JOB_TYPES];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = selectedDept === "All" || job.department === selectedDept;
    const matchesType = selectedType === "All" || job.type === selectedType;
    return matchesSearch && matchesDept && matchesType;
  });

  const closeApplication = () => {
    setSelectedJob(null);
    setApplicationSuccess(false);
    setApplyError("");
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setApplying(true);
    setApplyError("");
    try {
      await callApi("/api/applications", { ...application, jobId: selectedJob.id });
      setApplication(emptyApplication);
      setApplicationSuccess(true);
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div>
      {/* SECTION 1: Page Header with Search Bar */}
      <PageHero
        badge={
          <Badge variant="default" className="py-1 px-3.5">
            <Sparkles className="h-4 w-4" />
            <span>Curated Technology & Leadership Opportunities</span>
          </Badge>
        }
        title="Executive & Engineering Career Portal"
        description="Every opportunity is directly retained and backed by verified compensation guarantees, transparent interview timelines, and direct partner representation."
      >
        {/* Global Search Bar */}
        <div className="max-w-3xl mx-auto mt-8 bg-card border border-border rounded-2xl p-2 shadow-lift flex flex-col sm:flex-row items-center gap-2">
          <div className="flex-1 flex items-center px-3 h-11 w-full">
            <Search className="h-4 w-4 text-subtle-foreground mr-2.5 flex-shrink-0" />
            <input
              type="text"
              aria-label="Search jobs"
              placeholder="Search by title, technical stack (e.g. PyTorch, Rust, Kubernetes)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-subtle-foreground focus:outline-none w-full"
            />
          </div>
          <div className="flex items-center w-full sm:w-auto">
            <select
              aria-label="Department"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="h-11 w-full sm:w-auto bg-surface border border-border rounded-xl px-3 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </PageHero>

      {/* SECTION 2 & 3: Active Pipeline Filters, Counts & Job Grid */}
      <Section>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-border text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">{filteredJobs.length}</span>
            <span>Verified Positions Available</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-subtle-foreground">Filter By Engagement:</span>
            <TabsList>
              {jobTypes.map((type) => (
                <TabsTrigger
                  key={type}
                  active={selectedType === type}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {jobsStatus === "loading" && (
          <div className="flex justify-center py-16 text-muted-foreground" role="status" aria-label="Loading open roles">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {jobsStatus !== "loading" && filteredJobs.length === 0 && (
          <div className="flex flex-col items-center gap-3 text-center text-sm text-muted-foreground py-16 px-6 bg-card border border-dashed border-border-strong rounded-2xl">
            <IconBox tone="neutral">
              <Briefcase />
            </IconBox>
            {jobsStatus === "error"
              ? "We could not load the open roles. Please refresh the page or try again shortly."
              : jobs.length === 0
                ? "There are no open roles right now. Please check back soon."
                : "No roles match your search. Try different keywords or filters."}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="default">{job.type}</Badge>
                  <span className="text-xs text-subtle-foreground flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {timeAgo(job.postedAt)}
                  </span>
                </div>

                <CardTitle className="group-hover:text-primary transition-colors">
                  {job.title}
                </CardTitle>

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
                  <MapPin className="h-4 w-4 text-subtle-foreground flex-shrink-0" />
                  <span>{job.location}</span>
                </div>

                <div className="mt-2 text-sm font-semibold text-primary-hover flex items-center gap-1">
                  <DollarSign className="h-4 w-4 flex-shrink-0" />
                  <span>{job.salaryRange}</span>
                </div>

                <CardDescription className="mt-4">
                  {job.overview}
                </CardDescription>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md text-xs bg-surface border border-border text-body font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
                <span className="text-xs text-subtle-foreground font-medium">
                  Level: {job.experienceLevel}
                </span>
                <Button
                  size="sm"
                  onClick={() => setSelectedJob(job)}
                >
                  <span>Quick Apply</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* SECTION 4: Application Modal Component */}
      <Modal
        isOpen={!!selectedJob}
        onClose={closeApplication}
        title={selectedJob ? selectedJob.title : ""}
        description={selectedJob ? `${selectedJob.location} · ${selectedJob.salaryRange}` : ""}
      >
        {applicationSuccess ? (
          <div className="p-4 rounded-xl bg-primary-soft border border-primary-muted text-primary-hover text-sm flex items-center gap-2 animate-fade-up">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
            <span>Application transmitted! Assigned Partner will contact you within 24 hours.</span>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-5">
            <div>
              <Label htmlFor="apply-name">Your Full Name</Label>
              <Input
                id="apply-name"
                type="text"
                required
                minLength={2}
                autoComplete="name"
                value={application.name}
                onChange={(e) => setApplication({ ...application, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="apply-email">Your Confidential Email</Label>
              <Input
                id="apply-email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@executive.com"
                value={application.email}
                onChange={(e) => setApplication({ ...application, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="apply-profile">LinkedIn / GitHub / Portfolio Link</Label>
              <Input
                id="apply-profile"
                type="url"
                required
                placeholder="https://linkedin.com/in/yourprofile"
                value={application.profileUrl}
                onChange={(e) => setApplication({ ...application, profileUrl: e.target.value })}
              />
            </div>
            {applyError && <p role="alert" className="text-sm text-red-300">{applyError}</p>}
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Strict NDA adherence. Your profile is never shared without explicit consent.</span>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={applying}
              className="w-full"
            >
              <Send className="h-4 w-4" />
              <span>{applying ? "Sending..." : "Transmit Application to Sector Lead"}</span>
            </Button>
          </form>
        )}
      </Modal>

      {/* SECTION 5: Candidate Transparency Standards */}
      <Section variant="muted">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4">
            <IconBox>
              <DollarSign />
            </IconBox>
            <CardTitle>Transparent Compensation</CardTitle>
            <CardDescription>
              We mandate exact salary bands, equity ranges, and bonus structures on every active job posting before presenting candidates.
            </CardDescription>
          </Card>
          <Card className="p-6 space-y-4">
            <IconBox tone="accent">
              <Users />
            </IconBox>
            <CardTitle>Direct Founder/CTO Access</CardTitle>
            <CardDescription>
              Skip generic HR screening queues. The Automation Studio candidates bypass initial gatekeepers directly to hiring decision makers.
            </CardDescription>
          </Card>
          <Card className="p-6 space-y-4">
            <IconBox tone="sky">
              <Handshake />
            </IconBox>
            <CardTitle>Executive Offer Negotiation</CardTitle>
            <CardDescription>
              Our seasoned partners advocate on your behalf to negotiate equity refreshes, sign-on liquidity, and remote autonomy.
            </CardDescription>
          </Card>
        </div>
      </Section>
    </div>
  );
}
