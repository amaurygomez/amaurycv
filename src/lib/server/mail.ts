import { Resend } from "resend";
import { CONTACT_TO, RESEND_API_KEY, RESEND_FROM } from "astro:env/server";

export const mailFrom = RESEND_FROM;
export const ownerInbox = CONTACT_TO;

let client: Resend | null = null;

export function mailer(): Resend | null {
  if (!RESEND_API_KEY) return null;
  client ??= new Resend(RESEND_API_KEY);
  return client;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
