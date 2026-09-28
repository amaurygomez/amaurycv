import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
  TURNSTILE_SECRET_KEY,
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
} from "astro:env/server";

const redis =
  UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN })
    : null;

export const rateLimiting = redis !== null;

export function limiter(prefix: string, tokens: number, window: Duration): Ratelimit | null {
  return redis
    ? new Ratelimit({ redis, prefix, limiter: Ratelimit.slidingWindow(tokens, window) })
    : null;
}

const UNREACHABLE_WAIT = 60;

async function spend(
  checks: [Ratelimit | null, string][],
  onUnreachable: number | null,
): Promise<number | null> {
  try {
    const results = await Promise.all(checks.map(([rl, key]) => rl?.limit(key)));
    const resets = results.flatMap((r) => (r && !r.success ? [r.reset] : []));
    return resets.length ? Math.max(1, Math.ceil((Math.max(...resets) - Date.now()) / 1000)) : null;
  } catch (error) {
    console.error("[ratelimit] redis unreachable", error);
    return onUnreachable;
  }
}

/** Takes one token from each limiter; returns seconds to wait when any is exhausted. */
export function exceeded(...checks: [Ratelimit | null, string][]): Promise<number | null> {
  // A brake, not the gate: Turnstile still runs while Redis is unreachable.
  return spend(checks, null);
}

/** Same, but an unreachable Redis makes the caller wait instead of letting it through. */
export function exceededStrict(...checks: [Ratelimit | null, string][]): Promise<number | null> {
  return spend(checks, UNREACHABLE_WAIT);
}

type SiteverifyResult = { success: boolean; "error-codes"?: string[] };

export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) {
    console.error("[turnstile] TURNSTILE_SECRET_KEY missing");
    return false;
  }
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as SiteverifyResult;
    if (!data.success) console.warn("[turnstile] rejected", data["error-codes"]);
    return data.success === true;
  } catch (error) {
    console.error("[turnstile] siteverify unreachable", error);
    return false;
  }
}
