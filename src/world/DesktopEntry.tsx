import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ContactPanel } from "./components/ContactPanel";
import { FloatingJourneyCta } from "./components/FloatingJourneyCta";
import { HeroPanel } from "./components/HeroPanel";
import { IntroSequence } from "./components/IntroSequence";
import { StackPanel } from "./components/StackPanel";
import { TourControls } from "./components/TourControls";
import { ZoneNavigator } from "./components/ZoneNavigator";
import { ZonePanel } from "./components/ZonePanel";
import { ZonePill } from "./components/ZonePill";
import { ZoomControls } from "./components/ZoomControls";
import { ZONE_ORDER } from "./content/zones";
import { useWorld } from "./state/useWorld";

const WorldStageCanvas = lazy(() => import("./components/WorldStageCanvas"));
const INTRO_STORAGE_KEY = "introSeen";

export function DesktopEntry() {
  const reducedMotion = useReducedMotion();
  const worldRef = useRef<HTMLDivElement>(null);
  const [introDone, setIntroDone] = useState(
    typeof window !== "undefined" && window.localStorage.getItem(INTRO_STORAGE_KEY) === "1",
  );
  const [shouldLoadCanvas, setShouldLoadCanvas] = useState(false);
  const { activeZone } = useWorld();

  useEffect(() => {
    const root = worldRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadCanvas(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [activeZone]);

  const completeIntro = useCallback(() => {
    window.localStorage.setItem(INTRO_STORAGE_KEY, "1");
    setIntroDone(true);
  }, []);

  return (
    <div ref={worldRef} className="fixed inset-0 overflow-hidden bg-ag-bg text-ag-text">
      <WorldIdleOverlay dimmed={!introDone} reducedMotion={reducedMotion} />

      <div
        className="absolute inset-0 transition-[opacity,transform,filter] duration-500 ease-out"
        style={{
          // An open zone only dims the stage slightly: WorldMap already fades the
          // other rooms, and a global blur would also blur the selected one.
          opacity: !introDone ? 0.24 : activeZone ? 0.92 : 1,
          transform: !introDone ? "scale(0.96)" : "scale(1)",
          filter: !introDone ? "blur(3px)" : "none",
        }}
      >
        {shouldLoadCanvas ? (
          <Suspense fallback={<WorldStageFallback />}>
            <WorldStageCanvas />
          </Suspense>
        ) : (
          <WorldStageFallback />
        )}
      </div>

      {introDone && (
        <>
          <KeyboardNavigation />
          <HeroPanel />
          <ZoneNavigator />
          <ZonePill />
          <ZonePanel />
          <TourControls />
          <ZoomControls />
          <FloatingJourneyCta />
          <ContactPanel />
          <StackPanel />
        </>
      )}

      {!introDone && <IntroSequence onComplete={completeIntro} mobile={false} />}
    </div>
  );
}

function KeyboardNavigation() {
  const { activeZone, hoveredZone, setHoveredZone, setActiveZone, tourActive, tourNext, tourPrev } =
    useWorld();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("button,a,input,textarea,select")) return;

      if (event.key === "Escape") {
        if (activeZone) {
          event.preventDefault();
          setActiveZone(null);
        }
        return;
      }

      if (event.key === "Enter") {
        if (hoveredZone && !activeZone) {
          event.preventDefault();
          setActiveZone(hoveredZone);
        }
        return;
      }

      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();

      if (tourActive) {
        if (event.key === "ArrowRight") tourNext();
        else tourPrev();
        return;
      }

      const current = activeZone ?? hoveredZone;
      const currentIndex = current ? ZONE_ORDER.indexOf(current) : -1;
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex =
        currentIndex < 0
          ? event.key === "ArrowRight"
            ? 0
            : ZONE_ORDER.length - 1
          : (currentIndex + delta + ZONE_ORDER.length) % ZONE_ORDER.length;

      setHoveredZone(ZONE_ORDER[nextIndex]);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeZone, hoveredZone, setActiveZone, setHoveredZone, tourActive, tourNext, tourPrev]);

  return null;
}

function WorldIdleOverlay({
  dimmed,
  reducedMotion,
}: {
  dimmed: boolean;
  reducedMotion: boolean | null;
}) {
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        animate={
          reducedMotion
            ? { opacity: dimmed ? 0.88 : 0.74 }
            : { opacity: dimmed ? [0.84, 0.9, 0.84] : [0.68, 0.74, 0.68] }
        }
        transition={{
          duration: reducedMotion ? 0 : 4,
          repeat: reducedMotion ? 0 : Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(120% 80% at 50% 50%, transparent 54%, rgba(7,11,20,0.88) 100%)",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[11]"
        animate={
          reducedMotion
            ? { opacity: 0.012 }
            : { opacity: [0.01, 0.02, 0.01], backgroundPositionY: ["0%", "100%"] }
        }
        transition={{
          duration: reducedMotion ? 0 : 4,
          repeat: reducedMotion ? 0 : Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(94,234,212,0.18), transparent 32%), linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 100% 18px, 18px 100%",
        }}
      />
    </>
  );
}

function WorldStageFallback() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(94,234,212,0.08),transparent_30%),linear-gradient(180deg,#070B14_0%,#0B1020_100%)]">
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:100%_18px,18px_100%] opacity-[0.018]" />
    </div>
  );
}
