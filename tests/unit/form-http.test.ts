import { describe, expect, it } from "vitest";
import { readFormJson } from "../../src/lib/server/http";

const url = new URL("https://amaurygomez.dev/api/contact");

function read(body: BodyInit, headers: HeadersInit = { "content-type": "application/json" }) {
  const request = new Request(url, {
    method: "POST",
    headers,
    body,
    duplex: "half",
  } as RequestInit & { duplex: "half" });
  return readFormJson({ request, url });
}

function stream(first: Uint8Array, second: Uint8Array): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(first);
      controller.enqueue(second);
      controller.close();
    },
  });
}

describe("form request body", () => {
  it("accepts same-origin JSON split across chunks inside a Unicode character", async () => {
    const bytes = new TextEncoder().encode('"ñ"');
    const result = await read(stream(bytes.subarray(0, 2), bytes.subarray(2)), {
      "content-type": "Application/JSON; charset=utf-8",
      origin: url.origin,
    });
    expect(result).toEqual({ ok: true, body: "ñ" });
  });

  it("enforces the 16 KiB limit on streamed bytes", async () => {
    const accepted = new TextEncoder().encode(JSON.stringify("ñ".repeat(8191)));
    const within = await read(stream(accepted.subarray(0, 5000), accepted.subarray(5000)));
    expect(within.ok).toBe(true);

    const over = new TextEncoder().encode(JSON.stringify("ñ".repeat(8192)));
    const result = await read(stream(over.subarray(0, 5000), over.subarray(5000)));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.response.status).toBe(413);
    expect(result.response.headers.get("cache-control")).toBe("no-store");
  });

  it.each([
    [{ "content-type": "application/json", origin: "https://example.com" }, 403],
    [{ "content-type": "text/plain" }, 415],
    [{ "content-type": "application/json", "content-length": "16385" }, 413],
  ] as const)("returns the correct status for %o", async (headers, status) => {
    const result = await read("{}", headers);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.response.status).toBe(status);
  });

  it("returns a client error for malformed JSON", async () => {
    const result = await read("{");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.response.status).toBe(400);
  });
});
