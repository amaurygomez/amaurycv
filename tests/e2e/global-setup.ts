import { execFileSync } from "node:child_process";

const BASE_URL = "http://127.0.0.1:4321";
// Cloudflare's always-pass test key; the specs stub the widget script itself.
const SITE_KEY = "1x00000000000000000000AA";

// Astro 7 hands the dev server to a background daemon and returns, so Playwright's own
// `webServer` env never reaches a server that is already running. Restart it here instead.
export default async function globalSetup() {
  const astro = (...args: string[]) =>
    execFileSync("npx", ["astro", ...args], {
      stdio: "ignore",
      env: { ...process.env, PUBLIC_TURNSTILE_SITE_KEY: SITE_KEY },
    });

  try {
    astro("dev", "stop");
  } catch {
    // Nothing was running.
  }
  astro("dev", "--host", "127.0.0.1");

  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(BASE_URL)).ok) return;
    } catch {
      // Still booting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`dev server did not answer at ${BASE_URL}`);
}
