import { execFileSync } from "node:child_process";

const BASE_URL = "http://127.0.0.1:4321";
// Cloudflare's always-pass test key; the specs stub the widget script itself.
const SITE_KEY = "1x00000000000000000000AA";

async function waitForServer(timeoutMs: number) {
  const deadline = Date.now() + timeoutMs;
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

// Astro 7 hands the dev server to a background daemon and returns, so Playwright's own
// `webServer` env never reaches a server that is already running. Restart it here instead.
// In CI the daemon hand-off does not happen (`astro dev` stays attached and this setup would
// block forever), so the workflow starts the server itself and sets E2E_EXTERNAL_SERVER=1.
export default async function globalSetup() {
  if (process.env.E2E_EXTERNAL_SERVER) {
    await waitForServer(120_000);
    return;
  }

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
  await waitForServer(60_000);
}
