// Thin client for Cloudflare's official Turnstile script. Shared by the CV dialog and the AG World
// contact panel, so no third-party wrapper sits between the page and the challenge.

export type TurnstileApi = {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let pending: Promise<TurnstileApi> | null = null;

export function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  pending ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.onload = () =>
      window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile missing"));
    script.onerror = () => reject(new Error("Turnstile failed to load"));
    document.head.append(script);
  }).catch((error: unknown) => {
    // A failed load must not be cached, or a retry could never succeed.
    pending = null;
    throw error;
  });
  return pending;
}
