import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/server/auth";
import { writeDraft } from "@/lib/server/drafts";
import { fail, ok, serverError } from "@/lib/server/http";
import { newId, readRecords, updateRecords } from "@/lib/server/store";
import type { SubmissionRecord } from "@/lib/records";

export const dynamic = "force-dynamic";

const FILE = "submissions.json";

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  roleType: z.enum(["candidate", "employer"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) return fail(401, "Unauthorized");
    return ok(await readRecords<SubmissionRecord>(FILE));
  } catch (error) {
    return serverError("/api/ai-respond", error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = ContactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Data Formats",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const submission: SubmissionRecord = {
      id: newId("idx"),
      timestamp: new Date().toISOString(),
      ...validation.data,
      aiDraft: await writeDraft(validation.data),
    };
    await updateRecords<SubmissionRecord>(FILE, (records) => [submission, ...records]);

    return ok(submission);
  } catch (error) {
    return serverError("/api/ai-respond", error);
  }
}
