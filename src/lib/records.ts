/** Shapes returned by the API. */

export interface SubmissionRecord {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  roleType: "candidate" | "employer";
  message: string;
  aiDraft: string;
}

export interface ContactRecord {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source: "website" | "admin";
  aiDraft: string;
}

export type CandidateStatus = "pending" | "approved" | "rejected";

export interface CandidateAccountRecord {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  status: CandidateStatus;
  reviewedAt: string | null;
}

export interface ApplicationRecord {
  id: string;
  timestamp: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  profileUrl: string;
}
