import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ZoneId } from "../types";
import {
  WorldContext,
  ZOOM_MAX,
  ZOOM_MIN,
  ZOOM_STEP,
  type WorldState,
} from "./context";
import { ZONE_META } from "../content/zones";

function clampZoom(z: number) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
}

const TOUR_ORDER: ZoneId[] = [
  "education-path",
  "software-factory",
  "banking-finance",
  "telecom-quality",
  "public-security",
  "personal-lab",
  "discipline-life",
];

const LOBBY_START = {
  x: ZONE_META["education-path"].bounds.x + 3.5,
  y: ZONE_META["education-path"].bounds.y + 4.8,
};

const ZONE_WAYPOINTS: Record<ZoneId, { x: number; y: number }> = {
  "telecom-quality": { x: 3.25, y: 4.35 },
  "public-security": { x: 11.45, y: 3.8 },
  "banking-finance": { x: 18.9, y: 4.45 },
  "software-factory": { x: 4.4, y: 4.85 + 8 },
  "personal-lab": { x: 10.3, y: 12.1 },
  "discipline-life": { x: 17.3, y: 10.6 },
  "education-path": { x: 9.8, y: 19.3 },
};

export function WorldProvider({ children }: { children: ReactNode }) {
  const [activeZone, setActiveZoneRaw] = useState<ZoneId | null>(null);
  const [hoveredZone, setHoveredZone] = useState<ZoneId | null>(null);
  const [avatarPos, setAvatarPos] = useState(LOBBY_START);
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [journeyCompleted, setJourneyCompleted] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [stackOpen, setStackOpen] = useState(false);
  const [userZoom, setUserZoomRaw] = useState(1);
  const [cameraResetNonce, setCameraResetNonce] = useState(0);
  const setUserZoom = useCallback((z: number) => setUserZoomRaw(clampZoom(z)), []);
  const zoomIn = useCallback(() => setUserZoomRaw((z) => clampZoom(z * ZOOM_STEP)), []);
  const zoomOut = useCallback(() => setUserZoomRaw((z) => clampZoom(z / ZOOM_STEP)), []);
  const resetZoom = useCallback(() => {
    setUserZoomRaw(1);
    setCameraResetNonce((n) => n + 1);
  }, []);

  // Refs for the RAF animation loop
  const posRef = useRef({ ...LOBBY_START });
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Whenever the active zone changes, reset the user zoom so each room
  // starts at its hand-tuned camera. Doing this inline at the call site
  // (instead of in a useEffect on activeZone) keeps the state updates
  // batched and avoids the react-hooks/set-state-in-effect rule.
  const setActiveZone = useCallback((z: ZoneId | null) => {
    setTourActive(false);
    setUserZoomRaw(1);
    setActiveZoneRaw(z);
  }, []);

  const exitTour = useCallback(() => {
    setTourActive(false);
    setUserZoomRaw(1);
    setActiveZoneRaw(null);
  }, []);

  const startTour = useCallback(() => {
    setTourStep(0);
    setTourActive(true);
    setJourneyCompleted(false);
    setUserZoomRaw(1);
    setActiveZoneRaw(TOUR_ORDER[0]);
  }, []);

  const tourNext = useCallback(() => {
    setTourStep((prev) => {
      if (prev < TOUR_ORDER.length - 1) {
        const next = prev + 1;
        setUserZoomRaw(1);
        setActiveZoneRaw(TOUR_ORDER[next]);
        return next;
      }
      setTourActive(false);
      setJourneyCompleted(true);
      setUserZoomRaw(1);
      setActiveZoneRaw(null);
      return prev;
    });
  }, []);

  const tourPrev = useCallback(() => {
    setTourStep((prev) => {
      if (prev > 0) {
        const next = prev - 1;
        setUserZoomRaw(1);
        setActiveZoneRaw(TOUR_ORDER[next]);
        return next;
      }
      return prev;
    });
  }, []);

  // Avatar animation: lerp toward waypoint when activeZone changes.
  useEffect(() => {
    const target = activeZone ? ZONE_WAYPOINTS[activeZone] : LOBBY_START;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTimeRef.current = null;

    function tick(now: number) {
      const dt = lastTimeRef.current === null ? 0 : (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const speed = 3.5;
      const dx = target.x - posRef.current.x;
      const dy = target.y - posRef.current.y;

      if (Math.abs(dx) < 0.04 && Math.abs(dy) < 0.04) {
        posRef.current = { x: target.x, y: target.y };
        setAvatarPos({ x: target.x, y: target.y });
        rafRef.current = null;
        return;
      }

      const factor = Math.min(dt * speed, 0.15);
      posRef.current = {
        x: posRef.current.x + dx * factor,
        y: posRef.current.y + dy * factor,
      };
      setAvatarPos({ ...posRef.current });
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [activeZone]);

  const value = useMemo<WorldState>(
    () => ({
      activeZone,
      setActiveZone,
      hoveredZone,
      setHoveredZone,
      avatarPos,
      tourActive,
      tourStep,
      journeyCompleted,
      startTour,
      exitTour,
      tourNext,
      tourPrev,
      contactOpen,
      setContactOpen,
      stackOpen,
      setStackOpen,
      userZoom,
      setUserZoom,
      zoomIn,
      zoomOut,
      resetZoom,
      cameraResetNonce,
    }),
    [
      activeZone,
      setActiveZone,
      hoveredZone,
      avatarPos,
      tourActive,
      tourStep,
      journeyCompleted,
      startTour,
      exitTour,
      tourNext,
      tourPrev,
      contactOpen,
      stackOpen,
      userZoom,
      setUserZoom,
      zoomIn,
      zoomOut,
      resetZoom,
      cameraResetNonce,
    ]
  );

  return <WorldContext.Provider value={value}>{children}</WorldContext.Provider>;
}
