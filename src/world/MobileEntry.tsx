import { lazy, Suspense, useCallback, useState } from "react";
import { ContactPanel } from "./components/ContactPanel";
import { MobileExperience } from "./components/MobileExperience";
import { StackPanel } from "./components/StackPanel";

const MobileWorld = lazy(() => import("./MobileWorld"));

export function MobileEntry() {
  const [worldOpen, setWorldOpen] = useState(false);

  const enterWorld = useCallback(() => setWorldOpen(true), []);
  const exitWorld = useCallback(() => setWorldOpen(false), []);

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
          className="inline-block h-2 w-2 animate-pulse rounded-full bg-ag-primary"
        />
        Cargando AG World
      </div>
    </div>
  );
}
