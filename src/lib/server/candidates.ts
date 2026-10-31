import { createHash, createHmac, randomBytes } from "crypto";
import type { NextRequest } from "next/server";
import { hashPassword, safeEqual, SESSION_SECONDS, verifyPassword } from "./auth";
import { newId, readRecords, updateRecords } from "./store";
import type { CandidateAccountRecord, CandidateStatus } from "@/lib/records";
import { SITE } from "@/lib/site";

export const CANDIDATE_COOKIE = "as_candidate";
const FILE = "candidates.json";
const RESET_LIFETIME_MS = 60 * 60 * 1000;
// One emailed link per account in this time, so the form cannot be used to flood someone's inbox.
const RESET_RESEND_GAP_MS = 5 * 60 * 1000;

interface StoredCandidate extends CandidateAccountRecord {
  passwordHash: string;
  resetHash?: string;
  resetExpires?: number;
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

/** Adds a pending account and returns it. An email that is already registered is left unchanged, returning null. */
export async function registerCandidate(
  name: string,
  email: string,
  password: string
): Promise<CandidateAccountRecord | null> {
  const normalized = normalizeEmail(email);
  const passwordHash = await hashPassword(password);
  let created: StoredCandidate | null = null;
  await updateRecords<StoredCandidate>(FILE, (accounts) => {
    if (accounts.some((account) => account.email === normalized)) return accounts;
    const account: StoredCandidate = {
      id: newId("cand"),
      timestamp: new Date().toISOString(),
      name,
      email: normalized,
      status: "pending",
      reviewedAt: null,
      passwordHash,
    };
    created = account;
    return [account, ...accounts];
  });
  return created ? toPublic(created) : null;
}

function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Stores a new one-time reset token for the matching account and returns its link. Only the token's hash is kept. */
async function issueResetLink(
  matches: (account: StoredCandidate) => boolean,
  minimumGapMs: number
): Promise<{ account: CandidateAccountRecord; link: string } | null> {
  const token = randomBytes(32).toString("hex");
  const now = Date.now();
  let issuedTo: StoredCandidate | null = null;
  await updateRecords<StoredCandidate>(FILE, (accounts) =>
    accounts.map((account) => {
      if (!matches(account)) return account;
      const issuedAt = (account.resetExpires ?? 0) - RESET_LIFETIME_MS;
      if (now - issuedAt < minimumGapMs) return account;
      issuedTo = account;
      return { ...account, resetHash: hashResetToken(token), resetExpires: now + RESET_LIFETIME_MS };
    })
  );
  return issuedTo ? { account: toPublic(issuedTo), link: `${SITE.url}/candidate-login?reset=${token}` } : null;
}

export function issueResetLinkForEmail(email: string) {
  const normalized = normalizeEmail(email);
  return issueResetLink((account) => account.email === normalized, RESET_RESEND_GAP_MS);
}

export function issueResetLinkForId(id: unknown) {
  return issueResetLink((account) => account.id === id, 0);
}

/**
 * Sets a new password when the token is valid, and returns whether it was. The token works once.
 * Sessions are signed with the password hash, so this also ends any existing session.
 */
export async function resetCandidatePassword(token: string, password: string): Promise<boolean> {
  const tokenHash = hashResetToken(token);
  const passwordHash = await hashPassword(password);
  let changed = false;
  await updateRecords<StoredCandidate>(FILE, (accounts) =>
    accounts.map((account) => {
      if (account.resetHash !== tokenHash || (account.resetExpires ?? 0) <= Date.now()) return account;
      changed = true;
      return { ...account, passwordHash, resetHash: undefined, resetExpires: undefined };
    })
  );
  return changed;
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

/** The updated account, or null when no such account exists. */
export async function setCandidateStatus(id: unknown, status: CandidateStatus): Promise<CandidateAccountRecord | null> {
  let updated: StoredCandidate | null = null;
  await updateRecords<StoredCandidate>(FILE, (accounts) =>
    accounts.map((account) => {
      if (account.id !== id) return account;
      const next = { ...account, status, reviewedAt: new Date().toISOString() };
      updated = next;
      return next;
    })
  );
  return updated ? toPublic(updated) : null;
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
