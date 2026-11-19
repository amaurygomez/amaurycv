import { Resend } from "resend";
import { CONTACT_TO, RESEND_API_KEY, RESEND_FROM } from "astro:env/server";

export const mailFrom = RESEND_FROM;
export const ownerInbox = CONTACT_TO;

const SEND_TIMEOUT_MS = 4_000;
let client: Resend | null = null;

export function mailer(): Resend | null {
  if (!RESEND_API_KEY) return null;
  client ??= new Resend(RESEND_API_KEY);
  return client;
}

export async function sendOwnerMail(
  resend: Resend,
  message: { replyTo: string; subject: string; text: string; html: string },
): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send(
      { from: mailFrom, to: ownerInbox, ...message },
      { signal: AbortSignal.timeout(SEND_TIMEOUT_MS) },
    );
    if (error) console.error("[mail] provider rejected the send", error.name);
    return Boolean(data && !error);
  } catch {
    console.error("[mail] provider unreachable");
    return false;
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
