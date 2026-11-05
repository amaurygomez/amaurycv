import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { loadTurnstile } from "@/lib/turnstile";

export type TurnstileHandle = { reset(): void };

type Props = {
  siteKey: string;
  onSuccess: (token: string) => void;
  onFailure: () => void;
};

// Renders Cloudflare Turnstile through the official script. Callbacks are read through a ref so a
// parent re-render never tears the widget down and forces a new challenge.
export const TurnstileWidget = forwardRef<TurnstileHandle, Props>(function TurnstileWidget(
  { siteKey, onSuccess, onFailure },
  ref,
) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const callbacks = useRef({ onSuccess, onFailure });

  useEffect(() => {
    callbacks.current = { onSuccess, onFailure };
  });

  useImperativeHandle(ref, () => ({
    reset() {
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    },
  }));

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !container.current) return;
        widgetId.current = turnstile.render(container.current, {
          sitekey: siteKey,
          theme: "dark",
          size: "flexible",
          callback: (value: string) => callbacks.current.onSuccess(value),
          "expired-callback": () => callbacks.current.onFailure(),
          "error-callback": () => callbacks.current.onFailure(),
        });
      })
      .catch(() => {
        if (!cancelled) callbacks.current.onFailure();
      });
    return () => {
      cancelled = true;
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey]);

  return <div ref={container} />;
});
