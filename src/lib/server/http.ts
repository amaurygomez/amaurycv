import type { APIContext } from "astro";
import type { z } from "zod";

export function json(body: unknown, status = 200, headers?: HeadersInit): Response {
  return Response.json(body, { status, headers });
}

/** Both forms fit in a few KB; anything larger is refused before it costs a JSON parse. */
const MAX_BODY_BYTES = 16_384;

export function oversized(request: Request): boolean {
  const length = Number(request.headers.get("content-length"));
  return Number.isFinite(length) && length > MAX_BODY_BYTES;
}

export function payloadTooLarge(): Response {
  return json({ error: "payload_too_large" }, 413);
}

export async function readJson(request: Request): Promise<unknown> {
  if (!request.headers.get("content-type")?.includes("application/json")) return undefined;
  return request.json().catch(() => undefined);
}

export function invalidInput(error: z.ZodError): Response {
  const issue = error.issues[0];
  return json(
    { error: "invalid_input", field: issue?.path[0] ?? null, code: issue?.code ?? null },
    400,
  );
}

export function clientIp(context: APIContext): string {
  try {
    return context.clientAddress;
  } catch {
    return "unknown";
  }
}

export function tooManyRequests(retryAfter: number): Response {
  return json({ error: "rate_limited", retryAfter }, 429, { "retry-after": String(retryAfter) });
}
