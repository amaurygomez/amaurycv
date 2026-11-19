import type { APIContext } from "astro";
import { isIP } from "node:net";
import type { z } from "zod";

export function json(body: unknown, status = 200, headers?: HeadersInit): Response {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("cache-control", "no-store");
  return Response.json(body, { status, headers: responseHeaders });
}

const MAX_BODY_BYTES = 16_384;

type FormJson = { ok: true; body: unknown } | { ok: false; response: Response };

/** Reject cross-origin browser submissions and cap the number of bytes read from the body. */
export async function readFormJson({
  request,
  url,
}: Pick<APIContext, "request" | "url">): Promise<FormJson> {
  const origin = request.headers.get("origin");
  if (
    (origin !== null && origin !== url.origin) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    return { ok: false, response: json({ error: "invalid_origin" }, 403) };
  }
  const mediaType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (mediaType !== "application/json") {
    return { ok: false, response: json({ error: "unsupported_media_type" }, 415) };
  }
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
    return { ok: false, response: json({ error: "payload_too_large" }, 413) };
  }
  if (!request.body) return { ok: false, response: json({ error: "invalid_json" }, 400) };

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let body = "";
  try {
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        return { ok: false, response: json({ error: "payload_too_large" }, 413) };
      }
      body += decoder.decode(chunk.value, { stream: true });
    }
    return { ok: true, body: JSON.parse(body + decoder.decode()) as unknown };
  } catch {
    return { ok: false, response: json({ error: "invalid_json" }, 400) };
  } finally {
    void reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export function temporarilyUnavailable(): Response {
  return json({ error: "service_unavailable" }, 503, { "retry-after": "60" });
}

export function invalidInput(error: z.ZodError): Response {
  const issue = error.issues[0];
  return json(
    { error: "invalid_input", field: issue?.path[0] ?? null, code: issue?.code ?? null },
    400,
  );
}

export function clientIp(context: APIContext): string | undefined {
  try {
    const address = context.clientAddress;
    return isIP(address) ? address : undefined;
  } catch {
    return undefined;
  }
}

export function tooManyRequests(retryAfter: number): Response {
  return json({ error: "rate_limited", retryAfter }, 429, { "retry-after": String(retryAfter) });
}
