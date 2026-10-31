import { NextRequest } from "next/server";
import { isAdmin } from "@/lib/server/auth";
import { deleteCandidate, issueResetLinkForId, listCandidates, setCandidateStatus } from "@/lib/server/candidates";
import { sendEmail } from "@/lib/server/email";
import { fail, ok, readBody, serverError } from "@/lib/server/http";
import { SITE } from "@/lib/site";

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

    const notFound = () => fail(404, "Candidate account not found");

    if (body?.action === "approve") {
      const account = await setCandidateStatus(body.id, "approved");
      if (!account) return notFound();
      void sendEmail(
        account.email,
        `Your ${SITE.name} candidate account is approved`,
        `Hello ${account.name},\n\nYour candidate account has been approved. You can now sign in:\n${SITE.url}/candidate-login\n\n${SITE.name}`
      );
      return ok({ id: account.id });
    }

    if (body?.action === "reject") {
      const account = await setCandidateStatus(body.id, "rejected");
      if (!account) return notFound();
      void sendEmail(
        account.email,
        `Your ${SITE.name} candidate account`,
        `Hello ${account.name},\n\nYour candidate account does not have portal access. If you have questions, contact us at ${SITE.email}.\n\n${SITE.name}`
      );
      return ok({ id: account.id });
    }

    if (body?.action === "reset-link") {
      const issued = await issueResetLinkForId(body.id);
      return issued ? ok({ link: issued.link }) : notFound();
    }

    if (body?.action === "delete") {
      return (await deleteCandidate(body.id)) ? ok({ id: body.id }) : notFound();
    }

    return fail(400, "Unknown action");
  } catch (error) {
    return serverError("/api/candidates", error);
  }
}
