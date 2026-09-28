import { AnimatePresence, motion } from "motion/react";
import { Compass } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { ZONE_META } from "@/world/content/zones";
import { useWorld } from "@/world/state/useWorld";
import type { ZoneId } from "@/world/types";

const TOUR_LENGTH = 7;
const TOUR_ORDER: ZoneId[] = [
  "origin",
  "pos",
  "banking",
  "telecom",
  "public-sector",
  "ai-lab",
  "discipline",
];

const labels = {
  prev: { es: "← Anterior", en: "← Previous" },
  next: { es: "Siguiente →", en: "Next →" },
  exit: { es: "Salir", en: "Exit" },
};

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
          className="pointer-events-auto fixed right-4 bottom-[5.4rem] left-4 z-50 flex items-center justify-center gap-1 rounded-2xl border border-ag-gold/30 bg-ag-panel/90 px-2 py-2 shadow-[0_8px_32px_-8px_rgba(232,185,107,0.35)] backdrop-blur-md sm:right-auto sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:rounded-full"
          role="toolbar"
          aria-label={lang === "es" ? "Controles de recorrido" : "Tour controls"}
        >
          <button
            type="button"
            onClick={tourPrev}
            disabled={tourStep === 0}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-ag-text/80 uppercase transition hover:text-ag-gold disabled:cursor-not-allowed disabled:opacity-30"
          >
            {labels.prev[lang]}
          </button>

          <div className="flex min-w-0 items-center gap-1.5 rounded-full border border-ag-gold/20 bg-ag-gold/10 px-3 py-1.5">
            <Compass size={11} strokeWidth={2.4} className="text-ag-gold" />
            <span className="truncate text-[11px] font-semibold tracking-[0.08em] whitespace-nowrap text-ag-gold tabular-nums">
              {tourStep + 1} / {TOUR_LENGTH} {stepLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={tourNext}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-ag-text/80 uppercase transition hover:text-ag-gold"
          >
            {tourStep < TOUR_LENGTH - 1
              ? labels.next[lang]
              : lang === "es"
                ? "Finalizar"
                : "Finish"}
          </button>

          <div className="mx-1 h-5 w-px bg-ag-gold/20" aria-hidden />

          <button
            type="button"
            onClick={exitTour}
            className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-ag-text-muted/70 uppercase transition hover:text-ag-text"
            aria-label={lang === "es" ? "Salir del recorrido" : "Exit tour"}
          >
            ✕ {labels.exit[lang]}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
