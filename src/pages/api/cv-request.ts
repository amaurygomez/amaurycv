import type { APIRoute } from "astro";
import { createHash } from "node:crypto";
import type { Resend } from "resend";
import { limiter, rateLimit, verifyTurnstile } from "@/lib/server/guard";
import {
  clientIp,
  invalidInput,
  json,
  readFormJson,
  temporarilyUnavailable,
} from "@/lib/server/http";
import { escapeHtml, mailer, sendOwnerMail } from "@/lib/server/mail";
import { CvRequestSchema, type CvRequest } from "@/lib/server/validation";
import { TURNSTILE_ACTIONS } from "@/lib/turnstile-actions";

export const prerender = false;

const perIp = limiter("cv:ip", 5, "1 h");
const perEmail = limiter("cv:email", 2, "1 d");
const perDay = limiter("cv:day", 40, "1 d");

export const POST: APIRoute = async (context) => {
  const payload = await readFormJson(context);
  if (!payload.ok) return payload.response;

  const parsed = CvRequestSchema.safeParse(payload.body);
  if (!parsed.success) return invalidInput(parsed.error);
  const request = parsed.data;

  if (request.website) return json({ ok: true });

  const resend = mailer();
  if (!resend) return temporarilyUnavailable();

  const ip = clientIp(context);
  const ipBlock = await rateLimit([perIp, ip ?? "unknown"]);
  if (ipBlock) return ipBlock;
  const captchaBlock = await verifyTurnstile(
    request.turnstileToken,
    ip,
    TURNSTILE_ACTIONS.cvRequest,
    context,
  );
  if (captchaBlock) return captchaBlock;
  const emailBlock = await rateLimit([perEmail, digest(request.email)]);
  if (emailBlock) return emailBlock;
  const dayBlock = await rateLimit([perDay, "all"]);
  if (dayBlock) return dayBlock;

  // The full CV is never sent automatically: the owner reviews every request and replies by hand.
  const noticed = await notifyOwner(resend, request);
  return noticed ? json({ ok: true }) : json({ error: "send_failed" }, 502);
};

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

async function notifyOwner(resend: Resend, request: CvRequest): Promise<boolean> {
  const rows: [string, string][] = [
    ["Nombre", request.name],
    ["Empresa", request.company],
    ["Rol", request.role || "—"],
    ["Email", request.email],
    ["Idioma", request.lang.toUpperCase()],
  ];
  return sendOwnerMail(resend, {
    replyTo: request.email,
    subject: `Solicitud de CV pendiente — ${request.name} (${request.company})`,
    text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
    html: `<table style="font-family:Inter,system-ui,sans-serif;color:#0B1020;">${rows
      .map(
        ([label, value]) =>
          `<tr><td style="padding:2px 16px 2px 0;color:#667085;">${label}</td><td>${escapeHtml(value)}</td></tr>`,
      )
      .join("")}</table>`,
  });
}
