import { AnimatePresence, motion } from "motion/react";
import { Code2, Compass, Download, Layers, Mail, Sparkles, X } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { profile } from "../../i18n/content";
import { useWorld } from "../state/useWorld";

/**
 * Desktop hero dock — anchored bottom-left so the AG World map keeps the
 * stage. Previous layout pinned a tall card to the top-left, which on every
 * desktop breakpoint covered a quarter of the world and competed with the
 * selected room. This dock keeps brand, language, and primary CTAs reachable
 * without obstructing scene assets. The transient overview teaser fades in
 * above the dock only when no zone is active.
 *
 * Mobile keeps the rich landing in MobileExperience — this component is not
 * mounted on the mobile tree.
 */
export function HeroPanel() {
  const { lang, setLang } = useLanguage();
  const {
    tourActive,
    startTour,
    activeZone,
    setActiveZone,
    setContactOpen,
    setStackOpen,
  } = useWorld();

  const role =
    lang === "es"
      ? "Ingeniero Senior · Arquitecto de Sistemas"
      : "Senior Engineer · Systems Architect";
  const tagline =
    lang === "es"
      ? "Sistemas que tienen que funcionar en operación real."
      : "Systems that have to work in real operations.";
  const journeyEyebrow =
    lang === "es" ? "Recorrido guiado" : "Guided journey";
  const journeyCta =
    lang === "es" ? "Iniciar recorrido guiado" : "Start guided journey";
  const journeyHint =
    lang === "es"
      ? "Te llevo por cada capítulo, uno a uno · ~7 escenas · puedes salir cuando quieras."
      : "I walk you through every chapter, one at a time · ~7 scenes · exit anytime.";
  const manualHint =
    lang === "es"
      ? "O explora libremente: clic en cualquier zona del mapa."
      : "Or explore freely: click any zone on the map.";
  const contactLabel = lang === "es" ? "Contacto" : "Contact";

  // The guided-tour entry is intentionally a large CTA card, not a small dock
  // button. It is the primary action when no zone is selected — every other
  // dock control is secondary while a visitor is still standing at the
  // entrance of AG World.
  const showJourneyEntry = !activeZone && !tourActive;

  return (
    <>
      {/* Guided journey entry card — visible when no zone is open AND the
          tour is not already running. Sits ABOVE the dock so the dock is
          still reachable, but its presence is what tells a first-time
          visitor "you can take a tour from here". */}
      <AnimatePresence>
        {showJourneyEntry && (
          <motion.div
            key="journey-entry"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="
              pointer-events-auto absolute z-25
              left-4 bottom-[6rem]
              md:left-6 md:bottom-[6.5rem]
              max-w-[420px] md:max-w-[460px]
            "
          >
            <div
              className="rounded-2xl border border-[#E8B96B]/30 bg-[#0B1020]/88 backdrop-blur-md px-5 py-4 shadow-[0_28px_70px_-28px_rgba(232,185,107,0.55)]"
              style={{
                backgroundImage:
                  "linear-gradient(140deg, rgba(232,185,107,0.10) 0%, rgba(232,185,107,0.02) 55%, transparent 100%)",
              }}
            >
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.28em] text-[#E8B96B]">
                <Sparkles size={11} strokeWidth={2.4} aria-hidden="true" />
                {journeyEyebrow}
              </div>
              <p className="mt-2 font-display text-[17px] leading-snug text-[#F7F3EA]">
                {tagline}
              </p>
              <button
                type="button"
                onClick={startTour}
                aria-label={lang === "es" ? "Iniciar recorrido" : "Start journey"}
                className="
                  mt-3.5 inline-flex w-full items-center justify-center gap-2
                  rounded-xl bg-[#E8B96B] px-4 py-3
                  text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0B1020]
                  shadow-[0_18px_50px_-20px_rgba(232,185,107,0.7)]
                  transition hover:bg-[#f0c887] hover:shadow-[0_22px_60px_-22px_rgba(232,185,107,0.85)]
                  focus-visible:outline-2 focus-visible:outline-[#E8B96B] focus-visible:outline-offset-2
                "
              >
                <Compass size={14} strokeWidth={2.4} aria-hidden="true" />
                <span>{journeyCta}</span>
              </button>
              <p className="mt-2.5 text-[10.5px] leading-relaxed text-[#A8B0C2]/85">
                {journeyHint}
              </p>
              <p className="mt-1 text-[10.5px] leading-relaxed text-[#A8B0C2]/55">
                {manualHint}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom-left compact dock — always visible during desktop map mode */}
      <motion.aside
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="
          pointer-events-auto absolute z-30
          left-4 bottom-4
          md:left-6 md:bottom-6
          flex items-center gap-2.5
          rounded-full border border-[#E8B96B]/22
          bg-[#0B1020]/82 backdrop-blur-md
          px-3 py-2 md:px-4 md:py-2.5
          shadow-[0_20px_60px_-28px_rgba(232,185,107,0.5)]
        "
        aria-label="AG World dock"
      >
        {/* Brand chip */}
        <div className="flex items-center gap-2 pl-1 pr-2.5 border-r border-white/8">
          <span
            className="
              inline-flex h-8 w-8 items-center justify-center
              rounded-lg border border-[#E8B96B]/55 bg-[#E8B96B]/12
              text-[11px] font-bold tracking-[0.04em] text-[#E8B96B]
              shadow-[0_0_18px_-4px_rgba(232,185,107,0.6)]
            "
            aria-hidden="true"
          >
            AG
          </span>
          <div className="leading-tight hidden md:block">
            <div className="font-display text-[13px] text-[#F7F3EA]">
              {profile.shortName}
            </div>
            <div className="text-[9px] uppercase tracking-[0.22em] text-[#A8B0C2]/80">
              AG World · {role}
            </div>
          </div>
        </div>

        {/* CTAs */}
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
            className="
              hidden md:inline-flex items-center gap-1.5
              rounded-full border border-white/10 px-3 py-1.5
              text-[10.5px] font-semibold uppercase tracking-[0.16em]
              text-[#A8B0C2] transition
              hover:border-[#E8B96B]/50 hover:text-[#E8B96B]
            "
          >
            <Code2 size={13} strokeWidth={2.4} />
            GitHub
          </a>
          <a
            href={profile.cvPdf[lang]}
            download
            className="
              hidden lg:inline-flex items-center gap-1.5
              rounded-full border border-white/10 px-3 py-1.5
              text-[10.5px] font-semibold uppercase tracking-[0.16em]
              text-[#A8B0C2] transition
              hover:border-[#E8B96B]/50 hover:text-[#E8B96B]
            "
          >
            <Download size={13} strokeWidth={2.4} />
            CV
          </a>
          {/* Guided-journey CTA lives on the standalone overview card above
              the dock when no zone is selected — keeping it out of the dock
              here avoids visual duplication. */}
        </div>

        {/* Lang + active-zone close */}
        <div className="flex items-center gap-1.5 pl-2.5 border-l border-white/8">
          <LanguageToggle lang={lang} onChange={setLang} />
          {activeZone && (
            <button
              type="button"
              onClick={() => setActiveZone(null)}
              className="
                inline-flex h-7 w-7 items-center justify-center rounded-full
                border border-white/15 bg-white/[0.04]
                text-[#A8B0C2] transition
                hover:border-[#E8B96B]/60 hover:text-[#F7F3EA]
              "
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
          ? "inline-flex items-center gap-1.5 rounded-full bg-[#E8B96B] px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#0B1020] transition hover:bg-[#f0c887]"
          : "inline-flex items-center gap-1.5 rounded-full border border-[#5EEAD4]/40 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#F7F3EA] transition hover:border-[#5EEAD4] hover:text-[#5EEAD4]"
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
      className="
        inline-flex items-center gap-0.5
        rounded-full border border-[#E8B96B]/25 bg-[#070B14]/70
        p-0.5
      "
    >
      {(["es", "en"] as const).map((code) => {
        const active = lang === code;
        const label =
          code === "es" ? "Cambiar idioma a español" : "Switch language to English";
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            aria-pressed={active}
            aria-label={label}
            className={`
              rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.22em]
              transition
              ${
                active
                  ? "bg-[#E8B96B] text-[#0B1020] font-semibold"
                  : "text-[#A8B0C2] hover:text-[#F7F3EA]"
              }
            `}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
