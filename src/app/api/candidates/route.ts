import { NextRequest } from "next/server";
import { isAdmin } from "@/lib/server/auth";
import { deleteCandidate, listCandidates, setCandidateStatus } from "@/lib/server/candidates";
import { fail, ok, readBody, serverError } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) return fail(401, "Unauthorized");
    return ok(await listCandidates());
  } catch (error) {
    return serverError("/api/candidates", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdmin(request)) return fail(401, "Unauthorized");
    const body = await readBody(request);

    let found: boolean;
    if (body?.action === "approve") found = await setCandidateStatus(body.id, "approved");
    else if (body?.action === "reject") found = await setCandidateStatus(body.id, "rejected");
    else if (body?.action === "delete") found = await deleteCandidate(body.id);
    else return fail(400, "Unknown action");

    return found ? ok({ id: body.id }) : fail(404, "Candidate account not found");
  } catch (error) {
    return serverError("/api/candidates", error);
  }
}
