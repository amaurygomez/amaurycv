import type { APIRoute } from "astro";
import { CRON_SECRET } from "astro:env/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { keepAlive } from "@/lib/server/guard";
import { json } from "@/lib/server/http";

export const prerender = false;

const expectedAuthorization = CRON_SECRET
  ? createHash("sha256").update(`Bearer ${CRON_SECRET}`).digest()
  : null;

// Vercel Cron calls this daily (vercel.json) with `Authorization: Bearer $CRON_SECRET`.
export const GET: APIRoute = async ({ request }) => {
  const authorization = request.headers.get("authorization");
  if (
    !expectedAuthorization ||
    !authorization ||
    !timingSafeEqual(createHash("sha256").update(authorization).digest(), expectedAuthorization)
  ) {
    return json({ error: "unauthorized" }, 401);
  }
  return (await keepAlive()) ? json({ ok: true }) : json({ error: "redis_unreachable" }, 503);
};
