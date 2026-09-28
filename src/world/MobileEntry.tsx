import { lazy, Suspense, useCallback, useState } from "react";
import { ContactPanel } from "./components/ContactPanel";
import { IntroSequence } from "./components/IntroSequence";
import { MobileExperience } from "./components/MobileExperience";
import { StackPanel } from "./components/StackPanel";

const MobileWorld = lazy(() => import("./MobileWorld"));

const INTRO_STORAGE_KEY = "introSeen";

export function MobileEntry() {
  const [introDone, setIntroDone] = useState(
    typeof window !== "undefined" && window.localStorage.getItem(INTRO_STORAGE_KEY) === "1",
  );
  const [worldOpen, setWorldOpen] = useState(false);

  const completeIntro = useCallback(() => {
    window.localStorage.setItem(INTRO_STORAGE_KEY, "1");
    setIntroDone(true);
  }, []);

  const enterWorld = useCallback(() => setWorldOpen(true), []);
  const exitWorld = useCallback(() => setWorldOpen(false), []);

  // The intro needs a fixed viewport shell; after it, the story is a normal
  // document so native scroll and pull-to-refresh keep working.
  if (!introDone) {
    return (
      <div className="fixed inset-0 overflow-hidden bg-ag-bg text-ag-text">
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
    <div className="relative min-h-screen w-full bg-ag-bg text-ag-text">
      <MobileExperience onEnterWorld={enterWorld} />
      <ContactPanel />
      <StackPanel />
    </div>
  );
}

function WorldBootFallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-ag-bg text-ag-text-muted">
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
