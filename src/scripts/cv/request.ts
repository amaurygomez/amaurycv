import type { Lang } from "@/i18n/content";
import { requestCopy } from "@/i18n/cv";

type Turnstile = {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
};

type ErrorBody = {
  error?: string;
  field?: string | null;
  code?: string | null;
  retryAfter?: number;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined;
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const SENT_KEY = "cv-request-sent";
const TIMEOUT_MS = 15_000;
const FIELDS = ["name", "company", "email", "role"] as const;
type Field = (typeof FIELDS)[number];

const dialog = document.querySelector<HTMLDialogElement>("#cv-request")!;
const form = dialog.querySelector("form")!;
const captcha = dialog.querySelector<HTMLElement>("[data-turnstile]")!;
const submit = form.querySelector<HTMLButtonElement>("button[type=submit]")!;
const submitLabel = submit.querySelector<HTMLElement>("[data-submit-label]")!;
const spinner = submit.querySelector<HTMLElement>("[data-spinner]")!;
const alertBox = dialog.querySelector<HTMLElement>("[data-request-alert]")!;
const statusBox = dialog.querySelector<HTMLElement>("[data-request-status]")!;
const ownerEmail = dialog.dataset.email ?? "";

let token = "";
let widget: { id: string; lang: Lang } | null = null;
let turnstileScript: Promise<Turnstile> | null = null;
let sending = false;
let blockedUntil = 0;
let returnFocus: HTMLElement | null = null;

const lang = (): Lang => (document.documentElement.dataset.lang === "en" ? "en" : "es");
const copy = () => requestCopy[lang()];
const input = (name: Field | "lang") => form.elements.namedItem(name) as HTMLInputElement;

export function openRequest(trigger: HTMLElement) {
  returnFocus = trigger;
  input("lang").value = lang();
  dialog.showModal();
  const sentTo = readSent();
  if (!SITE_KEY) showUnavailable();
  else if (sentTo) showSent(sentTo);
  // On touch screens an instant keyboard would cover the sheet, so focus stays on the close button.
  else showForm(matchMedia("(pointer: fine)").matches ? "name" : null);
}

function show(view: "form" | "sent" | "unavailable") {
  for (const element of dialog.querySelectorAll<HTMLElement>("[data-view]")) {
    element.hidden = element.dataset.view !== view;
  }
}

function showForm(focus: Field | null) {
  show("form");
  renderSubmit();
  if (focus) input(focus).focus();
  void prepareTurnstile();
}

function showUnavailable() {
  show("unavailable");
  dialog.querySelector<HTMLElement>("[data-request-close]")!.focus();
}

function showSent(email: string) {
  show("sent");
  dialog.querySelector("[data-sent-email]")!.textContent = email;
  dialog.querySelector<HTMLElement>("[data-sent-heading]")!.focus();
}

function readSent() {
  try {
    return sessionStorage.getItem(SENT_KEY);
  } catch {
    return null;
  }
}

function rememberSent(email: string | null) {
  try {
    if (email) sessionStorage.setItem(SENT_KEY, email);
    else sessionStorage.removeItem(SENT_KEY);
  } catch {
    // Without storage the dialog simply opens on the form again.
  }
}

function loadTurnstile() {
  turnstileScript ??= new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.onload = () =>
      window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile missing"));
    script.onerror = () => reject(new Error("Turnstile failed to load"));
    document.head.append(script);
  });
  return turnstileScript;
}

async function prepareTurnstile() {
  const widgetLang = lang();
  let turnstile: Turnstile;
  try {
    turnstile = await loadTurnstile();
  } catch {
    turnstileScript = null;
    showUnavailable();
    return;
  }
  if (widget?.lang === widgetLang) return;
  if (widget) turnstile.remove(widget.id);
  setToken("");
  const id = turnstile.render(captcha, {
    sitekey: SITE_KEY,
    theme: "dark",
    size: "flexible",
    appearance: "interaction-only",
    language: widgetLang,
    callback: (value: string) => setToken(value),
    "expired-callback": () => setToken(""),
    "error-callback": showUnavailable,
  });
  widget = { id, lang: widgetLang };
}

// Tokens are single-use, so every failed attempt needs a fresh one.
function resetTurnstile() {
  setToken("");
  if (widget) window.turnstile?.reset(widget.id);
}

function setToken(value: string) {
  token = value;
  renderSubmit();
}

