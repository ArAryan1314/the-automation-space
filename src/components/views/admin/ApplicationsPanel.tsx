"use client";

import { useState } from "react";
import { Clock, ExternalLink, FileUser, Mail, Trash2 } from "lucide-react";
import { Button, Card, CardDescription, CardTitle, IconBox } from "@/components/ui";
import type { ApplicationRecord } from "@/lib/records";
import { ApiError, callApi, formatDateTime } from "./adminApi";

interface ApplicationsPanelProps {
  applications: ApplicationRecord[];
  onChanged: () => void;
  onSessionExpired: () => void;
}

export function ApplicationsPanel({ applications, onChanged, onSessionExpired }: ApplicationsPanelProps) {
  const [error, setError] = useState("");

  const handleDelete = async (application: ApplicationRecord) => {
    if (!window.confirm(`Delete the application from ${application.name}? This cannot be undone.`)) return;
    setError("");
    try {
      await callApi("/api/applications", { action: "delete", id: application.id });
      onChanged();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) onSessionExpired();
      else setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 text-center text-sm text-muted-foreground py-16 px-6 bg-card border border-dashed border-border-strong rounded-2xl">
        <IconBox tone="neutral">
          <FileUser />
        </IconBox>
        No applications yet. Quick Apply submissions from the jobs page will appear here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      {applications.map((application) => (
        <Card key={application.id} className="p-6 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle>{application.name}</CardTitle>
              <CardDescription className="mt-1">Applied for {application.jobTitle}</CardDescription>
            </div>
            <span className="text-xs text-subtle-foreground flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {formatDateTime(application.timestamp)}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground min-w-0">
              <a href={`mailto:${application.email}`} className="flex items-center gap-1.5 hover:text-primary break-all">
                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                {application.email}
              </a>
              <a
                href={application.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary break-all"
              >
                <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                {application.profileUrl}
              </a>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(application)} className="text-red-300">
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
