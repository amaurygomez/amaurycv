/**
 * Top-level world entry. Splits into mobile vs desktop trees so the heavy
 * Pixi/WebGL stack only loads on desktop. Mobile gets a vertical career
 * portfolio (no canvas, no @pixi/react).
 *
 * Mobile breakpoint: <=1023px → MobileEntry (also covers tablets, where the
 * iso world would be cramped). Desktop ≥1024px → DesktopEntry (lazy).
 */
import { lazy, Suspense, useEffect, useState } from "react";
import { LanguageProvider } from "../hooks/useLanguage";
import { MobileEntry } from "./MobileEntry";
import { WorldProvider } from "./state/WorldContext";

const DesktopEntry = lazy(() => import("./DesktopEntry"));

const MOBILE_QUERY = "(max-width: 1023px)";

function readIsMobile(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia(MOBILE_QUERY).matches;
}

function useIsMobile() {
  // Initialize from matchMedia synchronously so the first paint already reflects
  // the viewport — no flash, no setState-in-effect lint violation.
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