function renderSubmit() {
  const text = copy();
  submit.disabled = sending || !token || Date.now() < blockedUntil;
  submitLabel.textContent = sending ? text.sending : token ? text.send : text.verifying;
  spinner.hidden = !sending;
}

function setSending(value: boolean) {
  sending = value;
  form.setAttribute("aria-busy", String(value));
  for (const name of FIELDS) input(name).readOnly = value;
  for (const button of dialog.querySelectorAll<HTMLButtonElement>("[data-request-close]"))
    button.disabled = value;
  statusBox.textContent = value ? copy().sending : "";
  renderSubmit();
}

function setFieldError(name: Field, message: string) {
  const field = input(name);
  if (message) field.setAttribute("aria-invalid", "true");
  else field.removeAttribute("aria-invalid");
  form.querySelector(`[data-error-for="${name}"]`)!.textContent = message;
}

function validate() {
  let firstInvalid: HTMLInputElement | null = null;
  for (const name of FIELDS) {
    const field = input(name);
    field.value = field.value.trim();
    const valid = field.checkValidity();
    setFieldError(name, valid ? "" : copy().invalid[name]);
    if (!valid) firstInvalid ??= field;
  }
  firstInvalid?.focus();
  return firstInvalid === null;
}

// The daily limiter can return a full day, and "1440 min" reads as a bug.
function waitText(seconds: number) {
  const inHours = seconds > 90 * 60;
  return new Intl.NumberFormat(lang(), {
    style: "unit",
    unit: inHours ? "hour" : "minute",
    unitDisplay: inHours ? "long" : "short",
  }).format(Math.max(1, Math.ceil(seconds / (inHours ? 3600 : 60))));
}

function setAlert(template: string, wait = "") {
  alertBox.replaceChildren();
  if (!template) return;
  // The copy carries the unit next to the placeholder, so both are replaced together.
  const [before, after] = template.replace(/\{n\}( min)?/, wait).split("{email}");
  alertBox.append(before);
  if (after === undefined) return;
  const link = document.createElement("a");
  link.className = "cv-link text-ink";
  link.href = `mailto:${ownerEmail}`;
  link.textContent = ownerEmail;
  alertBox.append(link, after);
}

async function send(): Promise<Response | null> {
  const data = new FormData(form);
  const body = {
    name: data.get("name"),
    company: data.get("company"),
    email: data.get("email"),
    role: data.get("role"),
    lang: data.get("lang"),
    website: data.get("website") ?? "",
    turnstileToken: token,
  };
  try {
    return await fetch("/api/cv-request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return null;
  }
}

function handleFailure(response: Response | null, body: ErrorBody) {
  const text = copy();
  if (response?.status === 503) {
    showUnavailable();
  } else if (response?.status === 429) {
    const seconds = body.retryAfter ?? (Number(response.headers.get("retry-after")) || 60);
    blockedUntil = Date.now() + seconds * 1000;
    setTimeout(renderSubmit, seconds * 1000);
    setAlert(text.rateLimited, waitText(seconds));
  } else if (body.error === "captcha_failed") {
    setAlert(text.captcha);
  } else if (body.error === "invalid_input" && FIELDS.includes(body.field as Field)) {
    const field = body.field as Field;
    setFieldError(field, body.code === "custom" ? text.links : text.invalid[field]);
    input(field).focus();
  } else {
    setAlert(text.failed);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (sending || submit.disabled || !validate()) return;
  setAlert("");
  setSending(true);
  const response = await send();
  setSending(false);

  if (response?.ok) {
    const email = input("email").value;
    rememberSent(email);
    showSent(email);
    return;
  }
  const body = ((await response?.json().catch(() => null)) ?? {}) as ErrorBody;
  handleFailure(response, body);
  resetTurnstile();
});

form.addEventListener("input", (event) => {
  const field = event.target as HTMLInputElement;
  if (field.getAttribute("aria-invalid") && field.checkValidity())
    setFieldError(field.name as Field, "");
});

dialog.addEventListener("cancel", (event) => {
  if (sending) event.preventDefault();
});

dialog.addEventListener("close", () => returnFocus?.focus());

for (const button of dialog.querySelectorAll<HTMLButtonElement>("[data-request-close]")) {
  button.addEventListener("click", () => dialog.close());
}

dialog.querySelector("[data-request-again]")!.addEventListener("click", () => {
  rememberSent(null);
  input("email").value = "";
  showForm("email");
});
