import { NextRequest, NextResponse } from "next/server";
import {
  adminUsername,
  checkLogin,
  clearLoginFailures,
  createSessionToken,
  isAdmin,
  isHttps,
  isThrottled,
  recordLoginFailure,
  SESSION_COOKIE,
  SESSION_SECONDS,
} from "@/lib/server/auth";
import { fail, ok, readBody, serverError } from "@/lib/server/http";

export const dynamic = "force-dynamic";

function setSessionCookie(response: NextResponse, request: NextRequest, value: string, maxAge: number) {
  response.cookies.set(SESSION_COOKIE, value, {
    path: "/api",
    httpOnly: true,
    sameSite: "strict",
    secure: isHttps(request),
    maxAge,
  });
}

export async function GET(request: NextRequest) {
  const authenticated = isAdmin(request);
  return ok({ authenticated, username: authenticated ? adminUsername() : null });
}

export async function POST(request: NextRequest) {
  try {
    const body = await readBody(request);
    if (body?.action === "logout") {
      const response = ok({ authenticated: false, username: null });
      setSessionCookie(response, request, "", 0);
      return response;
    }
    if (body?.action !== "login") return fail(400, "Unknown action");

    if (await isThrottled(request)) {
      return fail(429, "Too many failed attempts. Try again in 15 minutes.");
    }

    const { username, password } = body;
    const valid =
      typeof username === "string" &&
      typeof password === "string" &&
      password.length <= 200 &&
      (await checkLogin(username, password));
    if (!valid) {
      await recordLoginFailure(request);
      return fail(401, "Incorrect username or password");
    }

    await clearLoginFailures(request);
    const response = ok({ authenticated: true, username: adminUsername() });
    setSessionCookie(response, request, createSessionToken(), SESSION_SECONDS);
    return response;
  } catch (error) {
    return serverError("/api/admin-session", error);
  }
}
