"use client";

import { useState } from "react";
import { Briefcase, DollarSign, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge, Button, Card, CardDescription, CardTitle, IconBox, Input, Label, Modal, Textarea } from "@/components/ui";
import { EXPERIENCE_LEVELS, JOB_TYPES, type JobListing } from "@/data/agencyData";
import { ApiError, callApi, formatDateTime, selectClass } from "./adminApi";

interface JobsPanelProps {
  jobs: JobListing[];
  onChanged: () => void;
  onSessionExpired: () => void;
}

const emptyForm = {
  title: "",
  department: "",
  location: "",
  type: JOB_TYPES[0] as string,
  salaryRange: "",
  experienceLevel: EXPERIENCE_LEVELS[0] as string,
  overview: "",
  skills: "",
};

export function JobsPanel({ jobs, onChanged, onSessionExpired }: JobsPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const departments = Array.from(new Set(jobs.map((job) => job.department))).sort();
  const update = (field: keyof typeof emptyForm, value: string) => setForm({ ...form, [field]: value });

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setFormOpen(true);
  };

  const openEdit = (job: JobListing) => {
    setEditingId(job.id);
    setForm({ ...job, skills: job.skills.join(", ") });
    setError("");
    setFormOpen(true);
  };

  const handleFailure = (err: unknown) => {
    if (err instanceof ApiError && err.status === 401) onSessionExpired();
    else setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await callApi("/api/jobs", {
        ...form,
        action: editingId ? "update" : "create",
        id: editingId ?? undefined,
        skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
      });
      setFormOpen(false);
      onChanged();
    } catch (err) {
      handleFailure(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (job: JobListing) => {
    if (!window.confirm(`Delete "${job.title}"? It will disappear from the public jobs page.`)) return;
    setError("");
    try {
      await callApi("/api/jobs", { action: "delete", id: job.id });
      onChanged();
    } catch (err) {
      handleFailure(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          These postings are what visitors see on the public jobs page.
        </p>
        <Button size="sm" onClick={openNew}>
          <Plus className="h-4 w-4" />
          <span>Add job posting</span>
        </Button>
      </div>

      {error && !formOpen && <p role="alert" className="text-sm text-red-300">{error}</p>}

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center gap-3 text-center text-sm text-muted-foreground py-16 px-6 bg-card border border-dashed border-border-strong rounded-2xl">
          <IconBox tone="neutral">
            <Briefcase />
          </IconBox>
          No job postings yet. Add one and it goes live on the jobs page.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <Card key={job.id} className="p-6 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription className="mt-1">{job.department}</CardDescription>
                </div>
                <Badge variant="default">{job.type}</Badge>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 flex-shrink-0" />
                  {job.salaryRange}
                </span>
              </div>
              <p className="text-sm text-body leading-relaxed">{job.overview}</p>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
                <span className="text-xs text-subtle-foreground">
                  {job.experienceLevel} · Posted {formatDateTime(job.postedAt)}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(job)}>
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(job)} className="text-red-300">
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? "Edit job posting" : "Add job posting"}
        description="Saved changes appear on the public jobs page straight away."
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <Label htmlFor="job-title">Job title</Label>
            <Input id="job-title" required value={form.title} onChange={(e) => update("title", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="job-department">Department</Label>
              <Input
                id="job-department"
                required
                list="job-departments"
                value={form.department}
                onChange={(e) => update("department", e.target.value)}
              />
              <datalist id="job-departments">
                {departments.map((department) => (
                  <option key={department} value={department} />
                ))}
              </datalist>
            </div>
            <div>
              <Label htmlFor="job-location">Location</Label>
              <Input id="job-location" required value={form.location} onChange={(e) => update("location", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="job-type">Engagement type</Label>
              <select id="job-type" className={selectClass} value={form.type} onChange={(e) => update("type", e.target.value)}>
                {JOB_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="job-level">Experience level</Label>
              <select
                id="job-level"
                className={selectClass}
                value={form.experienceLevel}
                onChange={(e) => update("experienceLevel", e.target.value)}
              >
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="job-salary">Salary range</Label>
            <Input
              id="job-salary"
              required
              placeholder="$180,000 - $220,000 + Bonus"
              value={form.salaryRange}
              onChange={(e) => update("salaryRange", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="job-overview">Overview</Label>
            <Textarea id="job-overview" rows={4} required value={form.overview} onChange={(e) => update("overview", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="job-skills">Skills (separate with commas)</Label>
            <Input
              id="job-skills"
              required
              placeholder="Rust, Kafka, PostgreSQL"
              value={form.skills}
              onChange={(e) => update("skills", e.target.value)}
            />
          </div>
          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
          <Button type="submit" size="lg" disabled={saving} className="w-full">
            {saving ? "Saving..." : editingId ? "Save changes" : "Publish job posting"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
