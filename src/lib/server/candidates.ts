import { createHmac } from "crypto";
import type { NextRequest } from "next/server";
import { hashPassword, safeEqual, SESSION_SECONDS, verifyPassword } from "./auth";
import { newId, readRecords, updateRecords } from "./store";
import type { CandidateAccountRecord, CandidateStatus } from "@/lib/records";

export const CANDIDATE_COOKIE = "as_candidate";
const FILE = "candidates.json";

interface StoredCandidate extends CandidateAccountRecord {
  passwordHash: string;
}

/** Removes the password hash before an account leaves the server. */
function toPublic(account: StoredCandidate): CandidateAccountRecord {
  const { id, timestamp, name, email, status, reviewedAt } = account;
  return { id, timestamp, name, email, status, reviewedAt };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function listCandidates(): Promise<CandidateAccountRecord[]> {
  return (await readRecords<StoredCandidate>(FILE)).map(toPublic);
}

/** Adds a pending account. An email that is already registered is left unchanged. */
export async function registerCandidate(name: string, email: string, password: string): Promise<void> {
  const normalized = normalizeEmail(email);
  const passwordHash = await hashPassword(password);
  await updateRecords<StoredCandidate>(FILE, (accounts) =>
    accounts.some((account) => account.email === normalized)
      ? accounts
      : [
          {
            id: newId("cand"),
            timestamp: new Date().toISOString(),
            name,
            email: normalized,
            status: "pending",
            reviewedAt: null,
            passwordHash,
          },
          ...accounts,
        ]
  );
}

// Compared against when the email is unknown, so timing does not reveal who has an account.
const unknownAccountHash = hashPassword("no account has this password");

/** The account when the password is correct, whatever its approval status. */
export async function authenticateCandidate(email: string, password: string): Promise<CandidateAccountRecord | null> {
  const normalized = normalizeEmail(email);
  const account = (await readRecords<StoredCandidate>(FILE)).find((item) => item.email === normalized);
  const matches = await verifyPassword(password, account?.passwordHash ?? (await unknownAccountHash));
  return account && matches ? toPublic(account) : null;
}

/** Returns false when no such account exists. */
export async function setCandidateStatus(id: unknown, status: CandidateStatus): Promise<boolean> {
  let found = false;
  await updateRecords<StoredCandidate>(FILE, (accounts) =>
    accounts.map((account) => {
      if (account.id !== id) return account;
      found = true;
      return { ...account, status, reviewedAt: new Date().toISOString() };
    })
  );
  return found;
}

/** Returns false when no such account exists. */
export async function deleteCandidate(id: unknown): Promise<boolean> {
  let found = false;
  await updateRecords<StoredCandidate>(FILE, (accounts) => {
    found = accounts.some((account) => account.id === id);
    return accounts.filter((account) => account.id !== id);
  });
  return found;
}

function sign(account: StoredCandidate, expiresAt: string): string {
  return createHmac("sha256", account.passwordHash).update(`${account.id}.${expiresAt}`).digest("hex");
}

export async function createCandidateToken(id: string): Promise<string> {
  const account = (await readRecords<StoredCandidate>(FILE)).find((item) => item.id === id);
  if (!account) throw new Error("Candidate account not found");
  const expiresAt = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${id}.${expiresAt}.${sign(account, expiresAt)}`;
}

// The status is read on every request, so rejecting or deleting an account ends its session at once.
export async function currentCandidate(request: NextRequest): Promise<CandidateAccountRecord | null> {
  const [id, expiresAt, signature] = (request.cookies.get(CANDIDATE_COOKIE)?.value ?? "").split(".");
  if (!id || !expiresAt || !signature || Number(expiresAt) <= Date.now() / 1000) return null;
  const account = (await readRecords<StoredCandidate>(FILE)).find((item) => item.id === id);
  if (!account || account.status !== "approved" || !safeEqual(signature, sign(account, expiresAt))) return null;
  return toPublic(account);
}
