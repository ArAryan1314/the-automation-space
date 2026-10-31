import { NextResponse } from "next/server";
import { z } from "zod";

export function ok(data: unknown): NextResponse {
  return NextResponse.json({ success: true, data });
}

export function fail(status: number, error: string): NextResponse {
  return NextResponse.json({ success: false, error }, { status });
}

export function invalid(error: z.ZodError): NextResponse {
  return NextResponse.json(
    { success: false, error: "Invalid Data Formats", details: z.flattenError(error) },
    { status: 400 }
  );
}

/** The request's JSON object, or null when the body is not one. */
export async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}

export function serverError(endpoint: string, error: unknown): NextResponse {
  console.error(`API Error in ${endpoint}:`, error);
  return fail(500, "Processing Failures");
}
