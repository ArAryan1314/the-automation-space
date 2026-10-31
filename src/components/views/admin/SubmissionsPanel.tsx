"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Copy, FileText, Inbox, Mail, User } from "lucide-react";
import { Badge, Button, Card, IconBox } from "@/components/ui";
import type { SubmissionRecord } from "@/lib/records";
import { formatDateTime } from "./adminApi";

export function SubmissionsPanel({ submissions }: { submissions: SubmissionRecord[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 text-center text-sm text-muted-foreground py-16 px-6 bg-card border border-dashed border-border-strong rounded-2xl">
        <IconBox tone="neutral">
          <Inbox />
        </IconBox>
        No intakes yet. Forms on the Home, Employers and Candidates pages will appear here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((sub) => (
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
              <span className="text-xs text-subtle-foreground flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {formatDateTime(sub.timestamp)}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border text-sm text-body">
            <span className="font-semibold text-xs text-muted-foreground block mb-1.5">Message</span>
            <p className="leading-relaxed whitespace-pre-wrap">{sub.message}</p>
          </div>

          <div className="p-4 rounded-xl bg-primary-soft border border-primary-muted text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-xs text-primary-hover flex items-center">
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                Drafted reply
              </span>
              <Button variant="ghost" size="sm" onClick={() => copyText(sub.id, sub.aiDraft)} className="h-7 text-xs px-2">
                {copiedId === sub.id ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span className="text-primary">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy draft</span>
                  </>
                )}
              </Button>
            </div>
            <p className="p-3 rounded-lg bg-card border border-border text-body leading-relaxed whitespace-pre-wrap">
              {sub.aiDraft}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
