import { createHash, createHmac, pbkdf2, timingSafeEqual } from "crypto";
import { promisify } from "util";
import type { NextRequest } from "next/server";
import { readRecords, updateRecords } from "./store";

export const SESSION_COOKIE = "as_admin";
export const SESSION_SECONDS = 8 * 60 * 60;
const ATTEMPTS_FILE = "login-attempts.json";
const MAX_FAILURES = 10;
const WINDOW_MS = 15 * 60 * 1000;

const derive = promisify(pbkdf2);

function credentials() {
  return {
    username: process.env.ADMIN_USERNAME?.trim() ?? "",
    passwordHash: process.env.ADMIN_PASSWORD_HASH?.trim() ?? "",
  };
}

function safeEqual(a: string, b: string): boolean {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

export async function checkLogin(username: string, password: string): Promise<boolean> {
  const expected = credentials();
  const [scheme, iterations, salt, hash] = expected.passwordHash.split(":");
  if (scheme !== "pbkdf2" || !iterations || !salt || !hash || !expected.username) return false;
  const derived = await derive(password, Buffer.from(salt, "hex"), Number(iterations), 32, "sha256");
  // Both checks always run, so timing does not reveal whether the username exists.
  const passwordMatches = safeEqual(derived.toString("hex"), hash);
  return safeEqual(username, expected.username) && passwordMatches;
}

// Signed with the stored hash, so changing the password ends every existing session.
function sign(expiresAt: string): string {
  return createHmac("sha256", credentials().passwordHash).update(expiresAt).digest("hex");
}

export function createSessionToken(): string {
  const expiresAt = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function isAdmin(request: NextRequest): boolean {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const [expiresAt, signature] = token.split(".");
  if (!credentials().passwordHash || !expiresAt || !signature) return false;
  return Number(expiresAt) > Date.now() / 1000 && safeEqual(signature, sign(expiresAt));
}

export function adminUsername(): string {
  return credentials().username;
}

export function isHttps(request: NextRequest): boolean {
  return request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
}

// Login throttling: failures per client address within a rolling window.
interface Attempt {
  client: string;
  at: number;
}

function clientKey(request: NextRequest): string {
  const address = request.headers.get("x-forwarded-for")?.split(",").pop()?.trim() || "local";
  return createHash("sha256").update(address).digest("hex");
}

export async function isThrottled(request: NextRequest): Promise<boolean> {
  const client = clientKey(request);
  const cutoff = Date.now() - WINDOW_MS;
  const attempts = await readRecords<Attempt>(ATTEMPTS_FILE);
  return attempts.filter((a) => a.client === client && a.at > cutoff).length >= MAX_FAILURES;
}

export async function recordLoginFailure(request: NextRequest): Promise<void> {
  const client = clientKey(request);
  const cutoff = Date.now() - WINDOW_MS;
  await updateRecords<Attempt>(ATTEMPTS_FILE, (attempts) => [
    ...attempts.filter((a) => a.at > cutoff),
    { client, at: Date.now() },
  ]);
}

export async function clearLoginFailures(request: NextRequest): Promise<void> {
  const client = clientKey(request);
  await updateRecords<Attempt>(ATTEMPTS_FILE, (attempts) => attempts.filter((a) => a.client !== client));
}
