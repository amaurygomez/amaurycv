import { AnimatePresence, motion } from "motion/react";
import { Compass } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { ZONE_META } from "../content/zones";
import { useWorld } from "../state/useWorld";
import type { ZoneId } from "../types";

const TOUR_LENGTH = 7;
const TOUR_ORDER: ZoneId[] = [
  "education-path",
  "software-factory",
  "banking-finance",
  "telecom-quality",
  "public-security",
  "personal-lab",
  "discipline-life",
];

const labels = {
  prev: { es: "← Anterior", en: "← Previous" },
  next: { es: "Siguiente →", en: "Next →" },
  exit: { es: "Salir", en: "Exit" },
};

/**
 * Floating bottom-center control bar that appears while guided tour is active.
 * Lives outside the Pixi canvas as an HTML overlay (z-50).
 */
export function TourControls() {
  const { tourActive, tourStep, tourNext, tourPrev, exitTour } = useWorld();
  const { lang } = useLanguage();
  const zone = ZONE_META[TOUR_ORDER[tourStep]];
  const stepLabel = lang === "es" ? zone.sectorEs : zone.sectorEn;

  return (
    <AnimatePresence>
      {tourActive && (
        <motion.div
          key="tour-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="
            pointer-events-auto
            fixed left-4 right-4 bottom-[5.4rem] z-50
            flex items-center justify-center gap-1
            rounded-2xl border border-[#E8B96B]/30
            bg-[#0B1020]/90 backdrop-blur-md
            px-2 py-2
            shadow-[0_8px_32px_-8px_rgba(232,185,107,0.35)]
            sm:left-1/2 sm:right-auto sm:bottom-6 sm:-translate-x-1/2 sm:rounded-full
          "
          role="toolbar"
          aria-label={lang === "es" ? "Controles de recorrido" : "Tour controls"}
        >
          {/* Previous */}
          <button
            type="button"
            onClick={tourPrev}
            disabled={tourStep === 0}
            className="
              inline-flex items-center gap-1.5
              rounded-full px-3 py-1.5
              text-[11px] font-semibold uppercase tracking-[0.14em]
              text-[#F7F3EA]/80 transition
              hover:text-[#E8B96B] disabled:opacity-30 disabled:cursor-not-allowed
            "
          >
            {labels.prev[lang]}
          </button>

          {/* Step indicator */}
          <div className="flex min-w-0 items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8B96B]/10 border border-[#E8B96B]/20">
            <Compass size={11} strokeWidth={2.4} className="text-[#E8B96B]" />
            <span className="truncate text-[11px] font-semibold tracking-[0.08em] text-[#E8B96B] tabular-nums whitespace-nowrap">
              {tourStep + 1} / {TOUR_LENGTH} {stepLabel}
            </span>
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={tourNext}
            className="
              inline-flex items-center gap-1.5
              rounded-full px-3 py-1.5
              text-[11px] font-semibold uppercase tracking-[0.14em]
              text-[#F7F3EA]/80 transition
              hover:text-[#E8B96B]
            "
          >
            {tourStep < TOUR_LENGTH - 1 ? labels.next[lang] : (lang === "es" ? "Finalizar" : "Finish")}
          </button>

          {/* Divider */}
          <div className="h-5 w-px bg-[#E8B96B]/20 mx-1" aria-hidden />

          {/* Exit */}
          <button
            type="button"
            onClick={exitTour}
            className="
              inline-flex items-center
              rounded-full px-3 py-1.5
              text-[11px] font-semibold uppercase tracking-[0.14em]
              text-[#A8B0C2]/70 transition
              hover:text-[#F7F3EA]
            "
            aria-label={lang === "es" ? "Salir del recorrido" : "Exit tour"}
          >
            ✕ {labels.exit[lang]}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
