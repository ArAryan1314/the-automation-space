import nodemailer from "nodemailer";

function smtpSettings() {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) return null;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  return {
    from: process.env.SMTP_FROM?.trim() || user || "",
    transport: {
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
      connectionTimeout: 10000,
      socketTimeout: 20000,
    },
  };
}

/** Where new account requests are announced. Defaults to the super admin login when that is an email. */
export function adminNotifyAddress(): string {
  const configured = process.env.ADMIN_NOTIFY_EMAIL?.trim();
  if (configured) return configured;
  const username = process.env.ADMIN_USERNAME?.trim() ?? "";
  return username.includes("@") ? username : "";
}

/**
 * Sends a plain-text email and never throws, so a mail problem cannot break the request.
 * Does nothing when SMTP is not configured. Returns whether the message was accepted.
 */
export async function sendEmail(to: string, subject: string, text: string): Promise<boolean> {
  const settings = smtpSettings();
  if (!settings || !to) return false;
  try {
    await nodemailer.createTransport(settings.transport).sendMail({ from: settings.from, to, subject, text });
    return true;
  } catch (error) {
    console.error("Email could not be sent:", error);
    return false;
  }
}
