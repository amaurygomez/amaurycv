import type { APIRoute } from "astro";
import { CRON_SECRET } from "astro:env/server";
import { keepAlive } from "@/lib/server/guard";
import { json } from "@/lib/server/http";

export const prerender = false;

// Vercel Cron calls this daily (vercel.json) with `Authorization: Bearer $CRON_SECRET`.
export const GET: APIRoute = async ({ request }) => {
  if (!CRON_SECRET || request.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return json({ error: "unauthorized" }, 401);
  }
  return (await keepAlive()) ? json({ ok: true }) : json({ error: "redis_unreachable" }, 503);
};
