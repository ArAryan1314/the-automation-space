import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  clearLoginFailures,
  isHttps,
  isThrottled,
  recordLoginFailure,
  SESSION_SECONDS,
} from "@/lib/server/auth";
import {
  authenticateCandidate,
  CANDIDATE_COOKIE,
  createCandidateToken,
  currentCandidate,
  issueResetLinkForEmail,
  registerCandidate,
  resetCandidatePassword,
} from "@/lib/server/candidates";
import { adminNotifyAddress, sendEmail } from "@/lib/server/email";
import { fail, invalid, ok, readBody, serverError } from "@/lib/server/http";
import { readRecords } from "@/lib/server/store";
import type { ApplicationRecord } from "@/lib/records";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

const LOGIN_ATTEMPTS_FILE = "candidate-login-attempts.json";
const REGISTER_ATTEMPTS_FILE = "candidate-register-attempts.json";
const RESET_ATTEMPTS_FILE = "candidate-reset-attempts.json";
const SIGNED_OUT = { authenticated: false, account: null, applications: [] };

const RegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().email("Please provide a valid email address").max(200),
  password: z.string().min(12, "Password must be at least 12 characters").max(200),
});

const ResetRequestSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address").max(200),
});

const ResetSchema = z.object({
  token: z.string().length(64, "This reset link is invalid or has expired. Please request a new one."),
  password: RegisterSchema.shape.password,
});

function setCandidateCookie(response: NextResponse, request: NextRequest, value: string, maxAge: number) {
  response.cookies.set(CANDIDATE_COOKIE, value, {
    path: "/api",
    httpOnly: true,
    sameSite: "strict",
    secure: isHttps(request),
    maxAge,
  });
}

export async function GET(request: NextRequest) {
  try {
    const account = await currentCandidate(request);
    if (!account) return ok(SIGNED_OUT);
    const applications = (await readRecords<ApplicationRecord>("applications.json"))
      .filter((application) => application.candidateId === account.id)
      .map(({ id, timestamp, jobTitle }) => ({ id, timestamp, jobTitle }));
    return ok({ authenticated: true, account, applications });
  } catch (error) {
    return serverError("/api/candidate-session", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await readBody(request);

    if (body?.action === "logout") {
      const response = ok(SIGNED_OUT);
      setCandidateCookie(response, request, "", 0);
      return response;
    }

    if (body?.action === "register") {
      if (await isThrottled(request, REGISTER_ATTEMPTS_FILE)) {
        return fail(429, "Too many requests. Try again in 15 minutes.");
      }
      const validation = RegisterSchema.safeParse(body);
      if (!validation.success) return invalid(validation.error);
      await recordLoginFailure(request, REGISTER_ATTEMPTS_FILE);
      const { name, email, password } = validation.data;
      const created = await registerCandidate(name, email, password);
      // Email is not awaited, so response time cannot reveal whether the account is new.
      if (created) {
        void sendEmail(
          adminNotifyAddress(),
          `New candidate account request: ${created.name}`,
          `${created.name} (${created.email}) has requested a candidate account.\n\nReview it in the Pending candidates tab:\n${SITE.url}/admin-login`
        );
      }
      // The same reply for a new or existing email, so this form cannot reveal who has an account.
      return ok({ registered: true });
    }

    if (body?.action === "request-reset" || body?.action === "reset") {
      if (await isThrottled(request, RESET_ATTEMPTS_FILE)) {
        return fail(429, "Too many requests. Try again in 15 minutes.");
      }

      if (body.action === "request-reset") {
        const validation = ResetRequestSchema.safeParse(body);
        if (!validation.success) return invalid(validation.error);
        await recordLoginFailure(request, RESET_ATTEMPTS_FILE);
        const issued = await issueResetLinkForEmail(validation.data.email);
        if (issued) {
          void sendEmail(
            issued.account.email,
            `Reset your ${SITE.name} password`,
            `Hello ${issued.account.name},\n\nUse this link within one hour to choose a new password:\n${issued.link}\n\nIf you did not ask for this, you can ignore this email.\n\n${SITE.name}`
          );
        }
        // The same reply whether or not the account exists.
        return ok({ requested: true });
      }

      const validation = ResetSchema.safeParse(body);
      if (!validation.success) return invalid(validation.error);
      await recordLoginFailure(request, RESET_ATTEMPTS_FILE);
      const changed = await resetCandidatePassword(validation.data.token, validation.data.password);
      return changed ? ok({ reset: true }) : fail(400, "This reset link is invalid or has expired. Please request a new one.");
    }

    if (body?.action !== "login") return fail(400, "Unknown action");

    if (await isThrottled(request, LOGIN_ATTEMPTS_FILE)) {
      return fail(429, "Too many failed attempts. Try again in 15 minutes.");
    }

    const { email, password } = body;
    const account =
      typeof email === "string" && typeof password === "string" && password.length <= 200
        ? await authenticateCandidate(email, password)
        : null;
    if (!account) {
      await recordLoginFailure(request, LOGIN_ATTEMPTS_FILE);
      return fail(401, "Incorrect email or password");
    }

    await clearLoginFailures(request, LOGIN_ATTEMPTS_FILE);
    if (account.status === "pending") {
      return fail(403, "Your account is waiting for approval. You can sign in once a super admin approves it.");
    }
    if (account.status === "rejected") {
      return fail(403, "Your account was not approved for portal access. Please contact us if you have questions.");
    }

    const response = ok({ authenticated: true });
    setCandidateCookie(response, request, await createCandidateToken(account.id), SESSION_SECONDS);
    return response;
  } catch (error) {
    return serverError("/api/candidate-session", error);
  }
}
