import type { APIRoute } from "astro";
import { limiter, rateLimit, verifyTurnstile } from "@/lib/server/guard";
import {
  clientIp,
  invalidInput,
  json,
  readFormJson,
  temporarilyUnavailable,
} from "@/lib/server/http";
import { escapeHtml, mailer, sendOwnerMail } from "@/lib/server/mail";
import { ContactSchema } from "@/lib/server/validation";
import { TURNSTILE_ACTIONS } from "@/lib/turnstile-actions";

export const prerender = false;

const hourly = limiter("contact:h", 3, "1 h");
const daily = limiter("contact:d", 10, "1 d");
const dayTotal = limiter("contact:day", 40, "1 d");
const LINK = /https?:\/\/(?:www\.)?|\bwww\./gi;

export const POST: APIRoute = async (context) => {
  const payload = await readFormJson(context);
  if (!payload.ok) return payload.response;

  const parsed = ContactSchema.safeParse(payload.body);
  if (!parsed.success) return invalidInput(parsed.error);
  const { name, email, message, website, turnstileToken } = parsed.data;

  // Honeypot: accept silently so bots get no signal.
  if (website) return json({ ok: true });
  if ((message.match(LINK)?.length ?? 0) > 2) return json({ error: "too_many_links" }, 400);

  const resend = mailer();
  if (!resend) return temporarilyUnavailable();

  const ip = clientIp(context);
  const ipKey = ip ?? "unknown";
  const ipBlock = await rateLimit([hourly, ipKey], [daily, ipKey]);
  if (ipBlock) return ipBlock;
  const captchaBlock = await verifyTurnstile(
    turnstileToken,
    ip,
    TURNSTILE_ACTIONS.contact,
    context,
  );
  if (captchaBlock) return captchaBlock;
  const dayBlock = await rateLimit([dayTotal, "all"]);
  if (dayBlock) return dayBlock;

  const sent = await sendOwnerMail(resend, {
    replyTo: email,
    subject: `Nuevo mensaje desde amaurygomez.dev — ${name}`,
    text: `De: ${name} <${email}>\n\n${message}`,
    html: `<div style="font-family:Inter,system-ui,sans-serif;color:#0B1020;">
  <p><strong>De:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
  <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;" />
  <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
</div>`,
  });

  return sent ? json({ ok: true }) : json({ error: "send_failed" }, 502);
};
