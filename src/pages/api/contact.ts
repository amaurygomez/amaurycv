import type { APIRoute } from "astro";
import { z } from "zod";
import { Resend } from "resend";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const prerender = false;

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(20).max(2000),
  // Honeypot — must be empty
  website: z.string().max(0).optional().default(""),
  turnstileToken: z.string().min(10).max(2048),
});

const urlRegex = /https?:\/\//gi;

const redis =
  import.meta.env.UPSTASH_REDIS_REST_URL && import.meta.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: import.meta.env.UPSTASH_REDIS_REST_URL,
        token: import.meta.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const hourlyLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, "1 h"), prefix: "contact:h" })
  : null;

const dailyLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 d"), prefix: "contact:d" })
  : null;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("[contact] TURNSTILE_SECRET_KEY missing");
    return false;
  }

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  body.append("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  if (!res.ok) {
    console.error("[contact] turnstile http", res.status);
    return false;
  }
  const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
  if (!data.success) {
    console.error("[contact] turnstile failed", data["error-codes"]);
  }
  return data.success === true;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const parsed = ContactSchema.safeParse(payload);
  if (!parsed.success) {
    console.error("[contact] invalid_input", parsed.error.issues);
    const first = parsed.error.issues[0];
    return json(
      {
        error: "invalid_input",
        field: first?.path[0] ?? null,
        code: first?.code ?? null,
      },
      400
    );
  }

  const { name, email, message, website, turnstileToken } = parsed.data;

  // Honeypot — silently accept to not signal the trap
  if (website && website.length > 0) {
    return json({ ok: true }, 200);
  }

  // Excessive URLs in body — spam signal
  const urlMatches = message.match(urlRegex);
  if (urlMatches && urlMatches.length > 2) {
    return json({ error: "too_many_links" }, 400);
  }

  if (hourlyLimit && dailyLimit) {
    const [hour, day] = await Promise.all([hourlyLimit.limit(ip), dailyLimit.limit(ip)]);
    if (!hour.success || !day.success) {
      return json({ error: "rate_limited" }, 429);
    }
  }

  const turnstileOk = await verifyTurnstile(turnstileToken, ip);
  if (!turnstileOk) {
    return json({ error: "captcha_failed" }, 400);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const from = import.meta.env.RESEND_FROM ?? "Portfolio <hello@amaurygomez.dev>";
  const to = import.meta.env.CONTACT_TO ?? "hello@amaurygomez.dev";
  if (!apiKey) {
    return json({ error: "service_unavailable" }, 503);
  }

  const resend = new Resend(apiKey);
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  const { error, data: sendData } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `Nuevo mensaje desde amaurygomez.dev — ${name}`,
    text: `De: ${name} <${email}>\nIP: ${ip}\n\n${message}`,
    html: `<div style="font-family:Inter,system-ui,sans-serif;color:#0B1020;">
  <p><strong>De:</strong> ${safeName} &lt;${escapeHtml(email)}&gt;</p>
  <p><strong>IP:</strong> ${escapeHtml(ip)}</p>
  <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;" />
  <p>${safeMessage}</p>
</div>`,
  });

  if (error) {
    console.error("[contact] resend send_failed", error);
    return json({ error: "send_failed" }, 502);
  }

  console.log("[contact] sent", sendData?.id);
  return json({ ok: true }, 200);
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
