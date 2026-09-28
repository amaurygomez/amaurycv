import { lazy, Suspense, useEffect, useState } from "react";
import { LanguageProvider } from "@/hooks/LanguageProvider";
import { MobileEntry } from "./MobileEntry";
import { WorldProvider } from "./state/WorldContext";

const DesktopEntry = lazy(() =>
  import("./DesktopEntry").then((module) => ({ default: module.DesktopEntry })),
);

// Tablets use the mobile tree too: the iso world is cramped below 1024px and
// this keeps the Pixi bundle out of their initial load.
const MOBILE_QUERY = "(max-width: 1023px)";

function readIsMobile(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia(MOBILE_QUERY).matches;
}

function useIsMobile() {
  // Read matchMedia synchronously so the first paint already matches the
  // viewport instead of flashing the wrong tree.
  const [isMobile, setIsMobile] = useState(readIsMobile);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

export default function WorldApp() {
  return (
    <LanguageProvider>
      <WorldProvider>
        <WorldSwitch />
      </WorldProvider>
    </LanguageProvider>
  );
}

function WorldSwitch() {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <MobileEntry />;
  }
  return (
    <Suspense fallback={<DesktopBootFallback />}>
      <DesktopEntry />
    </Suspense>
  );
}

function DesktopBootFallback() {
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
