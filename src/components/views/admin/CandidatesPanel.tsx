"use client";

import { useState } from "react";
import { Check, Clock, Mail, Trash2, UserCheck, X } from "lucide-react";
import { Badge, Button, Card, CardTitle, IconBox } from "@/components/ui";
import type { CandidateAccountRecord, CandidateStatus } from "@/lib/records";
import { ApiError, callApi, formatDateTime } from "./adminApi";

interface CandidatesPanelProps {
  candidates: CandidateAccountRecord[];
  onChanged: () => void;
  onSessionExpired: () => void;
}

const STATUS_BADGE: Record<CandidateStatus, { label: string; variant: "warning" | "success" | "destructive" }> = {
  pending: { label: "Waiting for approval", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export function CandidatesPanel({ candidates, onChanged, onSessionExpired }: CandidatesPanelProps) {
  const [error, setError] = useState("");

  const act = async (action: "approve" | "reject" | "delete", candidate: CandidateAccountRecord) => {
    if (action === "delete" && !window.confirm(`Delete the account for ${candidate.name}? This cannot be undone.`)) return;
    setError("");
    try {
      await callApi("/api/candidates", { action, id: candidate.id });
      onChanged();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) onSessionExpired();
      else setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (candidates.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 text-center text-sm text-muted-foreground py-16 px-6 bg-card border border-dashed border-border-strong rounded-2xl">
        <IconBox tone="neutral">
          <UserCheck />
        </IconBox>
        No candidate accounts yet. Requests from the candidate portal will appear here for approval.
      </div>
    );
  }

  const pendingFirst = [...candidates].sort(
    (a, b) => Number(b.status === "pending") - Number(a.status === "pending")
  );

  return (
    <div className="space-y-4">
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      {pendingFirst.map((candidate) => (
        <Card key={candidate.id} className="p-6 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <CardTitle>{candidate.name}</CardTitle>
              <Badge variant={STATUS_BADGE[candidate.status].variant}>{STATUS_BADGE[candidate.status].label}</Badge>
            </div>
            <span className="text-xs text-subtle-foreground flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {formatDateTime(candidate.timestamp)}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
            <a
              href={`mailto:${candidate.email}`}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary break-all min-w-0"
            >
              <Mail className="h-3.5 w-3.5 flex-shrink-0" />
              {candidate.email}
            </a>
            <div className="flex flex-wrap items-center gap-2">
              {candidate.status !== "approved" && (
                <Button size="sm" onClick={() => act("approve", candidate)}>
                  <Check className="h-3.5 w-3.5" />
                  <span>Approve</span>
                </Button>
              )}
              {candidate.status !== "rejected" && (
                <Button variant="outline" size="sm" onClick={() => act("reject", candidate)}>
                  <X className="h-3.5 w-3.5" />
                  <span>{candidate.status === "approved" ? "Revoke access" : "Reject"}</span>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => act("delete", candidate)} className="text-red-300">
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
