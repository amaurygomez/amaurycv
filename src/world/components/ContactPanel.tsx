import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, Mail, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useWorld } from "@/world/state/useWorld";

const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined;

type Status = "idle" | "submitting" | "success" | "error";

const COPY = {
  es: {
    eyebrow: "Contacto seguro",
    title: "Hablemos.",
    subtitle: "Cuéntame tu proyecto, idea o pregunta — respondo personalmente.",
    name: "Tu nombre",
    email: "Tu email",
    message: "Mensaje",
    messageHint: "Mínimo 20 caracteres. Sé directo.",
    send: "Enviar mensaje",
    sending: "Enviando…",
    success: "¡Listo! Te respondo pronto.",
    errorGeneric: "No se pudo enviar. Intenta de nuevo.",
    errorRate: "Demasiados envíos. Intenta más tarde.",
    errorCaptcha: "Verificación fallida. Intenta de nuevo.",
    errorLinks: "Demasiados enlaces en el mensaje.",
    errorNameShort: "El nombre debe tener al menos 2 caracteres.",
    errorEmailInvalid: "Email inválido.",
    errorMessageShort: "El mensaje debe tener al menos 20 caracteres.",
    errorMessageLong: "El mensaje supera los 2000 caracteres.",
    charsRemaining: "caracteres restantes",
    charsMore: "más para enviar",
    close: "Cerrar",
    captchaMissing: "Verificación no disponible. Recarga la página.",
  },
  en: {
    eyebrow: "Secure contact",
    title: "Let's talk.",
    subtitle: "Tell me about your project, idea or question — I reply personally.",
    name: "Your name",
    email: "Your email",
    message: "Message",
    messageHint: "Minimum 20 characters. Be direct.",
    send: "Send message",
    sending: "Sending…",
    success: "Done! I'll reply soon.",
    errorGeneric: "Could not send. Try again.",
    errorRate: "Too many submissions. Try later.",
    errorCaptcha: "Verification failed. Try again.",
    errorLinks: "Too many links in the message.",
    errorNameShort: "Name must be at least 2 characters.",
    errorEmailInvalid: "Invalid email.",
    errorMessageShort: "Message must be at least 20 characters.",
    errorMessageLong: "Message exceeds 2000 characters.",
    charsRemaining: "characters left",
    charsMore: "more to send",
    close: "Close",
    captchaMissing: "Verification unavailable. Reload the page.",
  },
} as const;

const ACCENT = "#E8B96B";

