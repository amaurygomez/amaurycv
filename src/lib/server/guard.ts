import type { APIContext } from "astro";
import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
  TURNSTILE_SECRET_KEY,
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
} from "astro:env/server";
import type { TurnstileAction } from "../turnstile-actions";
import { json, temporarilyUnavailable, tooManyRequests } from "./http";

const redis =
  UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: UPSTASH_REDIS_REST_URL,
        token: UPSTASH_REDIS_REST_TOKEN,
        retry: false,
        signal: () => AbortSignal.timeout(3000),
      })
    : null;

/** Touches Redis so Upstash never reclaims the free database as inactive. */
export async function keepAlive(): Promise<boolean> {
  if (!redis) return false;
  try {
    return (await redis.ping()) === "PONG";
  } catch {
    console.error("[keepalive] Redis unreachable");
    return false;
  }
}

export function limiter(prefix: string, tokens: number, window: Duration): Ratelimit | null {
  return redis
    ? new Ratelimit({
        redis,
        prefix,
        limiter: Ratelimit.slidingWindow(tokens, window),
        timeout: 3500,
      })
    : null;
}

/** Mail delivery requires an explicit allowance from every configured limiter. */
export async function rateLimit(...checks: [Ratelimit | null, string][]): Promise<Response | null> {
  try {
    const results = await Promise.all(checks.map(([rl, key]) => rl?.limit(key)));
    // Upstash can report success with reason="timeout" when no decision was made.
    if (results.some((result) => !result || result.reason === "timeout")) {
      return temporarilyUnavailable();
    }
    const resets = results.flatMap((result) => (result?.success === false ? [result.reset] : []));
    if (resets.length) {
      return tooManyRequests(Math.max(1, Math.ceil((Math.max(...resets) - Date.now()) / 1000)));
    }
    return null;
  } catch {
    console.error("[ratelimit] Redis unreachable");
    return temporarilyUnavailable();
  }
}

function isFormHostname({ url, site }: Pick<APIContext, "url" | "site">): boolean {
  const { hostname } = url;
  if (import.meta.env.DEV && ["localhost", "127.0.0.1", "[::1]"].includes(hostname)) return true;
  return (
    hostname === site?.hostname ||
    (site !== undefined && hostname === `www.${site.hostname}`) ||
    [
      process.env.VERCEL_URL,
      process.env.VERCEL_BRANCH_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
    ].includes(hostname)
  );
}

type SiteverifyResult = {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

export async function verifyTurnstile(
  token: string,
  ip: string | undefined,
  action: TurnstileAction,
  context: Pick<APIContext, "url" | "site">,
): Promise<Response | null> {
  if (!isFormHostname(context)) return json({ error: "invalid_origin" }, 403);
  if (!TURNSTILE_SECRET_KEY) {
    console.error("[turnstile] TURNSTILE_SECRET_KEY missing");
    return temporarilyUnavailable();
  }
  try {
    const body = new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return temporarilyUnavailable();
    const data = (await res.json()) as SiteverifyResult;
    if (
      typeof data?.success !== "boolean" ||
      data["error-codes"]?.some((code) =>
        ["internal-error", "invalid-input-secret", "missing-input-secret"].includes(code),
      )
    ) {
      return temporarilyUnavailable();
    }
    if (data.success && data.action === action && data.hostname === context.url.hostname)
      return null;
    return json({ error: "captcha_failed" }, 400);
  } catch {
    console.error("[turnstile] siteverify unreachable");
    return temporarilyUnavailable();
  }
}
