import type { APIRoute } from "astro";
import { createHash } from "node:crypto";
import type { Resend } from "resend";
import { fullCvFilename, openFullCv } from "@/lib/server/full-cv";
import { exceededStrict, limiter, rateLimiting, verifyTurnstile } from "@/lib/server/guard";
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
import { CvRequestSchema, type CvRequest } from "@/lib/server/validation";

export const prerender = false;

const perIp = limiter("cv:ip", 5, "1 h");
const perEmail = limiter("cv:email", 2, "1 d");
const perDay = limiter("cv:day", 40, "1 d");

// Nothing the requester typed is echoed back: the form cannot be used to relay text to a third party.
const LETTER = {
  es: {
    subject: "CV completo — Amaury Gómez",
    lines: [
      "Hola,",
      "Te comparto mi CV completo, solicitado desde amaurygomez.dev.",
      "Si quieres coordinar una conversación, responde a este correo.",
      "Amaury Gómez",
    ],
  },
  en: {
    subject: "Full CV — Amaury Gómez",
    lines: [
      "Hi,",
      "Here is my full CV, requested from amaurygomez.dev.",
      "If you'd like to set up a conversation, just reply to this email.",
      "Amaury Gómez",
    ],
  },
} as const;

export const POST: APIRoute = async (context) => {
  if (oversized(context.request)) return payloadTooLarge();
  const body = await readJson(context.request);
  if (body === undefined) return json({ error: "invalid_json" }, 400);

  const parsed = CvRequestSchema.safeParse(body);
  if (!parsed.success) return invalidInput(parsed.error);
  const request = parsed.data;

  if (request.website) return json({ ok: true });

  const resend = mailer();
  const pdf = openFullCv(request.lang);
  if (!resend || !pdf || (!rateLimiting && import.meta.env.PROD)) {
    return json({ error: "service_unavailable" }, 503);
  }

  const ip = clientIp(context);
  const ipWait = await exceededStrict([perIp, ip]);
  if (ipWait) return tooManyRequests(ipWait);
  if (!(await verifyTurnstile(request.turnstileToken, ip))) {
    return json({ error: "captcha_failed" }, 400);
  }
  const emailWait = await exceededStrict([perEmail, digest(request.email)]);
  if (emailWait) return tooManyRequests(emailWait);
  // Last check before the send, so a rejected request never spends the day's pool.
  const dayWait = await exceededStrict([perDay, "all"]);
  if (dayWait) return tooManyRequests(dayWait);

  const letter = LETTER[request.lang];
  const { data, error } = await resend.emails.send({
    from: mailFrom,
    to: request.email,
    replyTo: ownerInbox,
    subject: letter.subject,
    text: letter.lines.join("\n\n"),
    html: letter.lines.map((line) => `<p>${line}</p>`).join(""),
    attachments: [
      {
        filename: fullCvFilename(request.lang),
        content: pdf.toString("base64"),
        contentType: "application/pdf",
      },
    ],
  });

  if (error) console.error("[cv-request] delivery failed", error);
  await notifyOwner(resend, request, ip, error ? `FALLÓ (${error.name})` : `enviado ${data.id}`);

  return error ? json({ error: "send_failed" }, 502) : json({ ok: true });
};

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

async function notifyOwner(resend: Resend, request: CvRequest, ip: string, delivery: string) {
  const rows: [string, string][] = [
    ["Nombre", request.name],
    ["Empresa", request.company],
    ["Rol", request.role || "—"],
    ["Email", request.email],
    ["Idioma", request.lang.toUpperCase()],
    ["IP", ip],
    ["Entrega", delivery],
  ];
  const { error } = await resend.emails.send({
    from: mailFrom,
    to: ownerInbox,
    replyTo: request.email,
    subject: `CV solicitado — ${request.name} (${request.company})`,
    text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
    html: `<table style="font-family:Inter,system-ui,sans-serif;color:#0B1020;">${rows
      .map(
        ([label, value]) =>
          `<tr><td style="padding:2px 16px 2px 0;color:#667085;">${label}</td><td>${escapeHtml(value)}</td></tr>`,
      )
      .join("")}</table>`,
  });
  if (error) console.error("[cv-request] owner notice failed", error);
}
