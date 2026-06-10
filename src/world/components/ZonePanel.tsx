import { AnimatePresence, motion } from "motion/react";
import { Sparkles, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { useWorld } from "../state/useWorld";
import { ZONE_META } from "../content/zones";
import type { ZoneMeta } from "../types";
import { ChapterMiniCard } from "./career/ChapterMiniCard";
import { ConfidentialityNote } from "./career/ConfidentialityNote";
import { OriginTimeline } from "./career/OriginTimeline";
import { VisualMetaphorPanel } from "./career/VisualMetaphorPanel";
import { renderZoneMetaphor } from "./career/zoneMetaphor";

type Lang = "es" | "en";

const LABELS = {
  es: {
    context: "Contexto",
    chapters: "Sistemas clave",
    operationalValue: "Valor operacional",
    technologies: "Tecnologías",
    confidentiality: "Confidencialidad",
    proof: "Lo que esto prueba",
    timeline: "Línea de tiempo",
    close: "Cerrar",
  },
  en: {
    context: "Context",
    chapters: "Key systems",
    operationalValue: "Operational value",
    technologies: "Technologies",
    confidentiality: "Confidentiality",
    proof: "What this proves",
    timeline: "Timeline",
    close: "Close",
  },
} as const;

export function ZonePanel() {
  const { activeZone, setActiveZone } = useWorld();
  const { lang } = useLanguage();
  const zone = activeZone ? ZONE_META[activeZone] : null;
  const dialogRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!zone) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveZone(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zone, setActiveZone]);

  // Capture the element that opened the panel so we can restore focus to it
  // on close — keyboard users land back where they were instead of at <body>.
  useEffect(() => {
    if (!zone) {
      const trigger = triggerRef.current;
      triggerRef.current = null;
      if (trigger && typeof trigger.focus === "function") {
        trigger.focus();
      }
      return;
    }
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body) {
      triggerRef.current = active;
    }
  }, [zone]);

  useEffect(() => {
    if (!zone || !dialogRef.current) return;
    const root = dialogRef.current;
    const focusables = root.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusables[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((item) => !item.hasAttribute("disabled"));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    root.addEventListener("keydown", onKeyDown);
    return () => root.removeEventListener("keydown", onKeyDown);
  }, [zone]);

  return (
    <AnimatePresence>
      {zone && (
        <>
          {/* Mobile-only click-catcher (desktop stays interactive). It's not
              a button — keyboard close lives on the X and on Escape, so this
              stays out of the tab order and out of the a11y tree. */}
          <motion.div
            aria-hidden="true"
            onClick={() => setActiveZone(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 cursor-default sm:hidden"
          />
          <motion.aside
            key={zone.id}
            ref={dialogRef}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 28 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            // Panel anchors to the right with explicit breakpoint widths.
            //  - 1366×768  → sm:w-[380px] keeps a wide map safe area.
            //  - 1440×900  → md:w-[400px]
            //  - 1920×1080 → xl:w-[440px] (premium density without dominating)
            // The bottom is reserved (sm:bottom-24) so the bottom-left dock
            // and the timeline nav stay reachable without overlap.
            className="
              absolute z-40
              inset-x-2 bottom-2 top-auto max-h-[80vh] rounded-2xl
              sm:inset-x-auto sm:right-4 sm:top-20 sm:bottom-24 sm:max-h-none sm:w-[380px] sm:rounded-2xl
              md:right-5 md:top-24 md:w-[400px]
              xl:w-[440px]
              border overflow-y-auto
            "
            style={{
              borderColor: `${zone.accent}45`,
              boxShadow: `0 24px 70px -36px ${zone.accent}, 0 0 0 1px ${zone.accent}1a`,
              background:
                "linear-gradient(180deg, rgba(11,16,32,0.92) 0%, rgba(11,16,32,0.86) 100%)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
            role="dialog"
            aria-modal="false"
            aria-labelledby={`zone-${zone.id}-title`}
          >
            <PanelHeader zone={zone} lang={lang} onClose={() => setActiveZone(null)} />
            <PanelBody zone={zone} lang={lang} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function PanelHeader({
  zone,
  lang,
  onClose,
}: {
  zone: ZoneMeta;
  lang: Lang;
  onClose: () => void;
}) {
  const sector = lang === "es" ? zone.sectorEs : zone.sectorEn;
  return (
    <div
      className="sticky top-0 z-10 border-b px-4 pt-4 pb-3.5 backdrop-blur-md md:px-5"
      style={{
        borderColor: `${zone.accent}26`,
        background: "linear-gradient(180deg, rgba(11,16,32,0.96) 0%, rgba(11,16,32,0.88) 100%)",
        backgroundImage: `linear-gradient(180deg, ${zone.accent}14 0%, transparent 100%)`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: zone.accent, boxShadow: `0 0 12px ${zone.accent}` }}
          />
          <span className="text-[9.5px] font-semibold uppercase tracking-[0.24em] text-[#A8B0C2]">
            {sector ?? zone.category}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-m-1.5 rounded-full p-1.5 text-[#A8B0C2] transition hover:bg-white/5 hover:text-[#F7F3EA]"
          aria-label={LABELS[lang].close}
        >
          <X size={14} />
        </button>
      </div>

      <h2
        id={`zone-${zone.id}-title`}
        className="mt-2 font-display text-[18px] leading-tight text-[#F7F3EA] md:text-[20px]"
      >
        {lang === "es" ? zone.titleEs : zone.titleEn}
      </h2>
      <p className="mt-1 text-[11.5px] font-medium leading-snug" style={{ color: zone.accent }}>
        {lang === "es" ? zone.subtitleEs : zone.subtitleEn}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {[
          lang === "es" ? zone.periodEs : zone.periodEn,
          lang === "es" ? zone.scaleEs : zone.scaleEn,
        ].map((item) => (
          <span
            key={item}
            className="inline-flex items-center rounded-full border px-2 py-0.5 text-[9.5px] uppercase tracking-[0.16em] text-[#F7F3EA]/82"
            style={{ borderColor: `${zone.accent}3a`, background: `${zone.accent}14` }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function PanelBody({
  zone,
  lang,
}: {
  zone: ZoneMeta;
  lang: Lang;
}) {
  const t = LABELS[lang];
  const body = lang === "es" ? zone.bodyEs : zone.bodyEn;
  const pills = (lang === "es" ? zone.pillsEs : zone.pillsEn) ?? zone.pills ?? [];
  const operationalValue = lang === "es" ? zone.operationalValueEs : zone.operationalValueEn;
  const proof = lang === "es" ? zone.proofEs : zone.proofEn;
  const accent = zone.accent;

  // Above-the-fold priority for 1366x768:
  // (header) → Context → first 3 Key systems → Visual metaphor → rest below.
  const experiences = zone.experiences ?? [];
  const topExperiences = experiences.slice(0, 3);
  const restExperiences = experiences.slice(3);
  const hasMoreExperiences = restExperiences.length > 0;
  const isOrigin = zone.id === "education-path";

  return (
    <div className="px-4 pb-6 pt-4 md:px-5">
      <Section label={t.context} accent={accent} first>
        <p className="text-[13px] leading-relaxed text-[#F7F3EA]/92">{body}</p>
      </Section>

      {/* Above-the-fold: 3 key systems OR (for origin) first 3 timeline nodes. */}
      {topExperiences.length > 0 && (
        <Section label={t.chapters} accent={accent}>
          <div className="grid gap-2">
            {topExperiences.map((exp, i) => (
              <ChapterMiniCard
                key={exp.titleEn}
                iconKey={exp.iconKey}
                title={lang === "es" ? exp.titleEs : exp.titleEn}
                desc={lang === "es" ? exp.descEs : exp.descEn}
                accent={accent}
                index={i}
                compact
              />
            ))}
          </div>
        </Section>
      )}

      {/* Visual metaphor — sits below context + first cards. */}
      <div className="mt-5">
        <VisualMetaphorPanel accent={accent}>
          {renderZoneMetaphor(zone.id, accent, "h-full w-full")}
        </VisualMetaphorPanel>
      </div>

      {/* Remaining key systems pushed below metaphor. */}
      {hasMoreExperiences && (
        <Section label={lang === "es" ? "Más sistemas" : "More systems"} accent={accent}>
          <div className="grid gap-2">
            {restExperiences.map((exp, i) => (
              <ChapterMiniCard
                key={exp.titleEn}
                iconKey={exp.iconKey}
                title={lang === "es" ? exp.titleEs : exp.titleEn}
                desc={lang === "es" ? exp.descEs : exp.descEn}
                accent={accent}
                index={i}
                compact
              />
            ))}
          </div>
        </Section>
      )}

      {/* Origin timeline lifts up — central to the chapter's emotional weight. */}
      {isOrigin && zone.timeline && zone.timeline.length > 0 && (
        <Section label={t.timeline} accent={accent}>
          <OriginTimeline nodes={zone.timeline} lang={lang} accent={accent} />
        </Section>
      )}

      {operationalValue && (
        <Section label={t.operationalValue} accent={accent}>
          <div
            className="rounded-lg border p-3 text-[12px] leading-relaxed text-[#F7F3EA]/86"
            style={{
              borderColor: `${accent}33`,
              backgroundImage: `linear-gradient(135deg, ${accent}10 0%, transparent 70%)`,
            }}
          >
            {operationalValue}
          </div>
        </Section>
      )}

      {/* Confidentiality (visible, callout style). */}
      {zone.details && zone.details.length > 0 && (
        <Section label={t.confidentiality} accent={accent}>
          <div className="space-y-2">
            {zone.details.map((item) => (
              <ConfidentialityNote
                key={item.label[lang]}
                text={`${item.label[lang]}: ${item.value[lang]}`}
                accent={accent}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Tech tags moved below confidentiality/value as audit requested. */}
      {pills.length > 0 && (
        <Section label={t.technologies} accent={accent}>
          <div className="flex flex-wrap gap-1">
            {pills.map((p) => (
              <span
                key={p}
                className="rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]"
                style={{
                  borderColor: `${accent}66`,
                  color: accent,
                  background: `${accent}14`,
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Non-origin timeline (if any other zone later adds one). */}
      {!isOrigin && zone.timeline && zone.timeline.length > 0 && (
        <Section label={t.timeline} accent={accent}>
          <OriginTimeline nodes={zone.timeline} lang={lang} accent={accent} />
        </Section>
      )}

      {proof && (
        <Section label={t.proof} accent={accent} icon="sparkles">
          <p
            className="rounded-lg border px-3 py-2.5 text-[12px] italic leading-relaxed text-[#F7F3EA]/92"
            style={{ borderColor: `${accent}55`, background: `${accent}14` }}
          >
            {proof}
          </p>
        </Section>
      )}
    </div>
  );
}

function Section({
  label,
  accent,
  icon,
  children,
  first,
}: {
  label: string;
  accent: string;
  icon?: "sparkles";
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <div className={first ? "" : "mt-5"}>
      <div className="mb-2 flex items-center gap-2">
        <span
          className="inline-block h-[2px] w-5"
          style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
          aria-hidden="true"
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A8B0C2]">
          {label}
        </span>
        {icon === "sparkles" && <Sparkles size={12} style={{ color: accent }} aria-hidden="true" />}
      </div>
      {children}
    </div>
  );
}
