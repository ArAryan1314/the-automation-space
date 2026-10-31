import { NextRequest } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/server/auth";
import { currentCandidate } from "@/lib/server/candidates";
import { fail, invalid, ok, readBody, serverError } from "@/lib/server/http";
import { readJobs } from "@/lib/server/jobs";
import { newId, readRecords, updateRecords } from "@/lib/server/store";
import type { ApplicationRecord } from "@/lib/records";

export const dynamic = "force-dynamic";

const FILE = "applications.json";

const ApplicationSchema = z.object({
  jobId: z.string().min(1).max(100),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().email("Please provide a valid email address").max(200),
  // The admin console renders this as a link, so only web addresses are accepted.
  profileUrl: z
    .string()
    .trim()
    .max(500)
    .url("Please provide a valid link")
    .regex(/^https?:\/\//i, "Link must start with http:// or https://"),
});

export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) return fail(401, "Unauthorized");
    return ok(await readRecords<ApplicationRecord>(FILE));
  } catch (error) {
    return serverError("/api/applications", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await readBody(request);
    if (!body) return fail(400, "Invalid request");

    if (body.action === "delete") {
      if (!isAdmin(request)) return fail(401, "Unauthorized");
      let found = false;
      await updateRecords<ApplicationRecord>(FILE, (records) => {
        found = records.some((record) => record.id === body.id);
        return records.filter((record) => record.id !== body.id);
      });
      return found ? ok({ id: body.id }) : fail(404, "Application not found");
    }

    const validation = ApplicationSchema.safeParse(body);
    if (!validation.success) return invalid(validation.error);

    const job = (await readJobs()).find((candidate) => candidate.id === validation.data.jobId);
    if (!job) return fail(404, "This role is no longer open");

    const application: ApplicationRecord = {
      id: newId("app"),
      timestamp: new Date().toISOString(),
      ...validation.data,
      jobTitle: job.title,
      // Linked to the session, not the typed email, so nobody can add to another candidate's dashboard.
      candidateId: (await currentCandidate(request))?.id ?? null,
    };
    await updateRecords<ApplicationRecord>(FILE, (records) => [application, ...records]);
    return ok({ id: application.id });
  } catch (error) {
    return serverError("/api/applications", error);
  }
}
