import type { Ratelimit } from "@upstash/ratelimit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { limiter, rateLimit, verifyTurnstile } from "../../src/lib/server/guard";
import { TURNSTILE_ACTIONS } from "../../src/lib/turnstile-actions";

vi.mock("astro:env/server", () => ({
  TURNSTILE_SECRET_KEY: "local-test-turnstile-secret",
  UPSTASH_REDIS_REST_URL: "https://form-tests.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "local-test-redis-token",
}));

const site = new URL("https://portfolio.example.test");
const formContext = { site, url: new URL("/api/contact", site) };
const key = "test-client";
const token = "local-test-turnstile-response";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function mockSiteverify(response: Response) {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function mockLimiter(result: Partial<Awaited<ReturnType<Ratelimit["limit"]>>> = {}) {
  const check = limiter("form-test", 3, "1 m");
  if (!check) throw new Error("Expected a limiter with the mocked Redis configuration");
  vi.spyOn(check, "limit").mockResolvedValue({
    success: true,
    limit: 3,
    remaining: 2,
    reset: Date.now() + 60_000,
    pending: Promise.resolve(),
    ...result,
  });
  return check;
}

describe("Turnstile verification", () => {
  it.each(Object.values(TURNSTILE_ACTIONS))(
    "allows the expected hostname and %s action",
    async (action) => {
      mockSiteverify(Response.json({ success: true, hostname: site.hostname, action }));

      await expect(verifyTurnstile(token, undefined, action, formContext)).resolves.toBeNull();
    },
  );

  it.each([
    { hostname: "another.example.test", action: TURNSTILE_ACTIONS.contact },
    { hostname: site.hostname, action: TURNSTILE_ACTIONS.cvRequest },
  ])("rejects a response with a different hostname or form action", async (metadata) => {
    mockSiteverify(Response.json({ success: true, ...metadata }));

    const response = await verifyTurnstile(
      token,
      undefined,
      TURNSTILE_ACTIONS.contact,
      formContext,
    );

    expect(response?.status).toBe(400);
    await expect(response?.json()).resolves.toEqual({ error: "captcha_failed" });
  });

  it("rejects an unknown request hostname without calling Cloudflare", async () => {
    const fetchMock = mockSiteverify(Response.json({ success: true }));
    const response = await verifyTurnstile(token, undefined, TURNSTILE_ACTIONS.contact, {
      site,
      url: new URL("https://another.example.test/api/contact"),
    });

    expect(response?.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports an unavailable service when Cloudflare returns a 5xx", async () => {
    mockSiteverify(new Response(null, { status: 502 }));

    const response = await verifyTurnstile(
      token,
      undefined,
      TURNSTILE_ACTIONS.contact,
      formContext,
    );

    expect(response?.status).toBe(503);
    expect(response?.headers.get("retry-after")).toBe("60");
  });
});

describe("form rate limiting", () => {
  it("allows a request when every configured limiter allows it", async () => {
    await expect(rateLimit([mockLimiter(), key], [mockLimiter(), key])).resolves.toBeNull();
  });

  it("returns 503 when a limiter is unconfigured", async () => {
    const response = await rateLimit([null, key]);

    expect(response?.status).toBe(503);
  });

  it("returns 503 when Upstash times out", async () => {
    const response = await rateLimit([mockLimiter({ reason: "timeout" }), key]);

    expect(response?.status).toBe(503);
  });

  it("returns 429 with the longest wait when multiple limits are exhausted", async () => {
    const now = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(now);
    const response = await rateLimit(
      [mockLimiter({ success: false, reset: now + 10_000 }), key],
      [mockLimiter({ success: false, reset: now + 30_100 }), key],
    );

    expect(response?.status).toBe(429);
    expect(response?.headers.get("retry-after")).toBe("31");
    await expect(response?.json()).resolves.toEqual({ error: "rate_limited", retryAfter: 31 });
  });
});
