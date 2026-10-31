import { NextRequest } from "next/server";
import { isAdmin } from "@/lib/server/auth";
import { fail, invalid, ok, readBody, serverError } from "@/lib/server/http";
import { JobSchema, readJobs, updateJobs } from "@/lib/server/jobs";
import { newId } from "@/lib/server/store";
import type { JobListing } from "@/data/agencyData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return ok(await readJobs());
  } catch (error) {
    return serverError("/api/jobs", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdmin(request)) return fail(401, "Unauthorized");
    const body = await readBody(request);
    if (!body) return fail(400, "Invalid request");

    if (body.action === "delete") {
      let found = false;
      await updateJobs((jobs) => {
        found = jobs.some((job) => job.id === body.id);
        return jobs.filter((job) => job.id !== body.id);
      });
      return found ? ok({ id: body.id }) : fail(404, "Job not found");
    }

    if (body.action !== "create" && body.action !== "update") return fail(400, "Unknown action");
    const validation = JobSchema.safeParse(body);
    if (!validation.success) return invalid(validation.error);

    if (body.action === "create") {
      const job: JobListing = { id: newId("job"), ...validation.data, postedAt: new Date().toISOString() };
      await updateJobs((jobs) => [job, ...jobs]);
      return ok(job);
    }

    let updated: JobListing | undefined;
    await updateJobs((jobs) =>
      jobs.map((job) => {
        if (job.id !== body.id) return job;
        updated = { ...job, ...validation.data };
        return updated;
      })
    );
    return updated ? ok(updated) : fail(404, "Job not found");
  } catch (error) {
    return serverError("/api/jobs", error);
  }
}
