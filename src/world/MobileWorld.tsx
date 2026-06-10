/**
 * Mobile world mode — the full isometric AG World adapted for touch.
 * Reached from the vertical story via "Explorar AG World". Reuses the same
 * canvas, zones, scenes, and panels as desktop; touch gestures (drag-pan,
 * pinch-zoom, tap-to-enter) live inside WorldStageCanvas. Lazy-imported from
 * MobileEntry so the Pixi stack stays out of the story bundle until the user
 * opts in.
 */
import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowLeft, Compass } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { ContactPanel } from "./components/ContactPanel";
import { FloatingJourneyCta } from "./components/FloatingJourneyCta";
import { StackPanel } from "./components/StackPanel";
import { TourControls } from "./components/TourControls";
import { ZoneNavigator } from "./components/ZoneNavigator";
import { ZonePanel } from "./components/ZonePanel";
import { ZoomControls } from "./components/ZoomControls";
import { useWorld } from "./state/useWorld";

const WorldStageCanvas = lazy(() => import("./components/WorldStageCanvas"));

export default function MobileWorld({ onExit }: { onExit: () => void }) {
  const { lang } = useLanguage();
  const { activeZone, tourActive, startTour } = useWorld();
  const [hintDismissed, setHintDismissed] = useState(false);

  // The gesture hint earns ~7s of attention, then gets out of the way.
  useEffect(() => {
    const timer = window.setTimeout(() => setHintDismissed(true), 7000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#070B14] text-[#F7F3EA]">
      <Suspense fallback={<MobileWorldFallback />}>
        <WorldStageCanvas />
      </Suspense>

      {/* Top bar: back to the vertical story + tour shortcut */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between gap-2 px-3 pt-3">
        <button
          type="button"
          onClick={onExit}
          className="
            pointer-events-auto inline-flex items-center gap-1.5
            rounded-full border border-white/12 bg-[#0B1020]/85 px-3 py-2
            text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F7F3EA]
            backdrop-blur-md
          "
        >
          <ArrowLeft size={13} strokeWidth={2.6} />
          {lang === "es" ? "Mi historia" : "My story"}
        </button>
        {!tourActive && (
          <button
            type="button"
            onClick={startTour}
            className="
              pointer-events-auto inline-flex items-center gap-1.5
              rounded-full border border-[#E8B96B]/40 bg-[#0B1020]/85 px-3 py-2
              text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E8B96B]
              backdrop-blur-md
            "
          >
            <Compass size={13} strokeWidth={2.4} />
            {lang === "es" ? "Recorrido" : "Tour"}
          </button>
        )}
      </div>

      <ZoneNavigator />
      <ZonePanel />
      <TourControls />
      <ZoomControls />
      <FloatingJourneyCta />
      <ContactPanel />
      <StackPanel />

      {!activeZone && !hintDismissed && (
        <div
          className="
            pointer-events-none absolute inset-x-4 bottom-20 z-30
            rounded-2xl border border-white/10 bg-[#0B1020]/85 px-4 py-3
            text-center text-[11px] leading-relaxed text-[#A8B0C2] backdrop-blur-md
          "
          role="status"
        >
          {lang === "es"
            ? "Toca una sala para entrar · arrastra para moverte · pellizca para zoom"
            : "Tap a room to enter · drag to move · pinch to zoom"}
        </div>
      )}
    </div>
  );
}

function MobileWorldFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#070B14] text-[#A8B0C2]">
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em]"
      >
        <span
          aria-hidden="true"
          className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#E8B96B]"
        />
        Cargando AG World
      </div>
    </div>
  );
}
