import type { APIRoute } from "astro";
import { exceeded, limiter, verifyTurnstile } from "@/lib/server/guard";
import {
  clientIp,
  invalidInput,
  json,
  oversized,
  payloadTooLarge,
  readJson,
  tooManyRequests,
} from "@/lib/server/http";
import { escapeHtml, mailFrom, mailer, ownerInbox } from "@/lib/server/mail";
import { ContactSchema } from "@/lib/server/validation";

export const prerender = false;

const hourly = limiter("contact:h", 3, "1 h");
const daily = limiter("contact:d", 10, "1 d");
const dayTotal = limiter("contact:day", 40, "1 d");
const LINK = /https?:\/\//gi;

export const POST: APIRoute = async (context) => {
  if (oversized(context.request)) return payloadTooLarge();
  const body = await readJson(context.request);
  if (body === undefined) return json({ error: "invalid_json" }, 400);

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) return invalidInput(parsed.error);
  const { name, email, message, website, turnstileToken } = parsed.data;

  // Honeypot: accept silently so bots get no signal.
  if (website) return json({ ok: true });
  if ((message.match(LINK)?.length ?? 0) > 2) return json({ error: "too_many_links" }, 400);

  const resend = mailer();
  if (!resend) return json({ error: "service_unavailable" }, 503);

  const ip = clientIp(context);
  const wait = await exceeded([hourly, ip], [daily, ip]);
  if (wait) return tooManyRequests(wait);
  if (!(await verifyTurnstile(turnstileToken, ip))) return json({ error: "captcha_failed" }, 400);
  // Last check before the send, so a rejected request never spends the day's pool.
  const dayWait = await exceeded([dayTotal, "all"]);
  if (dayWait) return tooManyRequests(dayWait);

  const { data, error } = await resend.emails.send({
    from: mailFrom,
    to: ownerInbox,
    replyTo: email,
    subject: `Nuevo mensaje desde amaurygomez.dev — ${name}`,
    text: `De: ${name} <${email}>\nIP: ${ip}\n\n${message}`,
    html: `<div style="font-family:Inter,system-ui,sans-serif;color:#0B1020;">
  <p><strong>De:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
  <p><strong>IP:</strong> ${escapeHtml(ip)}</p>
  <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;" />
  <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
</div>`,
  });

  if (error) {
    console.error("[contact] send failed", error);
    return json({ error: "send_failed" }, 502);
  }
  console.log("[contact] sent", data.id);
  return json({ ok: true });
};
