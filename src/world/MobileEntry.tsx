/**
 * Mobile-only entrypoint. Renders the vertical career experience without
 * pulling any Pixi/WebGL code. Imported eagerly (small bundle) on mobile,
 * while DesktopEntry is dynamic-imported and stays out of this graph.
 *
 * The isometric world is still reachable on mobile: "Explorar AG World"
 * lazy-loads MobileWorld (and with it the Pixi stack) on demand.
 */
import { lazy, Suspense, useCallback, useState } from "react";
import { ContactPanel } from "./components/ContactPanel";
import { IntroSequence } from "./components/IntroSequence";
import { MobileExperience } from "./components/MobileExperience";
import { StackPanel } from "./components/StackPanel";

const MobileWorld = lazy(() => import("./MobileWorld"));

const INTRO_STORAGE_KEY = "introSeen";

export function MobileEntry() {
  const [introDone, setIntroDone] = useState(
    typeof window !== "undefined" && window.localStorage.getItem(INTRO_STORAGE_KEY) === "1"
  );
  const [worldOpen, setWorldOpen] = useState(false);

  const completeIntro = useCallback(() => {
    window.localStorage.setItem(INTRO_STORAGE_KEY, "1");
    setIntroDone(true);
  }, []);

  const enterWorld = useCallback(() => setWorldOpen(true), []);
  const exitWorld = useCallback(() => setWorldOpen(false), []);

  // Intro still needs a viewport-sized canvas to overlay, so when it's
  // showing we render a fixed shell. Once the user starts the journey we
  // hand control back to the document so scroll/momentum/pull-to-refresh
  // behave like a normal mobile page.
  if (!introDone) {
    return (
      <div className="fixed inset-0 overflow-hidden bg-[#070B14] text-[#F7F3EA]">
        <IntroSequence onComplete={completeIntro} mobile />
      </div>
    );
  }

  if (worldOpen) {
    return (
      <Suspense fallback={<WorldBootFallback />}>
        <MobileWorld onExit={exitWorld} />
      </Suspense>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#070B14] text-[#F7F3EA]">
      <MobileExperience onEnterWorld={enterWorld} />
      <ContactPanel />
      <StackPanel />
    </div>
  );
}

function WorldBootFallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#070B14] text-[#A8B0C2]">
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
