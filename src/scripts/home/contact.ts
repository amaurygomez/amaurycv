// Home contact form: posts to /api/contact behind Cloudflare Turnstile. The widget script is
// loaded on first interaction, so the form costs nothing until someone starts typing.

type Turnstile = {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
};
type Lang = "es" | "en";
declare global {
  interface Window {
    va?: (event: string, payload: { name: string; data?: Record<string, string> }) => void;
  }
}

type ErrorBody = { error?: string; field?: string | null; code?: string | null };

const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined;
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TIMEOUT_MS = 15_000;

const COPY = {
  es: {
    name: "Indique su nombre (mínimo 2 caracteres, sin enlaces).",
    email: "Indique un correo válido.",
    short: "Describa lo que necesita en al menos 20 caracteres.",
    long: "El mensaje es demasiado largo.",
    links: "El mensaje admite como máximo dos enlaces.",
    captcha: "No se pudo completar la verificación de seguridad. Inténtelo de nuevo.",
    rate: "Se alcanzó el límite de envíos. Inténtelo más tarde o escriba al correo.",
    generic: "No se pudo enviar el mensaje. Inténtelo de nuevo o escriba al correo.",
    sending: "Enviando…",
    send: "Enviar mensaje",
    type: "Tipo",
  },
  en: {
    name: "Enter your name (at least 2 characters, no links).",
    email: "Enter a valid email address.",
    short: "Describe what you need in at least 20 characters.",
    long: "The message is too long.",
    links: "The message can contain at most two links.",
    captcha: "The security check could not be completed. Please try again.",
    rate: "The sending limit was reached. Try again later or write to the email address.",
    generic: "The message could not be sent. Try again or write to the email address.",
    sending: "Sending…",
    send: "Send message",
    type: "Type",
  },
} as const;
type CopyKey = keyof (typeof COPY)["es"];

const card = document.querySelector<HTMLElement>("#contact-card");
const form = document.querySelector<HTMLFormElement>("#contact-form");

if (card && form && SITE_KEY) init(card, form, SITE_KEY);

function init(card: HTMLElement, form: HTMLFormElement, siteKey: string) {
  const ok = card.querySelector<HTMLElement>("#contact-ok")!;
  const errorBox = form.querySelector<HTMLElement>("#cf-error")!;
  const captcha = form.querySelector<HTMLElement>("[data-turnstile]")!;
  const submit = form.querySelector<HTMLButtonElement>("button[type=submit]")!;
  const submitLabel = submit.querySelector<HTMLElement>("[data-submit-label]")!;
  const field = (name: string) =>
    form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

  let token = "";
  let widgetId: string | null = null;
  let script: Promise<Turnstile> | null = null;
  let pending: ((value: string) => void) | null = null;
  let sending = false;

  const lang = (): Lang => (document.documentElement.lang === "en" ? "en" : "es");
  const copy = (key: CopyKey) => COPY[lang()][key];

  card.hidden = false;
  card.closest(".contact-grid")?.classList.add("has-form");

  function loadTurnstile() {
    script ??= new Promise<Turnstile>((resolve, reject) => {
      const element = document.createElement("script");
      element.src = TURNSTILE_SRC;
      element.async = true;
      element.onload = () =>
        window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile missing"));
      element.onerror = () => reject(new Error("Turnstile failed to load"));
      document.head.append(element);
    });
    return script;
  }

  async function prepare() {
    if (widgetId) return;
    let turnstile: Turnstile;
    try {
      turnstile = await loadTurnstile();
    } catch {
      script = null;
      return;
    }
    if (widgetId) return;
    widgetId = turnstile.render(captcha, {
      sitekey: siteKey,
      theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
      size: "flexible",
      appearance: "interaction-only",
      language: lang(),
      callback: (value: string) => {
        token = value;
        pending?.(value);
        pending = null;
      },
      "expired-callback": () => (token = ""),
      "error-callback": () => {
        token = "";
        pending?.("");
        pending = null;
      },
    });
  }

  /** Resolves with a token, waiting for a challenge still in flight; "" when none arrives. */
  async function ensureToken() {
    await prepare();
    if (token) return token;
    if (!widgetId) return "";
    return new Promise<string>((resolve) => {
      const timer = setTimeout(() => {
        pending = null;
        resolve("");
      }, TIMEOUT_MS);
      pending = (value) => {
        clearTimeout(timer);
        resolve(value);
      };
    });
  }

  function resetChallenge() {
    token = "";
    if (widgetId) window.turnstile?.reset(widgetId);
  }

  function fail(key: CopyKey, name?: string) {
    errorBox.textContent = copy(key);
    errorBox.classList.add("on");
    for (const item of ["name", "email", "message"]) {
      field(item).setAttribute("aria-invalid", String(item === name));
    }
    if (name) field(name).focus();
  }

  function setSending(value: boolean) {
    sending = value;
    submit.disabled = value;
    submit.setAttribute("aria-busy", String(value));
    submitLabel.textContent = copy(value ? "sending" : "send");
  }

  form.addEventListener("focusin", () => void prepare(), { once: true });
  form.addEventListener("input", () => errorBox.classList.remove("on"));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;

    const name = field("name").value.trim();
    const email = field("email").value.trim();
    const text = field("message").value.trim();
    if (name.length < 2) return fail("name", "name");
    if (!(field("email") as HTMLInputElement).validity.valid || !email)
      return fail("email", "email");
    if (text.length < 20) return fail("short", "message");

    const select = field("type") as HTMLSelectElement;
    const type = select.selectedOptions[0]?.textContent?.trim() ?? "";
    const message = `${copy("type")}: ${type}\n\n${text}`;

    errorBox.classList.remove("on");
    setSending(true);
    try {
      const turnstileToken = await ensureToken();
      if (!turnstileToken) {
        resetChallenge();
        return fail("captcha");
      }
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          website: field("website").value,
          turnstileToken,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (response.ok) {
        form.hidden = true;
        ok.hidden = false;
        window.va?.("event", { name: "contact_sent", data: { type: select.value } });
        ok.focus();
        return;
      }
      const body = (await response.json().catch(() => ({}))) as ErrorBody;
      // Turnstile tokens are single-use, so a retry needs a fresh challenge.
      resetChallenge();
      if (body.error === "rate_limited") fail("rate");
      else if (body.error === "captcha_failed") fail("captcha");
      else if (body.error === "too_many_links") fail("links", "message");
      else if (body.error === "invalid_input" && body.field === "name") fail("name", "name");
      else if (body.error === "invalid_input" && body.field === "email") fail("email", "email");
      else if (body.error === "invalid_input" && body.field === "message")
        fail(body.code === "too_big" ? "long" : "short", "message");
      else fail("generic");
    } catch {
      resetChallenge();
      fail("generic");
    } finally {
      setSending(false);
    }
  });
}
