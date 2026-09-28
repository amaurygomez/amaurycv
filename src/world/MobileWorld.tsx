import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowLeft, Compass } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
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

  useEffect(() => {
    const timer = window.setTimeout(() => setHintDismissed(true), 7000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-ag-bg text-ag-text">
      <Suspense fallback={<MobileWorldFallback />}>
        <WorldStageCanvas />
      </Suspense>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between gap-2 px-3 pt-3">
        <button
          type="button"
          onClick={onExit}
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-ag-panel/85 px-3 py-2 text-[10px] font-semibold tracking-[0.18em] text-ag-text uppercase backdrop-blur-md"
        >
          <ArrowLeft size={13} strokeWidth={2.6} />
          {lang === "es" ? "Mi historia" : "My story"}
        </button>
        {!tourActive && (
          <button
            type="button"
            onClick={startTour}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-ag-gold/40 bg-ag-panel/85 px-3 py-2 text-[10px] font-semibold tracking-[0.18em] text-ag-gold uppercase backdrop-blur-md"
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
          className="pointer-events-none absolute inset-x-4 bottom-20 z-30 rounded-2xl border border-white/10 bg-ag-panel/85 px-4 py-3 text-center text-[11px] leading-relaxed text-ag-text-muted backdrop-blur-md"
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
    <div className="absolute inset-0 flex items-center justify-center bg-ag-bg text-ag-text-muted">
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-3 text-[11px] tracking-[0.28em] uppercase"
      >
        <span
          aria-hidden="true"
          className="inline-block h-2 w-2 animate-pulse rounded-full bg-ag-gold"
        />
        Cargando AG World
      </div>
    </div>
  );
}
