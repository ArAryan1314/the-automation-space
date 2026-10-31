import { NextRequest } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/server/auth";
import { writeDraft } from "@/lib/server/drafts";
import { fail, invalid, ok, readBody, serverError } from "@/lib/server/http";
import { newId, readRecords, updateRecords } from "@/lib/server/store";
import type { ContactRecord } from "@/lib/records";

export const dynamic = "force-dynamic";

const FILE = "contacts.json";

const ContactFields = {
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().email("Please provide a valid email address").max(200),
  phone: z.string().trim().max(40).optional().default(""),
};

const WebsiteContactSchema = z.object({
  ...ContactFields,
  subject: z.string().trim().min(2, "Inquiry type is required").max(120),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
});

// Contacts the admin adds by hand may be just a name and an address.
const AdminContactSchema = z.object({
  ...ContactFields,
  subject: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(5000).optional().default(""),
});

export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) return fail(401, "Unauthorized");
    return ok(await readRecords<ContactRecord>(FILE));
  } catch (error) {
    return serverError("/api/contacts", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await readBody(request);
    if (!body) return fail(400, "Invalid request");

    if (body.action === undefined) {
      const validation = WebsiteContactSchema.safeParse(body);
      if (!validation.success) return invalid(validation.error);
      const { name, email, subject, message } = validation.data;
      const roleType = subject.includes("Retained") || subject.includes("Corporate") ? "employer" : "candidate";
      const contact: ContactRecord = {
        id: newId("con"),
        timestamp: new Date().toISOString(),
        ...validation.data,
        source: "website",
        aiDraft: await writeDraft({ name, email, roleType, message }),
      };
      await updateRecords<ContactRecord>(FILE, (contacts) => [contact, ...contacts]);
      return ok({ id: contact.id });
    }

    if (!isAdmin(request)) return fail(401, "Unauthorized");

    if (body.action === "create") {
      const validation = AdminContactSchema.safeParse(body);
      if (!validation.success) return invalid(validation.error);
      const contact: ContactRecord = {
        id: newId("con"),
        timestamp: new Date().toISOString(),
        ...validation.data,
        source: "admin",
        aiDraft: "",
      };
      await updateRecords<ContactRecord>(FILE, (contacts) => [contact, ...contacts]);
      return ok(contact);
    }

    if (body.action === "delete") {
      let found = false;
      await updateRecords<ContactRecord>(FILE, (contacts) => {
        found = contacts.some((contact) => contact.id === body.id);
        return contacts.filter((contact) => contact.id !== body.id);
      });
      return found ? ok({ id: body.id }) : fail(404, "Contact not found");
    }

    return fail(400, "Unknown action");
  } catch (error) {
    return serverError("/api/contacts", error);
  }
}
