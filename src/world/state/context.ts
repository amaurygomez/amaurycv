import { createContext } from "react";
import type { ZoneId } from "../types";

export interface WorldState {
  /** Zone whose side panel is open (null = nothing open). */
  activeZone: ZoneId | null;
  setActiveZone: (z: ZoneId | null) => void;
  /** Zone the pointer is over (for the floating pill). */
  hoveredZone: ZoneId | null;
  setHoveredZone: (z: ZoneId | null) => void;
  /** Current avatar tile position (animated). */
  avatarPos: { x: number; y: number };
  /** Guided tour mode. */
  tourActive: boolean;
  tourStep: number;
  journeyCompleted: boolean;
  startTour: () => void;
  exitTour: () => void;
  tourNext: () => void;
  tourPrev: () => void;
  /** Contact panel open state. */
  contactOpen: boolean;
  setContactOpen: (open: boolean) => void;
  /** Tech stack panel open state. */
  stackOpen: boolean;
  setStackOpen: (open: boolean) => void;
  /** User-controlled zoom multiplier applied on top of the per-zone scale.
      Bounded [ZOOM_MIN, ZOOM_MAX] in the provider. 1 = default framing. */
  userZoom: number;
  setUserZoom: (z: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  /** Bumped on resetZoom so the canvas re-frames even when userZoom is
      already 1 (e.g. after a touch drag-pan left the camera off-center). */
  cameraResetNonce: number;
}

export const ZOOM_MIN = 0.6;
export const ZOOM_MAX = 2.2;
export const ZOOM_STEP = 1.18;

export const WorldContext = createContext<WorldState | null>(null);
