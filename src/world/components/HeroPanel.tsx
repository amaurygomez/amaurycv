import { AnimatePresence, motion } from "motion/react";
import { Code2, Compass, FileText, Layers, Mail, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { profile } from "@/i18n/content";
import { useWorld } from "@/world/state/useWorld";

// Desktop only; the mobile tree renders its own landing in MobileExperience.
export function HeroPanel() {
  const { lang, setLang } = useLanguage();
  const { tourActive, startTour, activeZone, setActiveZone, setContactOpen, setStackOpen } =
    useWorld();

  const role =
    lang === "es"
      ? "Ingeniero de Software Senior · Full Stack .NET / React"
      : "Senior Software Engineer · Full Stack .NET / React";
  const tagline =
    lang === "es"
      ? "Sistemas que tienen que funcionar en operación real."
      : "Systems that have to work in real operations.";
  const journeyEyebrow = lang === "es" ? "Recorrido guiado" : "Guided journey";
  const journeyCta = lang === "es" ? "Iniciar recorrido guiado" : "Start guided journey";
  const journeyHint =
    lang === "es"
      ? "Te llevo por cada capítulo, uno a uno · ~7 escenas · puedes salir cuando quieras."
      : "I walk you through every chapter, one at a time · ~7 scenes · exit anytime.";
  const manualHint =
    lang === "es"
      ? "O explora libremente: clic en cualquier zona del mapa."
      : "Or explore freely: click any zone on the map.";
  const contactLabel = lang === "es" ? "Contacto" : "Contact";

  const showJourneyEntry = !activeZone && !tourActive;

  return (
    <>
      <AnimatePresence>
        {showJourneyEntry && (
          <motion.div
            key="journey-entry"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto absolute bottom-[6rem] left-4 z-25 max-w-[420px] md:bottom-[6.5rem] md:left-6 md:max-w-[460px]"
          >
            <div
              className="rounded-2xl border border-ag-gold/30 bg-ag-panel/88 px-5 py-4 shadow-[0_28px_70px_-28px_rgba(232,185,107,0.55)] backdrop-blur-md"
              style={{
                backgroundImage:
                  "linear-gradient(140deg, rgba(232,185,107,0.10) 0%, rgba(232,185,107,0.02) 55%, transparent 100%)",
              }}
            >
              <div className="flex items-center gap-1.5 text-[10px] tracking-[0.28em] text-ag-gold uppercase">
                <Sparkles size={11} strokeWidth={2.4} aria-hidden="true" />
                {journeyEyebrow}
              </div>
              <p className="mt-2 font-display text-[17px] leading-snug text-ag-text">{tagline}</p>
              <button
                type="button"
                onClick={startTour}
                className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ag-gold px-4 py-3 text-[12px] font-semibold tracking-[0.16em] text-ag-panel uppercase shadow-[0_18px_50px_-20px_rgba(232,185,107,0.7)] transition hover:bg-[#f0c887] hover:shadow-[0_22px_60px_-22px_rgba(232,185,107,0.85)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ag-gold"
              >
                <Compass size={14} strokeWidth={2.4} aria-hidden="true" />
                <span>{journeyCta}</span>
              </button>
              <p className="mt-2.5 text-[10.5px] leading-relaxed text-ag-text-muted/85">
                {journeyHint}
              </p>
              <p className="mt-1 text-[10.5px] leading-relaxed text-ag-text-muted/55">
                {manualHint}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto absolute bottom-4 left-4 z-30 flex items-center gap-2.5 rounded-full border border-ag-gold/22 bg-ag-panel/82 px-3 py-2 shadow-[0_20px_60px_-28px_rgba(232,185,107,0.5)] backdrop-blur-md md:bottom-6 md:left-6 md:px-4 md:py-2.5"
        aria-label="AG World dock"
      >
        <div className="flex items-center gap-2 border-r border-white/8 pr-2.5 pl-1">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-ag-gold/55 bg-ag-gold/12 text-[11px] font-bold tracking-[0.04em] text-ag-gold shadow-[0_0_18px_-4px_rgba(232,185,107,0.6)]"
            aria-hidden="true"
          >
            AG
          </span>
          <div className="hidden leading-tight md:block">
            <div className="font-display text-[13px] text-ag-text">{profile.shortName}</div>
            <div className="text-[9px] tracking-[0.22em] text-ag-text-muted/80 uppercase">
              AG World · {role}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <DockButton
            onClick={() => setContactOpen(true)}
            icon={<Mail size={13} strokeWidth={2.4} />}
            label={contactLabel}
            primary
          />
          <DockButton
            onClick={() => setStackOpen(true)}
            icon={<Layers size={13} strokeWidth={2.4} />}
            label="Stack"
          />
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[10.5px] font-semibold tracking-[0.16em] text-ag-text-muted uppercase transition hover:border-ag-gold/50 hover:text-ag-gold md:inline-flex"
          >
            <Code2 size={13} strokeWidth={2.4} />
            GitHub
          </a>
          <a
            href={`${profile.cvPath}?lang=${lang}`}
            className="hidden items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[10.5px] font-semibold tracking-[0.16em] text-ag-text-muted uppercase transition hover:border-ag-gold/50 hover:text-ag-gold lg:inline-flex"
          >
            <FileText size={13} strokeWidth={2.4} />
            CV
          </a>
        </div>

        <div className="flex items-center gap-1.5 border-l border-white/8 pl-2.5">
          <LanguageToggle lang={lang} onChange={setLang} />
          {activeZone && (
            <button
              type="button"
              onClick={() => setActiveZone(null)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-ag-text-muted transition hover:border-ag-gold/60 hover:text-ag-text"
              aria-label={lang === "es" ? "Cerrar zona" : "Close zone"}
            >
              <X size={13} strokeWidth={2.4} />
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
}

function DockButton({
  onClick,
  icon,
  label,
  primary,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        primary
          ? "inline-flex items-center gap-1.5 rounded-full bg-ag-gold px-3 py-1.5 text-[10.5px] font-semibold tracking-[0.16em] text-ag-panel uppercase transition hover:bg-[#f0c887]"
          : "inline-flex items-center gap-1.5 rounded-full border border-ag-teal/40 px-3 py-1.5 text-[10.5px] font-semibold tracking-[0.16em] text-ag-text uppercase transition hover:border-ag-teal hover:text-ag-teal"
      }
    >
      {icon}
      {label}
    </button>
  );
}

function LanguageToggle({
  lang,
  onChange,
}: {
  lang: "es" | "en";
  onChange: (l: "es" | "en") => void;
}) {
  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center gap-0.5 rounded-full border border-ag-gold/25 bg-ag-bg/70 p-0.5"
    >
      {(["es", "en"] as const).map((code) => {
        const active = lang === code;
        const label = code === "es" ? "Cambiar idioma a español" : "Switch language to English";
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            aria-pressed={active}
            aria-label={label}
            className={`rounded-full px-2.5 py-0.5 text-[10px] tracking-[0.22em] uppercase transition ${
              active
                ? "bg-ag-gold font-semibold text-ag-panel"
                : "text-ag-text-muted hover:text-ag-text"
            } `}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