export function ContactPanel() {
  const { contactOpen, setContactOpen } = useWorld();
  const { lang } = useLanguage();
  const t = COPY[lang];
  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState<keyof typeof COPY.es>("errorGeneric");

  const close = useCallback(() => {
    setContactOpen(false);
    setStatus("idle");
    setToken("");
  }, [setContactOpen]);

  useEffect(() => {
    if (!contactOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [contactOpen, close]);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const messageCount = trimmedMessage.length;
  const messageRemaining = 20 - messageCount;
  const canSubmit =
    trimmedName.length >= 2 &&
    emailValid &&
    messageCount >= 20 &&
    messageCount <= 2000 &&
    !!token &&
    !!SITE_KEY &&
    status !== "submitting";

  const handleSubmit = useCallback(
    async (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (status === "submitting") return;

      if (!SITE_KEY) {
        setErrorKey("captchaMissing");
        setStatus("error");
        return;
      }
      if (trimmedName.length < 2) {
        setErrorKey("errorNameShort");
        setStatus("error");
        return;
      }
      if (!emailValid) {
        setErrorKey("errorEmailInvalid");
        setStatus("error");
        return;
      }
      if (messageCount < 20) {
        setErrorKey("errorMessageShort");
        setStatus("error");
        return;
      }
      if (messageCount > 2000) {
        setErrorKey("errorMessageLong");
        setStatus("error");
        return;
      }
      if (!token) {
        setErrorKey("errorCaptcha");
        setStatus("error");
        return;
      }

      setStatus("submitting");

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            message: trimmedMessage,
            website,
            turnstileToken: token,
          }),
        });

        if (res.ok) {
          setStatus("success");
          setName("");
          setEmail("");
          setMessage("");
          setWebsite("");
          setToken("");
          return;
        }

        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          field?: string;
          code?: string;
        };
        if (data.error === "rate_limited") setErrorKey("errorRate");
        else if (data.error === "captcha_failed") setErrorKey("errorCaptcha");
        else if (data.error === "too_many_links") setErrorKey("errorLinks");
        else if (data.error === "invalid_input") {
          if (data.field === "name") setErrorKey("errorNameShort");
          else if (data.field === "email") setErrorKey("errorEmailInvalid");
          else if (data.field === "message")
            setErrorKey(data.code === "too_big" ? "errorMessageLong" : "errorMessageShort");
          else setErrorKey("errorGeneric");
        } else setErrorKey("errorGeneric");
      } catch {
        setErrorKey("errorGeneric");
      }
      // Turnstile tokens are single-use, so a retry needs a fresh challenge.
      turnstileRef.current?.reset();
      setToken("");
      setStatus("error");
    },
    [emailValid, messageCount, status, token, trimmedEmail, trimmedMessage, trimmedName, website],
  );

  return (
    <AnimatePresence>
      {contactOpen && (
        <>
          <motion.button
            type="button"
            aria-label={t.close}
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] cursor-default bg-[#070B14]/65 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            className="fixed inset-x-2 bottom-2 z-[81] max-h-[92vh] overflow-y-auto rounded-2xl border bg-[#0B1020]/96 backdrop-blur-xl sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:max-h-[88vh] sm:w-[460px] sm:-translate-x-1/2 sm:-translate-y-1/2 md:w-[520px]"
            style={{
              borderColor: `${ACCENT}33`,
              boxShadow: `0 28px 90px -42px ${ACCENT}`,
            }}
          >
            <header
              className="sticky top-0 z-10 border-b bg-[#0B1020]/95 px-6 pt-6 pb-5 backdrop-blur-xl md:px-7"
              style={{
                borderColor: `${ACCENT}24`,
                backgroundImage: `linear-gradient(180deg, ${ACCENT}12 0%, transparent 100%)`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: ACCENT, boxShadow: `0 0 14px ${ACCENT}` }}
                  />
                  <span className="text-[10px] tracking-[0.28em] text-[#A8B0C2] uppercase">
                    {t.eyebrow}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="-m-2 rounded-full p-2 text-[#A8B0C2] transition hover:bg-white/5 hover:text-[#F7F3EA]"
                  aria-label={t.close}
                >
                  <X size={16} />
                </button>
              </div>
              <h2
                id="contact-title"
                className="mt-3 font-display text-2xl leading-tight text-[#F7F3EA] md:text-[28px]"
              >
                {t.title}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[#F7F3EA]/75 md:text-sm">
                {t.subtitle}
              </p>
            </header>

            <div className="px-6 py-6 md:px-7">
              {status === "success" ? (
                <SuccessState message={t.success} closeLabel={t.close} onClose={close} />
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                  {/* Honeypot: only bots fill a field that people cannot see. */}
                  <div
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                  >
                    <label>
                      Website
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </label>
                  </div>

                  <Field
                    id="contact-name"
                    label={t.name}
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={setName}
                    required
                    minLength={2}
                    maxLength={80}
                  />
                  <Field
                    id="contact-email"
                    label={t.email}
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={setEmail}
                    required
                    maxLength={120}
                  />

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-1.5 block text-[11px] font-semibold tracking-[0.18em] text-[#A8B0C2] uppercase"
                    >
                      {t.message}
                    </label>
                    <textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      minLength={20}
                      maxLength={2000}
                      rows={5}
                      aria-describedby="contact-message-hint"
                      className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-[14px] text-[#F7F3EA] transition outline-none focus:border-[#E8B96B]/55 focus:bg-white/[0.06]"
                    />
                    <div
                      id="contact-message-hint"
                      className="mt-1 flex items-center justify-between text-[10.5px] tracking-[0.16em] uppercase"
                    >
                      <span className="text-[#A8B0C2]/70">{t.messageHint}</span>
                      <span
                        className={
                          messageRemaining > 0
                            ? "text-[#E8B96B]/80"
                            : messageCount > 2000
                              ? "text-red-300"
                              : "text-[#A8B0C2]/60"
                        }
                      >
                        {messageRemaining > 0
                          ? `${messageRemaining} ${t.charsMore}`
                          : `${messageCount} / 2000`}
                      </span>
                    </div>
                  </div>

                  {SITE_KEY ? (
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={SITE_KEY}
                      onSuccess={setToken}
                      onError={() => setToken("")}
                      onExpire={() => setToken("")}
                      options={{ theme: "dark", size: "flexible" }}
                    />
                  ) : (
                    <p className="text-[12px] text-red-300">{t.captchaMissing}</p>
                  )}

                  {status === "error" && (
                    <p className="text-[12.5px] text-red-300" role="alert">
                      {t[errorKey]}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#E8B96B] px-5 py-3 text-[12px] font-semibold tracking-[0.16em] text-[#0B1020] uppercase transition hover:bg-[#f0c887] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        {t.sending}
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        {t.send}
                      </>
                    )}
                  </button>

                  <p className="flex items-center gap-1.5 text-[10.5px] tracking-[0.14em] text-[#A8B0C2]/70 uppercase">
                    <Mail size={11} />
                    hello@amaurygomez.dev
                  </p>
                </form>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  required,
  minLength,
  maxLength,
  autoComplete,
}: {
  id: string;
  label: string;
  type: "text" | "email";
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11px] font-semibold tracking-[0.18em] text-[#A8B0C2] uppercase"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-[14px] text-[#F7F3EA] transition outline-none focus:border-[#E8B96B]/55 focus:bg-white/[0.06]"
      />
    </div>
  );
}

function SuccessState({
  message,
  closeLabel,
  onClose,
}: {
  message: string;
  closeLabel: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <CheckCircle2 size={48} className="text-[#E8B96B]" />
      <p className="text-[15px] text-[#F7F3EA]">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#E8B96B]/40 px-5 py-2 text-[11px] font-semibold tracking-[0.16em] text-[#F7F3EA] uppercase transition hover:border-[#E8B96B] hover:text-[#E8B96B]"
      >
        {closeLabel}
      </button>
    </div>
  );
}
